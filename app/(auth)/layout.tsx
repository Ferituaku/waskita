"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.main className="min-h-screen bg-red-800">
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        {/* Left Column: Image */}
        <div className="relative hidden md:block">
          <Image
            src="/hiv-awareness.png"
            alt="Gedung perkotaan modern"
            fill
            style={{ objectFit: "cover" }}
            quality={85}
            priority
          />
          <div className="absolute inset-0 bg-red-800 bg-opacity-40" />
          <div className="absolute top-10 left-15">
            <h1 className="text-4xl font-bold text-white tracking-wider">
              WASKITA wap wap
            </h1>
            <p className="text-white text-lg mt-2">
              Wadah Sinau Kita. wap wap
            </p>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="ml-20 bg-white flex items-center justify-center p-10 md:p-9 lg:p-9 sm:p-12 rounded-tl-[5rem] md:rounded-tl-[10rem] lg:rounded-tl-[10rem]">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </motion.main>
  );
}
