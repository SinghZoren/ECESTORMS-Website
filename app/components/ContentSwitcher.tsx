'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Home from '../pages/home';
import Calendar from '../pages/calendar';
import Events from '../pages/events';
import Conference from '../pages/conference';
import Resources from '../pages/resources';
import Shop from '../pages/shop';
import Contact from '../pages/contact';
import OurTeam from '../pages/our-team'
import OfficeHours from '../pages/office-hours'
import Partners from '../pages/partners'
import Admin from '../pages/admin'

export default function ContentSwitcher() {
  const pathname = usePathname();
  
  const getContent = (): ReactNode => {
    switch (pathname) {
      case '/':
        return <Home />;
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
      case '/our-team':
        return <OurTeam />;
      case '/office-hours':
        return <OfficeHours />;
      case '/partners':
        return <Partners />;
      case '/admin':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex-grow">
      {getContent()}
    </div>
  );
} 