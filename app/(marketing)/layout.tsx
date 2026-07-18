import SiteHeader from "@/components/marketing/SiteHeader";
import EnvelopeIntro from "@/components/marketing/EnvelopeIntro";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <EnvelopeIntro />
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}
