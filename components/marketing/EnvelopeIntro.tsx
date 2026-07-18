"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "pq_invite_v6";

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

// Sage-green botanical toile — chrysanthemum blooms trailing into vines —
// covering the whole cream cover, matching the reference invitation card.
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
        <pattern id="toile" width="110" height="110" patternUnits="userSpaceOnUse">
          <g stroke="#6f8354" strokeWidth="1.3" opacity="0.55" fill="none" strokeLinecap="round">
            {/* Central chrysanthemum bloom */}
            <circle cx="55" cy="55" r="16" />
            <circle cx="55" cy="55" r="8" />
            <path d="M55 39 C 62 45, 62 55, 55 56 C 48 55, 48 45, 55 39 Z" />
            <path d="M71 55 C 65 62, 55 62, 55 55 C 55 48, 65 48, 71 55 Z" />
            <path d="M55 71 C 48 65, 48 55, 55 55 C 62 55, 62 65, 55 71 Z" />
            <path d="M39 55 C 45 48, 55 48, 55 55 C 55 62, 45 62, 39 55 Z" />
            <path d="M43 43 C 49 46, 51 52, 47 55 C 43 52, 41 46, 43 43 Z" />
            <path d="M67 43 C 61 46, 59 52, 63 55 C 67 52, 69 46, 67 43 Z" />
            <path d="M67 67 C 61 64, 59 58, 63 55 C 67 58, 69 64, 67 67 Z" />
            <path d="M43 67 C 49 64, 51 58, 47 55 C 43 58, 41 64, 43 67 Z" />
            {/* Trailing vines and leaves toward the tile edges */}
            <path d="M55 39 C 40 25, 20 20, 5 28" />
            <path d="M20 30 C 15 22, 18 14, 26 10" />
            <path d="M71 55 C 88 46, 100 46, 108 38" />
            <path d="M95 40 C 100 32, 100 24, 94 18" />
            <path d="M55 71 C 46 88, 46 100, 38 108" />
            <path d="M40 95 C 32 100, 24 100, 18 94" />
            <path d="M39 55 C 22 64, 10 64, 2 72" />
            <path d="M10 95 C 5 88, 5 80, 10 74" />
            {/* Small accent bud at the tile corner */}
            <circle cx="0" cy="0" r="4" />
            <path d="M0 0 C -6 -4, -10 -10, -8 -18" />
          </g>
        </pattern>
      </defs>
      <rect width="400" height="700" fill="url(#toile)" />
    </svg>
  );
}

// Terracotta wax seal — organic poured edge, engraved ring, static and
// moving glints, matching the reference's single-monogram seal.
function WaxSeal({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="relative h-28 w-28 sm:h-32 sm:w-32">
      {/* Contact shadow on the paper */}
      <div className="absolute inset-0 translate-y-2 rounded-full bg-black/25 blur-md" />

      {/* Wax body — organic poured edge */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: "48% 52% 46% 54% / 52% 46% 55% 48%",
          background:
            "radial-gradient(circle at 34% 28%, #f0a273 0%, #e2794a 18%, #c85830 46%, #9c3f22 82%, #6e2c16 100%)",
          boxShadow:
            "inset 0 3px 5px rgba(255,220,190,0.55), inset 0 -5px 8px rgba(0,0,0,0.4), 0 6px 14px rgba(0,0,0,0.35)",
        }}
      />
      {/* Engraved ring */}
      <div
        className="absolute inset-[6px]"
        style={{
          borderRadius: "48% 52% 46% 54% / 52% 46% 55% 48%",
          border: "1px solid rgba(255,235,215,0.35)",
        }}
      />
      {/* Stamped coin edge */}
      <div
        className="absolute inset-[11px] rounded-full opacity-70"
        style={{ border: "1.5px dotted rgba(255,235,215,0.45)" }}
      />
      {/* Monogram */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ textShadow: "0 1px 1px rgba(0,0,0,0.45), 0 -1px 0 rgba(255,235,215,0.25)" }}
      >
        <span className="font-script text-3xl text-ivory/95 sm:text-4xl">PQ</span>
      </div>
      {/* Static glint */}
      <div
        className="pointer-events-none absolute h-5 w-3 rounded-full opacity-70"
        style={{
          top: "20%",
          left: "30%",
          background: "radial-gradient(ellipse, rgba(255,240,225,0.9), transparent 70%)",
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
                "linear-gradient(100deg, transparent, rgba(255,240,225,0.75), transparent)",
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
              background:
                "linear-gradient(175deg, #f7f2e2 0%, #f1ead4 45%, #ece2c5 78%, #e7dcbc 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
              style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "160px 160px" }}
            />
            <CoverTexture className="absolute inset-0 h-full w-full" />
          </div>

          {/* Seal + invitation text, positioned like the reference card. */}
          <div
            className="absolute inset-x-0 flex flex-col items-center px-6 text-center"
            style={{ top: "34%" }}
          >
            <WaxSeal reduceMotion={reduceMotion} />
            <p className="mt-8 font-script text-3xl leading-tight text-charcoal sm:text-4xl">
              You Are
            </p>
            <p className="font-script text-4xl leading-tight text-charcoal sm:text-5xl">
              Cordially Invited
            </p>
            <p className="mt-6 font-alt text-[0.65rem] tracking-[0.35em] text-bronze/80 uppercase sm:text-xs">
              Tap To Open
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
