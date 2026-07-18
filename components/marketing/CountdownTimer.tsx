"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function subscribeToClock(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

// Server snapshot is null so SSR/hydration render a stable placeholder,
// then the store re-reads the real time on the client.
function useNow(): number | null {
  return useSyncExternalStore(
    subscribeToClock,
    () => Math.floor(Date.now() / 1000) * 1000,
    () => null
  );
}

function RollingNumber({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const display = String(value).padStart(2, "0");
  return (
    <span className="relative block h-[1.2em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={display}
          className="block"
          initial={reduceMotion ? false : { y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? undefined : { y: "100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function CountdownTimer({
  targetIso,
  variant = "light",
}: {
  targetIso: string;
  variant?: "light" | "dark";
}) {
  const target = new Date(targetIso).getTime();
  const now = useNow();
  const numberColor = variant === "dark" ? "text-ivory" : "text-charcoal";
  const labelColor = variant === "dark" ? "text-champagne" : "text-bronze";

  if (now !== null && target - now <= 0) {
    return (
      <p className={`text-center font-serif-alt text-2xl italic ${labelColor}`}>
        The runway moment has arrived.
      </p>
    );
  }

  const delta = now === null ? 0 : target - now;
  const units = [
    { label: "Days", value: Math.floor(delta / 86_400_000) },
    { label: "Hours", value: Math.floor((delta / 3_600_000) % 24) },
    { label: "Minutes", value: Math.floor((delta / 60_000) % 60) },
    { label: "Seconds", value: Math.floor((delta / 1_000) % 60) },
  ];

  return (
    <div className="flex items-start justify-center gap-4 sm:gap-8">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-start gap-4 sm:gap-8">
          {i > 0 && (
            <span className="pt-2 font-display text-3xl text-gold/60 sm:text-5xl">
              ·
            </span>
          )}
          <div className="text-center">
            <div className={`font-display text-4xl tabular-nums sm:text-6xl ${numberColor}`}>
              <RollingNumber value={unit.value} />
            </div>
            <p className={`mt-2 font-alt text-[0.65rem] tracking-[0.3em] uppercase sm:text-xs ${labelColor}`}>
              {unit.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
