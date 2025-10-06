'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const transitionVariants = {
  initial: {
    opacity: 0,
    y: 24,
    filter: 'blur(8px) saturate(60%)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px) saturate(100%)',
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -24,
    filter: 'blur(8px) saturate(60%)',
    transition: {
      duration: 0.28,
      ease: [0.55, 0, 0.55, 0.2],
    },
  },
};

interface CircuitTransitionProps {
  children: React.ReactNode;
}

export default function CircuitTransition({ children }: CircuitTransitionProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}