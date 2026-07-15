import type { Metadata } from "next";
import { MailCheck } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Application Received",
};

export default function VendorApplySuccessPage() {
  return (
    <section className="flex min-h-[70vh] items-center py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <MailCheck
            size={48}
            strokeWidth={1.25}
            className="mx-auto text-gold"
          />
          <p className="eyebrow mt-8">Application received</p>
          <h1 className="mt-4 font-display text-4xl text-charcoal md:text-5xl">
            You&apos;ve Applied as a Vendor
          </h1>
          <p className="mt-6 font-serif-alt text-xl leading-relaxed text-charcoal/70 italic">
            Thank you — our team reviews every application personally.
            We&apos;ll reach out by email with next steps. This page is your
            confirmation; no email receipt is sent.
          </p>
          <div className="gold-hairline mx-auto mt-10 max-w-xs" />
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTAButton href="/baileys" variant="outline">
              See the Baileys Partnership
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
