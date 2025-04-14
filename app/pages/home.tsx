import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { IoDocumentText, IoMap } from 'react-icons/io5';
import { HiAcademicCap } from 'react-icons/hi';
import { bebasNeue } from '../fonts';
import PathwayModal from '../components/PathwayModal';
import ResourcesModal from '../components/ResourcesModal';
import Footer from '../components/Footer';

export default function Home() {
  const [showImage, setShowImage] = useState(false);
  const [isPathwayModalOpen, setIsPathwayModalOpen] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('ended', () => {
        setShowImage(true);
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="relative h-screen">
          {/* Background video with overlay */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${showImage ? 'opacity-0' : 'opacity-100'}`}
            >
              <source src="/images/drone.mp4" type="video/mp4" />
            </video>
            
            {/* Fallback image */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${showImage ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src="/images/campus.jpg"
                alt="Campus Background"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Purple overlay */}
            <div className="absolute inset-0 bg-[#931cf5] opacity-[0.2]"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-4">
            <div className="relative select-none -mt-[10px]">
              <h1 
                className={`text-[4.5rem] md:text-[4.5rem] font-bold text-[#ffffff] mb-0 drop-shadow-lg relative z-20 ${bebasNeue.className}`}
              >
                Electrical And Computer Engineering
              </h1>
              <h2 
                className={`text-[2.5rem] md:text-[3rem] font-medium text-white drop-shadow-lg -mt-9 relative z-10 ${bebasNeue.className}`}
              >
                Society For Toronto Metropolitan Students
              </h2>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="relative bg-[#4A154B] min-h-[1080px] -mt-16">
          <div className="container mx-auto px-4">
            <div className="absolute right-40 -top-16 bg-white/80 backdrop-blur-sm shadow-lg shadow-xl p-8 w-[750px] h-[350px]">
              <h2 className={`${bebasNeue.className} text-4xl text-[#4A154B] mb-4`}>
                About Us
              </h2>
              <p className="text-gray-700 leading-relaxed font-bold text-xl letter-spacing-wide text-center">
                The Electrical and Computer Engineering Society For Toronto Metropolitan Students (ECESTORMS) is a student-run organization at Toronto Metropolitan University (TMU) representing the interests of the Electrical and Computer Engineering students. ECESTORMS works to enhance the academic and professional journey of its members through various events, workshops, and networking opportunities.
              </p>
            </div>
          </div>
          <div className="absolute left-40 top-64 bg-white/80 backdrop-blur-sm shadow-lg shadow-xl p-8 w-[750px] h-[400px]">
            <h2 className={`${bebasNeue.className} text-4xl text-[#4A154B] mb-4`}>
              Our Team
            </h2>
            <div className="absolute left-25 top-20 bg-[#4A154B] shadow-xl p-8 w-[600px] h-[200px]">
            </div>
            <div className="absolute left-20 top-25 bg-[#000000] shadow-xl p-8 w-[600px] h-[275px]">
            </div>
          </div>
          <div className="absolute right-40 top-150 bg-white/80 backdrop-blur-sm shadow-lg shadow-xl p-8 w-[750px] h-[400px]">
            <h2 className={`${bebasNeue.className} text-4xl text-[#4A154B] mb-8 text-left`}>
              Quick Links
            </h2>
            <div className="grid grid-cols-3 gap-8">
              <a 
                href="https://forms.gle/YourGoogleFormLink" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
              >
                <IoDocumentText size={40} className="text-[#931cf5] mb-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg font-medium text-gray-800 text-center">Academic Resource Forum</span>
                <p className="text-sm text-gray-600 mt-2 text-center">Request a study hall or tutorial for your course</p>
              </a>
              <button 
                onClick={() => setIsPathwayModalOpen(true)}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
              >
                <IoMap size={40} className="text-[#931cf5] mb-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg font-medium text-gray-800 text-center">Program Pathway</span>
                <p className="text-sm text-gray-600 mt-2 text-center">Navigate your academic journey</p>
              </button>
              <button
                onClick={() => setIsResourcesModalOpen(true)} 
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
              >
                <HiAcademicCap size={40} className="text-[#931cf5] mb-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg font-medium text-gray-800 text-center">University Resources</span>
                <p className="text-sm text-gray-600 mt-2 text-center">Access academic and support resources</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <PathwayModal 
        isOpen={isPathwayModalOpen}
        onClose={() => setIsPathwayModalOpen(false)}
      />
      <ResourcesModal
        isOpen={isResourcesModalOpen}
        onClose={() => setIsResourcesModalOpen(false)}
      />
    </div>
  );
} 