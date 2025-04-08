'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
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

  const handleNavClick = (path: string) => {
    router.push(path);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage 
          ? 'bg-white shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-12 w-auto transition-transform duration-300 hover:scale-110"
                src={isScrolled || !isHomePage ? "/images/logo.svg" : "/images/logoWhite.png"}
                alt="ECESTORMS Logo"
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
                    : 'text-blue-600' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-blue-600'
              }`}
              onClick={() => handleNavClick('/')}
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className={`px-3 py-2 text-sm font-bold relative group ${
                pathname === '/about' 
                  ? isHomePage && !isScrolled 
                    ? 'text-white' 
                    : 'text-blue-600' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-blue-600'
              }`}
              onClick={() => handleNavClick('/about')}
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/calendar" 
              className={`px-3 py-2 text-sm font-bold relative group ${
                pathname === '/calendar' 
                  ? isHomePage && !isScrolled 
                    ? 'text-white' 
                    : 'text-blue-600' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-blue-600'
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
                    : 'text-blue-600' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-blue-600'
              }`}
              onClick={() => handleNavClick('/events')}
            >
              Events
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/conference" 
              className={`px-3 py-2 text-sm font-bold relative group ${
                pathname === '/conference' 
                  ? isHomePage && !isScrolled 
                    ? 'text-white' 
                    : 'text-blue-600' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-blue-600'
              }`}
              onClick={() => handleNavClick('/conference')}
            >
              Conference
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/resources" 
              className={`px-3 py-2 text-sm font-bold relative group ${
                pathname === '/resources' 
                  ? isHomePage && !isScrolled 
                    ? 'text-white' 
                    : 'text-blue-600' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-blue-600'
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
                    : 'text-blue-600' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-blue-600'
              }`}
              onClick={() => handleNavClick('/shop')}
            >
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/contact" 
              className={`px-3 py-2 text-sm font-bold relative group ${
                pathname === '/contact' 
                  ? isHomePage && !isScrolled 
                    ? 'text-white' 
                    : 'text-blue-600' 
                  : isHomePage && !isScrolled 
                    ? 'text-white hover:text-gray-200' 
                    : 'text-gray-700 hover:text-blue-600'
              }`}
              onClick={() => handleNavClick('/contact')}
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#931cf5] transition-all duration-500 group-hover:w-full"></span>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300"
              aria-controls="mobile-menu"
              aria-expanded="false"
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
          </div>
        </div>
      </div>
    </nav>
  );
} 