'use client';

import React, { useState, useMemo } from 'react';
import { IoClose, IoFolder, IoDocument, IoArrowBack, IoSearch } from 'react-icons/io5';
import { bebasNeue } from '../fonts';
import { allCourses, electricalCourses, computerHardwareCourses, computerSoftwareCourses, CourseInfo } from '../data/courses';
import { S3Resource, listObjects, uploadFileToS3, deleteFileFromS3 } from '../utils/s3';
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

interface ResourceManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});
const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || '';

export default function ResourceManagerModal({ isOpen, onClose }: ResourceManagerModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
  const [resources, setResources] = useState<S3Resource[]>([]);
  const [currentFolder, setCurrentFolder] = useState<S3Resource | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [resourcePath, setResourcePath] = useState<S3Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<'Electrical' | 'Computer-Hardware' | 'Computer-Software' | null>(null);
  const [uploadDetails, setUploadDetails] = useState<null | {
    name: string;
    size: number;
    type: string;
    uploadedAt: Date;
  }>(null);
  const [previewFile, setPreviewFile] = useState<null | { url: string; name: string; type: string }>(null);
  const [renamingFile, setRenamingFile] = useState<null | { id: string; name: string; key: string }>(null);
  const [newFileName, setNewFileName] = useState('');

  const getCourseList = () => {
    if (selectedProgram === 'Electrical') return electricalCourses;
    if (selectedProgram === 'Computer-Hardware') return computerHardwareCourses;
    if (selectedProgram === 'Computer-Software') return computerSoftwareCourses;
    return [];
  };

  const filteredCourses = useMemo(() => {
    const courses = getCourseList();
    return courses.filter(course =>
      (course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
       allCourses[course.code].name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, selectedProgram]);

  if (!isOpen) return null;

  const handleCourseClick = async (courseCode: string) => {
    const course = allCourses[courseCode];
    if (course) {
      setSelectedCourse(course);
      setCurrentFolder(null);
      setResourcePath([]);
      const courseResources = await listObjects(courseCode);
      setResources(courseResources);
    }
  };

  const handleBackClick = async () => {
    if (resourcePath.length > 0) {
      const newPath = resourcePath.slice(0, -1);
      setResourcePath(newPath);
      const newFolder = newPath.length > 0 ? newPath[newPath.length - 1] : null;
      setCurrentFolder(newFolder);
      
      // Load resources for the new path
      if (selectedCourse) {
        const prefix = newFolder 
          ? `${selectedCourse.code}/${newFolder.id}/`
          : `${selectedCourse.code}/`;
        const courseResources = await listObjects(prefix);
        setResources(courseResources);
      }
    }
  };

  const handleFolderClick = async (folder: S3Resource) => {
    setCurrentFolder(folder);
    setResourcePath([...resourcePath, folder]);
    
    // Load resources for the selected folder
    if (selectedCourse) {
      const prefix = `${selectedCourse.code}/${folder.id}/`;
      const folderResources = await listObjects(prefix);
      setResources(folderResources);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !selectedCourse) return;

    // Prevent duplicate folder names in the current directory
    const existingFolder = resources.find(
      (r) => r.type === 'folder' && r.name === newFolderName.trim()
    );
    if (existingFolder) {
      alert('A folder with this name already exists.');
      return;
    }

    try {
      // In S3, folders are created implicitly when files are uploaded
      // We'll create a placeholder file to represent the folder
      const folderKey = currentFolder
        ? `${selectedCourse.code}/${currentFolder.id}/${newFolderName}/.placeholder`
        : `${selectedCourse.code}/${newFolderName}/.placeholder`;
      await uploadFileToS3(new File([], '.placeholder'), folderKey);
      // Refresh the resources list
      const prefix = currentFolder
        ? `${selectedCourse.code}/${currentFolder.id}/`
        : `${selectedCourse.code}/`;
      const updatedResources = await listObjects(prefix);
      setResources(updatedResources);
      setNewFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
      alert(error instanceof Error ? error.message : 'Failed to create folder');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !selectedCourse) return;

    const file = e.target.files[0];
    // Use original file name for display
    const fileName = file.name;
    
    try {
      const key = currentFolder
        ? `${selectedCourse.code}/${currentFolder.id}/${Date.now()}-${fileName}`
        : `${selectedCourse.code}/${Date.now()}-${fileName}`;
      await uploadFileToS3(file, key);
      // Show upload details modal
      setUploadDetails({
        name: fileName,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
      });
      // Refresh the resources list
      const prefix = currentFolder
        ? `${selectedCourse.code}/${currentFolder.id}/`
        : `${selectedCourse.code}/`;
      const updatedResources = await listObjects(prefix);
      setResources(updatedResources);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  // Helper for robust recursive folder deletion in S3
  const deleteFolderRecursivelyS3 = async (prefix: string) => {
    const folderContents = await listObjects(prefix);
    for (const item of folderContents) {
      if (item.type === 'file' && item.fileUrl) {
        const itemKey = item.fileUrl.split('.com/')[1];
        await deleteFileFromS3(itemKey);
      } else if (item.type === 'folder') {
        // Recursively delete subfolders using the full prefix
        const subfolderPrefix = `${prefix}${item.name}/`;
        await deleteFolderRecursivelyS3(subfolderPrefix);
      }
    }
    // Delete the .placeholder file for this folder
    await deleteFileFromS3(`${prefix}.placeholder`);
  };

  const handleDeleteResource = async (resourceId: string, type: 'file' | 'folder') => {
    console.log('Delete clicked:', resourceId, type);
    if (!selectedCourse) return;
    try {
      if (type === 'folder') {
        const prefix = currentFolder
          ? `${selectedCourse.code}/${currentFolder.id}/${resourceId}/`
          : `${selectedCourse.code}/${resourceId}/`;
        await deleteFolderRecursivelyS3(prefix);
      } else {
        const key = currentFolder
          ? `${selectedCourse.code}/${currentFolder.id}/${resourceId}`
          : `${selectedCourse.code}/${resourceId}`;
        await deleteFileFromS3(key);
      }
      // Refresh the resources list
      const refreshPrefix = currentFolder
        ? `${selectedCourse.code}/${currentFolder.id}/`
        : `${selectedCourse.code}/`;
      const updatedResources = await listObjects(refreshPrefix);
      setResources(updatedResources);
      if (currentFolder?.id === resourceId) {
        handleBackClick();
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete resource');
    }
  };

  const getCurrentResources = () => {
    if (!currentFolder) {
      // Only show resources whose parentId is null or matches the course code (root level)
      return resources.filter(
        r => !r.parentId || r.parentId === selectedCourse?.code
      );
    }
    // Show only resources whose parentId matches the current folder
    return resources.filter(
      r => r.parentId === currentFolder.id && r.id !== currentFolder.id
    );
  };

  const getCurrentPath = () => {
    if (!selectedCourse) return '';
    if (!currentFolder) return selectedCourse.code;
    
    return `${selectedCourse.code}/${resourcePath.map(f => f.name).join('/')}`;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (selectedCourse) {
        const prefix = currentFolder
          ? `${selectedCourse.code}/${currentFolder.id}/`
          : `${selectedCourse.code}/`;
        const updatedResources = await listObjects(prefix);
        setResources(updatedResources);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRenameFile = async () => {
    if (!renamingFile || !selectedCourse || !newFileName.trim()) return;
    const oldKey = currentFolder
      ? `${selectedCourse.code}/${currentFolder.id}/${renamingFile.name}`
      : `${selectedCourse.code}/${renamingFile.name}`;
    const newKey = currentFolder
      ? `${selectedCourse.code}/${currentFolder.id}/${newFileName}`
      : `${selectedCourse.code}/${newFileName}`;
    try {
      // Copy the file to the new key
      await s3Client.send(new CopyObjectCommand({
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${oldKey}`,
        Key: newKey,
      }));
      // Delete the old file
      await s3Client.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: oldKey,
      }));
      // Refresh the resources list
      const prefix = currentFolder
        ? `${selectedCourse.code}/${currentFolder.id}/`
        : `${selectedCourse.code}/`;
      const updatedResources = await listObjects(prefix);
      setResources(updatedResources);
      setRenamingFile(null);
      setNewFileName('');
    } catch {
      alert('Failed to rename file');
      setRenamingFile(null);
      setNewFileName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[95%] h-[90vh] p-8 relative flex">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoClose size={24} />
        </button>

        {/* Upload Details Modal */}
        {uploadDetails && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
              <h3 className="text-lg font-bold mb-2 text-[#931cf5]">File Uploaded</h3>
              <div className="mb-2"><b>Name:</b> {uploadDetails.name}</div>
              <div className="mb-2"><b>Size:</b> {(uploadDetails.size / 1024).toFixed(2)} KB</div>
              <div className="mb-2"><b>Type:</b> {uploadDetails.type || 'Unknown'}</div>
              <div className="mb-2"><b>Uploaded At:</b> {uploadDetails.uploadedAt.toLocaleString()}</div>
              <button
                className="mt-4 px-4 py-2 bg-[#931cf5] text-white rounded hover:bg-[#7a1ac4]"
                onClick={() => setUploadDetails(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg relative max-w-3xl w-full max-h-[90vh] flex flex-col">
              {/* Download button */}
              <a
                href={previewFile.url}
                download={previewFile.name}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-16 px-4 py-2 bg-[#931cf5] text-white rounded hover:bg-[#7a1ac4] z-10"
              >
                Download
              </a>
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                onClick={() => setPreviewFile(null)}
              >
                <IoClose size={24} />
              </button>
              <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
                {/* Render preview based on file type */}
                {previewFile.type.startsWith('image/') ? (
                  <img src={previewFile.url} alt={previewFile.name} className="max-h-[70vh] max-w-full rounded" />
                ) : previewFile.type === 'application/pdf' ? (
                  <iframe src={previewFile.url} title={previewFile.name} className="w-full h-[70vh] rounded" />
                ) : (
                  <div className="text-center w-full">
                    <p className="mb-4">Preview not available for this file type.</p>
                    <a
                      href={previewFile.url}
                      download={previewFile.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#931cf5] text-white rounded hover:bg-[#7a1ac4]"
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rename File Modal */}
        {renamingFile && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
              <h3 className="text-lg font-bold mb-2 text-[#931cf5]">Rename File</h3>
              <div className="mb-2"><b>Current Name:</b> {renamingFile.name}</div>
              <input
                className="border rounded px-2 py-1 w-full mb-4"
                value={newFileName}
                onChange={e => setNewFileName(e.target.value)}
                placeholder="Enter new file name"
              />
              <div className="flex gap-2 justify-end">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => { setRenamingFile(null); setNewFileName(''); }}
                >Cancel</button>
                <button
                  className="px-4 py-2 bg-[#931cf5] text-white rounded hover:bg-[#7a1ac4]"
                  onClick={handleRenameFile}
                >Rename</button>
              </div>
            </div>
          </div>
        )}

        {/* Course List Column */}
        <div className="w-1/4 border-r border-gray-200 pr-6 flex flex-col h-full">
          <h2 className={`${bebasNeue.className} text-4xl text-[#4A154B] mb-4`}>
            Courses
          </h2>
          
          {/* Filter Buttons - Made more compact */}
          <div className="flex flex-col gap-1 mb-3">
            {['Electrical', 'Computer-Hardware', 'Computer-Software'].map((program) => (
              <button
                key={program}
                onClick={() => setSelectedProgram(program as 'Electrical' | 'Computer-Hardware' | 'Computer-Software')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors text-left ${
                  selectedProgram === program
                    ? 'bg-[#931cf5] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {program}
              </button>
            ))}
          </div>

          {/* Search Bar - Made more compact */}
          <div className="relative mb-3">
            <IoSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
            />
          </div>

          {/* Course List - Fixed height and overflow */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {filteredCourses.map((course) => {
              const courseInfo = allCourses[course.code];
              if (!courseInfo) return null;
              return (
                <div
                  key={course.code}
                  onClick={() => handleCourseClick(course.code)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors mb-1 ${
                    selectedCourse?.code === course.code
                      ? 'bg-[#931cf5] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-semibold text-sm">{course.code}</div>
                  <div className="text-xs">{courseInfo.name}</div>
                  <div className={`text-xs mt-0.5 ${selectedCourse?.code === course.code ? 'text-white/80' : 'text-gray-500'}`}>
                    Year {course.year}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* File Explorer - Adjusted to match new layout */}
        <div className="flex-1 pl-6 flex flex-col h-full">
          {selectedCourse ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {resourcePath.length > 0 && (
                    <button
                      onClick={handleBackClick}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <IoArrowBack size={24} />
                    </button>
                  )}
                  <h3 className={`${bebasNeue.className} text-2xl text-[#4A154B]`}>
                    {getCurrentPath()}
                  </h3>
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New folder name"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
                  />
                </div>
                <button
                  onClick={handleCreateFolder}
                  className="px-4 py-1.5 text-sm bg-[#931cf5] text-white rounded-lg hover:bg-[#7a1ac4] transition-colors"
                >
                  Create Folder
                </button>
              </div>

              <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-auto min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {getCurrentResources().map((resource) => (
                    <div
                      key={resource.id}
                      className="relative bg-white rounded-lg p-3 pt-8 hover:shadow-md transition-shadow flex flex-col items-center group min-h-[220px]"
                    >
                      {/* Delete button as X at top left */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteResource(resource.id, resource.type);
                        }}
                        className="absolute top-2 left-2 text-red-400 hover:text-red-600 p-1 rounded-full bg-white shadow group-hover:scale-110 transition-transform z-10"
                        title="Delete"
                      >
                        <IoClose size={18} />
                      </button>

                      {/* File name at the top */}
                      <div className="w-full text-center mb-2 font-medium text-sm truncate px-2">
                        {resource.type === 'file' && resource.name.includes('-')
                          ? resource.name.split('-').slice(1).join('-')
                          : resource.name}
                      </div>

                      {/* File preview */}
                      <div
                        className="flex-1 flex items-center justify-center w-full mb-2 cursor-pointer"
                        onClick={() => {
                          if (resource.type === 'folder') {
                            handleFolderClick(resource);
                          } else if (resource.type === 'file' && resource.fileUrl) {
                            // Try to infer type for preview
                            const ext = resource.fileUrl.split('.').pop()?.toLowerCase();
                            setPreviewFile({
                              url: resource.fileUrl,
                              name: resource.name.includes('-') ? resource.name.split('-').slice(1).join('-') : resource.name,
                              type: ext === 'pdf' ? 'application/pdf' : (resource.fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? 'image/' : 'application/octet-stream')
                            });
                          }
                        }}
                      >
                        {resource.type === 'folder' ? (
                          <IoFolder className="text-[#931cf5] w-12 h-12 opacity-80" />
                        ) : resource.fileUrl && resource.fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                          <img
                            src={resource.fileUrl}
                            alt={resource.name}
                            className="max-h-20 max-w-full rounded shadow border border-gray-100 object-contain"
                          />
                        ) : resource.fileUrl && resource.fileUrl.toLowerCase().endsWith('.pdf') ? (
                          <div className="flex flex-col items-center">
                            <span className="inline-block bg-red-100 text-red-600 rounded-full p-2 mb-1">
                              <IoDocument className="w-8 h-8" />
                            </span>
                            <span className="text-xs text-gray-500">PDF</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="inline-block bg-gray-100 text-gray-400 rounded-full p-2 mb-1">
                              <IoDocument className="w-8 h-8" />
                            </span>
                            <span className="text-xs text-gray-400">File</span>
                          </div>
                        )}
                      </div>

                      {/* Rename button below preview (only for files) */}
                      {resource.type === 'file' && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setRenamingFile({ id: resource.id, name: resource.name, key: resource.fileUrl?.split('.com/')[1] || '' });
                            setNewFileName(resource.name.includes('-') ? resource.name.split('-').slice(1).join('-') : resource.name);
                          }}
                          className="mt-2 px-3 py-1 text-xs bg-[#931cf5] text-white rounded hover:bg-[#7a1ac4] transition-colors w-full"
                        >
                          Rename
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <label className="px-4 py-1.5 text-sm bg-[#931cf5] text-white rounded-lg hover:bg-[#7a1ac4] transition-colors cursor-pointer inline-block">
                  Upload Files
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-1.5 text-sm bg-[#931cf5] text-white rounded-lg hover:bg-[#7a1ac4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a course to manage its resources
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 