// components/auth/slideshow.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ImageOff,
  Calendar,
  User,
  Tag,
} from "lucide-react";

type Slide = {
  src: string;
  alt: string;
  title?: string;
  category?: string;
  date?: string;
  author?: string;
  tags?: string[];
  source?: string;
  description?: string;
};

type SlideshowProps = {
  slides: Slide[];
  intervalMs?: number;
  className?: string;
  autoPlay?: boolean;
};

// Helper function to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export function Slideshow({
  slides,
  intervalMs = 7000,
  className,
  autoPlay = true,
}: SlideshowProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(!autoPlay);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [isImageError, setIsImageError] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

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
    setIsImageError(false);
  }, [slides.length]);

  const goToPrevious = React.useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    setProgress(0);
    setIsImageLoading(true);
    setIsImageError(false);
  }, [slides.length]);

  const togglePause = React.useCallback(() => {
    setPaused((p) => !p);
  }, []);

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
  }, [goToNext, goToPrevious, togglePause]);

  const goToSlide = React.useCallback((i: number) => {
    setIndex(i);
    setProgress(0);
    setIsImageLoading(true);
    setIsImageError(false);
  }, []);

  const handleDragEnd = React.useCallback(
    (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: { offset: { x: number } }
    ) => {
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

  const currentSlide = slides[index];

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
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
          <motion.div
            className="h-full bg-white shadow-lg shadow-white/50"
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
          {/* Red overlay gradient - Enhanced */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-red-950/95 via-red-900/50 to-transparent" />

          <Image
            src={currentSlide?.src || "/placeholder.jpg"}
            alt={currentSlide?.alt || "Slide galeri"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
            className={cn(
              "object-cover transition-opacity duration-300",
              isImageLoading || isImageError ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => {
              setIsImageLoading(false);
              setIsImageError(false);
            }}
            onError={() => {
              setIsImageLoading(false);
              setIsImageError(true);
            }}
          />

          {/* Loading skeleton */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-red-900/50 animate-pulse" />
          )}
          {!isImageLoading && isImageError && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-red-900/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              aria-label="Gambar tidak dapat dimuat"
            >
              <div className="text-center text-white/70">
                <ImageOff className="w-12 h-12 mx-auto" />
                <p className="mt-2 text-sm font-medium">
                  Gambar tidak tersedia
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Content Section */}
      <div className="absolute inset-x-0 bottom-0 z-20 pb-12 md:pb-16">
        <div className="px-6 md:px-10 lg:px-14 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${index}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="space-y-3 md:space-y-4"
            >
              {/* Category Badge & Meta Info */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {currentSlide?.category && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs md:text-sm font-semibold shadow-lg"
                  >
                    <Tag className="w-3 h-3" />
                    {currentSlide.category}
                  </motion.span>
                )}

                {currentSlide?.date && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="inline-flex items-center gap-1.5 text-white/90 text-xs md:text-sm font-medium"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(currentSlide.date)}
                  </motion.span>
                )}
              </div>

              {/* Title */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="font-bold tracking-tight text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white text-balance drop-shadow-2xl leading-tight"
              >
                {currentSlide?.title}
              </motion.h2>

              {/* Description */}
              {currentSlide?.description && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm md:text-base text-white/85 text-balance drop-shadow-md max-w-2xl leading-relaxed"
                >
                  {currentSlide.description}
                </motion.p>
              )}

              {/* Author & Source */}
              {(currentSlide?.author || currentSlide?.source) && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center gap-3 pt-1"
                >
                  {currentSlide?.author && (
                    <span className="inline-flex items-center gap-1.5 text-white/80 text-xs md:text-sm font-medium">
                      <User className="w-3.5 h-3.5" />
                      {currentSlide.author}
                    </span>
                  )}
                  {currentSlide?.source && (
                    <span className="text-white/70 text-xs md:text-sm">
                      • {currentSlide.source}
                    </span>
                  )}
                </motion.div>
              )}

              {/* Tags */}
              {currentSlide?.tags && currentSlide.tags.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {currentSlide.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows - Enhanced */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-20 pointer-events-none">
        <motion.button
          onClick={goToPrevious}
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto p-2 md:p-1 md:py-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-30 shadow-xl"
          aria-label="Slide sebelumnya"
          disabled={slides.length <= 1}
        >
          <ChevronLeft className="w-2 h-2 md:w-3 md:h-5 text-white drop-shadow-lg" />
        </motion.button>
        <motion.button
          onClick={goToNext}
          whileHover={{ scale: 1.1, x: 4 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto p-2 md:p-1 md:py-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-30 shadow-xl"
          aria-label="Slide berikutnya"
          disabled={slides.length <= 1}
        >
          <ChevronRight className="w-2 h-2 md:w-3 md:h-5 text-white drop-shadow-lg" />
        </motion.button>
      </div>

      {/* Play/Pause button - Enhanced */}
      {autoPlay && (
        <motion.button
          onClick={togglePause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-xl"
          aria-label={paused ? "Putar slideshow" : "Jeda slideshow"}
        >
          {paused ? (
            <Play className="w-4 h-4 text-white drop-shadow-lg" fill="white" />
          ) : (
            <Pause className="w-4 h-4 text-white drop-shadow-lg" />
          )}
        </motion.button>
      )}

      {/* Dots navigation - Enhanced */}
      <div className="absolute bottom-4 md:bottom-5 left-0 right-0 flex items-center justify-center gap-2 z-20">
        {slides.map((_, i) => {
          const active = i === index;
          return (
            <motion.button
              key={i}
              whileHover={{ scale: active ? 1 : 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-red-900",
                active
                  ? "h-2.5 w-10 bg-white shadow-lg shadow-white/30"
                  : "h-2.5 w-2.5 bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Ke slide ${i + 1}`}
              aria-current={active}
              onClick={() => goToSlide(i)}
            />
          );
        })}
      </div>

      {/* Slide counter - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-30 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/95 text-xs md:text-sm font-semibold shadow-xl"
      >
        {index + 1} / {slides.length}
      </motion.div>
    </div>
  );
}
