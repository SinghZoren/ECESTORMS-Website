'use client';

import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import CourseTree from './CourseTree';

interface PathwayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PathwayModal({ isOpen, onClose }: PathwayModalProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedStream, setSelectedStream] = useState<'electrical' | 'computer' | null>(null);
  const [softwareSpecialization, setSoftwareSpecialization] = useState(false);

  const isCommonYear = selectedYear === 1;
  const canSelectSoftware = selectedStream === 'computer' && (selectedYear === 3 || selectedYear === 4);

  const years = [1, 2, 3, 4];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[95%] h-[90vh] p-8 relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-3xl font-bold text-[#4A154B] mb-8">Program Pathway</h2>

        {/* Top Selection Bar */}
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
                      setSelectedStream(null);
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

          {/* Stream Selection - Right Side */}
          <div className="w-1/3">
            <h3 className="text-xl font-semibold mb-4">Program</h3>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setSelectedStream('electrical');
                    setSoftwareSpecialization(false);
                  }}
                  disabled={isCommonYear}
                  className={`px-8 py-4 rounded-lg text-lg transition-all flex-1 ${
                    isCommonYear
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : selectedStream === 'electrical'
                      ? 'bg-[#931cf5] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Electrical
                </button>
                <button
                  onClick={() => setSelectedStream('computer')}
                  disabled={isCommonYear}
                  className={`px-8 py-4 rounded-lg text-lg transition-all flex-1 ${
                    isCommonYear
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : selectedStream === 'computer'
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

        {/* Course Tree Diagram Area */}
        <div className="bg-gray-50 rounded-lg p-6 flex-1 overflow-auto">
          <CourseTree
            year={selectedYear}
            stream={selectedStream}
            isSoftwareSpecialization={softwareSpecialization}
          />
        </div>
      </div>
    </div>
  );
} 