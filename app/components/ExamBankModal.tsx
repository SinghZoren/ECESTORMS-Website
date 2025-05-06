'use client';

import React, { useState, useEffect } from 'react';
import { IoClose, IoFolder, IoDocument, IoArrowBack } from 'react-icons/io5';
import { bebasNeue } from '../fonts';
import { allCourses, electricalCourses, computerHardwareCourses, computerSoftwareCourses, CourseInfo } from '../data/courses';

interface Resource {
  id: string;
  name: string;
  type: 'file' | 'folder';
  courseCode: string;
  parentId: string | null;
  fileUrl?: string;
  children?: Resource[];
}

interface ExamBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
}

export default function ExamBankModal({ isOpen, onClose }: ExamBankModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Resource | null>(null);
  const [resourcePath, setResourcePath] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<'Electrical' | 'Computer' | null>(null);
  const [softwareSpecialization, setSoftwareSpecialization] = useState(false);
  const [previewFile, setPreviewFile] = useState<null | { url: string; name: string; type: string }>(null);

  const years = [1, 2, 3, 4];
  const isCommonYear = selectedYear === 1;
  const canSelectSoftware = selectedProgram === 'Computer' && (selectedYear === 3 || selectedYear === 4);

  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedCourse) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/resources?courseCode=${selectedCourse.code}`);
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const data = await response.json();
        setResources(data.resources || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [selectedCourse]);

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
    setCurrentFolder(folder);
    setResourcePath([...resourcePath, folder]);
  };

  const getCurrentResources = () => {
    if (!currentFolder) {
      // Show all root-level resources (files and folders)
      return resources.filter(r => !r.parentId || r.parentId === selectedCourse?.code);
    }
    // Show all resources whose parentId matches the current folder
    return resources.filter(r => r.parentId === currentFolder.id);
  };

  const getCurrentPath = () => {
    if (!selectedCourse) return '';
    if (!currentFolder) return selectedCourse.code;
    return `${selectedCourse.code}/${resourcePath.map(f => f.name).join('/')}`;
  };

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
      // First year: show all common courses
      return Object.values(allCourses).filter(c => c.year === 1);
    }
    const courses = getCourseList();
    return courses.filter(course => course.year === selectedYear)
      .map(course => allCourses[course.code])
      .sort((a, b) => a.code.localeCompare(b.code));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[95%] h-[90vh] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoClose size={24} />
        </button>

        {/* File Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg relative max-w-5xl w-[90vw] max-h-[95vh] flex flex-col">
              {/* Download button (not for PDFs) */}
              { !previewFile.type.startsWith('application/pdf') && (
                <a
                  href={previewFile.url}
                  download={previewFile.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-16 px-4 py-2 bg-[#931cf5] text-white rounded hover:bg-[#7a1ac4] z-10"
                >
                  Download
                </a>
              )}
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
                  <img src={previewFile.url} alt={previewFile.name} className="max-h-[80vh] max-w-full rounded" />
                ) : previewFile.type === 'application/pdf' ? (
                  <iframe src={previewFile.url} title={previewFile.name} className="w-full h-[85vh] rounded" />
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

        <h2 className={`${bebasNeue.className} text-4xl text-[#4A154B] mb-6`}>
          {selectedCourse ? 'Resources' : 'Select a Course'}
        </h2>

        {!selectedCourse ? (
          <>
            {/* Top Selection Controls */}
            <div className="flex justify-between items-start mb-8">
              {/* Year Selection - Left Side */}
              <div className="w-1/3">
                <h3 className="text-xl font-semibold mb-4">Year</h3>
                <div className="flex gap-4">
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
                      className={`px-8 py-4 rounded-lg transition-colors ${
                        selectedYear === year
                          ? 'bg-[#931cf5] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
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
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setSelectedProgram('Electrical');
                        setSoftwareSpecialization(false);
                      }}
                      disabled={isCommonYear}
                      className={`px-8 py-4 rounded-lg transition-colors flex-1 ${
                        isCommonYear
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedProgram === 'Electrical'
                          ? 'bg-[#931cf5] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Electrical
                    </button>
                    <button
                      onClick={() => setSelectedProgram('Computer')}
                      disabled={isCommonYear}
                      className={`px-8 py-4 rounded-lg transition-colors flex-1 ${
                        isCommonYear
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedProgram === 'Computer'
                          ? 'bg-[#931cf5] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Computer
                    </button>
                  </div>
                  {canSelectSoftware && (
                    <button
                      onClick={() => setSoftwareSpecialization(!softwareSpecialization)}
                      className={`px-8 py-4 rounded-lg transition-colors ${
                        softwareSpecialization
                          ? 'bg-[#931cf5] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Software Specialization
                    </button>
                  )}
                  {isCommonYear && (
                    <span className="text-gray-500 italic text-center">
                      Common year courses
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="overflow-y-auto max-h-[calc(90vh-20rem)] pr-2">
              {selectedYear && selectedYear !== 1 && !selectedProgram ? (
                <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
                  Select a program to view courses
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {getFilteredCourses().map((course) => {
                    if (!course) return null;
                    return (
                      <div
                        key={course.code}
                        onClick={() => setSelectedCourse(course)}
                        className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="font-semibold text-[#4A154B]">{course.code}</div>
                        <div className="text-sm text-gray-600">{course.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Year {course.year}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={handleBackClick}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoArrowBack size={24} />
              </button>
              <h3 className={`${bebasNeue.className} text-2xl text-[#4A154B]`}>
                {getCurrentPath()}
              </h3>
            </div>

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
                      className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center gap-2 flex-1 cursor-pointer"
                          onClick={() => {
                            if (resource.type === 'folder') {
                              handleFolderClick(resource);
                            } else if (resource.type === 'file' && resource.fileUrl) {
                              setPreviewFile({
                                url: resource.fileUrl,
                                name: resource.name.includes('-') ? resource.name.split('-').slice(1).join('-') : resource.name,
                                type: resource.fileUrl.split('.').pop()?.toLowerCase() === 'pdf' ? 'application/pdf' : (resource.fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? 'image/' : 'application/octet-stream')
                              });
                            }
                          }}
                        >
                          {resource.type === 'folder' ? (
                            <IoFolder className="text-[#931cf5]" />
                          ) : (
                            <IoDocument className="text-[#931cf5]" />
                          )}
                          <span className="truncate">{resource.name}</span>
                        </div>
                        {resource.type === 'file' && (
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#931cf5] hover:text-[#7a1ac4]"
                          >
                            Open
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No resources found for this course
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 