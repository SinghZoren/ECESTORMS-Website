'use client';

import { FaInstagram, FaLinkedin, FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SocialSidebar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40">
      <div 
        className={`flex flex-col space-y-4 p-3 transition-all duration-300 ${
          isScrolled || !isHomePage 
            ? 'bg-white/80 backdrop-blur-sm shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <a
          href="https://instagram.com/ecestorms"
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-colors duration-300 hover:scale-110 transform ${
            isScrolled || !isHomePage 
              ? 'text-gray-600 hover:text-[#931cf5]' 
              : 'text-white hover:text-[#931cf5]'
          }`}
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://linkedin.com/company/ecestorms"
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-colors duration-300 hover:scale-110 transform ${
            isScrolled || !isHomePage 
              ? 'text-gray-600 hover:text-[#931cf5]' 
              : 'text-white hover:text-[#931cf5]'
          }`}
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href="https://discord.gg/Bv9AZRcDJN"
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-colors duration-300 hover:scale-110 transform ${
            isScrolled || !isHomePage 
              ? 'text-gray-600 hover:text-[#931cf5]' 
              : 'text-white hover:text-[#931cf5]'
          }`}
        >
          <FaDiscord size={24} />
        </a>
        <a
          href="mailto:ecestorms@torontomu.ca"
          className={`transition-colors duration-300 hover:scale-110 transform ${
            isScrolled || !isHomePage 
              ? 'text-gray-600 hover:text-[#931cf5]' 
              : 'text-white hover:text-[#931cf5]'
          }`}
        >
          <MdEmail size={24} />
        </a>
      </div>
    </div>
  );
} 