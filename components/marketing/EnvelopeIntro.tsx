"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
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

// Choreography: the seal cracks first, then the flap peels open behind it,
// then the card rises clear before the full invitation takes over.
const CRACK_MS = 550;
const FLAP_DELAY_MS = 280;
const FLAP_DURATION_MS = 1500;
const FLAP_BEHIND_MS = FLAP_DELAY_MS + Math.round(FLAP_DURATION_MS * 0.55);
const RISE_START_MS = FLAP_DELAY_MS + Math.round(FLAP_DURATION_MS * 0.78);
const RISE_DURATION_MS = 1750;
const PRESENT_MS = RISE_START_MS + 1550;

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

// Wax seal split into two halves along "P | Q" — cracks apart when the
// envelope opens instead of just swinging away with the flap.
function WaxSeal({
  cracked,
  reduceMotion,
}: {
  cracked: boolean;
  reduceMotion: boolean | null;
}) {
  const crackTransition = { duration: CRACK_MS / 1000, ease: [0.5, 0, 0.75, 0] as const };

  return (
    <div className="absolute left-1/2 top-[56%] z-40 -translate-x-1/2 -translate-y-1/2">
      <div className="relative h-16 w-16">
        {/* Contact shadow beneath the wax */}
        <div className="absolute inset-0 translate-y-1 rounded-full bg-black/35 blur-md" />

        {/* Left half — "P" */}
        <motion.div
          className="absolute inset-0"
          style={{ clipPath: "polygon(0 0, 52% 0, 46% 50%, 54% 100%, 0 100%)" }}
          animate={
            cracked && !reduceMotion
              ? { x: -9, y: 5, rotate: -16, opacity: 0 }
              : { x: 0, y: 0, rotate: 0, opacity: 1 }
          }
          transition={crackTransition}
        >
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "50% 46% 54% 48% / 48% 52% 46% 55%",
              background:
                "radial-gradient(circle at 34% 30%, #f3ddac 0%, #c9a15c 42%, #7d5a2c 88%, #6a4a24 100%)",
              boxShadow:
                "inset 0 2px 3px rgba(255,247,224,0.55), inset 0 -3px 5px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.45)",
            }}
          />
          <div
            className="absolute inset-[3px]"
            style={{
              borderRadius: "50% 46% 54% 48% / 48% 52% 46% 55%",
              border: "1px solid rgba(255,247,224,0.35)",
            }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center pr-[7px] font-display text-[0.95rem] text-ivory/95"
            style={{ textShadow: "0 1px 1px rgba(0,0,0,0.5), 0 -1px 0 rgba(255,240,210,0.3)" }}
          >
            P
          </span>
        </motion.div>

        {/* Right half — "Q" */}
        <motion.div
          className="absolute inset-0"
          style={{ clipPath: "polygon(52% 0, 100% 0, 100% 100%, 54% 100%, 46% 50%)" }}
          animate={
            cracked && !reduceMotion
              ? { x: 9, y: 5, rotate: 16, opacity: 0 }
              : { x: 0, y: 0, rotate: 0, opacity: 1 }
          }
          transition={crackTransition}
        >
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "46% 50% 48% 54% / 52% 48% 55% 46%",
              background:
                "radial-gradient(circle at 66% 30%, #f3ddac 0%, #c9a15c 42%, #7d5a2c 88%, #6a4a24 100%)",
              boxShadow:
                "inset 0 2px 3px rgba(255,247,224,0.55), inset 0 -3px 5px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.45)",
            }}
          />
          <div
            className="absolute inset-[3px]"
            style={{
              borderRadius: "46% 50% 48% 54% / 52% 48% 55% 46%",
              border: "1px solid rgba(255,247,224,0.35)",
            }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center pl-[7px] font-display text-[0.95rem] text-ivory/95"
            style={{ textShadow: "0 1px 1px rgba(0,0,0,0.5), 0 -1px 0 rgba(255,240,210,0.3)" }}
          >
            Q
          </span>
        </motion.div>

        {/* Snap-of-light flash right as the wax breaks */}
        {cracked && !reduceMotion && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              background:
                "linear-gradient(90deg, transparent 46%, rgba(255,247,224,0.9) 50%, transparent 54%)",
              filter: "blur(0.5px)",
            }}
          />
        )}

        {/* Wax drips, only while intact */}
        {!cracked && (
          <>
            <span
              className="absolute -bottom-1 left-3 h-2 w-1.5 rounded-b-full"
              style={{ background: "linear-gradient(180deg, #b98a49, #7d5a2c)" }}
            />
            <span
              className="absolute -bottom-0.5 right-4 h-1.5 w-1 rounded-b-full"
              style={{ background: "linear-gradient(180deg, #b98a49, #7d5a2c)" }}
            />
          </>
        )}
      </div>
    </div>
  );
}

// Wraps a scene's lines so they cascade in individually instead of arriving
// as one flat block; the whole group still fades as a unit on exit.
function StaggerScene({
  children,
  reduceMotion,
}: {
  children: React.ReactNode;
  reduceMotion: boolean | null;
}) {
  const container: Variants = {
    hidden: { opacity: 0, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
    show: {
      opacity: 1,
      transition: {
        duration: 0.2,
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  };
  const item: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 14,
      filter: reduceMotion ? "none" : "blur(2px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center"
      variants={container}
      initial="hidden"
      animate="show"
      exit="hidden"
    >
      {Children.map(children, (child) =>
        isValidElement(child) ? <motion.div variants={item}>{child}</motion.div> : child
      )}
    </motion.div>
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
    later(() => setFlapBehind(true), FLAP_BEHIND_MS);
    later(() => setStage("rising"), RISE_START_MS);
    later(() => setStage("presenting"), PRESENT_MS);
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
    <StaggerScene key="s0" reduceMotion={reduceMotion}>
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
    </StaggerScene>,

    // Scene 2 — Pastry Quin presents The Cake Runway
    <StaggerScene key="s1" reduceMotion={reduceMotion}>
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
    </StaggerScene>,

    // Scene 3 — Save the Date
    <StaggerScene key="s2" reduceMotion={reduceMotion}>
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
    </StaggerScene>,

    // Scene 4 — The venue
    <StaggerScene key="s3" reduceMotion={reduceMotion}>
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
    </StaggerScene>,

    // Scene 5 — full details + Visit Our Website
    <StaggerScene key="s4" reduceMotion={reduceMotion}>
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
    </StaggerScene>,
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
                transition: {
                  duration: reduceMotion ? 0 : 1,
                  ease: [0.55, 0, 0.55, 0.45],
                },
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
                whileTap={
                  !reduceMotion && stage === "sealed" ? { scale: 0.96 } : undefined
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
                  animate={
                    cardRisen
                      ? { y: "-64%", rotate: reduceMotion ? 0 : [0, -1.2, 0.6, 0] }
                      : { y: 0, rotate: 0 }
                  }
                  transition={{ duration: RISE_DURATION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
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

                {/* Contact shadow the flap casts as it lifts away */}
                <motion.div
                  className="pointer-events-none absolute inset-x-0 top-0 z-[25] h-[56%] origin-top"
                  style={{
                    background:
                      "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(0,0,0,0.32), transparent 72%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: flapOpen ? 0.45 : 0 }}
                  transition={{
                    duration: 0.8,
                    delay: flapOpen ? FLAP_DELAY_MS / 1000 + 0.1 : 0,
                    ease: "easeOut",
                  }}
                />

                {/* Top flap — hinges open from the top edge, right after the seal cracks */}
                <motion.div
                  className={`absolute inset-x-0 top-0 h-[56%] ${
                    flapBehind ? "z-[5]" : "z-30"
                  }`}
                  style={{
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                  }}
                  animate={flapOpen ? { rotateX: 176 } : { rotateX: 0 }}
                  transition={{
                    duration: FLAP_DURATION_MS / 1000,
                    delay: flapOpen ? FLAP_DELAY_MS / 1000 : 0,
                    ease: [0.45, 0, 0.2, 1],
                  }}
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
                </motion.div>

                {/* Wax seal — sits over the fold line, cracks apart as the flap lifts */}
                {(stage === "sealed" || stage === "opening") && (
                  <WaxSeal cracked={stage === "opening"} reduceMotion={reduceMotion} />
                )}
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
                Tap to break the seal
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Soft flash that masks the cut from the rising card to the full invitation */}
        {presenting && (
          <motion.div
            key="crossfade-flash"
            className="pointer-events-none absolute inset-0 z-[8]"
            initial={{ opacity: reduceMotion ? 0 : 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle at 50% 55%, rgba(255,247,224,0.55) 0%, rgba(243,229,203,0.18) 35%, transparent 70%)",
            }}
          />
        )}

        {/* ————— The invitation, presented full ————— */}
        {presenting && (
          <motion.div
            className="relative z-10 flex items-center justify-center px-5"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 110, scale: 0.72, filter: "blur(10px)" }
            }
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{
              duration: reduceMotion ? 0 : 1.2,
              ease: [0.22, 1, 0.36, 1],
              delay: reduceMotion ? 0 : 0.05,
            }}
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

              <AnimatePresence mode="wait">{scenes[scene]}</AnimatePresence>

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
