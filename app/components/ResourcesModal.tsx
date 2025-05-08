'use client';

import { IoClose } from 'react-icons/io5';
import { HiHeart } from 'react-icons/hi';
import { FaHospital, FaDatabase, FaUniversity, FaBook } from 'react-icons/fa';
import { MdAccessibility, MdSecurity } from 'react-icons/md';

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Resource {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

export default function ResourcesModal({ isOpen, onClose }: ResourcesModalProps) {
  const mainResources: Resource[] = [
    {
      title: "Academic Consideration Request Form",
      description: "Academic consideration is a form of alternate arrangement that may be made with the approval of the course faculty/contract lecturer, when a student experiences extenuating circumstances that prevents them from completing an academic requirement. ",
      icon: <MdSecurity className="w-8 h-8 text-[#931cf5]" />,
      link: "https://prod.apps.ccs.torontomu.ca/senateapps/acadconsprecondition"
    },
    {
      title: "TMU Medical Centre",
      description: "The Medical Centre, located in 181 Kerr Hall West, offers various health services to current TMU students, faculty, and staff in order to account for and respond to the physical well-being of the student body.",
      icon: <FaHospital className="w-8 h-8 text-[#931cf5]" />,
      link: "https://www.torontomu.ca/student-wellbeing/medicalcentre/"
    },
    {
      title: "Community Wellbeing",
      description: "A department at TMU which works to address the needs of students and issues impacting the wellbeing of students across campus by tackling issues over time which cannot be handled by a single department.",
      icon: <HiHeart className="w-8 h-8 text-[#931cf5]" />,
      link: "https://www.torontomu.ca/community-wellbeing/"
    },
    {
      title: "Centre For Student Development & Counselling",
      description: "Allows students to book one-on-one sessions with educated and experienced professionals in order to provide a space where students can thrive, grow, and excel.",
      icon: <FaUniversity className="w-8 h-8 text-[#931cf5]" />,
      link: "https://www.torontomu.ca/student-wellbeing/counselling/"
    },
    {
      title: "Test Centre",
      description: "TMU Test Centre, including the Accommodated Test Centre (ATC) and Make Up Test Centre (MUTC), provides administrative guidance and support to students in order to aid in demonstrating their learning.",
      icon: <FaBook className="w-8 h-8 text-[#931cf5]" />,
      link: "https://www.torontomu.ca/accommodations/test-centre/"
    },
    {
      title: "Student Resources Database",
      description: "Encompasses and outlines various resources that TMU students have available to them which may aid in their academic, mental, or professional success in the future.",
      icon: <FaDatabase className="w-8 h-8 text-[#931cf5]" />,
      link: "https://www.torontomu.ca/student-life-and-learning/learning-support/"
    },
    {
      title: "Academic Accommodation Support (AAS)",
      description: "Serves as the accessibility services office which works to create inclusive and inviting learning environments for TMU students.",
      icon: <MdAccessibility className="w-8 h-8 text-[#931cf5]" />,
      link: "https://www.torontomu.ca/accommodations/"
    }
  ];

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

        <h2 className="text-3xl font-bold text-[#4A154B] mb-8">University Resources</h2>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-auto flex-1">
          {mainResources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100 hover:border-[#931cf5]/20 group"
            >
              <div className="flex items-center mb-4">
                {resource.icon}
                <h3 className="text-lg font-semibold text-gray-800 ml-3 group-hover:text-[#931cf5] transition-colors">
                  {resource.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm flex-1">
                {resource.description}
              </p>
            </a>
          ))}
        </div>

        {/* View All Resources Button */}
        <div className="mt-6 flex justify-center">
          <a
            href="https://mues.ca/services/resources-database/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#931cf5] text-white rounded-lg hover:bg-[#7916c4] transition-colors text-lg font-medium"
          >
            View Complete Resources Database
          </a>
        </div>
      </div>
    </div>
  );
} 