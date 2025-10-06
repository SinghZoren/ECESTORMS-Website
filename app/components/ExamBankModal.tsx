'use client';

import React, { useState, useEffect } from 'react';
import { IoClose, IoFolder, IoDocument } from 'react-icons/io5';
import { allCourses, electricalCourses, computerHardwareCourses, computerSoftwareCourses, CourseInfo } from '../data/courses';
import { bebasNeue } from '../fonts';
import Image from 'next/image';
import { useModalRegistration } from './ModalVisibilityContext';

interface Resource {
  id: string;
  name: string;
  type: 'file' | 'folder';
  courseCode: string;
  parentId: string | null;
  fileUrl?: string;
  linkUrl?: string; // For folders that act as links
  children?: Resource[];
}

interface ExamBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
}

export default function ExamBankModal({ isOpen, onClose }: ExamBankModalProps) {
  useModalRegistration('exam-bank-modal', isOpen);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<'Electrical' | 'Computer' | null>(null);
  const [softwareSpecialization, setSoftwareSpecialization] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const isMobile = windowWidth < 768;
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Resource | null>(null);
  const [resourcePath, setResourcePath] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<null | { url: string; name: string; type: string }>(null);
  const [courseLinks, setCourseLinks] = useState<{[courseCode: string]: string}>({});

  const years = [1, 2, 3, 4];
  const isCommonYear = selectedYear === 1;
  const canSelectSoftware = selectedProgram === 'Computer' && (selectedYear === 3 || selectedYear === 4);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load course links on mount
  useEffect(() => {
    if (isOpen) {
      const loadCourseLinks = async () => {
        try {
          const response = await fetch('/api/resources/course-links');
          if (response.ok) {
            const data = await response.json();
            const linksMap: {[courseCode: string]: string} = {};
            data.links.forEach((link: {courseCode: string; linkUrl: string}) => {
              linksMap[link.courseCode] = link.linkUrl;
            });
            setCourseLinks(linksMap);
          }
        } catch (error) {
          console.error('Error loading course links:', error);
        }
      };
      loadCourseLinks();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedCourse) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/resources?courseCode=${selectedCourse.code}`);
        if (!response.ok) throw new Error('Failed to fetch resources');
        const data = await response.json();
        setResources(data.resources || []);
      } catch {
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, [selectedCourse]);

  const getCourseList = () => {
    if (selectedProgram === 'Electrical') return electricalCourses;
    if (selectedProgram === 'Computer') {
      if (softwareSpecialization) return computerSoftwareCourses;
      return computerHardwareCourses;
    }
    return [];
  };

  const getFilteredCourses = () => {
    if (!selectedYear) return [];
    if (selectedYear === 1) {
      return Object.values(allCourses).filter(c => c.year === 1);
    }
    const courses = getCourseList();
    return courses.filter(course => course.year === selectedYear)
      .map(course => allCourses[course.code])
      .sort((a, b) => a.code.localeCompare(b.code));
  };

  const handleBackClick = () => {
    if (resourcePath.length > 0) {
      const newPath = resourcePath.slice(0, -1);
      setResourcePath(newPath);
      setCurrentFolder(newPath.length > 0 ? newPath[newPath.length - 1] : null);
    } else {
      setSelectedCourse(null);
      setResources([]);
      setCurrentFolder(null);
      setResourcePath([]);
    }
  };

  const handleFolderClick = (folder: Resource) => {
    // If folder has a link URL, open it in a new tab instead of navigating
    if (folder.linkUrl) {
      window.open(folder.linkUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Otherwise, navigate into the folder as usual
    setCurrentFolder(folder);
    setResourcePath([...resourcePath, folder]);
  };

  const getCurrentResources = () => {
    if (!currentFolder) {
      return resources.filter(r => !r.parentId || r.parentId === selectedCourse?.code);
    }
    return resources.filter(r => r.parentId === currentFolder.id);
  };

  // Helper to get the current path as a string
  const getCurrentPath = () => {
    if (!selectedCourse) return '';
    if (!currentFolder) return selectedCourse.code;
    return `${selectedCourse.code}/${resourcePath.map(f => f.name).join('/')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[95%] h-[90vh] p-4 sm:p-8 relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#4A154B] mb-4 sm:mb-8">Exam Bank</h2>

        {/* Top Selection Bar */}
        {isMobile ? (
          <div className="flex flex-col gap-4 mb-4">
            {/* Year Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Year</h3>
              <select
                value={selectedYear ?? ''}
                onChange={e => {
                  const year = Number(e.target.value);
                  setSelectedYear(year);
                  if (year === 1) {
                    setSelectedProgram(null);
                    setSoftwareSpecialization(false);
                  }
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
              >
                <option value="" disabled>Select year</option>
                {years.map(year => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
            </div>
            {/* Program Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Program</h3>
              <select
                value={selectedProgram ?? ''}
                onChange={e => {
                  const stream = e.target.value as 'Electrical' | 'Computer';
                  setSelectedProgram(stream);
                  setSoftwareSpecialization(false);
                }}
                disabled={isCommonYear}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#931cf5] disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="" disabled>{isCommonYear ? 'Common year courses' : 'Select program'}</option>
                <option value="Electrical">Electrical</option>
                <option value="Computer">Computer</option>
              </select>
              {canSelectSoftware && (
                <button
                  onClick={() => setSoftwareSpecialization(!softwareSpecialization)}
                  className={`w-full mt-2 px-4 py-2 rounded-lg text-base transition-all ${
                    softwareSpecialization
                      ? 'bg-[#931cf5] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Software Specialization
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start mb-8">
            {/* Year Selection - Left Side */}
            <div className="w-1/3">
              <h3 className="text-xl font-semibold mb-4">Year</h3>
              <div className="flex space-x-4">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      if (year === 1) {
                        setSelectedProgram(null);
                        setSoftwareSpecialization(false);
                      }
                    }}
                    className={`px-8 py-4 rounded-lg text-lg transition-all ${
                      selectedYear === year
                        ? 'bg-[#931cf5] text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Year {year}
                  </button>
                ))}
              </div>
            </div>
            {/* Program Selection - Right Side */}
            <div className="w-1/3">
              <h3 className="text-xl font-semibold mb-4">Program</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setSelectedProgram('Electrical');
                      setSoftwareSpecialization(false);
                    }}
                    disabled={isCommonYear}
                    className={`px-8 py-4 rounded-lg text-lg transition-all flex-1 ${
                      isCommonYear
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : selectedProgram === 'Electrical'
                        ? 'bg-[#931cf5] text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Electrical
                  </button>
                  <button
                    onClick={() => setSelectedProgram('Computer')}
                    disabled={isCommonYear}
                    className={`px-8 py-4 rounded-lg text-lg transition-all flex-1 ${
                      isCommonYear
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : selectedProgram === 'Computer'
                        ? 'bg-[#931cf5] text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Computer
                  </button>
                </div>
                {isCommonYear && (
                  <span className="text-gray-500 italic text-center">
                    Common year courses
                  </span>
                )}
                {canSelectSoftware && (
                  <button
                    onClick={() => setSoftwareSpecialization(!softwareSpecialization)}
                    className={`px-8 py-4 rounded-lg text-lg transition-all ${
                      softwareSpecialization
                        ? 'bg-[#931cf5] text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Software Specialization
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder Content Area */}
        {!selectedCourse ? (
          <div className="overflow-y-auto max-h-[calc(90vh-20rem)] pr-2">
            {selectedYear && selectedYear !== 1 && !selectedProgram ? (
              <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
                Select a program to view courses
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {getFilteredCourses().map((course) => {
                  if (!course) return null;
                  const hasLink = courseLinks[course.code];
                  
                  const handleCourseClick = () => {
                    // If course has a link URL, open it in a new tab instead of selecting the course
                    if (hasLink) {
                      window.open(hasLink, '_blank', 'noopener,noreferrer');
                      return;
                    }
                    
                    // Otherwise, select the course as usual
                    setSelectedCourse(course);
                  };
                  
                  return (
                    <div
                      key={course.code}
                      onClick={handleCourseClick}
                      className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="font-semibold text-[#4A154B]">
                        {course.code}
                      </div>
                      <div className="text-sm text-gray-600">{course.name}</div>
                      <div className="text-xs text-gray-500 mt-1">Year {course.year}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Back button for exiting folder or course */}
            {selectedCourse && (
              <button
                onClick={() => {
                  if (resourcePath.length > 0) {
                    handleBackClick();
                  } else {
                    setSelectedCourse(null);
                    setResources([]);
                    setCurrentFolder(null);
                    setResourcePath([]);
                  }
                }}
                className="mb-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#4A154B] font-semibold rounded transition-colors w-fit"
              >
                {resourcePath.length > 0 ? '← Back' : '← Back to Courses'}
              </button>
            )}
            {/* Path/Breadcrumb Display */}
            <div className="flex items-center gap-2 mb-6">
              <h3 className={`${bebasNeue.className} text-2xl text-[#4A154B]`}>
                {getCurrentPath()}
              </h3>
            </div>
            {/* File/Folder Grid with Previews */}
            <div className="bg-gray-50 rounded-lg p-6 h-[calc(90vh-10rem)] overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#931cf5]"></div>
                </div>
              ) : getCurrentResources().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getCurrentResources().map((resource) => (
                    <div
                      key={resource.id}
                      className="relative bg-white rounded-lg p-4 pt-8 hover:shadow-md transition-shadow flex flex-col items-center min-h-[200px]"
                    >
                      {/* File/folder name at the top */}
                      <div className="w-full text-center mb-2 font-medium text-sm truncate px-2">
                        {resource.name}
                      </div>
                      {/* File/folder preview */}
                      <div
                        className="flex-1 flex items-center justify-center w-full mb-2 cursor-pointer"
                        onClick={() => {
                          if (resource.type === 'folder') {
                            handleFolderClick(resource);
                          } else if (resource.type === 'file' && resource.fileUrl) {
                            const ext = resource.fileUrl.split('.').pop()?.toLowerCase();
                            setPreviewFile({
                              url: resource.fileUrl,
                              name: resource.name,
                              type: ext === 'pdf' ? 'application/pdf' : (resource.fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? 'image/' : 'application/octet-stream')
                            });
                          }
                        }}
                      >
                        {resource.type === 'folder' ? (
                          <IoFolder className="w-12 h-12 opacity-80 text-[#931cf5]" />
                        ) : resource.fileUrl && resource.fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                          <Image
                            src={resource.fileUrl}
                            alt={resource.name}
                            width={80}
                            height={80}
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
                      {/* Action buttons for files and folders */}
                      {resource.type === 'file' && resource.fileUrl && (
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 px-3 py-1 text-xs bg-[#931cf5] text-white rounded hover:bg-[#7a1ac4] transition-colors w-full text-center"
                        >
                          Open
                        </a>
                      )}

                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No resources found for this course
                </div>
              )}
            </div>
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
                      <Image src={previewFile.url} alt={previewFile.name} width={600} height={600} className="max-h-[70vh] max-w-full rounded" />
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
          </>
        )}
      </div>
    </div>
  );
} 