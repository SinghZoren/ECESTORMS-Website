'use client';

import Navbar from './Navbar';
import ContentSwitcher from './ContentSwitcher';
import CircuitTransition from './CircuitTransition';

export default function ClientLayout() {
  return (
    <>
      <Navbar />
      <CircuitTransition>
        <ContentSwitcher />
      </CircuitTransition>
    </>
  );
} 