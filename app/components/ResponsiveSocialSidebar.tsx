"use client";
import { useState, useEffect } from 'react';
import SocialSidebar from './SocialSidebar';

function useWindowWidth() {
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    setWidth(window.innerWidth); // set on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

export default function ResponsiveSocialSidebar() {
  const [mounted, setMounted] = useState(false);
  const width = useWindowWidth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Don't render on server
  if (width < 768) return null;
  return <SocialSidebar />;
} 