'use client';

import { useEffect, useState } from 'react';

export default function CircuitTransition({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentContent, setCurrentContent] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setCurrentContent(children);
      setIsTransitioning(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [children]);

  return (
    <div className="relative">
      {isTransitioning && (
        <div 
          className="fixed inset-0 bg-white z-40 flex items-center justify-center"
          style={{ 
            top: '64px',
            opacity: 1,
            transition: 'opacity 0.5s ease-in-out'
          }}
        >
          <div className="w-96 h-auto">
            <img
              src="/images/logo.svg"
              alt="ECESTORMS Logo"
              className="w-full h-auto animate-logo-fade"
              style={{ 
                willChange: 'opacity',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)'
              }}
              loading="eager"
            />
          </div>
        </div>
      )}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {currentContent}
      </div>
    </div>
  );
} 