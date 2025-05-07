'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoChevronDown, IoClose } from 'react-icons/io5';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [conferenceVisible, setConferenceVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  const [ReactDOM, setReactDOM] = useState<typeof import('react-dom') | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const fetchConferenceVisibility = async () => {
      try {
        const response = await fetch('/api/conferenceVisibility');
        if (!response.ok) throw new Error('Failed to fetch conference visibility');
        const data = await response.json();
        setConferenceVisible(data.conferenceVisible);
      } catch (error) {
        console.error('Error fetching conference visibility:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    fetchConferenceVisibility();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen && typeof window !== 'undefined') {
      import('react-dom').then((mod) => setReactDOM(mod));
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (path: string) => {
    router.push(path);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage 
          ? 'bg-white/80 backdrop-blur-sm shadow-lg shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                className="h-12 w-auto transition-transform duration-300 hover:scale-110"
                src={isScrolled || !isHomePage ? "/images/logo.svg" : "/images/logoWhite.png"}
                alt="ECESTORMS Logo"
                width={48}
                height={48}
                priority
              />
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              href="/" 
              className={`px-3 py-2 text-sm font-bold relative group ${
                pathname === '/' 
                  ? isHomePage && !isScrolled 
                    ? 'text-white' 
                    : 'text-[#931cf5]' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-[#931cf5]'
              }`}
              onClick={() => handleNavClick('/')}
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <div 
              className="relative"
              onMouseEnter={() => setIsAboutHovered(true)}
              onMouseLeave={() => setIsAboutHovered(false)}
            >
              <button
                className={`px-3 py-2 text-sm font-bold relative group flex items-center ${
                  pathname.startsWith('/about') 
                    ? isHomePage && !isScrolled 
                      ? 'text-white' 
                      : 'text-[#931cf5]' 
                    : isHomePage && !isScrolled 
                      ? 'text-white hover:text-gray-200' 
                      : 'text-gray-700 hover:text-[#931cf5]'
                }`}
              >
                About
                <IoChevronDown className={`ml-1 transition-transform duration-200 ${isAboutHovered ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
              </button>
              {isAboutHovered && (
                <div 
                  className="absolute top-full left-0 w-48 z-50"
                  onMouseEnter={() => setIsAboutHovered(true)}
                  onMouseLeave={() => setIsAboutHovered(false)}
                >
                  <div className="h-1 bg-transparent"></div>
                  <div className="bg-white bg-white/80 backdrop-blur-sm shadow-lg shadow-xl shadow-lg py-2">
                    <Link
                      href="/our-team"
                      className={`block px-4 py-2 text-sm relative group ${
                        pathname === '/our-team'
                          ? 'text-[#931cf5]'
                          : 'text-gray-700 hover:text-[#931cf5]'
                      }`}
                      onClick={() => handleNavClick('/our-team')}
                    >
                      Our Team
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
                    </Link>
                    <Link
                      href="/office-hours"
                      className={`block px-4 py-2 text-sm relative group ${
                        pathname === '/office-hours'
                          ? 'text-[#931cf5]'
                          : 'text-gray-700 hover:text-[#931cf5]'
                      }`}
                      onClick={() => handleNavClick('/office-hours')}
                    >
                      Office Hours
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
                    </Link>
                    <Link
                      href="/partners"
                      className={`block px-4 py-2 text-sm relative group ${
                        pathname === '/partners'
                          ? 'text-[#931cf5]'
                          : 'text-gray-700 hover:text-[#931cf5]'
                      }`}
                      onClick={() => handleNavClick('/partners')}
                    >
                      Partners
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link 
              href="/calendar" 
              className={`px-3 py-2 text-sm font-bold relative group ${
                pathname === '/calendar' 
                  ? isHomePage && !isScrolled 
                    ? 'text-white' 
                    : 'text-[#931cf5]' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-[#931cf5]'
              }`}
              onClick={() => handleNavClick('/calendar')}
            >
              Calendar
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/events" 
              className={`px-3 py-2 text-sm font-bold relative group ${
                pathname === '/events' 
                  ? isHomePage && !isScrolled 
                    ? 'text-white' 
                    : 'text-[#931cf5]' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-[#931cf5]'
              }`}
              onClick={() => handleNavClick('/events')}
            >
              Events
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
            </Link>
            {conferenceVisible && (
              <Link 
                href="/conference" 
                className={`px-3 py-2 text-sm font-bold relative group ${
                  pathname === '/conference' 
                    ? isHomePage && !isScrolled 
                      ? 'text-white' 
                      : 'text-[#931cf5]' 
                    : isHomePage && !isScrolled 
                      ? 'text-white hover:text-gray-200' 
                      : 'text-gray-700 hover:text-[#931cf5]'
                }`}
                onClick={() => handleNavClick('/conference')}
              >
                Conference
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
              </Link>
            )}
            <Link 
              href="/resources" 
              className={`px-3 py-2 text-sm font-bold relative group ${
                pathname === '/resources' 
                  ? isHomePage && !isScrolled 
                    ? 'text-white' 
                    : 'text-[#931cf5]' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-[#931cf5]'
              }`}
              onClick={() => handleNavClick('/resources')}
            >
              Resources
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/shop" 
              className={`px-3 py-2 text-sm font-bold relative group ${
                pathname === '/shop' 
                  ? isHomePage && !isScrolled 
                    ? 'text-white' 
                    : 'text-[#931cf5]' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-[#931cf5]'
              }`}
              onClick={() => handleNavClick('/shop')}
            >
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
            </Link>
            
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {isMobileMenuOpen && ReactDOM && ReactDOM.createPortal(
              <>
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[99999] md:hidden" />
                <div className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-lg flex flex-col p-6 animate-slide-in z-[100000] md:hidden">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-[#931cf5]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IoClose size={28} />
                  </button>
                  <nav className="flex flex-col gap-4 mt-10">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-[#931cf5]">Home</Link>
                    <Link href="/our-team" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-[#931cf5]">Our Team</Link>
                    <Link href="/office-hours" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-[#931cf5]">Office Hours</Link>
                    <Link href="/partners" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-[#931cf5]">Partners</Link>
                    <Link href="/calendar" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-[#931cf5]">Calendar</Link>
                    <Link href="/events" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-[#931cf5]">Events</Link>
                    {conferenceVisible && <Link href="/conference" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-[#931cf5]">Conference</Link>}
                    <Link href="/resources" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-[#931cf5]">Resources</Link>
                    <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-[#931cf5]">Shop</Link>
                  </nav>
                </div>
              </>,
              document.body
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 