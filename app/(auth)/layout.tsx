"use client";

import React from "react";
import { Slideshow } from "@/components/auth/slideshow";
import { slides } from "@/components/auth/slides";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.main
      className="min-h-screen grid grid-cols-1 md:grid-cols-2 h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* <div className="min-h-screen bg-red-800">
       
        <div className="grid grid-cols-1 md:grid-cols-2 h-screen"> */}
      {/* Left Column: Image */}
      <div className="relative hidden md:block">
        <div className="absolute inset-0 bg-white bg-opacity-30" />
        <Slideshow slides={slides} className="h-full w-full " />
      </div>
      {/* Right Column: Form */}
      <div className="relative isolate flex items-center justify-center">
        <div
          className={cn(
            "absolute inset-y-0 left-0 right-0 md:right-auto md:w-[calc(100%)]",
            "bg-white md:bg-white p-10 shadow-lg"
          )}
          aria-hidden
        />
        <div className="relative z-10 w-full max-w-md px-5 py-10 md:py-0 md:px-10">
          {/* Mobile logo at top */}
          {children}
        </div>
      </div>
    </motion.main>
  );
}
