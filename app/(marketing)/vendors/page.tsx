import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import VendorApplicationForm from "@/components/forms/VendorApplicationForm";
import { IMAGES, VENDOR_BENEFITS, VENDOR_TARGETS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vendor Opportunities",
  description:
    "Apply for a stand or partnership at Pastry Quin Cake Runway — a curated marketplace in front of the audience that books.",
};

export default function VendorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-28">
        <Image
          src={IMAGES.weddingTable}
          alt="Vendor showcase styling"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/65" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-ivory">
          <Reveal>
            <p className="eyebrow text-champagne">Vendor Opportunities</p>
            <h1 className="mt-4 font-display text-5xl md:text-6xl">
              Put your brand on the runway
            </h1>
            <p className="mt-6 font-serif-alt text-xl text-champagne italic">
              A curated marketplace in front of the people creating
              tomorrow&apos;s most beautiful moments.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Who we're looking for */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Who We're Looking For"
              title="Eleven kinds of craft"
              intro="If your work belongs at a luxury celebration, it belongs at Cake Runway."
            />
          </Reveal>
          <RevealStagger className="mt-14 flex flex-wrap justify-center gap-3">
            {VENDOR_TARGETS.map((target) => (
              <RevealItem key={target}>
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-cream px-5 py-2.5 font-alt text-sm text-charcoal">
                  <BadgeCheck size={16} strokeWidth={1.5} className="text-gold" />
                  {target}
                </span>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <div className="gold-hairline mx-auto max-w-5xl" />

      {/* Benefits */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Why Partner With Us"
              title="Where memorable moments become lasting impressions"
            />
          </Reveal>
          <RevealStagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VENDOR_BENEFITS.map((benefit) => (
              <RevealItem key={benefit.title}>
                <div className="h-full rounded-2xl border border-gold/20 bg-ivory p-8 shadow-warm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-lg">
                  <h3 className="font-display text-xl text-charcoal">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                    {benefit.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="bg-cream py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Vendor Application"
              title="Apply as a Vendor"
              intro="Tell us about your work — we review every application and respond personally."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-14 rounded-2xl border border-gold/20 bg-ivory p-8 shadow-warm sm:p-12">
              <VendorApplicationForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
