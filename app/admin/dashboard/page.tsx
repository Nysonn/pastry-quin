import Link from "next/link";
import { differenceInCalendarDays, format } from "date-fns";
import { desc, sql } from "drizzle-orm";
import {
  CalendarDays,
  ClipboardCheck,
  Store,
  UserCheck,
  Users,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { db } from "@/lib/db";
import { registrations, vendorApplications } from "@/lib/db/schema";
import { getEventSettings } from "@/lib/db/queries";

export default async function AdminOverviewPage() {
  const [settings, regStats, vendorStats, recentRegs, recentVendors] =
    await Promise.all([
      getEventSettings(),
      db
        .select({
          total: sql<number>`count(*)::int`,
          guests: sql<number>`coalesce(sum(${registrations.numberOfGuests}), 0)::int`,
          confirmed: sql<number>`count(*) filter (where ${registrations.status} = 'confirmed')::int`,
        })
        .from(registrations),
      db
        .select({
          total: sql<number>`count(*)::int`,
          pending: sql<number>`count(*) filter (where ${vendorApplications.status} = 'pending')::int`,
          approved: sql<number>`count(*) filter (where ${vendorApplications.status} = 'approved')::int`,
          rejected: sql<number>`count(*) filter (where ${vendorApplications.status} = 'rejected')::int`,
        })
        .from(vendorApplications),
      db
        .select()
        .from(registrations)
        .orderBy(desc(registrations.createdAt))
        .limit(5),
      db
        .select()
        .from(vendorApplications)
        .orderBy(desc(vendorApplications.createdAt))
        .limit(5),
    ]);

  const reg = regStats[0];
  const ven = vendorStats[0];
  const daysToEvent = differenceInCalendarDays(settings.eventDate, new Date());

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal">Overview</h1>
      <p className="mt-1 font-serif-alt text-charcoal/60 italic">
        {settings.eventName} · {format(settings.eventDate, "do MMMM yyyy")} ·
        Registration {settings.registrationOpen ? "open" : "closed"}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Registrations"
          value={reg.total}
          detail={`${reg.confirmed} confirmed`}
          icon={ClipboardCheck}
        />
        <StatCard
          label="Total Guests"
          value={reg.guests}
          detail="Sum of party sizes"
          icon={Users}
        />
        <StatCard
          label="Vendor Applications"
          value={ven.total}
          detail={`${ven.pending} pending · ${ven.approved} approved · ${ven.rejected} rejected`}
          icon={Store}
        />
        <StatCard
          label="Days Until Event"
          value={daysToEvent >= 0 ? daysToEvent : "—"}
          detail={daysToEvent < 0 ? "Event date has passed" : undefined}
          icon={CalendarDays}
        />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-2">
        <section className="rounded-2xl border border-gold/20 bg-ivory p-6 shadow-warm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-charcoal">
              Latest Registrations
            </h2>
            <Link
              href="/admin/dashboard/registrations"
              className="font-alt text-xs font-semibold tracking-widest text-bronze uppercase hover:text-gold"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-gold/10">
            {recentRegs.length === 0 && (
              <li className="py-6 text-center font-alt text-sm text-charcoal/50">
                No registrations yet.
              </li>
            )}
            {recentRegs.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-alt text-sm font-medium text-charcoal">
                    {r.fullName}
                  </p>
                  <p className="font-alt text-xs text-charcoal/50">
                    {r.guestType ?? "Guest"} · party of {r.numberOfGuests}
                  </p>
                </div>
                <p className="font-alt text-xs text-charcoal/50">
                  {format(r.createdAt, "d MMM, HH:mm")}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gold/20 bg-ivory p-6 shadow-warm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-charcoal">
              Latest Vendor Applications
            </h2>
            <Link
              href="/admin/dashboard/vendors"
              className="font-alt text-xs font-semibold tracking-widest text-bronze uppercase hover:text-gold"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-gold/10">
            {recentVendors.length === 0 && (
              <li className="py-6 text-center font-alt text-sm text-charcoal/50">
                No vendor applications yet.
              </li>
            )}
            {recentVendors.map((v) => (
              <li key={v.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-alt text-sm font-medium text-charcoal">
                    {v.businessName}
                  </p>
                  <p className="font-alt text-xs text-charcoal/50">
                    {v.vendorCategory}
                  </p>
                </div>
                <StatusBadge status={v.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-10 rounded-2xl border border-gold/20 bg-ivory p-6 shadow-warm">
        <div className="flex items-center gap-3">
          <UserCheck size={18} strokeWidth={1.5} className="text-gold" />
          <p className="font-alt text-sm text-charcoal/70">
            Everyone who signs up through the public site appears here
            instantly — check{" "}
            <Link
              href="/admin/dashboard/registrations"
              className="font-semibold text-bronze underline decoration-gold underline-offset-4"
            >
              Registrations
            </Link>{" "}
            for the full list with search, filters and CSV export.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-champagne text-bronze",
    approved: "bg-gold/20 text-bronze",
    rejected: "bg-rose-gold/15 text-rose-gold",
    confirmed: "bg-gold/20 text-bronze",
    cancelled: "bg-rose-gold/15 text-rose-gold",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 font-alt text-[0.65rem] font-semibold tracking-widest uppercase ${styles[status] ?? "bg-cream text-charcoal/60"}`}
    >
      {status}
    </span>
  );
}
