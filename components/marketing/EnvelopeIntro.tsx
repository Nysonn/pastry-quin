"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EVENT } from "@/lib/content";

const SESSION_KEY = "pq_invite_v3";

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

type Stage = "sealed" | "opening" | "presenting" | "done";

// Choreography lifted from the reference: tap → flap peels toward the
// viewer (~1.35s), its dark underside sweeps the screen, and the interior
// fades in from a soft blur (~1.9s tap-to-hero).
const FLAP_MS = 1350;
const PRESENT_MS = 1950;

// Scene 0 is the hero; the final scene (website) never auto-advances.
const LAST_SCENE = 6;
const HOLD_MS = [3400, 2600, 2400, 2400, 2600, 2600];

// Where the flap's point sits, as a fraction of cover height.
const FLAP_TIP = 42;

// Subtle noise so the paper never reads as a flat digital gradient.
const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

// Tone-on-tone botanical crackle for the cover — the reference envelope
// carries an all-over subtle leafy paper texture.
function CoverTexture({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 700"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
      className={className}
    >
      <g stroke="#dff0d8" strokeWidth="1" strokeLinecap="round" opacity="0.1">
        <path d="M20 30 C 70 80, 50 150, 110 190 C 160 222, 150 290, 200 330" />
        <path d="M380 50 C 340 110, 360 170, 310 210 C 270 242, 280 300, 230 340" />
        <path d="M40 660 C 80 620, 70 570, 120 540 C 165 514, 155 460, 200 430" />
        <path d="M360 680 C 320 640, 335 580, 285 545 C 245 517, 255 465, 215 435" />
        <path d="M0 200 C 40 230, 60 280, 40 330" />
        <path d="M400 260 C 360 290, 340 340, 360 390" />
        <path d="M60 100 C 90 120, 100 150, 90 185" />
        <path d="M330 130 C 305 155, 300 190, 315 220" />
        <path d="M100 560 C 130 545, 160 550, 180 575" />
        <path d="M300 600 C 275 585, 245 588, 225 610" />
      </g>
      <g fill="#dff0d8" opacity="0.07">
        <path d="M55 55 C 25 80, 28 130, 55 160 C 85 130, 82 80, 55 55 z" />
        <path d="M350 80 C 380 105, 378 150, 350 180 C 322 150, 324 105, 350 80 z" />
        <path d="M60 560 C 30 585, 32 625, 60 650 C 88 625, 88 585, 60 560 z" />
        <path d="M340 590 C 370 615, 368 652, 340 678 C 312 652, 314 615, 340 590 z" />
      </g>
    </svg>
  );
}

// Single gold wax seal — stays whole and rides the flap as it opens,
// exactly as in the reference (no cracking).
function GoldSeal({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="relative h-[5.5rem] w-[5.5rem] sm:h-24 sm:w-24">
      {/* Contact shadow on the paper */}
      <div className="absolute inset-0 translate-y-1.5 rounded-full bg-black/40 blur-md" />

      {/* Wax body — organic poured edge */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: "48% 52% 46% 54% / 52% 46% 55% 48%",
          background:
            "radial-gradient(circle at 34% 28%, #fff6de 0%, #f5e2ae 18%, #c9a15c 46%, #8a6633 82%, #5f4320 100%)",
          boxShadow:
            "inset 0 2px 4px rgba(255,247,224,0.7), inset 0 -4px 6px rgba(0,0,0,0.45), 0 4px 10px rgba(0,0,0,0.45)",
        }}
      />
      {/* Engraved ring */}
      <div
        className="absolute inset-[4px]"
        style={{
          borderRadius: "48% 52% 46% 54% / 52% 46% 55% 48%",
          border: "1px solid rgba(255,247,224,0.4)",
        }}
      />
      {/* Stamped coin edge */}
      <div
        className="absolute inset-[8px] rounded-full opacity-70"
        style={{ border: "1.5px dotted rgba(255,247,224,0.5)" }}
      />
      {/* Monogram */}
      <span
        className="absolute inset-0 flex items-center justify-center font-display text-xl text-ivory/95 sm:text-2xl"
        style={{ textShadow: "0 1px 1px rgba(0,0,0,0.5), 0 -1px 0 rgba(255,240,210,0.3)" }}
      >
        PQ
      </span>
      {/* Static glint */}
      <div
        className="pointer-events-none absolute h-4 w-2.5 rounded-full opacity-70"
        style={{
          top: "20%",
          left: "30%",
          background: "radial-gradient(ellipse, rgba(255,252,240,0.9), transparent 70%)",
          transform: "rotate(-18deg)",
          filter: "blur(0.4px)",
        }}
      />
      {/* Moving specular sweep */}
      {!reduceMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <motion.div
            className="absolute -inset-y-2 w-6"
            style={{
              background:
                "linear-gradient(100deg, transparent, rgba(255,252,240,0.8), transparent)",
              filter: "blur(1.5px)",
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

  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const pending = timeouts.current;
    return () => pending.forEach(clearTimeout);
  }, []);
  const later = (fn: () => void, ms: number) => {
    timeouts.current.push(setTimeout(fn, ms));
  };

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

  const open = () => {
    if (reduceMotion) {
      setStage("presenting");
      return;
    }
    setStage("opening");
    later(() => setStage("presenting"), PRESENT_MS);
  };

  const handleOverlayClick = () => {
    if (stage === "sealed") open();
    else if (stage === "presenting" && scene < LAST_SCENE) {
      setScene((s) => s + 1);
    }
  };

  const opening = stage === "opening";
  const presenting = stage === "presenting";

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

  // Scroll-style transitions: the outgoing section slides up and away as
  // the next slides in from below, exactly like the reference's scroll.
  const sectionEnter = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 56 };
  const sectionShow = {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduceMotion ? 0.25 : 0.65,
      ease: [0.25, 0.8, 0.35, 1] as const,
    },
  };
  const sectionExit = {
    opacity: 0,
    y: reduceMotion ? 0 : -56,
    transition: {
      duration: reduceMotion ? 0.2 : 0.55,
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
            transition: { duration: reduceMotion ? 0 : 0.8, ease: [0.65, 0, 0.35, 1] },
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
                ? { opacity: 0, filter: "blur(10px)" }
                : opening
                  ? { opacity: 1, filter: "blur(10px)" }
                  : { opacity: 1, filter: "blur(0px)" }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : opening
                  ? { opacity: { delay: 0.8, duration: 0.6 } }
                  : { filter: { duration: 0.9, ease: "easeOut" }, opacity: { duration: 0.3 } }
            }
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

            {/* Sections — absolutely stacked so exits and entries overlap */}
            <AnimatePresence>
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

          {/* ————— Envelope cover ————— */}
          <AnimatePresence>
            {(stage === "sealed" || opening) && (
              <motion.div
                key="cover"
                className="absolute inset-0 z-20"
                style={{ perspective: 900 }}
                animate={
                  opening && !reduceMotion
                    ? { opacity: 0, scale: 1.06 }
                    : { opacity: 1, scale: 1 }
                }
                transition={
                  opening
                    ? {
                        opacity: { delay: 1.15, duration: 0.7, ease: "easeIn" },
                        scale: { duration: PRESENT_MS / 1000, ease: "easeIn" },
                      }
                    : undefined
                }
                exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.2 } }}
              >
                {/* Envelope body */}
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
                  {/* Side/bottom fold creases, hinted like the reference */}
                  <div
                    className="absolute inset-0 opacity-45"
                    style={{
                      background:
                        "linear-gradient(to top left, transparent 49.55%, rgba(0,0,0,0.3) 50%, transparent 50.45%) bottom left / 50% 45% no-repeat, linear-gradient(to top right, transparent 49.55%, rgba(0,0,0,0.3) 50%, transparent 50.45%) bottom right / 50% 45% no-repeat",
                    }}
                  />

                  {/* Reveal 1 — script on the cover, like the reference */}
                  <div
                    className="absolute inset-x-0 text-center"
                    style={{ top: "56%" }}
                  >
                    <p className="font-script text-3xl text-champagne/90 sm:text-4xl">
                      You Are
                    </p>
                    <p className="mt-1 font-script text-5xl text-champagne sm:text-6xl">
                      Cordially Invited
                    </p>
                  </div>
                </div>

                {/* Soft shadow the flap casts on the body */}
                <div
                  className="absolute inset-x-0 top-0"
                  style={{
                    height: `${FLAP_TIP + 4}%`,
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background: "rgba(0,0,0,0.25)",
                    filter: "blur(6px)",
                    transform: "translateY(6px)",
                  }}
                />

                {/* Top flap — hinges at the top edge, peels toward the viewer */}
                <motion.div
                  className="absolute inset-x-0 top-0"
                  style={{
                    height: `${FLAP_TIP}%`,
                    transformOrigin: "50% 0%",
                    transformStyle: "preserve-3d",
                  }}
                  animate={{ rotateX: opening && !reduceMotion ? -118 : 0 }}
                  transition={{
                    duration: FLAP_MS / 1000,
                    ease: [0.6, 0.05, 0.3, 1],
                  }}
                >
                  {/* Outer face */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      backfaceVisibility: "hidden",
                      background:
                        "linear-gradient(180deg, #1a6049 0%, #115540 55%, #0d422f 100%)",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.32] mix-blend-overlay"
                      style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "160px 160px" }}
                    />
                    <CoverTexture className="absolute inset-0 h-full w-full" />
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background:
                          "linear-gradient(120deg, transparent 35%, rgba(201,161,92,0.1) 48%, transparent 62%)",
                      }}
                    />
                  </div>
                  {/* Dark underside, seen as the flap sweeps past the camera */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      transform: "rotateX(180deg)",
                      backfaceVisibility: "hidden",
                      background: "linear-gradient(0deg, #07251b 0%, #041710 100%)",
                    }}
                  />
                  {/* Gold wax seal at the flap's point — rides with it */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ bottom: "-9%", transform: "translateX(-50%) translateZ(1px)" }}
                  >
                    <GoldSeal reduceMotion={reduceMotion} />
                  </div>
                </motion.div>

                {/* Darkness that swells as the flap crosses the view */}
                {!reduceMotion && (
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "#041710" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: opening ? 0.85 : 0 }}
                    transition={{ delay: opening ? 0.4 : 0, duration: 0.7, ease: "easeIn" }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
