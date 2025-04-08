'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Home from '../pages/home';
import About from '../pages/about';
import Calendar from '../pages/calendar';
import Events from '../pages/events';
import Conference from '../pages/conference';
import Resources from '../pages/resources';
import Shop from '../pages/shop';
import Contact from '../pages/contact';
import Footer from './Footer';

export default function ContentSwitcher() {
  const pathname = usePathname();
  
  const getContent = (): ReactNode => {
    switch (pathname) {
      case '/':
        return <Home />;
      case '/about':
        return <About />;
      case '/calendar':
        return <Calendar />;
      case '/events':
        return <Events />;
      case '/conference':
        return <Conference />;
      case '/resources':
        return <Resources />;
      case '/shop':
        return <Shop />;
      case '/contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {getContent()}
      </div>
      <Footer />
    </div>
  );
} 