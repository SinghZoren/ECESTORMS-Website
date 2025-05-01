'use client';

import React, { useState } from 'react';
import { bebasNeue } from '../fonts';
import { IoClose } from 'react-icons/io5';
import { IoDocumentText } from 'react-icons/io5';
import { HiAcademicCap } from 'react-icons/hi';
import Image from 'next/image';

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
}

interface ExamBankYear {
  year: string;
  courses: {
    code: string;
    name: string;
    resources: {
      name: string;
      link: string;
    }[];
  }[];
}

export default function Resources() {
  const [isExamBankOpen, setIsExamBankOpen] = useState(false);
  const [isTutorialsOpen, setIsTutorialsOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<'exam' | 'tutorial' | null>(null);

  // Sample data - replace with actual data from your backend
  const examBankYears: ExamBankYear[] = [
    {
      year: '2023-2024',
      courses: [
        {
          code: 'ELE302',
          name: 'Electric Networks',
          resources: [
            { name: 'Midterm 2023', link: '/exams/ele302-midterm-2023.pdf' },
            { name: 'Final 2023', link: '/exams/ele302-final-2023.pdf' },
          ]
        },
      ]
    },
  ];

  const tutorialEvents: TutorialEvent[] = [
    {
      id: '1',
      course: 'ELE302',
      date: '2024-03-15',
      time: '14:00-16:00',
      taName: 'John Doe',
      location: 'ENG123',
      zoomLink: 'https://zoom.us/j/example',
      willRecord: true,
      willPostNotes: true,
      additionalResources: ['Practice Problems', 'Solution Guide']
    },
  ];

  return (
    <div className="min-h-screen bg-[#4A154B] flex flex-col md:flex-row relative overflow-hidden">
      {/* Exam Bank Section */}
      <button 
        onClick={() => setIsExamBankOpen(true)}
        onMouseEnter={() => setHoveredSection('exam')}
        onMouseLeave={() => setHoveredSection(null)}
        className="flex-1 flex items-center justify-center p-8 hover:bg-[#3a1039] transition-all duration-500 relative z-10 group overflow-hidden"
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
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className={`absolute inset-0 bg-[#4A154B]/60 transition-opacity duration-500 ${hoveredSection === 'exam' ? 'opacity-40' : 'opacity-60'}`} />
        </div>

        <div className="text-center relative z-10">
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
        className="flex-1 flex items-center justify-center p-8 hover:bg-[#3a1039] transition-all duration-500 relative group overflow-hidden"
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
            className={`object-cover transition-all duration-500 ${hoveredSection === 'exam' ? 'grayscale blur-sm' : ''}`}
            priority
          />
          {/* Overlay */}
          <div className={`absolute inset-0 bg-[#4A154B]/60 transition-opacity duration-500 ${hoveredSection === 'tutorial' ? 'opacity-40' : 'opacity-60'}`} />
        </div>

        <div className="text-center relative z-10">
          <div className="flex justify-center mb-6">
            <HiAcademicCap className="w-20 h-20 text-white opacity-80" />
          </div>
          <h2 className={`${bebasNeue.className} text-7xl text-white mb-4`}>
            Tutorials
          </h2>
        </div>
      </button>

      {/* Exam Bank Modal */}
      {isExamBankOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg w-[95%] h-[90vh] p-8 relative flex flex-col">
            <button
              onClick={() => setIsExamBankOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <IoClose size={24} />
            </button>

            <h2 className={`${bebasNeue.className} text-4xl text-[#4A154B] mb-8`}>Exam Bank</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto">
              {examBankYears.map((yearData) => (
                <div key={yearData.year} className="bg-gray-50 rounded-lg p-6">
                  <h3 className={`${bebasNeue.className} text-2xl text-[#931cf5] mb-4`}>
                    {yearData.year}
                  </h3>
                  <div className="space-y-4">
                    {yearData.courses.map((course) => (
                      <div key={course.code} className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-lg mb-2">{course.code}</h4>
                        <p className="text-gray-600 mb-3">{course.name}</p>
                        <div className="space-y-2">
                          {course.resources.map((resource, idx) => (
                            <a
                              key={idx}
                              href={resource.link}
                              className="block text-[#931cf5] hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {resource.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                      {tutorialEvents
                        .filter(event => event.course.startsWith('ELE'))
                        .map((event) => (
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
                      {tutorialEvents
                        .filter(event => !event.course.startsWith('ELE'))
                        .map((event) => (
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