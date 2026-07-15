export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl md:text-5xl text-charcoal leading-tight">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 font-serif-alt text-xl text-charcoal/70 leading-relaxed">
          {intro}
        </p>
      )}
    </div>
  );
}
