"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type Slide = {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
};

type SlideshowProps = {
  slides: Slide[];
  intervalMs?: number;
  className?: string;
  autoPlay?: boolean;
};

export function Slideshow({
  slides,
  intervalMs = 5000,
  className,
  autoPlay = true,
}: SlideshowProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(!autoPlay);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const dragX = useMotionValue(0);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === " ") {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, paused]);

  // Auto-pause when tab is not visible
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPaused(true);
      } else if (autoPlay) {
        setPaused(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [autoPlay]);

  // Slideshow interval with progress
  React.useEffect(() => {
    if (paused || !autoPlay) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    let animationFrame: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / intervalMs) * 100, 100);
      setProgress(newProgress);

      if (elapsed < intervalMs) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
      setProgress(0);
      setIsImageLoading(true);
    }, intervalMs);

    return () => {
      clearInterval(id);
      cancelAnimationFrame(animationFrame);
    };
  }, [intervalMs, slides.length, paused, autoPlay]);

  const goToNext = React.useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
    setProgress(0);
    setIsImageLoading(true);
  }, [slides.length]);

  const goToPrevious = React.useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    setProgress(0);
    setIsImageLoading(true);
  }, [slides.length]);

  const goToSlide = React.useCallback((i: number) => {
    setIndex(i);
    setProgress(0);
    setIsImageLoading(true);
  }, []);

  const togglePause = React.useCallback(() => {
    setPaused((p) => !p);
  }, []);

  const handleDragEnd = React.useCallback(
    (_: any, info: { offset: { x: number } }) => {
      const threshold = 50;
      if (info.offset.x > threshold) {
        goToPrevious();
      } else if (info.offset.x < -threshold) {
        goToNext();
      }
    },
    [goToNext, goToPrevious]
  );

  if (!slides.length) return null;

  return (
    <div
      className={cn(
        "group relative h-full w-full overflow-hidden bg-gradient-to-br from-red-900 to-red-950",
        "rounded-none md:rounded-r-[3rem]",
        className
      )}
      onMouseEnter={() => autoPlay && setPaused(true)}
      onMouseLeave={() => autoPlay && setPaused(false)}
      aria-label="Slideshow galeri WASKITA"
      role="region"
      aria-roledescription="carousel"
    >
      {/* Progress bar */}
      {autoPlay && !paused && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20">
          <motion.div
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}

      {/* Image with drag gesture */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.7,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          {/* Red overlay gradient */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-red-950/90 via-red-900/40 to-red-800/10" />

          <Image
            src={slides[index]?.src || "/placeholder.jpg"}
            alt={slides[index]?.alt || "Slide galeri"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
            quality={90}
            className={cn(
              "object-cover transition-opacity duration-300",
              isImageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoadingComplete={() => setIsImageLoading(false)}
          />

          {/* Loading skeleton */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-red-900/50 animate-pulse" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Hero text */}
      <div className="absolute inset-x-0 bottom-0 z-10 pb-16 md:pb-20">
        <div className="px-6 md:px-10 lg:px-14 text-white max-w-[42rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${index}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* <h1 className="font-bold tracking-tight text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-balance drop-shadow-2xl">
                WASKITA
              </h1>
              <p className="mt-1 md:mt-2 text-white/95 text-lg md:text-lg lg:text-xl xl:text-xl font-medium text-balance drop-shadow-2xl">
                Wadah Sinau Kita
              </p> */}
              {slides[index]?.title && (
                <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-white/90 text-balance drop-shadow-lg max-w-xl leading-relaxed">
                  {slides[index].title}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-10 pointer-events-none">
        <button
          onClick={goToPrevious}
          className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
          aria-label="Slide sebelumnya"
          disabled={slides.length <= 1}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
        <button
          onClick={goToNext}
          className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
          aria-label="Slide berikutnya"
          disabled={slides.length <= 1}
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      {/* Play/Pause button */}
      {autoPlay && (
        <button
          onClick={togglePause}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label={paused ? "Putar slideshow" : "Jeda slideshow"}
        >
          {paused ? (
            <Play className="w-4 h-4 text-white" />
          ) : (
            <Pause className="w-4 h-4 text-white" />
          )}
        </button>
      )}

      {/* Dots navigation */}
      <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex items-center justify-center gap-2 z-10">
        {slides.map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              className={cn(
                "rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-red-900",
                active
                  ? "h-2.5 w-8 bg-white shadow-lg"
                  : "h-2.5 w-2.5 bg-white/50 hover:bg-white/80 hover:scale-110"
              )}
              aria-label={`Ke slide ${i + 1}`}
              aria-current={active}
              onClick={() => goToSlide(i)}
            />
          );
        })}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white/90 text-xs md:text-sm font-medium">
        {index + 1} / {slides.length}
      </div>
    </div>
  );
}
