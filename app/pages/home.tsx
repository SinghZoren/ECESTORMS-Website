'use client';

import { bebasNeue } from '../fonts';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [showImage, setShowImage] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('ended', () => {
        setShowImage(true);
      });
    }
  }, []);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
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
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
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
      <div className="relative bg-[#4A154B] min-h-[1080px] -mt-16 ">
        <div className="container mx-auto px-4">
          <div className="absolute right-40 -top-16 bg-white shadow-xl p-8 w-[750px] h-[350px]">
            <h2 className={`${bebasNeue.className} text-4xl text-[#4A154B] mb-4`}>
              About Us
            </h2>
            <p className="text-gray-700 leading-relaxed font-bold text-xl letter-spacing-wide text-center" >
              The Electrical and Computer Engineering Society For Toronto Metropolitan Students (ECESTORMS) is a student-run organization at Toronto Metropolitan University (TMU) representing the interests of the Electrical and Computer Engineering students. ECESTORMS works to enhance the academic and professional journey of its members through various events, workshops, and networking opportunities.
            </p>
            
          </div>
        </div>
        <div className="absolute left-40 top-64 bg-white shadow-xl p-8 w-[750px] h-[350px]">

        </div>
      </div>
    </>
  );
} 