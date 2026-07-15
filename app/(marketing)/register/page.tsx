import type { Metadata } from "next";
import { format } from "date-fns";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { getEventSettings } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Register to Attend",
  description:
    "Reserve your place at Pastry Quin Cake Runway — free to attend, RSVP required.",
};

export default async function RegisterPage() {
  const settings = await getEventSettings();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Registration"
            title="Reserve your place on the front row"
            intro={`${format(settings.eventDate, "do MMMM yyyy")} · ${settings.venue} · Free to attend`}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 rounded-2xl border border-gold/20 bg-cream p-8 shadow-warm sm:p-12">
            {settings.registrationOpen ? (
              <RegistrationForm />
            ) : (
              <div className="py-8 text-center">
                <p className="font-display text-2xl text-charcoal">
                  Registration is currently closed
                </p>
                <p className="mt-4 font-serif-alt text-lg text-charcoal/70 italic">
                  Follow @pastryquin on Instagram for updates — we&apos;d love
                  to see you at a future runway.
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
