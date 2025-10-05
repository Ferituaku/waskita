"use client";

import { motion } from "framer-motion";
import type React from "react";

type AuroraBackgroundProps = {
  className?: string;
};

export default function AuroraBackground({
  className = "",
}: AuroraBackgroundProps) {
  return (
    <div
      aria-hidden
      className={`fixed inset-0 -z-10 overflow-hidden ${className}`}
      // Define brand palette locally via CSS variables to keep styles cohesive and easy to tweak
      style={
        {
          // Warm, inviting palette
          // Cream base
          ["--brand-cream" as any]: "#FFF5E1",
          // Soft red
          ["--brand-accent" as any]: "#E85D5A",
          // Warm orange
          ["--brand-primary" as any]: "#FF7A3D",
          // Deep neutral for subtle depth if needed
          ["--brand-deep" as any]: "#1E1B16",
        } as React.CSSProperties
      }
    >
      {/* Soft cream backdrop tint */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--brand-cream)" }}
      />

      {/* Aurora blobs - large, blurred, low-opacity, gently drifting in loops */}
      <motion.span
        className="absolute -left-20 -top-24 h-[42rem] w-[42rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--brand-accent), transparent 65%)",
          opacity: 0.22,
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -25, 25, 0],
          scale: [1, 1.03, 0.97, 1],
        }}
        transition={{
          duration: 48,
          ease: [0.16, 1, 0.3, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
        }}
      />
      <motion.span
        className="absolute -right-16 top-1/4 h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--brand-primary), transparent 60%)",
          opacity: 0.2,
        }}
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 20, -20, 0],
          scale: [1, 1.02, 0.98, 1],
        }}
        transition={{
          duration: 56,
          ease: [0.16, 1, 0.3, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
        }}
      />
      <motion.span
        className="absolute left-1/3 -bottom-24 h-[40rem] w-[40rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--brand-accent) 55%, var(--brand-primary)), transparent 65%)",
          opacity: 0.18,
        }}
        animate={{
          x: [0, 20, -35, 0],
          y: [0, -15, 25, 0],
          scale: [1, 1.04, 0.96, 1],
        }}
        transition={{
          duration: 60,
          ease: [0.16, 1, 0.3, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
        }}
      />
    </div>
  );
}
