"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

// Full-bleed looping video that drifts slower than the scroll for depth,
// mirroring ParallaxImage's treatment.
export default function ParallaxVideo({
  src,
  className = "",
  overlayClassName,
}: {
  src: string;
  className?: string;
  overlayClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute -inset-y-[10%] inset-x-0"
        style={reduceMotion ? undefined : { y }}
      >
        <video
          className="h-full w-full object-cover"
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </motion.div>
      {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`} />}
    </div>
  );
}
