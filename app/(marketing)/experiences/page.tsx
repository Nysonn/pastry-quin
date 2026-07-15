import type { Metadata } from "next";
import Image from "next/image";
import CTAButton from "@/components/ui/CTAButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { EXPERIENCES, IMAGES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Featured Experiences",
  description:
    "Ten curated experiences across the residence — from the Luxury Cake Runway to the Baileys Experience Lounge.",
};

const EXPERIENCE_IMAGES = [
  IMAGES.heroRunway,
  IMAGES.editorialCake,
  IMAGES.weddingTable,
  IMAGES.baileysPairing,
  IMAGES.editorialCake,
  IMAGES.heroRunway,
  IMAGES.weddingTable,
  IMAGES.baileysPairing,
  IMAGES.weddingTable,
  IMAGES.editorialCake,
];

export default function ExperiencesPage() {
  return (
    <>
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <SectionHeading
              eyebrow="Featured Experiences"
              title="Ten curated moments across the residence"
              intro="Each experience is styled, tasted and photographed — a set of moments rather than a schedule."
            />
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <RevealStagger className="grid gap-8 sm:grid-cols-2">
            {EXPERIENCES.map((exp, i) => (
              <RevealItem key={exp.title}>
                <article className="group overflow-hidden rounded-2xl border border-gold/20 bg-ivory shadow-warm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-lg">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={EXPERIENCE_IMAGES[i]}
                      alt={exp.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8">
                    <h2 className="font-display text-2xl text-charcoal">
                      {exp.title}
                    </h2>
                    <p className="mt-3 leading-relaxed text-charcoal/70">
                      {exp.description}
                    </p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealStagger>
          <Reveal>
            <div className="mt-16 text-center">
              <CTAButton href="/register">Register Now</CTAButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
