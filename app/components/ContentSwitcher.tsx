'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Home from '../home/page';
import Calendar from '../calendar/page';
import Events from '../events/page';
import Conference from '../conference/page';
import Resources from '../resources/page';
import Shop from '../shop/page';
import Contact from '../contact/page';
import OurTeam from '../our-team/page';
import OfficeHours from '../office-hours/page';
import Partners from '../partners/page';
import Admin from '../admin/page';

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