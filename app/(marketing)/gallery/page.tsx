import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import GalleryGrid from "@/components/marketing/GalleryGrid";
import { GALLERY } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Wedding inspiration, cake installations and styling displays from the world of Pastry Quin Cake Runway.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <SectionHeading
              eyebrow="Gallery"
              title="Wedding inspiration & cake installations"
              intro="A first look at the world of Cake Runway. Real event photography will replace these editorial placeholders."
            />
          </Reveal>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <GalleryGrid images={[...GALLERY]} />
        </div>
      </section>
    </>
  );
}
