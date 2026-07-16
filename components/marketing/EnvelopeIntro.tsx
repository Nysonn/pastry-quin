"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import { EVENT } from "@/lib/content";

const SESSION_KEY = "pq_envelope_seen";

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

type Stage = "sealed" | "opening" | "rising" | "presenting" | "done";

const LAST_SCENE = 4;
const SCENE_MS = 3800;

// Ambient gold dust drifting while the envelope waits to be opened.
const DUST = [
  { left: "20%", top: "28%", size: 3, duration: 7, delay: 0 },
  { left: "72%", top: "22%", size: 2, duration: 9, delay: 1.2 },
  { left: "32%", top: "60%", size: 2, duration: 8, delay: 2.1 },
  { left: "80%", top: "54%", size: 3, duration: 10, delay: 0.6 },
  { left: "12%", top: "70%", size: 2, duration: 9, delay: 3 },
  { left: "58%", top: "74%", size: 2, duration: 7.5, delay: 1.8 },
];

// Embossed floral sprig for the envelope panels (tone-on-tone, like pressed paper).
function FloralEmboss({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 160 260"
      fill="none"
      aria-hidden
      className={className}
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.45))",
      }}
    >
      <g stroke="#f3e5cb" strokeWidth="1.1" strokeLinecap="round" opacity="0.22">
        <path d="M22 252 C 34 196, 14 150, 36 102 C 50 70, 42 40, 62 14" />
        <path d="M30 190 C 52 178, 66 156, 70 132" />
        <path d="M32 148 C 16 138, 8 120, 8 100" />
        <path d="M48 78 C 66 70, 78 54, 82 34" />
      </g>
      <g fill="#f3e5cb" opacity="0.14">
        <path d="M30 214 q -18 -6 -24 -24 q 20 2 24 24 z" />
        <path d="M34 170 q 20 -2 30 -18 q -22 -6 -30 18 z" />
        <path d="M28 124 q -18 -2 -26 -18 q 20 -4 26 18 z" />
        <path d="M46 92 q 18 -4 24 -22 q -20 0 -24 22 z" />
        <path d="M58 46 q 16 -6 20 -24 q -18 2 -20 24 z" />
      </g>
      <g fill="#f3e5cb" opacity="0.18">
        <circle cx="64" cy="16" r="3.4" />
        <circle cx="71" cy="22" r="2.4" />
        <circle cx="58" cy="24" r="2.4" />
        <circle cx="72" cy="130" r="3" />
        <circle cx="79" cy="136" r="2" />
        <circle cx="8" cy="98" r="2.6" />
        <circle cx="84" cy="32" r="2" />
      </g>
    </svg>
  );
}

// Embossed pampas plume for the invitation card, echoing the stationery reference.
function PampasEmboss({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 320"
      fill="none"
      aria-hidden
      className={className}
      style={{ filter: "drop-shadow(0 1px 1px rgba(169,121,59,0.35))" }}
    >
      <g stroke="#d8c8a4" strokeWidth="1.2" strokeLinecap="round" opacity="0.9">
        <path d="M60 318 C 66 250, 58 200, 70 150" />
        <path d="M96 318 C 96 260, 104 216, 112 178" />
        <path d="M34 318 C 30 272, 36 240, 32 210" />
      </g>
      <g fill="#e9dcc3" opacity="0.95">
        <path d="M70 152 C 52 120, 56 76, 76 48 C 86 82, 88 122, 70 152 z" />
        <path d="M70 150 C 88 122, 108 108, 128 104 C 114 134, 92 148, 70 150 z" />
        <path d="M112 180 C 102 146, 108 112, 128 88 C 134 122, 130 156, 112 180 z" />
        <path d="M32 212 C 18 188, 16 158, 28 134 C 40 160, 42 190, 32 212 z" />
      </g>
      <g fill="#dccdaa" opacity="0.85">
        <path d="M70 150 C 60 116, 66 84, 82 62 C 88 94, 84 126, 70 150 z" />
        <path d="M112 178 C 108 150, 114 124, 128 106 C 130 134, 124 160, 112 178 z" />
        <path d="M32 210 C 24 190, 24 166, 32 148 C 40 168, 40 192, 32 210 z" />
      </g>
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-alt text-[0.6rem] tracking-[0.42em] text-bronze uppercase sm:text-xs">
      {children}
    </p>
  );
}

export default function EnvelopeIntro() {
  const reduceMotion = useReducedMotion();
  const alreadySeen = useIntroSeen();
  const [stage, setStage] = useState<Stage>("sealed");
  const [flapBehind, setFlapBehind] = useState(false);
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

  // Auto-advance through the invitation scenes; the final scene waits for the CTA.
  useEffect(() => {
    if (stage !== "presenting" || scene >= LAST_SCENE || reduceMotion) return;
    const t = setTimeout(() => setScene((s) => s + 1), SCENE_MS);
    return () => clearTimeout(t);
  }, [stage, scene, reduceMotion]);

  const finish = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setStage("done");
  };

  const open = () => {
    if (reduceMotion) {
      // Skip the choreography, land on the full-details card.
      setScene(LAST_SCENE);
      setStage("presenting");
      return;
    }
    setStage("opening");
    later(() => setFlapBehind(true), 750);
    later(() => setStage("rising"), 1200);
    later(() => setStage("presenting"), 2900);
  };

  const handleOverlayClick = () => {
    if (stage === "sealed") open();
    else if (stage === "presenting" && scene < LAST_SCENE) {
      setScene((s) => s + 1);
    }
  };

  const flapOpen = stage !== "sealed";
  const cardRisen = stage === "rising" || stage === "presenting";
  const presenting = stage === "presenting";

  const scenes: React.ReactNode[] = [
    // Scene 1 — You're cordially invited
    <div key="s0" className="flex flex-col items-center">
      <Eyebrow>{EVENT.presenter}</Eyebrow>
      <p className="mt-10 font-alt text-sm tracking-[0.4em] text-charcoal/80 uppercase">
        You&apos;re
      </p>
      <p className="my-3 font-serif-alt text-5xl text-bronze italic sm:text-6xl">
        cordially
      </p>
      <p className="font-alt text-sm tracking-[0.4em] text-charcoal/80 uppercase">
        Invited
      </p>
    </div>,

    // Scene 2 — Pastry Quin presents The Cake Runway
    <div key="s1" className="flex flex-col items-center">
      <Eyebrow>{EVENT.presenter} presents</Eyebrow>
      <p className="mt-8 font-serif-alt text-3xl text-charcoal/70 italic">The</p>
      <p className="mt-1 font-display text-5xl tracking-[0.08em] text-charcoal sm:text-6xl">
        Cake
      </p>
      <p className="mt-1 font-display text-5xl tracking-[0.08em] text-charcoal sm:text-6xl">
        Runway
      </p>
      <p className="mt-6 font-serif-alt text-base text-bronze italic">
        {EVENT.motto}
      </p>
    </div>,

    // Scene 3 — Save the Date
    <div key="s2" className="flex flex-col items-center">
      <p className="font-serif-alt text-5xl text-charcoal italic sm:text-6xl">
        Save the
      </p>
      <p className="mt-1 font-serif-alt text-5xl text-charcoal italic sm:text-6xl">
        Date
      </p>
      <p className="mt-8 font-alt text-base tracking-[0.35em] text-charcoal/85 uppercase sm:text-lg">
        {EVENT.saveTheDate}
      </p>
      <p className="mt-4 font-alt text-[0.65rem] tracking-[0.3em] text-bronze uppercase">
        {EVENT.gatesNote}
      </p>
    </div>,

    // Scene 4 — The venue
    <div key="s3" className="flex flex-col items-center">
      <Eyebrow>The Venue</Eyebrow>
      <p className="mt-8 font-display text-4xl leading-tight text-charcoal sm:text-5xl">
        Serena Hotel
      </p>
      <p className="mt-1 font-display text-4xl leading-tight text-charcoal sm:text-5xl">
        Kigo
      </p>
      <p className="mt-6 font-serif-alt text-xl text-bronze italic">
        Entebbe · Uganda
      </p>
    </div>,

    // Scene 5 — full details + Visit Our Website
    <div key="s4" className="flex flex-col items-center">
      <Eyebrow>{EVENT.presenter} presents</Eyebrow>
      <p className="mt-4 font-display text-4xl text-charcoal sm:text-[2.6rem]">
        The Cake Runway
      </p>
      <div className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <p className="mt-5 font-serif-alt text-2xl text-charcoal italic">
        Save the Date
      </p>
      <p className="mt-2 font-alt text-sm tracking-[0.3em] text-charcoal/85 uppercase">
        {EVENT.saveTheDate}
      </p>
      <p className="mt-2 font-alt text-[0.6rem] tracking-[0.28em] text-bronze uppercase">
        {EVENT.gatesNote}
      </p>
      <p className="mt-4 font-alt text-[0.65rem] tracking-[0.24em] text-charcoal/70 uppercase">
        {EVENT.venue} · {EVENT.venueRegion}
      </p>
      <p className="mt-6 font-serif-alt text-xl text-bronze italic">
        Kindly RSVP
      </p>
      <a
        href={`tel:${EVENT.contactPhone}`}
        onClick={(e) => e.stopPropagation()}
        className="mt-2 flex items-center gap-2 font-alt text-sm tracking-[0.2em] text-charcoal transition-colors hover:text-bronze"
      >
        <Phone size={14} strokeWidth={1.5} className="text-gold" />
        {EVENT.contactPhone}
      </a>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="shimmer-sweep mt-8 inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent bg-gold px-10 py-3.5 font-alt text-xs font-semibold tracking-widest text-ivory uppercase shadow-warm transition-all duration-300 hover:-translate-y-0.5 hover:bg-bronze"
      >
        Visit Our Website
      </button>
    </div>,
  ];

  return (
    <AnimatePresence>
      {visible && (
      <motion.div
        key="envelope-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-charcoal"
        exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
        onClick={handleOverlayClick}
        role="button"
        aria-label="Open the invitation envelope"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleOverlayClick();
        }}
      >
        {/* Warm spotlight while the envelope is sealed */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(201,161,92,0.28) 0%, rgba(42,33,26,0) 65%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, rgba(16,12,9,0.6) 100%)",
          }}
        />

        {/* Ambient gold dust */}
        {!reduceMotion &&
          !presenting &&
          DUST.map((d, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-gold/60"
              style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
              animate={{ y: [0, -26, 0], opacity: [0.1, 0.55, 0.1] }}
              transition={{
                repeat: Infinity,
                duration: d.duration,
                delay: d.delay,
                ease: "easeInOut",
              }}
            />
          ))}

        {/* Soft stationery backdrop once the invitation is out */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, #f6efe3 0%, #f3e9d6 45%, #ecdfc6 100%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: presenting ? 1 : 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        {/* Diagonal window-light streak on the backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,253,246,0.55) 46%, transparent 60%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: presenting ? 0.7 : 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />

        {/* ————— The envelope ————— */}
        <AnimatePresence>
          {!presenting && (
            <motion.div
              key="envelope"
              className="relative flex flex-col items-center px-6"
              exit={{
                opacity: 0,
                y: 90,
                scale: 0.9,
                transition: { duration: 1, ease: [0.55, 0, 0.55, 0.45] },
              }}
            >
              <motion.div
                className="relative h-[24rem] w-[17.5rem] sm:h-[27rem] sm:w-[19.5rem]"
                style={{ perspective: 1200 }}
                animate={
                  stage === "sealed" && !reduceMotion ? { y: [0, -6, 0] } : { y: 0 }
                }
                transition={
                  stage === "sealed"
                    ? { repeat: Infinity, duration: 3.2, ease: "easeInOut" }
                    : { duration: 0.3 }
                }
              >
                {/* Pocket (back of the envelope) */}
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(165deg, #443528 0%, #2a211a 55%, #1b140e 100%)",
                    boxShadow: "0 40px 90px -24px rgba(0,0,0,0.75)",
                  }}
                />

                {/* Invitation card tucked inside */}
                <motion.div
                  className="absolute inset-x-4 top-5 bottom-8 z-10 overflow-hidden rounded-lg"
                  style={{
                    background:
                      "linear-gradient(170deg, #fbf8f3 0%, #f6efe3 60%, #efe3cc 100%)",
                    boxShadow: "0 14px 34px -14px rgba(0,0,0,0.55)",
                  }}
                  animate={cardRisen ? { y: "-64%" } : { y: 0 }}
                  transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="absolute inset-2 rounded-md border border-gold/35" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold font-display text-base text-bronze">
                      PQ
                    </span>
                    <span className="font-serif-alt text-xs tracking-[0.35em] text-bronze uppercase">
                      Invitation
                    </span>
                  </div>
                </motion.div>

                {/* Front folds of the envelope */}
                <div className="absolute inset-0 z-20 overflow-hidden rounded-xl">
                  {/* Left fold */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 50% 50%, 0 100%)",
                      background:
                        "linear-gradient(100deg, #4a3a2c 0%, #362a20 70%, #2d2118 100%)",
                    }}
                  />
                  {/* Right fold */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 50% 50%)",
                      background:
                        "linear-gradient(260deg, #4a3a2c 0%, #362a20 70%, #2d2118 100%)",
                    }}
                  />
                  {/* Bottom fold */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 100%, 100% 100%, 50% 48%)",
                      background:
                        "linear-gradient(180deg, #33271d 0%, #40311f 60%, #241a12 100%)",
                    }}
                  />
                  {/* Crease highlights along the folds */}
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      background:
                        "linear-gradient(45deg, transparent 49.4%, rgba(201,161,92,0.28) 50%, transparent 50.6%), linear-gradient(-45deg, transparent 49.4%, rgba(201,161,92,0.28) 50%, transparent 50.6%)",
                    }}
                  />
                  {/* Embossed florals on the folds */}
                  <FloralEmboss className="absolute -bottom-4 -left-2 h-56 w-36" />
                  <FloralEmboss className="absolute -bottom-4 -right-2 h-56 w-36" flip />
                  <FloralEmboss className="absolute -top-6 left-3 h-40 w-24 opacity-70" />
                  <FloralEmboss
                    className="absolute -top-6 right-3 h-40 w-24 opacity-70"
                    flip
                  />
                </div>

                {/* Top flap — hinges open from the top edge */}
                <motion.div
                  className={`absolute inset-x-0 top-0 h-[56%] ${
                    flapBehind ? "z-[5]" : "z-30"
                  }`}
                  style={{
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                  }}
                  animate={flapOpen ? { rotateX: 176 } : { rotateX: 0 }}
                  transition={{ duration: 1.6, ease: [0.45, 0, 0.2, 1] }}
                >
                  {/* Outer face */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background:
                        "linear-gradient(180deg, #4e3d2e 0%, #3a2c20 62%, #2c2015 100%)",
                      backfaceVisibility: "hidden",
                      boxShadow: "0 18px 30px -16px rgba(0,0,0,0.6)",
                    }}
                  >
                    <FloralEmboss className="absolute top-1 left-2 h-36 w-24" />
                    <FloralEmboss className="absolute top-1 right-2 h-36 w-24" flip />
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{
                        background:
                          "linear-gradient(120deg, transparent 35%, rgba(243,229,203,0.10) 48%, transparent 62%)",
                      }}
                    />
                  </div>
                  {/* Inner liner, seen once the flap swings past vertical */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background:
                        "linear-gradient(0deg, #1e1610 0%, #17110b 100%)",
                      transform: "rotateX(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  />
                  {/* Gold wax seal at the flap tip */}
                  <div
                    className="absolute bottom-0 left-1/2 flex h-14 w-14 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full font-display text-sm text-ivory"
                    style={{
                      background:
                        "radial-gradient(circle at 32% 28%, #f0d9a8 0%, #c9a15c 45%, #8a6633 100%)",
                      boxShadow:
                        "0 6px 16px rgba(0,0,0,0.45), inset 0 -2px 4px rgba(0,0,0,0.25)",
                      backfaceVisibility: "hidden",
                      transform: "translateZ(1px)",
                    }}
                  >
                    PQ
                  </div>
                </motion.div>
              </motion.div>

              {/* Prompt */}
              <motion.p
                className="mt-10 font-alt text-[0.65rem] tracking-[0.35em] text-champagne uppercase sm:text-xs"
                animate={
                  flapOpen
                    ? { opacity: 0 }
                    : reduceMotion
                      ? {}
                      : { opacity: [0.45, 1, 0.45] }
                }
                transition={
                  flapOpen
                    ? { duration: 0.3 }
                    : { repeat: Infinity, duration: 2.4 }
                }
              >
                Tap the seal to open your invitation
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ————— The invitation, presented full ————— */}
        {presenting && (
          <motion.div
            className="relative z-10 flex items-center justify-center px-5"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 140, scale: 0.62 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div
              className="relative flex h-[min(80svh,36rem)] w-[min(90vw,23rem)] flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-gold/30 px-7 py-10 text-center"
              style={{
                background:
                  "linear-gradient(170deg, #fdfbf6 0%, #f6efe3 55%, #efe3cc 100%)",
                boxShadow: "0 40px 90px -30px rgba(169,121,59,0.5)",
              }}
            >
              {/* Light streak across the card */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 38%, rgba(255,253,246,0.65) 50%, transparent 62%)",
                }}
              />
              {/* Embossed pampas, bottom-left like the stationery reference */}
              <PampasEmboss className="pointer-events-none absolute -bottom-2 -left-4 h-64 w-40 opacity-80" />
              <div className="pointer-events-none absolute inset-3 rounded-[1.15rem] border border-gold/20" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={scene}
                  className="relative flex flex-col items-center"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  {scenes[scene]}
                </motion.div>
              </AnimatePresence>

              {/* Scene progress dots */}
              <div className="absolute bottom-5 flex gap-2">
                {scenes.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                      i === scene ? "bg-gold" : "bg-gold/25"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      )}
    </AnimatePresence>
  );
}
