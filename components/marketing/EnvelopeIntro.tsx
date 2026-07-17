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

const SESSION_KEY = "pq_invite_seen";

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

const LAST_SCENE = 3;
// Auto-advance hold per scene — short, punchy middle beat, longer bookends.
const SCENE_MS = [5400, 2700, 6200];

// Choreography: the seal cracks first, then all four flaps peel open
// together, then the interior settles into view.
const CRACK_MS = 550;
const FLAP_DELAY_MS = 260;
const FLAP_DURATION_MS = 1250;
const PRESENT_MS = FLAP_DELAY_MS + FLAP_DURATION_MS + 260;

// Subtle noise so the paper never reads as a flat digital gradient.
const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

// Tone-on-tone botanical line art for the cover flaps — tropical leaves and
// fronds instead of the reference's rose emboss, scaled to fill one panel.
function TropicalEmboss({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 700"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
      className={className}
    >
      <g stroke="#dff0d8" strokeWidth="1.1" strokeLinecap="round" opacity="0.16">
        <path d="M40 40 C 90 90, 70 160, 130 200 C 180 232, 170 300, 220 340" />
        <path d="M60 60 C 40 110, 90 130, 80 190" />
        <path d="M90 80 C 130 100, 140 140, 175 165" />
        <path d="M340 60 C 300 120, 320 180, 270 220 C 230 252, 240 310, 190 350" />
        <path d="M320 90 C 350 130, 310 160, 330 210" />
        <path d="M60 560 C 100 520, 90 470, 140 440 C 185 414, 175 360, 220 330" />
        <path d="M340 600 C 300 560, 315 500, 265 465 C 225 437, 235 385, 195 355" />
      </g>
      <g fill="#dff0d8" opacity="0.12">
        <path d="M60 60 C 20 90, 24 150, 60 190 C 100 150, 96 90, 60 60 z" />
        <path d="M340 90 C 380 120, 378 175, 340 210 C 302 175, 304 120, 340 90 z" />
        <path d="M70 540 C 30 570, 32 620, 70 650 C 108 620, 108 570, 70 540 z" />
        <path d="M330 580 C 370 610, 368 655, 330 685 C 292 655, 294 610, 330 580 z" />
      </g>
      <g fill="#dff0d8" opacity="0.15">
        <circle cx="130" cy="200" r="5" />
        <circle cx="270" cy="220" r="5" />
        <circle cx="220" cy="340" r="4" />
        <circle cx="140" cy="440" r="4" />
        <circle cx="265" cy="465" r="4" />
      </g>
    </svg>
  );
}

// Small gold flourish that emerges from the seal and hovers over every
// scene, standing in for the reference's butterfly.
function GoldFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      aria-hidden
      className={className}
      style={{ filter: "drop-shadow(0 2px 4px rgba(15,77,58,0.25))" }}
    >
      <g stroke="#c9a15c" strokeWidth="1.3" strokeLinecap="round" fill="none">
        <path d="M60 30 C 44 30, 34 20, 18 20" />
        <path d="M60 30 C 76 30, 86 20, 102 20" />
        <path d="M60 30 C 44 30, 34 40, 18 40" />
        <path d="M60 30 C 76 30, 86 40, 102 40" />
      </g>
      <g fill="#c9a15c">
        <circle cx="60" cy="30" r="3.2" />
        <circle cx="18" cy="20" r="2" />
        <circle cx="102" cy="20" r="2" />
        <circle cx="18" cy="40" r="2" />
        <circle cx="102" cy="40" r="2" />
      </g>
      <path
        d="M60 30 L 63 22 L 60 14 L 57 22 Z"
        fill="#f0d9a8"
        opacity="0.9"
      />
    </svg>
  );
}

// Wax seal split into two halves along "P | Q" — cracks apart when the
// cover opens instead of just swinging away with a flap.
function WaxSeal({
  cracked,
  reduceMotion,
}: {
  cracked: boolean;
  reduceMotion: boolean | null;
}) {
  const crackTransition = { duration: CRACK_MS / 1000, ease: [0.5, 0, 0.75, 0] as const };

  return (
    <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        className="relative h-20 w-20 sm:h-24 sm:w-24"
        animate={
          !cracked && !reduceMotion
            ? { filter: ["brightness(1)", "brightness(1.35)", "brightness(1)"] }
            : { filter: "brightness(1)" }
        }
        transition={
          !cracked
            ? { repeat: Infinity, duration: 3.6, ease: "easeInOut", repeatDelay: 1.2 }
            : { duration: 0.3 }
        }
      >
        {/* Contact shadow */}
        <div className="absolute inset-0 translate-y-1.5 rounded-full bg-black/35 blur-md" />

        {/* Left half — "P" */}
        <motion.div
          className="absolute inset-0"
          style={{ clipPath: "polygon(0 0, 52% 0, 46% 50%, 54% 100%, 0 100%)" }}
          animate={
            cracked && !reduceMotion
              ? { x: -12, y: 6, rotate: -18, opacity: 0 }
              : { x: 0, y: 0, rotate: 0, opacity: 1 }
          }
          transition={crackTransition}
        >
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "50% 46% 54% 48% / 48% 52% 46% 55%",
              background:
                "radial-gradient(circle at 34% 30%, #f5e2ae 0%, #c9a15c 42%, #7d5a2c 88%, #6a4a24 100%)",
              boxShadow:
                "inset 0 2px 3px rgba(255,247,224,0.6), inset 0 -3px 5px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.45)",
            }}
          />
          <div
            className="absolute inset-[3px]"
            style={{
              borderRadius: "50% 46% 54% 48% / 48% 52% 46% 55%",
              border: "1px solid rgba(255,247,224,0.4)",
            }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center pr-[9px] font-display text-lg text-ivory/95 sm:text-xl"
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
              ? { x: 12, y: 6, rotate: 18, opacity: 0 }
              : { x: 0, y: 0, rotate: 0, opacity: 1 }
          }
          transition={crackTransition}
        >
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "46% 50% 48% 54% / 52% 48% 55% 46%",
              background:
                "radial-gradient(circle at 66% 30%, #f5e2ae 0%, #c9a15c 42%, #7d5a2c 88%, #6a4a24 100%)",
              boxShadow:
                "inset 0 2px 3px rgba(255,247,224,0.6), inset 0 -3px 5px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.45)",
            }}
          />
          <div
            className="absolute inset-[3px]"
            style={{
              borderRadius: "46% 50% 48% 54% / 52% 48% 55% 46%",
              border: "1px solid rgba(255,247,224,0.4)",
            }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center pl-[9px] font-display text-lg text-ivory/95 sm:text-xl"
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
                "linear-gradient(90deg, transparent 46%, rgba(255,247,224,0.95) 50%, transparent 54%)",
              filter: "blur(0.5px)",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-alt text-[0.62rem] tracking-[0.42em] text-emerald uppercase sm:text-xs">
      {children}
    </p>
  );
}

// Wraps a scene's lines so they materialize with a soft focus-pull dissolve
// instead of arriving as one flat block — echoes the reference's ink-develop reveal.
function StaggerScene({
  children,
  reduceMotion,
}: {
  children: React.ReactNode;
  reduceMotion: boolean | null;
}) {
  const container: Variants = {
    hidden: { opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
    show: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: reduceMotion ? 0 : 0.1,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  };
  const item: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 6,
      filter: reduceMotion ? "none" : "blur(3px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
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

type FlapSide = "top" | "right" | "bottom" | "left";

const FLAP_CONFIG: Record<
  FlapSide,
  { clipPath: string; origin: string; axis: "rotateX" | "rotateY"; angle: number }
> = {
  top: {
    clipPath: "polygon(0 0, 100% 0, 50% 50%)",
    origin: "50% 0%",
    axis: "rotateX",
    angle: -122,
  },
  bottom: {
    clipPath: "polygon(0 100%, 100% 100%, 50% 50%)",
    origin: "50% 100%",
    axis: "rotateX",
    angle: 122,
  },
  left: {
    clipPath: "polygon(0 0, 0 100%, 50% 50%)",
    origin: "0% 50%",
    axis: "rotateY",
    angle: 122,
  },
  right: {
    clipPath: "polygon(100% 0, 100% 100%, 50% 50%)",
    origin: "100% 50%",
    axis: "rotateY",
    angle: -122,
  },
};

function CoverFlap({
  side,
  open,
  reduceMotion,
}: {
  side: FlapSide;
  open: boolean;
  reduceMotion: boolean | null;
}) {
  const cfg = FLAP_CONFIG[side];
  const rotateProp = cfg.axis === "rotateX" ? "rotateX" : "rotateY";
  const linerAxis = cfg.axis === "rotateX" ? "rotateX(180deg)" : "rotateY(180deg)";

  return (
    <motion.div
      className="absolute inset-0 z-20"
      style={{
        clipPath: cfg.clipPath,
        transformOrigin: cfg.origin,
        transformStyle: "preserve-3d",
      }}
      animate={{ [rotateProp]: open ? cfg.angle : 0 }}
      transition={{
        duration: reduceMotion ? 0 : FLAP_DURATION_MS / 1000,
        delay: open && !reduceMotion ? FLAP_DELAY_MS / 1000 : 0,
        ease: [0.45, 0, 0.2, 1],
      }}
    >
      {/* Outer face — emerald cover with tropical emboss */}
      <div
        className="absolute inset-0"
        style={{
          backfaceVisibility: "hidden",
          background:
            "linear-gradient(155deg, #145b46 0%, #0f4d3a 45%, #0a3527 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
          style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "160px 160px" }}
        />
        <TropicalEmboss className="absolute inset-0 h-full w-full" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(120deg, transparent 35%, rgba(201,161,92,0.12) 48%, transparent 62%)",
          }}
        />
      </div>
      {/* Inner liner, seen briefly as the flap swings past vertical */}
      <div
        className="absolute inset-0"
        style={{
          transform: linerAxis,
          backfaceVisibility: "hidden",
          background: "linear-gradient(0deg, #08281e 0%, #051a13 100%)",
        }}
      />
    </motion.div>
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

  // Auto-advance through the invitation scenes; the final scene waits for the CTA.
  useEffect(() => {
    if (stage !== "presenting" || scene >= LAST_SCENE || reduceMotion) return;
    const t = setTimeout(() => setScene((s) => s + 1), SCENE_MS[scene]);
    return () => clearTimeout(t);
  }, [stage, scene, reduceMotion]);

  const finish = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setStage("done");
  };

  const open = () => {
    if (reduceMotion) {
      setScene(LAST_SCENE);
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

  const coverOpen = stage !== "sealed";
  const presenting = stage === "presenting";

  const scenes: React.ReactNode[] = [
    // Scene 1 — You are cordially invited
    <StaggerScene key="s0" reduceMotion={reduceMotion}>
      <p className="font-alt text-xs tracking-[0.4em] text-charcoal/70 uppercase sm:text-sm">
        You are
      </p>
      <p className="my-3 font-display text-4xl text-charcoal italic sm:text-5xl">
        Cordially
      </p>
      <p className="font-alt text-xs tracking-[0.4em] text-charcoal/70 uppercase sm:text-sm">
        Invited
      </p>
    </StaggerScene>,

    // Scene 2 — Pastry Quin Presents / The Cake Runway
    <StaggerScene key="s1" reduceMotion={reduceMotion}>
      <Eyebrow>{EVENT.presenter} Presents</Eyebrow>
      <p className="mt-5 font-display text-4xl leading-tight text-charcoal sm:text-5xl">
        The Cake
      </p>
      <p className="font-display text-4xl leading-tight text-charcoal italic sm:text-5xl">
        Runway
      </p>
    </StaggerScene>,

    // Scene 3 — Save the Date / time / location
    <StaggerScene key="s2" reduceMotion={reduceMotion}>
      <p className="font-script text-4xl text-rose-gold sm:text-5xl">Save the Date</p>
      <p className="mt-4 font-alt text-lg tracking-[0.3em] text-charcoal uppercase sm:text-xl">
        3rd August
      </p>
      <div className="mt-6 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="mt-6 space-y-4">
        <div>
          <Eyebrow>Time</Eyebrow>
          <p className="mt-1 font-serif-alt text-lg text-charcoal italic">
            {EVENT.gatesNote}
          </p>
        </div>
        <div>
          <Eyebrow>Location</Eyebrow>
          <p className="mt-1 font-serif-alt text-lg text-charcoal italic">Serena Kigo</p>
        </div>
      </div>
    </StaggerScene>,

    // Scene 4 — Kindly RSVP + contact + CTA
    <StaggerScene key="s3" reduceMotion={reduceMotion}>
      <p className="font-script text-3xl text-rose-gold sm:text-4xl">Kindly</p>
      <p className="mt-1 font-alt text-2xl tracking-[0.3em] text-charcoal uppercase sm:text-3xl">
        RSVP
      </p>
      <p className="mt-3 font-alt text-[0.65rem] tracking-[0.28em] text-charcoal/60 uppercase">
        By {EVENT.rsvpDeadline}
      </p>
      <p className="mt-6 font-serif-alt text-lg text-charcoal italic">{EVENT.presenter}</p>
      <a
        href={`tel:${EVENT.contactPhone}`}
        onClick={(e) => e.stopPropagation()}
        className="mt-1 flex items-center gap-2 font-alt text-sm tracking-[0.2em] text-charcoal/80 transition-colors hover:text-emerald"
      >
        <Phone size={14} strokeWidth={1.5} className="text-gold" />
        {EVENT.contactPhone}
      </a>
      <div className="mt-7 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="shimmer-sweep mt-7 inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent bg-emerald px-10 py-3.5 font-alt text-xs font-semibold tracking-widest text-ivory uppercase shadow-warm transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-deep"
      >
        Visit Website
      </button>
    </StaggerScene>,
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="invite-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal p-0 sm:p-6"
          exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 1, ease: "easeInOut" } }}
          onClick={handleOverlayClick}
          role="button"
          aria-label="Open the invitation"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleOverlayClick();
          }}
        >
          <div
            className="relative h-[100dvh] w-full overflow-hidden shadow-2xl sm:h-[min(92dvh,850px)] sm:w-[min(92vw,430px)] sm:rounded-[1.75rem]"
            style={{ perspective: 2200 }}
          >
            {/* Thin metallic gold frame */}
            <div className="pointer-events-none absolute inset-3 z-40 rounded-[0.9rem] border border-gold/70 sm:inset-4" />
            <div className="pointer-events-none absolute inset-[14px] z-40 rounded-[0.75rem] border border-gold/25 sm:inset-[18px]" />

            {/* ————— Interior (ivory card) — always mounted beneath the cover ————— */}
            <div
              className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
              style={{
                background: "linear-gradient(170deg, #fdfbf6 0%, #f6efe3 55%, #efe3cc 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
                style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "160px 160px" }}
              />
              {/* Soft tropical watercolor corner accents */}
              <div
                className="absolute -left-10 -top-10 h-48 w-48 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(183,201,173,0.45), transparent 70%)" }}
              />
              <div
                className="absolute -right-12 top-1/3 h-56 w-56 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(226,168,147,0.35), transparent 70%)" }}
              />
              <div
                className="absolute -bottom-14 -left-6 h-52 w-52 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(183,201,173,0.4), transparent 70%)" }}
              />
              <div
                className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(201,161,92,0.28), transparent 70%)" }}
              />

              {/* Persistent gold flourish + crossfading scene content */}
              <motion.div
                className="relative z-10 flex flex-col items-center px-8 text-center"
                initial={false}
                animate={{ opacity: presenting ? 1 : 0, scale: presenting ? 1 : 0.94 }}
                transition={{
                  duration: reduceMotion ? 0 : 1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: reduceMotion ? 0 : 0.1,
                }}
              >
                <motion.div
                  animate={
                    !reduceMotion
                      ? { y: [0, -3, 0], opacity: [0.85, 1, 0.85] }
                      : { y: 0, opacity: 1 }
                  }
                  transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
                >
                  <GoldFlourish className="h-10 w-20 sm:h-12 sm:w-24" />
                </motion.div>

                <div className="mt-6">
                  <AnimatePresence mode="wait">{scenes[scene]}</AnimatePresence>
                </div>

                {/* Scene progress dots */}
                <div className="mt-8 flex gap-2">
                  {scenes.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                        i === scene ? "bg-gold" : "bg-gold/25"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ————— Cover: four flaps meeting at the center seal ————— */}
            <CoverFlap side="top" open={coverOpen} reduceMotion={reduceMotion} />
            <CoverFlap side="bottom" open={coverOpen} reduceMotion={reduceMotion} />
            <CoverFlap side="left" open={coverOpen} reduceMotion={reduceMotion} />
            <CoverFlap side="right" open={coverOpen} reduceMotion={reduceMotion} />

            {/* Wax seal — cracks apart to begin the reveal */}
            {(stage === "sealed" || stage === "opening") && (
              <WaxSeal cracked={stage === "opening"} reduceMotion={reduceMotion} />
            )}

            {/* Prompt */}
            {stage === "sealed" && (
              <motion.p
                className="pointer-events-none absolute inset-x-0 bottom-12 z-30 text-center font-alt text-[0.65rem] tracking-[0.35em] text-champagne uppercase sm:text-xs"
                animate={reduceMotion ? {} : { opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2.6 }}
              >
                Tap to break the seal
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
