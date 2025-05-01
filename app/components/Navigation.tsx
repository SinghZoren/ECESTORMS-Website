'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Calendar', path: '/calendar' },
  { name: 'Events', path: '/events' },
  { name: 'Conference', path: '/conference' },
  { name: 'Resources', path: '/resources' },
  { name: 'Shop', path: '/shop' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-gray-200 bg-white fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/Logo.png"
                alt="ECESTORMS Logo"
                width={200}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.path} className="relative group">
                <Link
                  href={item.path}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    pathname === item.path
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
                {pathname === item.path && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600" />
                )}
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 