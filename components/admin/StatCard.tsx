import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-ivory p-6 shadow-warm">
      <div className="flex items-center justify-between">
        <p className="font-alt text-xs font-semibold tracking-widest text-bronze uppercase">
          {label}
        </p>
        <Icon size={18} strokeWidth={1.5} className="text-gold" />
      </div>
      <p className="mt-4 font-display text-4xl text-charcoal tabular-nums">
        {value}
      </p>
      {detail && (
        <p className="mt-1 font-alt text-xs text-charcoal/50">{detail}</p>
      )}
    </div>
  );
}
