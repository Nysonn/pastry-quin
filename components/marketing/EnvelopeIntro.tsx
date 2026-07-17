"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EVENT } from "@/lib/content";

const SESSION_KEY = "pq_invite_v4";

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

type Stage = "sealed" | "presenting" | "done";

// Tap the seal → the cover fades and gently pulls back first; the hero
// only starts fading in once the cover is nearly gone, so "You Are
// Cordially Invited" never overlaps the hero's own text.
const COVER_EXIT_S = 0.95;
const HERO_ENTER_DELAY_S = 0.8;
const HERO_ENTER_DURATION_S = 1.2;

// Scene 0 is the hero; the final scene (website) never auto-advances.
const LAST_SCENE = 6;
const HOLD_MS = [3400, 2600, 2400, 2400, 2600, 2600];

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
      {/* Monogram */}
      <span
        className="absolute inset-0 flex items-center justify-center font-display text-2xl text-ivory/95 sm:text-3xl"
        style={{ textShadow: "0 1px 1px rgba(0,0,0,0.5), 0 -1px 0 rgba(255,240,210,0.3)" }}
      >
        PQ
      </span>
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
            transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut", repeatDelay: 1.8 }}
          />
        </div>
      )}
    </div>
  );
}

function ScriptLine({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`font-script text-rose-gold ${className}`}>{children}</p>
  );
}

function CapsLine({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-alt tracking-[0.35em] text-charcoal/85 uppercase ${className}`}
    >
      {children}
    </p>
  );
}

export default function EnvelopeIntro() {
  const reduceMotion = useReducedMotion();
  const alreadySeen = useIntroSeen();
  const [stage, setStage] = useState<Stage>("sealed");
  const [scene, setScene] = useState(0);

  const visible = !alreadySeen && stage !== "done";

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  // Auto-advance downward through the reveals, scroll-style; the website
  // scene at the end waits for the visitor.
  useEffect(() => {
    if (stage !== "presenting" || scene >= LAST_SCENE) return;
    const t = setTimeout(() => setScene((s) => s + 1), HOLD_MS[scene]);
    return () => clearTimeout(t);
  }, [stage, scene]);

  const finish = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setStage("done");
  };

  const handleOverlayClick = () => {
    if (stage === "sealed") setStage("presenting");
    else if (stage === "presenting" && scene < LAST_SCENE) {
      setScene((s) => s + 1);
    }
  };

  const presenting = stage === "presenting";
  const coverExit = { duration: reduceMotion ? 0 : COVER_EXIT_S, ease: [0.4, 0, 0.2, 1] as const };
  const heroEnter = {
    delay: reduceMotion ? 0 : HERO_ENTER_DELAY_S,
    duration: reduceMotion ? 0 : HERO_ENTER_DURATION_S,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  // The seven reveals + the website scene, paced like the reference's
  // downward scroll: script heading above, spaced capitals beneath.
  const scenes: React.ReactNode[] = [
    // Reveal 2 — Pastry Quin Presents / THE CAKE RUNWAY (hero)
    <div key="s0" className="flex flex-col items-center">
      <CapsLine className="text-xs sm:text-sm">Pastry Quin Presents</CapsLine>
      <ScriptLine className="mt-6 text-6xl sm:text-7xl">The Cake</ScriptLine>
      <ScriptLine className="mt-2 text-6xl sm:text-7xl">Runway</ScriptLine>
    </div>,

    // Reveal 3 — Save the Date
    <div key="s1" className="flex flex-col items-center">
      <ScriptLine className="text-5xl sm:text-6xl">Save the Date</ScriptLine>
      <CapsLine className="mt-7 text-base sm:text-lg">3rd August</CapsLine>
    </div>,

    // Reveal 4 — Time
    <div key="s2" className="flex flex-col items-center">
      <ScriptLine className="text-5xl sm:text-6xl">Time</ScriptLine>
      <CapsLine className="mt-7 text-base sm:text-lg">Gates Close at 2 PM</CapsLine>
    </div>,

    // Reveal 5 — Location
    <div key="s3" className="flex flex-col items-center">
      <ScriptLine className="text-5xl sm:text-6xl">Location</ScriptLine>
      <CapsLine className="mt-7 text-base sm:text-lg">Serena Kigo</CapsLine>
    </div>,

    // Reveal 6 — Kindly RSVP
    <div key="s4" className="flex flex-col items-center">
      <ScriptLine className="text-5xl sm:text-6xl">Kindly RSVP</ScriptLine>
      <CapsLine className="mt-7 text-base sm:text-lg">By {EVENT.rsvpDeadline}</CapsLine>
    </div>,

    // Reveal 7 — Pastry Quin / contact
    <div key="s5" className="flex flex-col items-center">
      <ScriptLine className="text-5xl sm:text-6xl">Pastry Quin</ScriptLine>
      <CapsLine className="mt-7 text-base sm:text-lg">{EVENT.contactPhone}</CapsLine>
    </div>,

    // Final — website section, like the reference's closing form block
    <div key="s6" className="flex flex-col items-center">
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="shimmer-sweep mt-8 inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent bg-gold px-12 py-4 font-alt text-sm font-semibold tracking-widest text-ivory uppercase shadow-warm transition-all duration-300 hover:-translate-y-0.5 hover:bg-bronze"
      >
        {EVENT.websiteLabel}
      </button>
    </div>,
  ];

  // Scroll-style transitions: the outgoing section fully fades and glides
  // away before the next one begins entering (mode="wait" below), so
  // consecutive lines of text are never on screen — and never overlapping
  // — at the same time.
  const sectionEnter = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 80, scale: 0.97 };
  const sectionShow = {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: reduceMotion ? 0.25 : 1.2,
      ease: [0.22, 0.75, 0.3, 1] as const,
    },
  };
  const sectionExit = {
    opacity: 0,
    y: reduceMotion ? 0 : -80,
    scale: reduceMotion ? 1 : 1.03,
    transition: {
      duration: reduceMotion ? 0.2 : 1,
      ease: [0.5, 0, 0.75, 0.4] as const,
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="invite-overlay"
          className="fixed inset-0 z-50 overflow-hidden bg-charcoal"
          exit={{
            y: "-100%",
            transition: { duration: reduceMotion ? 0 : 1.15, ease: [0.65, 0, 0.35, 1] },
          }}
          onClick={handleOverlayClick}
          role="button"
          aria-label="Open the invitation"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleOverlayClick();
          }}
        >
          {/* ————— Interior — warm cream with soft tropical washes ————— */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(175deg, #fdfbf6 0%, #f6efe3 45%, #efe6d2 78%, #e9e2cd 100%)",
            }}
            initial={false}
            animate={
              stage === "sealed"
                ? { opacity: 0, filter: "blur(8px)", scale: reduceMotion ? 1 : 1.06 }
                : { opacity: 1, filter: "blur(0px)", scale: 1 }
            }
            transition={heroEnter}
          >
            <div
              className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
              style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "160px 160px" }}
            />
            {/* Soft tropical washes — sage, sand, champagne */}
            <div
              className="absolute -left-16 top-[8%] h-72 w-72 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(183,201,173,0.4), transparent 70%)" }}
            />
            <div
              className="absolute -right-20 top-[30%] h-80 w-80 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(226,168,147,0.26), transparent 70%)" }}
            />
            <div
              className="absolute -bottom-16 -left-10 h-72 w-72 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(201,161,92,0.22), transparent 70%)" }}
            />
            <div
              className="absolute -bottom-20 -right-12 h-80 w-80 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(183,201,173,0.34), transparent 70%)" }}
            />

            {/* Sections — mode="wait" so one fully fades out before the
                next fades in; their text is never simultaneously visible */}
            <AnimatePresence mode="wait">
              {presenting && (
                <motion.div
                  key={scene}
                  className="absolute inset-0 flex items-center justify-center px-8 text-center"
                  initial={sectionEnter}
                  animate={sectionShow}
                  exit={sectionExit}
                >
                  {scenes[scene]}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ————— Envelope cover — a single flat card, no fold animation;
               it simply dissolves as the interior fades in beneath it ————— */}
          <AnimatePresence>
            {stage === "sealed" && (
              <motion.div
                key="cover"
                className="absolute inset-0 z-20"
                exit={{
                  opacity: 0,
                  scale: reduceMotion ? 1 : 1.08,
                  transition: coverExit,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(165deg, #14563f 0%, #0f4d3a 48%, #093023 100%)",
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
                      background:
                        "linear-gradient(200deg, rgba(0,0,0,0.4) 0%, transparent 60%)",
                    }}
                  />
                </div>

                {/* Seal + invitation line, grouped in the upper third —
                    exactly where the reference places its wax seal */}
                <div
                  className="absolute inset-x-0 flex flex-col items-center px-6 text-center"
                  style={{ top: "22%" }}
                >
                  <GoldSeal reduceMotion={reduceMotion} />
                  <p className="mt-6 font-script text-3xl text-champagne/90 sm:text-4xl">
                    You Are
                  </p>
                  <p className="mt-1 font-script text-5xl text-champagne sm:text-6xl">
                    Cordially Invited
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
