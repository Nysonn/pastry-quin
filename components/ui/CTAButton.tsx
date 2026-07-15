import Link from "next/link";

type Variant = "solid" | "outline" | "ghost";

const styles: Record<Variant, string> = {
  solid:
    "bg-gold text-ivory hover:bg-bronze shadow-warm border border-transparent",
  outline:
    "border border-gold text-charcoal hover:bg-gold hover:text-ivory bg-transparent",
  ghost: "text-bronze hover:text-charcoal border border-transparent",
};

export default function CTAButton({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`shimmer-sweep inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-alt text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:-translate-y-0.5 ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
