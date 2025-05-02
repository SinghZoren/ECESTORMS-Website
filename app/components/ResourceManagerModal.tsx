'use client';

import React, { useState, useMemo } from 'react';
import { IoClose, IoFolder, IoDocument, IoArrowBack, IoSearch } from 'react-icons/io5';
import { bebasNeue } from '../fonts';
import { Course, courseGroups, getCoursesByGroup } from '../data/courses';

interface Resource {
  id: string;
  name: string;
  type: 'file' | 'folder';
  courseCode: string;
  parentId: string | null;
  fileUrl?: string;
  children?: Resource[];
}

interface ResourceManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResourceManagerModal({ isOpen, onClose }: ResourceManagerModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Resource | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [resourcePath, setResourcePath] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('First Year');

  const filteredCourses = useMemo(() => {
    const courses = getCoursesByGroup(selectedGroup);
    return courses.filter(course => 
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedGroup]);

  if (!isOpen) return null;

  const handleCourseClick = (courseCode: string) => {
    const course = filteredCourses.find(c => c.code === courseCode);
    if (course) {
      setSelectedCourse(course);
      setCurrentFolder(null);
      setResourcePath([]);
    }
  };

  const handleBackClick = () => {
    if (resourcePath.length > 0) {
      const newPath = resourcePath.slice(0, -1);
      setResourcePath(newPath);
      setCurrentFolder(newPath.length > 0 ? newPath[newPath.length - 1] : null);
    }
  };

  const handleFolderClick = (folder: Resource) => {
    setCurrentFolder(folder);
    setResourcePath([...resourcePath, folder]);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !selectedCourse) return;

    try {
      const createPayload = {
        name: newFolderName.trim(),
        courseCode: selectedCourse.code,
        parentId: currentFolder?.id || null
      };

      console.log('Creating folder:', createPayload);

      const response = await fetch('/api/resources/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPayload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Create response:', data);
        throw new Error(data.error || 'Failed to create folder');
      }

      // Add the new folder to the state
      setResources(prev => {
        const updateFolderChildren = (folders: Resource[]): Resource[] => {
          return folders.map(folder => {
            if (folder.id === currentFolder?.id) {
              return {
                ...folder,
                children: [...(folder.children || []), data]
              };
            }
            if (folder.children) {
              return {
                ...folder,
                children: updateFolderChildren(folder.children)
              };
            }
            return folder;
          });
        };

        if (currentFolder) {
          return updateFolderChildren(prev);
        }
        return [...prev, data];
      });
      
      setNewFolderName('');

      // Refresh resources to get updated structure
      const resourcesResponse = await fetch(`/api/resources?courseCode=${selectedCourse.code}`);
      if (!resourcesResponse.ok) {
        throw new Error('Failed to fetch updated resources');
      }
      const refreshedData = await resourcesResponse.json();
      setResources(refreshedData.resources);
    } catch (error) {
      console.error('Error creating folder:', error);
      alert(error instanceof Error ? error.message : 'Failed to create folder');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !selectedCourse) return;

    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('courseCode', selectedCourse.code);
    formData.append('parentId', currentFolder?.id || '');

    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const newFile = await response.json();
      setResources(prev => [...prev, newFile]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDeleteResource = async (resourceId: string, type: 'file' | 'folder') => {
    if (!selectedCourse) return;
    
    try {
      const deletePayload = {
        type,
        courseCode: selectedCourse.code,
        parentId: currentFolder?.id || null,
        resourceId
      };

      console.log('Deleting resource:', deletePayload);

      const response = await fetch('/api/resources', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deletePayload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Delete response:', data);
        throw new Error(data.error || 'Failed to delete resource');
      }

      // Remove the resource from the state
      setResources(prev => {
        // If we're in a folder, filter its children
        if (currentFolder) {
          return prev.map(r => {
            if (r.id === currentFolder.id) {
              return {
                ...r,
                children: r.children?.filter(c => c.id !== resourceId) || []
              };
            }
            return r;
          });
        }
        // Otherwise filter the root resources
        return prev.filter(r => r.id !== resourceId);
      });
      
      // If we deleted the current folder, go back
      if (currentFolder?.id === resourceId) {
        handleBackClick();
      }

      // Refresh the resources to ensure our state is in sync
      const resourcesResponse = await fetch(`/api/resources?courseCode=${selectedCourse.code}`);
      if (!resourcesResponse.ok) {
        throw new Error('Failed to fetch updated resources');
      }
      const refreshedData = await resourcesResponse.json();
      setResources(refreshedData.resources);
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete resource');
    }
  };

  const getCurrentResources = () => {
    if (!selectedCourse) return [];
    
    if (!currentFolder) {
      return resources.filter(r => r.courseCode === selectedCourse.code && !r.parentId);
    }

    return currentFolder.children || [];
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
        const response = await fetch(`/api/resources?courseCode=${selectedCourse.code}`);
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const data = await response.json();
        setResources(data.resources);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
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

        {/* Course List Column */}
        <div className="w-1/4 border-r border-gray-200 pr-6 flex flex-col h-full">
          <h2 className={`${bebasNeue.className} text-4xl text-[#4A154B] mb-4`}>
            Courses
          </h2>
          
          {/* Filter Buttons - Made more compact */}
          <div className="flex flex-col gap-1 mb-3">
            {courseGroups.map((group) => (
              <button
                key={group.name}
                onClick={() => setSelectedGroup(group.name)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors text-left ${
                  selectedGroup === group.name
                    ? 'bg-[#931cf5] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {group.name}
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
            {filteredCourses.map((course) => (
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
                <div className="text-xs">{course.name}</div>
                <div className={`text-xs mt-0.5 ${selectedCourse?.code === course.code ? 'text-white/80' : 'text-gray-500'}`}>
                  Year {course.year}
                  {course.specialization && ` - ${course.specialization}`}
                </div>
              </div>
            ))}
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
                      className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center gap-2 flex-1 cursor-pointer"
                          onClick={() => resource.type === 'folder' && handleFolderClick(resource)}
                        >
                          {resource.type === 'folder' ? (
                            <IoFolder className="text-[#931cf5] w-4 h-4" />
                          ) : (
                            <IoDocument className="text-[#931cf5] w-4 h-4" />
                          )}
                          <span className="truncate text-sm">{resource.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResource(resource.id, resource.type);
                          }}
                          className="text-red-500 hover:text-red-700 ml-2 text-sm"
                        >
                          Delete
                        </button>
                      </div>
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