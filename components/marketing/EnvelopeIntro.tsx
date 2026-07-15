"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EVENT } from "@/lib/content";

const SESSION_KEY = "pq_envelope_seen";

const emptySubscribe = () => () => {};

// Server snapshot pretends the intro was seen so SSR renders nothing;
// the client snapshot re-reads sessionStorage after hydration.
function useEnvelopeSeen() {
  return useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem(SESSION_KEY) !== null,
    () => true
  );
}

export default function EnvelopeIntro() {
  const reduceMotion = useReducedMotion();
  const alreadySeen = useEnvelopeSeen();
  const [stage, setStage] = useState<"sealed" | "opening" | "done">("sealed");

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

  const open = () => {
    if (stage !== "sealed") return;
    if (reduceMotion) {
      finish();
      return;
    }
    setStage("opening");
    setTimeout(finish, 2400);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="envelope-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-ivory"
        exit={{ opacity: 0 }}
        onClick={open}
        role="button"
        aria-label="Open your invitation"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, #f3e5cb 0%, #fbf8f3 70%)",
          }}
          animate={stage === "opening" ? { opacity: 0 } : { opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        />

        <div className="relative flex flex-col items-center px-6">
          {/* Envelope */}
          <motion.div
            className="relative h-56 w-80 sm:h-64 sm:w-96"
            style={{ perspective: 800 }}
            animate={stage === "opening" ? { y: 40, opacity: 0 } : {}}
            transition={{ delay: 1.7, duration: 0.7, ease: "easeIn" }}
          >
            {/* Body */}
            <div className="absolute inset-0 rounded-lg border border-gold/40 bg-champagne shadow-warm-lg" />

            {/* Invitation card lifting out */}
            <motion.div
              className="absolute inset-x-5 top-4 bottom-4 flex flex-col items-center justify-center rounded-md border border-gold/30 bg-ivory px-4 text-center shadow-warm"
              initial={{ y: 0 }}
              animate={stage === "opening" ? { y: -110, scale: 1.06 } : {}}
              transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-serif-alt text-[0.6rem] tracking-[0.35em] text-bronze uppercase">
                You&apos;re invited to
              </p>
              <p className="mt-1.5 font-display text-xl text-charcoal sm:text-2xl">
                Cake Runway
              </p>
              <p className="mt-1.5 font-serif-alt text-sm text-charcoal/70 italic">
                {EVENT.motto}
              </p>
            </motion.div>

            {/* Flap */}
            <motion.div
              className="absolute inset-x-0 top-0 z-10 h-1/2 origin-top"
              initial={{ rotateX: 0 }}
              animate={stage === "opening" ? { rotateX: 180, zIndex: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="h-full w-full border border-gold/40 bg-soft-beige"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  backfaceVisibility: "hidden",
                }}
              />
            </motion.div>

            {/* Wax seal */}
            <motion.button
              type="button"
              aria-label="Break the seal and open your invitation"
              className="absolute top-1/2 left-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose-gold font-display text-xl text-ivory shadow-warm-lg"
              animate={
                stage === "sealed" && !reduceMotion
                  ? { scale: [1, 1.08, 1] }
                  : stage === "opening"
                    ? { scale: 0, opacity: 0 }
                    : {}
              }
              transition={
                stage === "sealed"
                  ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
                  : { duration: 0.4 }
              }
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #cf8a94, #b76e79 55%, #96525d)",
              }}
            >
              PQ
            </motion.button>
          </motion.div>

          <motion.p
            className="mt-10 font-alt text-xs tracking-[0.35em] text-bronze uppercase"
            animate={
              stage === "opening"
                ? { opacity: 0 }
                : reduceMotion
                  ? {}
                  : { opacity: [0.5, 1, 0.5] }
            }
            transition={
              stage === "opening"
                ? { duration: 0.3 }
                : { repeat: Infinity, duration: 2.4 }
            }
          >
            Tap the seal to open your invitation
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
