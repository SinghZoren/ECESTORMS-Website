'use client';

import { useEffect, useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { slides } from "./slides";
import type { SlideDefinition } from "./types";

const SLIDE_DURATION = 15000;

const fadeVariants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: -10 },
};

export default function SlidesShow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const progressRef = useMemo(() => ({ current: 0 }), []);

  const currentSlide = useMemo<SlideDefinition>(() => slides[currentIndex], [currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const updateProgress = useCallback(() => {
    progressRef.current += 100;
    const newProgress = Math.min(progressRef.current / SLIDE_DURATION, 1);
    setProgress(newProgress * 100);
    if (newProgress >= 1) {
      handleNext();
    }
  }, [handleNext]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
  }, [isPlaying, updateProgress]);

  const handleKeyNavigation = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "ArrowRight" || event.code === "Space") {
        event.preventDefault();
        handleNext();
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      } else if (event.code === "KeyP") {
        handleTogglePlay();
      }
    },
    [handleNext, handlePrev, handleTogglePlay]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyNavigation);
    return () => document.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);

  useEffect(() => {
    const checkFullscreen = () => {
      const hasFullscreenElement = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      const isF11Fullscreen = window.innerHeight === window.screen.height &&
        window.innerWidth === window.screen.width;

      setIsFullscreen(hasFullscreenElement || isF11Fullscreen);
    };

    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("webkitfullscreenchange", checkFullscreen);
    document.addEventListener("mozfullscreenchange", checkFullscreen);
    document.addEventListener("MSFullscreenChange", checkFullscreen);
    window.addEventListener("resize", checkFullscreen);

    checkFullscreen();

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("webkitfullscreenchange", checkFullscreen);
      document.removeEventListener("mozfullscreenchange", checkFullscreen);
      document.removeEventListener("MSFullscreenChange", checkFullscreen);
      window.removeEventListener("resize", checkFullscreen);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed inset-0 bg-black" aria-hidden="true" />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div className="relative z-10 h-full w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex h-full w-full flex-col items-center justify-center"
            >
              {currentSlide.render()}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div className="h-full bg-[#f7ce46] transition-all" style={{ width: `${progress}%` }} />
          </div>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => {
                  setCurrentIndex(index);
                  progressRef.current = 0;
                  setProgress(0);
                }}
                className={`h-2 w-8 rounded-full transition-all ${
                  index === currentIndex ? "bg-[#f7ce46]" : "bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {!isFullscreen && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-lg backdrop-blur">
              Use arrow keys · Press P to pause · Press F11 for fullscreen
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
