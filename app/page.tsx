"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HomePage() {
  return (
    // Tambahkan `suppressHydrationWarning` pada elemen body atau main jika perlu
    <main
      suppressHydrationWarning
      className="relative flex min-h-dvh items-center justify-center overflow-hidden"
    >
      <div
        suppressHydrationWarning
        aria-hidden
        className="aurora pointer-events-none absolute inset-0"
      />

      <motion.section
        suppressHydrationWarning
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "glass-card z-10 mx-4 w-full max-w-xl",
          "rounded-3xl border p-8 md:p-10",
          "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.18)]"
        )}
        role="region"
        aria-label="Waskita by Stophiva welcome panel"
      >
        <motion.div
          suppressHydrationWarning
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={fadeUp} suppressHydrationWarning>
            <Image
              suppressHydrationWarning
              src="/logo-waskitabystophiva.png"
              alt="Logo Waskita by Stophiva"
              width={440}
              height={80}
              priority
              className="h-auto w-[260px] md:w-[320px]"
            />
          </motion.div>

          <motion.p
            variants={fadeUp}
            suppressHydrationWarning
            className="mt-3 max-w-prose text-pretty font-sans text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Selamat datang di Wadah Sinau Kita.
          </motion.p>

          <motion.div
            suppressHydrationWarning
            variants={fadeUp}
            className="mt-8"
          >
            <Link
              href="/login"
              className="btn-gradient inline-flex h-12 items-center justify-center rounded-full px-8 font-medium text-primary-foreground shadow-md transition-transform duration-300 ease-out hover:scale-105 focus-visible:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              Masuk
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}
