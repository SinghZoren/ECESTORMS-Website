'use client';

import { FaInstagram, FaLinkedin, FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Social Media Links */}
          <div className="flex space-x-6 mb-4">
            <a
              href="https://instagram.com/ecestorms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#931cf5] transition-colors duration-300"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://linkedin.com/company/ecestorms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#931cf5] transition-colors duration-300"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://discord.gg/Bv9AZRcDJN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#931cf5] transition-colors duration-300"
            >
              <FaDiscord size={24} />
            </a>
            <a
              href="mailto:ecestorms@torontomu.ca"
              className="text-gray-600 hover:text-[#931cf5] transition-colors duration-300"
            >
              <MdEmail size={24} />
            </a>
          </div>

          <p className="text-gray-600 text-sm">
            © {currentYear} ECESTORMS. All rights reserved.
          </p>
          <img src="/images/Logo.png" alt="ECESTORMS Logo" className="w-28 h-12 inline-block mr-2" />
        </div>
      </div>
    </footer>
  );
} 