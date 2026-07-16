"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ScrollCue() {
  const reduceMotion = useReducedMotion();

  return (
    <a
      href="#about"
      aria-label="Scroll to the showcase"
      className="group flex flex-col items-center gap-3"
    >
      <span className="font-alt text-[0.6rem] tracking-[0.4em] text-champagne/70 uppercase transition-colors group-hover:text-champagne">
        Scroll
      </span>
      <span className="relative h-12 w-px overflow-hidden bg-champagne/25">
        <motion.span
          className="absolute inset-x-0 top-0 h-5 bg-gold"
          animate={reduceMotion ? {} : { y: [-20, 48] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
      </span>
    </a>
  );
}
