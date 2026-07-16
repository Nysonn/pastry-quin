import Link from "next/link";
import { differenceInCalendarDays, format } from "date-fns";
import { desc, sql } from "drizzle-orm";
import {
  CalendarDays,
  ClipboardCheck,
  UserCheck,
  Users,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import { getEventSettings } from "@/lib/db/queries";

export default async function AdminOverviewPage() {
  const [settings, regStats, recentRegs] = await Promise.all([
    getEventSettings(),
    db
      .select({
        total: sql<number>`count(*)::int`,
        guests: sql<number>`coalesce(sum(${registrations.numberOfGuests}), 0)::int`,
        confirmed: sql<number>`count(*) filter (where ${registrations.status} = 'confirmed')::int`,
      })
      .from(registrations),
    db
      .select()
      .from(registrations)
      .orderBy(desc(registrations.createdAt))
      .limit(8),
  ]);

  const reg = regStats[0];
  const daysToEvent = differenceInCalendarDays(settings.eventDate, new Date());

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal">Overview</h1>
      <p className="mt-1 font-serif-alt text-charcoal/60 italic">
        {settings.eventName} · {format(settings.eventDate, "do MMMM yyyy")} ·
        RSVP {settings.registrationOpen ? "open" : "closed"}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="RSVPs"
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
          label="Days Until Event"
          value={daysToEvent >= 0 ? daysToEvent : "—"}
          detail={daysToEvent < 0 ? "Event date has passed" : undefined}
          icon={CalendarDays}
        />
      </div>

      <div className="mt-10">
        <section className="rounded-2xl border border-gold/20 bg-ivory p-6 shadow-warm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-charcoal">Latest RSVPs</h2>
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
                No RSVPs yet.
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
      </div>

      <div className="mt-10 rounded-2xl border border-gold/20 bg-ivory p-6 shadow-warm">
        <div className="flex items-center gap-3">
          <UserCheck size={18} strokeWidth={1.5} className="text-gold" />
          <p className="font-alt text-sm text-charcoal/70">
            Everyone who RSVPs through the public site appears here instantly —
            check{" "}
            <Link
              href="/admin/dashboard/registrations"
              className="font-semibold text-bronze underline decoration-gold underline-offset-4"
            >
              RSVPs
            </Link>{" "}
            for the full list with search, filters and CSV export.
          </p>
        </div>
      </div>
    </div>
  );
}
