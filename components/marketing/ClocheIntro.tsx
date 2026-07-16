"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { EVENT } from "@/lib/content";

const SESSION_KEY = "pq_cloche_seen";

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

const SPARKLES = [
  { x: -110, y: -150, delay: 1.7, size: 5 },
  { x: 95, y: -170, delay: 1.9, size: 4 },
  { x: -60, y: -210, delay: 2.1, size: 3 },
  { x: 130, y: -110, delay: 2.3, size: 5 },
  { x: 20, y: -230, delay: 2.5, size: 4 },
  { x: -140, y: -80, delay: 2.7, size: 3 },
];

// Ambient gold dust drifting in the spotlight while the scene is covered.
const DUST = [
  { left: "22%", top: "30%", size: 3, duration: 7, delay: 0 },
  { left: "70%", top: "24%", size: 2, duration: 9, delay: 1.2 },
  { left: "34%", top: "58%", size: 2, duration: 8, delay: 2.1 },
  { left: "78%", top: "52%", size: 3, duration: 10, delay: 0.6 },
  { left: "14%", top: "66%", size: 2, duration: 9, delay: 3 },
  { left: "60%", top: "70%", size: 2, duration: 7.5, delay: 1.8 },
  { left: "46%", top: "18%", size: 2, duration: 11, delay: 2.6 },
];

function CakeOnStand() {
  return (
    <div className="relative w-44 sm:w-48">
      {/* Top tier */}
      <div className="relative mx-auto h-10 w-20 sm:h-11">
        <div
          className="absolute inset-0 rounded-[5px_5px_3px_3px]"
          style={{
            background:
              "linear-gradient(90deg, #d9c49c 0%, #fdfaf4 42%, #f6ecd8 62%, #cdb489 100%)",
          }}
        />
        <div
          className="absolute -top-[3px] inset-x-[2px] h-[7px] rounded-[50%]"
          style={{
            background: "linear-gradient(180deg, #fffdf8, #f3e5cb)",
            boxShadow: "inset 0 -1px 2px rgba(169,121,59,0.25)",
          }}
        />
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-bronze/70 via-gold to-bronze/70" />
      </div>

      {/* Middle tier */}
      <div className="relative mx-auto h-12 w-32 sm:h-13 sm:w-34">
        <div
          className="absolute inset-0 rounded-[4px_4px_3px_3px]"
          style={{
            background:
              "linear-gradient(90deg, #d3bd93 0%, #fbf6ea 40%, #f3e5cb 64%, #c8ad80 100%)",
          }}
        />
        <div
          className="absolute -top-[3px] inset-x-[2px] h-[8px] rounded-[50%]"
          style={{
            background: "linear-gradient(180deg, #fefbf4, #efe0c4)",
            boxShadow: "inset 0 -1px 2px rgba(169,121,59,0.25)",
          }}
        />
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-bronze/70 via-gold to-bronze/70" />
      </div>

      {/* Bottom tier */}
      <div className="relative mx-auto h-14 w-44 sm:h-15 sm:w-48">
        <div
          className="absolute inset-0 rounded-[4px_4px_2px_2px]"
          style={{
            background:
              "linear-gradient(90deg, #cfb88d 0%, #fdfaf4 38%, #f4e7cf 66%, #c3a87a 100%)",
          }}
        />
        <div
          className="absolute -top-[4px] inset-x-[2px] h-[9px] rounded-[50%]"
          style={{
            background: "linear-gradient(180deg, #fffdf8, #ecdcbd)",
            boxShadow: "inset 0 -1px 3px rgba(169,121,59,0.3)",
          }}
        />
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-bronze/70 via-gold to-bronze/70" />
      </div>

      {/* Stand: plate, stem, foot */}
      <div
        className="relative left-1/2 h-2 w-56 -translate-x-1/2 rounded-full sm:w-60"
        style={{
          background:
            "linear-gradient(90deg, #7a5a2b 0%, #c9a15c 22%, #f0d9a8 50%, #c9a15c 78%, #7a5a2b 100%)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.45)",
        }}
      />
      <div
        className="mx-auto h-6 w-3"
        style={{
          background: "linear-gradient(90deg, #8a6633, #e2c48f, #8a6633)",
        }}
      />
      <div
        className="mx-auto h-2 w-20 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, #7a5a2b 0%, #c9a15c 25%, #ecd5a4 50%, #c9a15c 75%, #7a5a2b 100%)",
        }}
      />
    </div>
  );
}

export default function ClocheIntro() {
  const reduceMotion = useReducedMotion();
  const alreadySeen = useIntroSeen();
  const [stage, setStage] = useState<"covered" | "revealing" | "done">(
    "covered"
  );

  // Pointer-tracking 3D tilt with layered parallax.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 120,
    damping: 18,
  });
  const domeX = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 18,
  });
  const cakeX = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), {
    stiffness: 120,
    damping: 18,
  });
  const shadowX = useSpring(useTransform(mx, [-0.5, 0.5], [8, -8]), {
    stiffness: 120,
    damping: 18,
  });

  const visible = !alreadySeen && stage !== "done";

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const finish = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setStage("done");
  };

  const reveal = () => {
    if (stage !== "covered") return;
    if (reduceMotion) {
      finish();
      return;
    }
    setStage("revealing");
    setTimeout(finish, 5000);
  };

  if (!visible) return null;

  const revealing = stage === "revealing";

  return (
    <AnimatePresence>
      <motion.div
        key="cloche-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-charcoal"
        exit={{ opacity: 0, transition: { duration: 1.4, ease: "easeInOut" } }}
        onClick={reveal}
        onPointerMove={(e) => {
          if (reduceMotion || e.pointerType !== "mouse") return;
          mx.set(e.clientX / window.innerWidth - 0.5);
          my.set(e.clientY / window.innerHeight - 0.5);
        }}
        role="button"
        aria-label="Lift the dome to unveil the showcase"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && reveal()}
      >
        {/* Warm spotlight */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(201,161,92,0.30) 0%, rgba(42,33,26,0) 65%)",
          }}
          animate={revealing ? { opacity: [1, 1.4, 1] } : { opacity: 1 }}
          transition={{ duration: 2.6 }}
        />
        {/* Floor */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(to top, rgba(16,12,9,0.85), rgba(16,12,9,0) 90%)",
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

        <div
          className="relative flex flex-col items-center px-6"
          style={{ perspective: 1100 }}
        >
          {/* Title — appears once the dome lifts */}
          <motion.div
            className="pointer-events-none absolute -top-2 left-1/2 w-[110vw] -translate-x-1/2 text-center sm:-top-8"
            initial={{ opacity: 0, y: 18 }}
            animate={revealing ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.4, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-serif-alt text-[0.65rem] tracking-[0.4em] text-champagne/80 uppercase sm:text-xs">
              {EVENT.presenter} presents
            </p>
            <p className="mt-2 font-display text-3xl text-ivory sm:text-4xl">
              Cake Runway
            </p>
            <p className="mt-2 font-serif-alt text-sm text-gold italic sm:text-base">
              {EVENT.motto}
            </p>
          </motion.div>

          {/* The 3D scene */}
          <motion.div
            className="relative mt-16 h-80 w-80 sm:h-88 sm:w-88"
            style={
              reduceMotion
                ? undefined
                : { rotateX, rotateY, transformStyle: "preserve-3d" }
            }
          >
            {/* Spotlight cone from above */}
            <div
              className="absolute -top-24 left-1/2 h-64 w-72 -translate-x-1/2 opacity-50"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(243,229,203,0.14), rgba(243,229,203,0.02))",
                clipPath: "polygon(42% 0, 58% 0, 92% 100%, 8% 100%)",
              }}
            />

            {/* Reveal sparkles */}
            {SPARKLES.map((s, i) => (
              <motion.span
                key={i}
                className="absolute top-2/3 left-1/2 rounded-full bg-gold"
                style={{ width: s.size, height: s.size }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={
                  revealing
                    ? { opacity: [0, 1, 0], x: s.x, y: s.y, scale: [0, 1.4, 0] }
                    : {}
                }
                transition={{ delay: s.delay, duration: 1.7, ease: "easeOut" }}
              />
            ))}

            {/* Light bloom behind the cake on reveal */}
            <motion.div
              className="absolute inset-x-0 bottom-8 mx-auto h-56 w-56 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(240,217,168,0.5) 0%, transparent 65%)",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={revealing ? { opacity: [0, 1, 0.5], scale: 1.25 } : {}}
              transition={{ delay: 1.4, duration: 2, ease: "easeOut" }}
            />

            {/* Cake — dim under the glass, glows into view */}
            <motion.div
              className="absolute inset-x-0 bottom-12 flex justify-center"
              style={reduceMotion ? undefined : { x: cakeX }}
            >
              <motion.div
                initial={{ opacity: 0.45, filter: "brightness(0.6) saturate(0.85)" }}
                animate={
                  revealing
                    ? {
                        opacity: 1,
                        filter: "brightness(1.05) saturate(1)",
                        scale: 1.04,
                      }
                    : {}
                }
                transition={{ delay: 1.2, duration: 1.6, ease: "easeOut" }}
              >
                <CakeOnStand />
              </motion.div>
            </motion.div>

            {/* Contact shadow on the floor */}
            <motion.div
              className="absolute inset-x-0 bottom-9 mx-auto h-4 w-60 rounded-[50%] bg-black/55 blur-md"
              style={reduceMotion ? undefined : { x: shadowX }}
              animate={revealing ? { opacity: 0.35, scaleX: 0.9 } : {}}
              transition={{ delay: 1, duration: 1.6 }}
            />

            {/* Faded reflection on the floor */}
            <div
              aria-hidden
              className="absolute inset-x-0 -bottom-30 flex justify-center opacity-20 blur-[1.5px]"
              style={{
                transform: "scaleY(-1)",
                maskImage:
                  "linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%)",
                WebkitMaskImage:
                  "linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%)",
              }}
            >
              <CakeOnStand />
            </div>

            {/* Glass cloche */}
            <motion.div
              className="absolute inset-x-0 bottom-14 mx-auto h-56 w-64 origin-bottom sm:h-60 sm:w-68"
              style={reduceMotion ? undefined : { x: domeX }}
              animate={
                revealing
                  ? { y: -260, rotateZ: 9, rotateX: -20, opacity: 0 }
                  : {}
              }
              transition={
                revealing
                  ? { duration: 2, ease: [0.22, 1, 0.36, 1] }
                  : undefined
              }
            >
              <motion.div
                className="relative h-full w-full"
                animate={
                  !revealing && !reduceMotion ? { y: [0, -4, 0] } : { y: 0 }
                }
                transition={
                  !revealing
                    ? { repeat: Infinity, duration: 2.8, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
              >
                {/* Glass body */}
                <div
                  className="absolute inset-0 rounded-t-full"
                  style={{
                    background:
                      "linear-gradient(115deg, rgba(251,248,243,0.20) 0%, rgba(201,161,92,0.26) 30%, rgba(251,248,243,0.06) 52%, rgba(169,121,59,0.22) 78%, rgba(251,248,243,0.14) 100%)",
                    backdropFilter: "blur(2.5px)",
                    boxShadow:
                      "inset 0 0 40px rgba(201,161,92,0.22), inset 0 2px 18px rgba(251,248,243,0.28), 0 24px 60px -18px rgba(0,0,0,0.65)",
                  }}
                />
                {/* Rim light along the dome edge */}
                <div className="absolute inset-0 rounded-t-full border border-champagne/45" />
                <div className="absolute inset-[3px] rounded-t-full border-t border-ivory/25" />

                {/* Large specular streak */}
                <div
                  className="absolute top-7 left-9 h-28 w-9 rounded-full opacity-70"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(251,248,243,0.65), rgba(251,248,243,0.05))",
                    transform: "rotate(16deg)",
                    filter: "blur(1px)",
                  }}
                />
                {/* Small counter-highlight */}
                <div
                  className="absolute top-16 right-10 h-14 w-3.5 rounded-full opacity-40"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(251,248,243,0.5), transparent)",
                    transform: "rotate(-14deg)",
                    filter: "blur(1px)",
                  }}
                />

                {/* Polished gold base rim */}
                <div
                  className="absolute -bottom-1 inset-x-[-6px] h-3 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #6f5227 0%, #c9a15c 20%, #f0d9a8 50%, #c9a15c 80%, #6f5227 100%)",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
                  }}
                />

                {/* Gold ball handle with monogram */}
                <div
                  className="absolute -top-6 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full font-display text-xs text-ivory"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 28%, #f0d9a8 0%, #c9a15c 45%, #8a6633 100%)",
                    boxShadow:
                      "0 6px 16px rgba(0,0,0,0.45), inset 0 -2px 4px rgba(0,0,0,0.25)",
                  }}
                >
                  PQ
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Prompt */}
          <motion.p
            className="mt-10 font-alt text-[0.65rem] tracking-[0.35em] text-champagne uppercase sm:text-xs"
            animate={
              revealing
                ? { opacity: 0 }
                : reduceMotion
                  ? {}
                  : { opacity: [0.45, 1, 0.45] }
            }
            transition={
              revealing
                ? { duration: 0.3 }
                : { repeat: Infinity, duration: 2.4 }
            }
          >
            Tap to unveil the showcase
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
