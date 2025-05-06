'use client';

import React, { useState, useEffect } from 'react';
import { bebasNeue } from '../fonts';
import { IoDocumentText, IoClose } from 'react-icons/io5';
import { HiAcademicCap } from 'react-icons/hi';
import Image from 'next/image';
import ExamBankModal from '../components/ExamBankModal';

interface TutorialEvent {
  id: string;
  course: string;
  date: string;
  time: string;
  taName: string;
  location: string;
  zoomLink?: string;
  willRecord: boolean;
  willPostNotes: boolean;
  additionalResources?: string[];
  type: 'academic' | 'non-academic';
}

export default function Resources() {
  const [isExamBankOpen, setIsExamBankOpen] = useState(false);
  const [isTutorialsOpen, setIsTutorialsOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<'exam' | 'tutorial' | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [tutorialEvents, setTutorialEvents] = useState<TutorialEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isTutorialsOpen) fetchTutorials();
  }, [isTutorialsOpen]);

  const fetchTutorials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tutorials');
      const data = await res.json();
      setTutorialEvents(data.tutorials || []);
    } catch {
      setTutorialEvents([]);
    }
    setLoading(false);
  };

  const academicTutorials = tutorialEvents.filter(event => event.type === 'academic');
  const nonAcademicTutorials = tutorialEvents.filter(event => event.type === 'non-academic');

  return (
    <div className="min-h-screen bg-[#4A154B] flex flex-col md:flex-row relative overflow-hidden">
      {/* Exam Bank Section */}
      <button 
        onClick={() => {
          setSelectedCourse('ELEC2501'); // Default course for now
          setIsExamBankOpen(true);
        }}
        onMouseEnter={() => setHoveredSection('exam')}
        onMouseLeave={() => setHoveredSection(null)}
        className={`flex-1 flex items-center justify-center p-8 hover:bg-[#3a1039] transition-all duration-[600ms] relative z-10 group overflow-hidden ${hoveredSection === 'tutorial' ? 'grayscale blur-sm' : ''}`}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
          width: '50%'
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/exam-bank-bg.jpg"
            alt="Exam Bank Background"
            fill
            className={`object-cover transition-all duration-[600ms] ${hoveredSection === 'tutorial' ? 'grayscale blur-sm' : ''}`}
            priority
          />
          {/* Overlay */}
          <div className={`absolute inset-0 bg-[#4A154B]/60 transition-opacity duration-[600ms] ${hoveredSection === 'exam' ? 'opacity-40' : 'opacity-60'}`} />
        </div>

        <div className={`text-center relative z-10 transition-all duration-[600ms] ${hoveredSection === 'tutorial' ? 'grayscale blur-sm' : ''}`}>
          <div className="flex justify-center mb-6">
            <IoDocumentText className="w-20 h-20 text-white opacity-80" />
          </div>
          <h2 className={`${bebasNeue.className} text-7xl text-white mb-4`}>
            Exam Bank
          </h2>
        </div>
      </button>

      {/* Tutorials Section */}
      <button 
        onClick={() => setIsTutorialsOpen(true)}
        onMouseEnter={() => setHoveredSection('tutorial')}
        onMouseLeave={() => setHoveredSection(null)}
        className={`flex-1 flex items-center justify-center p-8 hover:bg-[#3a1039] transition-all duration-[600ms] relative group overflow-hidden ${hoveredSection === 'exam' ? 'grayscale blur-sm' : ''}`}
        style={{
          clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
          marginLeft: '-8%',
          width: '50%'
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/tutorials-bg.jpg"
            alt="Tutorials Background"
            fill
            className={`object-cover transition-all duration-[600ms] ${hoveredSection === 'exam' ? 'grayscale blur-sm' : ''}`}
            priority
          />
          {/* Overlay */}
          <div className={`absolute inset-0 bg-[#4A154B]/60 transition-opacity duration-[600ms] ${hoveredSection === 'tutorial' ? 'opacity-40' : 'opacity-60'}`} />
        </div>

        <div className={`text-center relative z-10 transition-all duration-[600ms] ${hoveredSection === 'exam' ? 'grayscale blur-sm' : ''}`}>
          <div className="flex justify-center mb-6">
            <HiAcademicCap className="w-20 h-20 text-white opacity-80" />
          </div>
          <h2 className={`${bebasNeue.className} text-7xl text-white mb-4`}>
            Tutorials
          </h2>
        </div>
      </button>

      {/* Exam Bank Modal */}
      <ExamBankModal
        isOpen={isExamBankOpen}
        onClose={() => {
          setIsExamBankOpen(false);
          setSelectedCourse(null);
        }}
        courseCode={selectedCourse || ''}
      />

      {/* Tutorials Modal */}
      {isTutorialsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg w-[95%] h-[90vh] p-8 relative flex flex-col">
            <button
              onClick={() => setIsTutorialsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <IoClose size={24} />
            </button>

            <h2 className={`${bebasNeue.className} text-4xl text-[#4A154B] mb-8`}>Tutorials</h2>

            <div className="overflow-auto flex-1">
              {/* Academic Tutorials */}
              <div className="mb-12">
                <h3 className={`${bebasNeue.className} text-3xl text-[#931cf5] mb-6`}>Academic Tutorials</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-[#931cf5] text-white">
                        <th className="px-4 py-2 text-left">Course</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="px-4 py-2 text-left">TA</th>
                        <th className="px-4 py-2 text-left">Location</th>
                        <th className="px-4 py-2 text-left">Zoom</th>
                        <th className="px-4 py-2 text-left">Resources</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={7} className="text-center py-4">Loading...</td></tr>
                      ) : academicTutorials.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-4">No academic tutorials scheduled.</td></tr>
                      ) : academicTutorials.map(event => (
                        <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="px-4 py-2">{event.course}</td>
                          <td className="px-4 py-2">{event.date}</td>
                          <td className="px-4 py-2">{event.time}</td>
                          <td className="px-4 py-2">{event.taName}</td>
                          <td className="px-4 py-2">{event.location}</td>
                          <td className="px-4 py-2">
                            {event.zoomLink && (
                              <a 
                                href={event.zoomLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#931cf5] hover:underline"
                              >
                                Join
                              </a>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-col gap-1">
                              {event.willRecord && <span className="text-sm">📹 Recording</span>}
                              {event.willPostNotes && <span className="text-sm">📝 Notes</span>}
                              {event.additionalResources?.map((resource, index) => (
                                <span key={index} className="text-sm">📚 {resource}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Non-Academic Tutorials */}
              <div>
                <h3 className={`${bebasNeue.className} text-3xl text-[#931cf5] mb-6`}>Non-Academic Tutorials</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-[#931cf5] text-white">
                        <th className="px-4 py-2 text-left">Course</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="px-4 py-2 text-left">TA</th>
                        <th className="px-4 py-2 text-left">Location</th>
                        <th className="px-4 py-2 text-left">Zoom</th>
                        <th className="px-4 py-2 text-left">Resources</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={7} className="text-center py-4">Loading...</td></tr>
                      ) : nonAcademicTutorials.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-4">No non-academic tutorials scheduled.</td></tr>
                      ) : nonAcademicTutorials.map(event => (
                        <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="px-4 py-2">{event.course}</td>
                          <td className="px-4 py-2">{event.date}</td>
                          <td className="px-4 py-2">{event.time}</td>
                          <td className="px-4 py-2">{event.taName}</td>
                          <td className="px-4 py-2">{event.location}</td>
                          <td className="px-4 py-2">
                            {event.zoomLink && (
                              <a 
                                href={event.zoomLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#931cf5] hover:underline"
                              >
                                Join
                              </a>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-col gap-1">
                              {event.willRecord && <span className="text-sm">📹 Recording</span>}
                              {event.willPostNotes && <span className="text-sm">📝 Notes</span>}
                              {event.additionalResources?.map((resource, index) => (
                                <span key={index} className="text-sm">📚 {resource}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}