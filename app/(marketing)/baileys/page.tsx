import type { Metadata } from "next";
import Image from "next/image";
import { GlassWater, Martini, Sparkles, Wine, Coffee } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { BAILEYS_PAIRINGS, IMAGES } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Baileys Partnership",
  description:
    "Baileys Irish Cream is the Official Beverage Partner of Cake Runway — signature cocktails, luxury cake pairings and interactive tastings.",
};

const PAIRING_ICONS = [Wine, Coffee, Martini, Sparkles, GlassWater];

export default function BaileysPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-32">
        <Image
          src={IMAGES.baileysPairing}
          alt="Baileys signature serve beside a dessert pairing"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/70" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-ivory">
          <Reveal>
            <p className="eyebrow text-champagne">Official Beverage Partner</p>
            <h1 className="mt-4 font-display text-5xl md:text-6xl">
              The Perfect Pairing
            </h1>
            <p className="mt-6 font-serif-alt text-2xl text-champagne italic">
              Baileys · Made for Celebration
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="font-serif-alt text-2xl leading-relaxed text-charcoal italic">
              Cake Runway offers Baileys an opportunity to become part of
              life&apos;s sweetest celebrations.
            </p>
            <div className="gold-hairline mx-auto mt-10 max-w-xs" />
            <p className="mt-10 leading-relaxed text-charcoal/75">
              From the first welcome moment to the final toast, guests
              experience thoughtfully curated moments designed to inspire and
              delight — signature Baileys welcome drinks on arrival, premium
              cocktail experiences, luxury gifting moments and elegant Baileys
              integrations woven throughout the event.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="gold-hairline mx-auto max-w-5xl" />

      {/* Pairing experience */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="The Cake Pairing Experience"
              title="Five ways to taste the partnership"
              intro="A guided journey through cream, cocoa and caramel — matched to couture cake."
            />
          </Reveal>
          <RevealStagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BAILEYS_PAIRINGS.map((pairing, i) => {
              const Icon = PAIRING_ICONS[i] ?? GlassWater;
              return (
                <RevealItem key={pairing.title}>
                  <div className="h-full rounded-2xl border border-gold/20 bg-ivory p-8 shadow-warm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-lg">
                    <Icon size={24} strokeWidth={1.25} className="text-gold" />
                    <h3 className="mt-4 font-display text-xl text-charcoal">
                      {pairing.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                      {pairing.description}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <h2 className="font-display text-4xl text-charcoal">
              Raise a glass to life&apos;s sweetest celebrations
            </h2>
            <p className="mt-5 font-serif-alt text-xl text-charcoal/70 italic">
              The Baileys Experience Lounge awaits — from the first impression
              to the final toast.
            </p>
            <div className="mt-10">
              <CTAButton href="/register">Register Now</CTAButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
