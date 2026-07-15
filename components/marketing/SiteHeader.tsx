"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experiences", label: "Experiences" },
  { href: "/baileys", label: "Baileys" },
  { href: "/gallery", label: "Gallery" },
  { href: "/vendors", label: "Vendors" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold bg-champagne font-display text-base text-bronze sm:h-11 sm:w-11 sm:text-lg">
            PQ
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base leading-tight text-charcoal sm:text-lg">
              Pastry Quin
            </span>
            <span className="block truncate font-serif-alt text-[0.6rem] tracking-[0.25em] text-bronze uppercase sm:text-xs sm:tracking-[0.3em]">
              Cake Runway
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-alt text-sm tracking-wide transition-colors hover:text-bronze ${
                pathname === item.href ? "text-bronze" : "text-charcoal/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="shimmer-sweep rounded-full bg-gold px-6 py-2.5 font-alt text-sm font-semibold tracking-widest text-ivory uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-bronze"
          >
            Register Now
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <Link
            href="/register"
            className="rounded-full bg-gold px-4 py-2 font-alt text-[0.65rem] font-semibold tracking-widest text-ivory uppercase transition-colors hover:bg-bronze"
          >
            Register
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-charcoal transition-colors hover:border-gold"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-gold/20 bg-ivory px-4 pt-2 pb-6 shadow-warm-lg lg:hidden">
          <div className="flex flex-col divide-y divide-gold/10">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-2 py-4 font-alt text-base ${
                  pathname === item.href
                    ? "font-semibold text-bronze"
                    : "text-charcoal/80"
                }`}
              >
                {item.label}
                <span className="font-serif-alt text-gold">→</span>
              </Link>
            ))}
          </div>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-full bg-gold px-6 py-3.5 text-center font-alt text-sm font-semibold tracking-widest text-ivory uppercase shadow-warm"
          >
            Register Now — It&apos;s Free
          </Link>
        </nav>
      )}
    </header>
  );
}
