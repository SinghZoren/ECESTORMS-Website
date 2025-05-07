'use client';

import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
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

  const years = [1, 2, 3, 4];
  const isCommonYear = selectedYear === 1;
  const canSelectSoftware = selectedProgram === 'Computer' && (selectedYear === 3 || selectedYear === 4);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setCurrentFolder(folder);
    setResourcePath([...resourcePath, folder]);
  };

  const getCurrentResources = () => {
    if (!currentFolder) {
      return resources.filter(r => !r.parentId || r.parentId === selectedCourse?.code);
    }
    return resources.filter(r => r.parentId === currentFolder.id);
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
                  return (
                    <div
                      key={course.code}
                      onClick={() => setSelectedCourse(course)}
                      className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="font-semibold text-[#4A154B]">{course.code}</div>
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
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={handleBackClick}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Back
              </button>
              <h3 className="text-2xl text-[#4A154B]">{selectedCourse.code}</h3>
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
                              // setPreviewFile({
                              //   url: resource.fileUrl,
                              //   name: resource.name,
                              //   type: resource.fileUrl.split('.').pop()?.toLowerCase() === 'pdf' ? 'application/pdf' : (resource.fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? 'image/' : 'application/octet-stream')
                              // });
                            }
                          }}
                        >
                          {resource.type === 'folder' ? (
                            <span>📁</span>
                          ) : (
                            <span>📄</span>
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