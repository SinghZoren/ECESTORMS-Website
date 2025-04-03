'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const pathname = usePathname();

  const handleNavigation = (section: string) => {
    setActiveSection(section);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" onClick={() => handleNavigation('home')}>
              <Image
                src="/images/logo.svg"
                alt="ECESTORMS Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('home')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'home' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation('about')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'about' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavigation('calendar')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'calendar' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => handleNavigation('events')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'events' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => handleNavigation('conference')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'conference' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Conference
            </button>
            <button
              onClick={() => handleNavigation('resources')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'resources' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => handleNavigation('shop')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'shop' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => handleNavigation('contact')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'contact' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 