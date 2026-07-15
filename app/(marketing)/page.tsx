import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Cake,
  Camera,
  Crown,
  Gem,
  GlassWater,
  Heart,
  Sparkles,
  Users,
  Briefcase,
  UtensilsCrossed,
  Megaphone,
  CalendarHeart,
  Building2,
  Flower2,
} from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import CountdownTimer from "@/components/marketing/CountdownTimer";
import { getEventSettings } from "@/lib/db/queries";
import {
  AUDIENCE,
  EVENT,
  EXPERIENCES,
  IMAGES,
  WHY_ATTEND,
} from "@/lib/content";

export const dynamic = "force-dynamic";

const AUDIENCE_ICONS = [
  Heart,
  Users,
  CalendarHeart,
  Cake,
  Sparkles,
  Gem,
  Building2,
  UtensilsCrossed,
  Megaphone,
  Briefcase,
];

export default async function HomePage() {
  const settings = await getEventSettings();
  const eventDate = settings.eventDate;

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[68svh] items-center justify-center overflow-hidden md:min-h-[92vh]">
        <Image
          src={IMAGES.heroRunway}
          alt="Luxury cake runway showcase"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/70" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center text-ivory md:py-24">
          <Reveal>
            <p className="font-serif-alt text-xs tracking-[0.4em] text-champagne uppercase sm:text-sm">
              {EVENT.presenter} presents
            </p>
            <h1 className="mt-4 font-display text-5xl leading-none sm:text-7xl md:mt-6 md:text-8xl">
              Cake Runway
            </h1>
            <div className="gold-hairline mx-auto mt-6 max-w-xs md:mt-8" />
            <p className="mt-5 font-serif-alt text-xl text-champagne italic sm:text-2xl">
              {EVENT.motto}
            </p>
            <p className="mt-6 font-alt text-xs tracking-[0.25em] uppercase sm:text-sm md:mt-8">
              {format(eventDate, "do MMMM yyyy")} · {settings.venue}
            </p>
            <p className="mt-2.5 font-alt text-[0.65rem] tracking-[0.25em] text-champagne/80 uppercase sm:text-xs">
              Official Beverage Partner — Baileys
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 md:mt-12">
              <CTAButton href="/register" className="w-full max-w-xs sm:w-auto sm:px-12">
                Register Now — It&apos;s Free
              </CTAButton>
              <div className="flex items-center gap-6">
                <CTAButton href="/vendors" variant="ghost" className="px-2 text-champagne hover:text-ivory">
                  Become a Vendor
                </CTAButton>
                <span className="h-4 w-px bg-champagne/30" />
                <CTAButton href="/about" variant="ghost" className="px-2 text-champagne hover:text-ivory">
                  Event Details
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Countdown */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <p className="eyebrow text-center">The runway opens in</p>
            <div className="mt-10">
              <CountdownTimer targetIso={eventDate.toISOString()} />
            </div>
            <div className="mt-10 text-center">
              <CTAButton href="/register">Reserve Your Place</CTAButton>
              <p className="mt-4 font-alt text-xs tracking-[0.2em] text-charcoal/50 uppercase">
                Free to attend · Limited by space, not by price
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-warm-lg">
              <Image
                src={IMAGES.editorialCake}
                alt="Editorial cake artistry"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <SectionHeading
              align="left"
              eyebrow="About the Event"
              title="Wedding season is here — and the cake finally takes centre stage."
            />
            <div className="mt-8 space-y-5 leading-relaxed text-charcoal/75">
              <p>
                Most people spend months planning décor, flowers and outfits
                while treating the cake as an afterthought.{" "}
                <em className="font-serif-alt text-lg text-bronze">
                  Cake Runway changes that.
                </em>
              </p>
              <p>
                Cake Runway is not simply an event. It is a curated celebration
                of cake artistry, design and luxury experiences that inspires
                the future of weddings in Uganda — bringing together the top
                wedding planners, cake makers and industry creatives for an
                unforgettable showcase of creativity, elegance and culture.
              </p>
              <p className="font-serif-alt text-xl text-charcoal italic">
                From the first impression to the final bite, every detail is
                intentional.
              </p>
            </div>
            <div className="mt-10">
              <CTAButton href="/about" variant="outline">
                View Event Details
              </CTAButton>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="gold-hairline mx-auto max-w-5xl" />

      {/* Why Attend */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Why Attend"
              title="An afternoon of artistry, taste and connection"
              intro="Eight reasons to be in the room where cake becomes the moment."
            />
          </Reveal>
          <RevealStagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_ATTEND.map((item, i) => (
              <RevealItem key={item.title}>
                <div className="group h-full rounded-2xl border border-gold/20 bg-ivory p-8 shadow-warm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-lg">
                  <span className="font-serif-alt text-sm tracking-[0.3em] text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-xl text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                    {item.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <div className="gold-hairline mx-auto max-w-5xl" />

      {/* Featured Experiences */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Featured Experiences"
              title="Curated moments across the residence"
              intro="Ten experiences woven through the day — each one styled, tasted and photographed."
            />
          </Reveal>
          <RevealStagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EXPERIENCES.slice(0, 6).map((exp) => (
              <RevealItem key={exp.title}>
                <div className="group h-full rounded-2xl border border-gold/20 bg-ivory p-8 shadow-warm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-lg">
                  <Crown
                    size={22}
                    strokeWidth={1.25}
                    className="text-gold transition-transform duration-300 group-hover:scale-110"
                  />
                  <h3 className="mt-4 font-display text-xl text-charcoal">
                    {exp.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                    {exp.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
          <div className="mt-12 text-center">
            <CTAButton href="/experiences" variant="outline">
              View All Ten Experiences
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Perfect For"
              title="The people shaping tomorrow's celebrations"
              intro="A carefully curated audience of individuals actively investing in life's most meaningful moments."
            />
          </Reveal>
          <RevealStagger className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {AUDIENCE.map((label, i) => {
              const Icon = AUDIENCE_ICONS[i] ?? Flower2;
              return (
                <RevealItem key={label}>
                  <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-gold/20 bg-ivory px-4 py-8 text-center shadow-warm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-lg">
                    <Icon size={26} strokeWidth={1.25} className="text-gold" />
                    <p className="font-alt text-sm font-medium text-charcoal">
                      {label}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      {/* Baileys teaser */}
      <section className="relative overflow-hidden py-28">
        <Image
          src={IMAGES.baileysPairing}
          alt="Baileys cake pairing experience"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/65" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-ivory">
          <Reveal>
            <GlassWater size={30} strokeWidth={1.25} className="mx-auto text-champagne" />
            <p className="eyebrow mt-6 text-champagne">The Perfect Pairing</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              The Baileys Experience Lounge
            </h2>
            <p className="mt-6 font-serif-alt text-xl text-champagne/90 italic">
              From the first welcome drink to the final toast — signature
              cocktails, luxury cake pairings and interactive tastings, made
              for celebration.
            </p>
            <div className="mt-10">
              <CTAButton href="/baileys">Explore the Pairing Experience</CTAButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vendor teaser */}
      <section className="bg-cream py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Vendor Opportunities"
              title="Put your brand on the runway"
              intro="Cake designers, florists, photographers, luxury hotels — join a curated marketplace in front of the audience that books."
            />
            <div className="mt-10 flex flex-wrap gap-4">
              <CTAButton href="/vendors">Apply as a Vendor</CTAButton>
              <CTAButton href="/vendors" variant="ghost">
                See Who We&apos;re Looking For
              </CTAButton>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-warm-lg">
              <Image
                src={IMAGES.weddingTable}
                alt="Wedding vendor showcase table"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <Camera size={26} strokeWidth={1.25} className="mx-auto text-gold" />
            <h2 className="mt-6 font-display text-4xl text-charcoal md:text-5xl">
              See you at Cake Runway
            </h2>
            <p className="mt-5 font-serif-alt text-xl text-charcoal/70 italic">
              Together, we will celebrate craftsmanship, thoughtful luxury and
              life&apos;s sweetest moments.
            </p>
            <div className="mt-10">
              <CTAButton href="/register">Register Now</CTAButton>
            </div>
            <p className="mt-6 font-alt text-xs tracking-[0.25em] text-charcoal/50 uppercase">
              Free to attend ·{" "}
              <Link href="/register" className="underline decoration-gold underline-offset-4">
                RSVP required
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mobile-only sticky register bar — the envelope overlay (z-50) sits above it */}
      <div className="fixed inset-x-4 bottom-4 z-30 md:hidden">
        <CTAButton href="/register" className="w-full shadow-warm-lg">
          Register Now — It&apos;s Free
        </CTAButton>
      </div>
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}
