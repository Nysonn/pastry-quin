import type { Metadata } from "next";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getEventSettings } from "@/lib/db/queries";
import { EVENT, IMAGES } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About the Event",
  description:
    "Cake Runway is a curated celebration of cake artistry, design and luxury experiences inspiring the future of weddings in Uganda.",
};

export default async function AboutPage() {
  const settings = await getEventSettings();

  return (
    <>
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <SectionHeading
              eyebrow="About the Event"
              title="A curated celebration of cake artistry, design and luxury experiences"
              intro={EVENT.motto}
            />
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-warm-lg">
              <Image
                src={IMAGES.editorialCake}
                alt="Couture cake styling"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-6 leading-relaxed text-charcoal/75">
              <p className="font-serif-alt text-2xl text-charcoal italic">
                Cake Runway is not simply an event.
              </p>
              <p>
                It is where Uganda&apos;s next generation of weddings comes to
                life through cake artistry, luxury experiences and thoughtfully
                curated brand partnerships. Wedding season is one of life&apos;s
                most meaningful and celebrated moments — yet most people spend
                months planning décor, flowers and outfits while treating the
                cake as an afterthought.
              </p>
              <p>
                We bring together the top wedding planners, cake makers and
                industry creatives for an unforgettable showcase of creativity,
                elegance and culture. Couture cakes take the runway like
                fashion pieces. Installations fill the residence. Tastings,
                demonstrations and styled moments carry you from the first
                impression to the final bite.
              </p>
              <p className="font-serif-alt text-xl text-bronze italic">
                Every detail is intentional.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="gold-hairline mx-auto max-w-5xl" />

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-gold/20 bg-ivory p-8 text-center shadow-warm">
                <CalendarDays size={24} strokeWidth={1.25} className="mx-auto text-gold" />
                <p className="eyebrow mt-4">Date</p>
                <p className="mt-2 font-display text-xl text-charcoal">
                  {format(settings.eventDate, "do MMMM yyyy")}
                </p>
              </div>
              <div className="rounded-2xl border border-gold/20 bg-ivory p-8 text-center shadow-warm">
                <MapPin size={24} strokeWidth={1.25} className="mx-auto text-gold" />
                <p className="eyebrow mt-4">Venue</p>
                <p className="mt-2 font-display text-xl text-charcoal">
                  {settings.venue}
                </p>
              </div>
              <div className="rounded-2xl border border-gold/20 bg-ivory p-8 text-center shadow-warm">
                <Ticket size={24} strokeWidth={1.25} className="mx-auto text-gold" />
                <p className="eyebrow mt-4">Entry</p>
                <p className="mt-2 font-display text-xl text-charcoal">
                  Free — RSVP required
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-14 text-center">
              <CTAButton href="/register">Register Now</CTAButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
