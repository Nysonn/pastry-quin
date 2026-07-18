"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "pq_invite_v5";

const emptySubscribe = () => () => {};

// Server snapshot pretends the intro was seen so SSR renders nothing;
// the client snapshot re-reads sessionStorage after hydration.
function useIntroSeen() {
  return useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem(SESSION_KEY) !== null,
    () => true
  );
}

// Subtle noise so the paper never reads as a flat digital gradient.
const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

// Dense tone-on-tone floral engraving covering the whole cover, matching
// the reference's all-over paper texture.
function CoverTexture({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 700"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
      className={className}
    >
      <defs>
        <pattern id="bloom" width="70" height="70" patternUnits="userSpaceOnUse">
          <g stroke="#dff0d8" strokeWidth="0.9" opacity="0.16">
            <circle cx="35" cy="35" r="11" />
            <circle cx="35" cy="35" r="5" />
            <path d="M35 24 C 40 28, 40 34, 35 35 C 30 34, 30 28, 35 24 Z" />
            <path d="M46 35 C 42 40, 36 40, 35 35 C 36 30, 42 30, 46 35 Z" />
            <path d="M35 46 C 30 42, 30 36, 35 35 C 40 36, 40 42, 35 46 Z" />
            <path d="M24 35 C 28 30, 34 30, 35 35 C 34 40, 28 40, 24 35 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="400" height="700" fill="url(#bloom)" />
    </svg>
  );
}

// Gold wax seal — organic poured edge, engraved ring, static and moving
// glints, no cracking (the reference seal never splits, it just fades).
function GoldSeal({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="relative h-32 w-32 sm:h-36 sm:w-36">
      {/* Contact shadow on the paper */}
      <div className="absolute inset-0 translate-y-2 rounded-full bg-black/40 blur-md" />

      {/* Wax body — organic poured edge */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: "48% 52% 46% 54% / 52% 46% 55% 48%",
          background:
            "radial-gradient(circle at 34% 28%, #fff6de 0%, #f5e2ae 18%, #c9a15c 46%, #8a6633 82%, #5f4320 100%)",
          boxShadow:
            "inset 0 3px 5px rgba(255,247,224,0.7), inset 0 -5px 8px rgba(0,0,0,0.45), 0 6px 14px rgba(0,0,0,0.45)",
        }}
      />
      {/* Engraved ring */}
      <div
        className="absolute inset-[6px]"
        style={{
          borderRadius: "48% 52% 46% 54% / 52% 46% 55% 48%",
          border: "1px solid rgba(255,247,224,0.4)",
        }}
      />
      {/* Stamped coin edge */}
      <div
        className="absolute inset-[11px] rounded-full opacity-70"
        style={{ border: "1.5px dotted rgba(255,247,224,0.5)" }}
      />
      {/* Monogram + presenter line */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-0.5"
        style={{ textShadow: "0 1px 1px rgba(0,0,0,0.5), 0 -1px 0 rgba(255,240,210,0.3)" }}
      >
        <span className="font-display text-xl text-ivory/95 sm:text-2xl">PQ</span>
        <span className="font-alt text-[0.4rem] leading-tight tracking-[0.14em] text-ivory/85 uppercase sm:text-[0.45rem]">
          Pastry Quin
        </span>
        <span className="font-alt text-[0.4rem] leading-tight tracking-[0.14em] text-ivory/85 uppercase sm:text-[0.45rem]">
          Presents
        </span>
      </div>
      {/* Static glint */}
      <div
        className="pointer-events-none absolute h-5 w-3 rounded-full opacity-70"
        style={{
          top: "20%",
          left: "30%",
          background: "radial-gradient(ellipse, rgba(255,252,240,0.9), transparent 70%)",
          transform: "rotate(-18deg)",
          filter: "blur(0.5px)",
        }}
      />
      {/* Moving specular sweep */}
      {!reduceMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <motion.div
            className="absolute -inset-y-2 w-8"
            style={{
              background:
                "linear-gradient(100deg, transparent, rgba(255,252,240,0.8), transparent)",
              filter: "blur(2px)",
            }}
            initial={{ x: "-140%" }}
            animate={{ x: "220%" }}
            transition={{ repeat: Infinity, duration: 4.6, ease: "easeInOut", repeatDelay: 2.2 }}
          />
        </div>
      )}
    </div>
  );
}

// Tap the seal → the whole envelope lifts away in one motion, revealing
// the site directly underneath. No intermediate scenes.
export default function EnvelopeIntro() {
  const reduceMotion = useReducedMotion();
  const alreadySeen = useIntroSeen();
  const [open, setOpen] = useState(false);

  const visible = !alreadySeen && !open;

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const openEnvelope = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="invite-overlay"
          className="fixed inset-0 z-50 overflow-hidden"
          exit={{
            y: "-100%",
            transition: { duration: reduceMotion ? 0 : 1.4, ease: [0.65, 0, 0.35, 1] },
          }}
          onClick={openEnvelope}
          role="button"
          aria-label="Open the invitation"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openEnvelope();
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(165deg, #14563f 0%, #0f4d3a 48%, #093023 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.32] mix-blend-overlay"
              style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "160px 160px" }}
            />
            <CoverTexture className="absolute inset-0 h-full w-full" />
            {/* Soft shadow in the upper corner, like the reference's cover */}
            <div
              className="absolute inset-x-0 top-0 h-1/3 opacity-40"
              style={{
                background: "linear-gradient(200deg, rgba(0,0,0,0.4) 0%, transparent 60%)",
              }}
            />
          </div>

          {/* Seal, positioned in the upper third — exactly where the
              reference places its wax seal. */}
          <div
            className="absolute inset-x-0 flex flex-col items-center px-6 text-center"
            style={{ top: "26%" }}
          >
            <GoldSeal reduceMotion={reduceMotion} />
            <p className="mt-8 font-alt text-[0.65rem] tracking-[0.35em] text-champagne/70 uppercase sm:text-xs">
              Tap the seal to open
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
