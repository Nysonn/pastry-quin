"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "#event-details", label: "Details" },
  { href: "#about", label: "The Showcase" },
  { href: "#dress-code", label: "Dress Code" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Over the dark hero the header is transparent with ivory text;
  // once scrolled (or when the mobile menu is open) it turns ivory.
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        solid
          ? "border-b border-gold/20 bg-ivory/90 shadow-warm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* Gold hairline accent along the very top */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-display text-base transition-all duration-500 group-hover:rotate-[8deg] sm:h-11 sm:w-11 sm:text-lg ${
              solid
                ? "border-gold bg-champagne text-bronze"
                : "border-champagne/60 bg-ivory/10 text-champagne backdrop-blur-sm"
            }`}
          >
            PQ
          </span>
          <span className="min-w-0">
            <span
              className={`block truncate font-display text-base leading-tight transition-colors duration-500 sm:text-lg ${
                solid ? "text-charcoal" : "text-ivory"
              }`}
            >
              Pastry Quin
            </span>
            <span
              className={`block truncate font-serif-alt text-[0.6rem] tracking-[0.25em] uppercase transition-colors duration-500 sm:text-xs sm:tracking-[0.3em] ${
                solid ? "text-bronze" : "text-champagne"
              }`}
            >
              Cake Runway
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`group relative font-alt text-[0.8rem] font-medium tracking-[0.18em] uppercase transition-colors duration-500 ${
                solid
                  ? "text-charcoal/75 hover:text-bronze"
                  : "text-ivory/85 hover:text-ivory"
              }`}
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
          <a
            href="#rsvp"
            className="shimmer-sweep rounded-full bg-gold px-7 py-2.5 font-alt text-sm font-semibold tracking-widest text-ivory uppercase shadow-warm transition-all duration-300 hover:-translate-y-0.5 hover:bg-bronze hover:shadow-warm-lg"
          >
            RSVP
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <a
            href="#rsvp"
            className="rounded-full bg-gold px-4 py-2 font-alt text-[0.65rem] font-semibold tracking-widest text-ivory uppercase shadow-warm transition-colors hover:bg-bronze"
          >
            RSVP
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-500 ${
              solid
                ? "border-gold/30 text-charcoal hover:border-gold"
                : "border-champagne/50 text-ivory hover:border-champagne"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-gold/20 bg-ivory shadow-warm-lg lg:hidden"
          >
            <div className="px-4 pt-2 pb-6">
              <div className="flex flex-col divide-y divide-gold/10">
                {NAV.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
                    className="flex items-center justify-between px-2 py-4 font-alt text-base text-charcoal/80"
                  >
                    {item.label}
                    <span className="font-serif-alt text-gold">→</span>
                  </motion.a>
                ))}
              </div>
              <motion.a
                href="#rsvp"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.3 }}
                className="mt-4 block rounded-full bg-gold px-6 py-3.5 text-center font-alt text-sm font-semibold tracking-widest text-ivory uppercase shadow-warm"
              >
                RSVP — It&apos;s Free
              </motion.a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
