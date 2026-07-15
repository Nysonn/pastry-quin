import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "You're Registered",
};

export default function RegisterSuccessPage() {
  return (
    <section className="flex min-h-[70vh] items-center py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <CheckCircle2
            size={48}
            strokeWidth={1.25}
            className="mx-auto text-gold"
          />
          <p className="eyebrow mt-8">Consider it done</p>
          <h1 className="mt-4 font-display text-4xl text-charcoal md:text-5xl">
            You&apos;re Registered for Cake Runway
          </h1>
          <p className="mt-6 font-serif-alt text-xl leading-relaxed text-charcoal/70 italic">
            Your place is reserved. This page is your confirmation — no email
            will be sent. We&apos;ll be in touch with event details closer to
            the date.
          </p>
          <div className="gold-hairline mx-auto mt-10 max-w-xs" />
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTAButton href="/experiences" variant="outline">
              Explore the Experiences
            </CTAButton>
            <CTAButton href="/" variant="ghost">
              Back to Home
            </CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
