import Image from "next/image";
import { Sparkles } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import ParallaxImage from "@/components/ui/ParallaxImage";
import ParallaxVideo from "@/components/ui/ParallaxVideo";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import CountdownTimer from "@/components/marketing/CountdownTimer";
import ScrollCue from "@/components/marketing/ScrollCue";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { getEventSettings } from "@/lib/db/queries";
import { DRESS_CODE, DRESS_CODE_IMAGES, EVENT, IMAGES, REASONS, VIDEOS } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getEventSettings();
  const eventDate = settings.eventDate;

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[72svh] items-center justify-center overflow-hidden md:min-h-[100vh]">
        <ParallaxVideo
          src={VIDEOS.hero}
          overlayClassName="bg-gradient-to-b from-charcoal/80 via-charcoal/45 to-charcoal/85"
        />
        {/* Vignette for edge focus */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 45%, rgba(27,43,34,0.55) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-16 text-center text-ivory sm:px-10 md:pt-32 md:pb-20">
          <RevealStagger staggerDelay={0.3}>
            <RevealItem>
              <p className="flex items-center justify-center gap-4 font-serif-alt text-[0.65rem] tracking-[0.45em] text-champagne uppercase sm:text-sm">
                <span className="hidden h-px w-10 bg-gold/60 sm:block" />
                {EVENT.presenter} presents
                <span className="hidden h-px w-10 bg-gold/60 sm:block" />
              </p>
            </RevealItem>
            <RevealItem>
              <h1 className="mt-5 font-display text-6xl leading-[0.95] sm:text-7xl md:mt-7 md:text-8xl lg:text-9xl">
                Cake{" "}
                <em className="text-champagne italic">Runway</em>
              </h1>
            </RevealItem>
            <RevealItem>
              <p className="mt-6 font-serif-alt text-lg text-champagne/95 italic sm:text-2xl">
                {EVENT.tagline}
              </p>
            </RevealItem>
            <RevealItem>
              <div className="mt-10 flex justify-center md:mt-12">
                <CTAButton
                  href="#about"
                  variant="outline"
                  className="w-full max-w-xs border-champagne/70 bg-charcoal/25 text-ivory backdrop-blur-sm hover:bg-champagne/15 hover:text-ivory sm:w-auto"
                >
                  Discover More
                </CTAButton>
              </div>
            </RevealItem>
          </RevealStagger>
        </div>

        <div className="absolute inset-x-0 bottom-8 z-10 hidden justify-center md:flex md:bottom-12">
          <ScrollCue />
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative scroll-mt-24 overflow-hidden py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(183,201,173,0.35), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(226,168,147,0.28), transparent 70%)" }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <Reveal>
            <TiltCard>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-warm-lg">
                <Image
                  src={IMAGES.showpieceCake}
                  alt="Cake craftsmanship, up close"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </TiltCard>
          </Reveal>
          <Reveal delay={0.15}>
            <SectionHeading
              align="left"
              eyebrow="The Showcase"
              title="Cake, finally treated as couture."
            />
            <div className="mt-8 space-y-5 leading-relaxed text-charcoal/75">
              <p>
                One evening. One artist. A showcase of cakes on a
                runway —{" "}
                <em className="font-serif-alt text-lg text-bronze">
                  crafted to be seen, styled to be tasted.
                </em>
              </p>
              <p className="font-serif-alt text-xl text-charcoal italic">
                From the first impression to the final bite, every detail is
                intentional.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="gold-hairline mx-auto max-w-5xl" />

      {/* Dress Code */}
      <section id="dress-code" className="relative scroll-mt-24 overflow-hidden bg-cream py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/3 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(183,201,173,0.28), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(226,168,147,0.3), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading eyebrow={DRESS_CODE.eyebrow} title={DRESS_CODE.title} />
            <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-charcoal/75">
              {DRESS_CODE.intro}
            </p>
          </Reveal>

          <RevealStagger className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-2" staggerDelay={0.15}>
            {DRESS_CODE_IMAGES.map((src) => (
              <RevealItem key={src}>
                <TiltCard>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-warm-lg">
                    <Image
                      src={src}
                      alt="Dress code inspiration"
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="relative scroll-mt-24 overflow-hidden py-24">
        <ParallaxImage
          src={IMAGES.showpieceCake}
          alt=""
          overlayClassName="bg-charcoal/80"
        />
        <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-14 px-6 lg:grid-cols-[2fr_3fr]">
          <Reveal>
            <div className="text-ivory">
              <Sparkles size={26} strokeWidth={1.25} className="text-gold" />
              <p className="eyebrow mt-6 text-champagne">Your invitation</p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
                Take your seat at the runway
              </h2>
              <ul className="mt-8 space-y-4">
                {REASONS.map((reason) => (
                  <li key={reason} className="flex items-start gap-3">
                    <span className="mt-2.5 h-px w-6 shrink-0 bg-gold" />
                    <span className="font-serif-alt text-lg text-champagne/90 italic">
                      {reason}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 font-alt text-xs tracking-[0.25em] text-champagne/70 uppercase">
                Free to attend · RSVP required
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-gold/20 bg-ivory p-6 shadow-warm-lg sm:p-10">
              <RegistrationForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Countdown — closing section of the page */}
      <section className="bg-charcoal py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <p className="eyebrow text-center text-champagne">The runway opens in</p>
            <div className="mt-10">
              <CountdownTimer targetIso={eventDate.toISOString()} variant="dark" />
            </div>
            <div className="mt-10 text-center">
              <CTAButton href="#rsvp">Reserve Your Place</CTAButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mobile-only sticky RSVP bar — the intro overlay (z-50) sits above it */}
      <div className="fixed inset-x-4 bottom-4 z-30 md:hidden">
        <CTAButton href="#rsvp" className="w-full shadow-warm-lg">
          RSVP — It&apos;s Free
        </CTAButton>
      </div>
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}
