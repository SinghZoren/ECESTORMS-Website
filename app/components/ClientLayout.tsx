'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import ContentSwitcher from './ContentSwitcher';
import CircuitTransition from './CircuitTransition';

export default function ClientLayout() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <>
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <CircuitTransition>
        <ContentSwitcher activeSection={activeSection} />
      </CircuitTransition>
    </>
  );
} 