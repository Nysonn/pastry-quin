import Link from "next/link";
import { AtSign, Mail, MapPin, Phone } from "lucide-react";
import { EVENT } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold bg-charcoal font-display text-lg text-gold">
                PQ
              </span>
              <div>
                <p className="font-display text-lg text-ivory">Pastry Quin</p>
                <p className="font-serif-alt text-xs tracking-[0.3em] text-gold uppercase">
                  Cakes of Distinction
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs font-serif-alt text-lg text-ivory/70 italic">
              {EVENT.motto}
            </p>
            <p className="mt-4 font-alt text-xs tracking-widest text-gold/80 uppercase">
              {EVENT.partnerLine}
            </p>
          </div>

          <div>
            <p className="font-serif-alt text-xs tracking-[0.35em] text-gold uppercase">
              Explore
            </p>
            <nav className="mt-5 flex flex-col gap-3 font-alt text-sm text-ivory/70">
              <Link href="/about" className="transition-colors hover:text-gold">
                About the Event
              </Link>
              <Link href="/experiences" className="transition-colors hover:text-gold">
                Featured Experiences
              </Link>
              <Link href="/baileys" className="transition-colors hover:text-gold">
                The Baileys Partnership
              </Link>
              <Link href="/gallery" className="transition-colors hover:text-gold">
                Gallery
              </Link>
              <Link href="/vendors" className="transition-colors hover:text-gold">
                Vendor Opportunities
              </Link>
              <Link href="/register" className="transition-colors hover:text-gold">
                Register to Attend
              </Link>
            </nav>
          </div>

          <div>
            <p className="font-serif-alt text-xs tracking-[0.35em] text-gold uppercase">
              Get in Touch
            </p>
            <div className="mt-5 flex flex-col gap-3 font-alt text-sm text-ivory/70">
              <span className="flex items-center gap-3">
                <MapPin size={16} strokeWidth={1.5} className="text-gold" />
                {EVENT.venue}
              </span>
              <a
                href="mailto:hello@pastryquin.com"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Mail size={16} strokeWidth={1.5} className="text-gold" />
                hello@pastryquin.com
              </a>
              <span className="flex items-center gap-3">
                <Phone size={16} strokeWidth={1.5} className="text-gold" />
                +256 700 000 000
              </span>
              <a
                href="https://instagram.com/pastryquin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <AtSign size={16} strokeWidth={1.5} className="text-gold" />
                @pastryquin
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 font-alt text-xs text-ivory/40 md:flex-row">
          <p>© {new Date().getFullYear()} Pastry Quin. All rights reserved.</p>
          <p className="font-serif-alt text-sm text-ivory/60 italic">
            {EVENT.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
