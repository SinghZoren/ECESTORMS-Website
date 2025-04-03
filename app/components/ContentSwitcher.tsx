'use client';

import { ReactNode } from 'react';
import Home from '../pages/home';
import About from '../pages/about';
import Calendar from '../pages/calendar';
import Events from '../pages/events';
import Conference from '../pages/conference';
import Resources from '../pages/resources';
import Shop from '../pages/shop';
import Contact from '../pages/contact';

interface ContentSwitcherProps {
  activeSection: string;
}

export default function ContentSwitcher({ activeSection }: ContentSwitcherProps) {
  const getContent = (): ReactNode => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'calendar':
        return <Calendar />;
      case 'events':
        return <Events />;
      case 'conference':
        return <Conference />;
      case 'resources':
        return <Resources />;
      case 'shop':
        return <Shop />;
      case 'contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="pt-16">
      {getContent()}
    </div>
  );
} 