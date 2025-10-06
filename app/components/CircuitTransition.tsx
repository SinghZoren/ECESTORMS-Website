'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const contentVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(6px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(6px)',
    transition: {
      duration: 0.25,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

const overlayVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.35, ease: 'easeIn', delay: 0.1 },
  },
};

const logoVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    scale: 1.08,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] },
  },
};

interface CircuitTransitionProps {
  children: React.ReactNode;
}

export default function CircuitTransition({ children }: CircuitTransitionProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [pageKey, setPageKey] = useState(pathname);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (pathname === pageKey) return;

    setShowOverlay(true);

    const updateTimer = setTimeout(() => {
      setPageKey(pathname);
    }, 180);

    const hideTimer = setTimeout(() => {
      setShowOverlay(false);
    }, 650);

    return () => {
      clearTimeout(updateTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname, pageKey, isMounted]);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-white">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pageKey}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="circuit-overlay"
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div variants={logoVariants} initial="initial" animate="animate" exit="exit" className="flex items-center justify-center">
              <Image
                src="/images/logo.svg"
                alt="ECESTORMS logo"
                width={160}
                height={160}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}