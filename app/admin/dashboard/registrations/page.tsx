import { format } from "date-fns";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { Download, Search } from "lucide-react";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import { GUEST_TYPES } from "@/lib/validation/registration";
import { setRegistrationStatus } from "../actions";

const inputClass =
  "rounded-xl border border-gold/30 bg-ivory px-4 py-2.5 font-alt text-sm text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; guestType?: string; status?: string }>;
}) {
  const { q, guestType, status } = await searchParams;

  const filters: SQL[] = [];
  if (q) {
    const match = or(
      ilike(registrations.fullName, `%${q}%`),
      ilike(registrations.email, `%${q}%`)
    );
    if (match) filters.push(match);
  }
  if (guestType) filters.push(eq(registrations.guestType, guestType));
  if (status) filters.push(eq(registrations.status, status));

  const rows = await db
    .select()
    .from(registrations)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(registrations.createdAt));

  const totalGuests = rows.reduce((sum, r) => sum + r.numberOfGuests, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Registrations</h1>
          <p className="mt-1 font-alt text-sm text-charcoal/60">
            {rows.length} registration{rows.length === 1 ? "" : "s"} ·{" "}
            {totalGuests} guest{totalGuests === 1 ? "" : "s"} in view
          </p>
        </div>
        <a
          href="/api/admin/export?table=registrations"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-alt text-xs font-semibold tracking-widest text-ivory uppercase shadow-warm transition-colors hover:bg-bronze"
        >
          <Download size={15} strokeWidth={1.5} />
          Export CSV
        </a>
      </div>

      <form className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search
            size={15}
            strokeWidth={1.5}
            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-charcoal/40"
          />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name or email"
            className={`${inputClass} pl-10`}
          />
        </div>
        <select name="guestType" defaultValue={guestType ?? ""} className={inputClass}>
          <option value="">All guest types</option>
          {GUEST_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? ""} className={inputClass}>
          <option value="">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          type="submit"
          className="rounded-full border border-gold px-6 py-2.5 font-alt text-xs font-semibold tracking-widest text-bronze uppercase transition-colors hover:bg-gold hover:text-ivory"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold/20 bg-ivory shadow-warm">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-gold/20 font-alt text-xs font-semibold tracking-widest text-bronze uppercase">
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email / Phone</th>
              <th className="px-5 py-4">Guest Type</th>
              <th className="px-5 py-4">Party</th>
              <th className="px-5 py-4">Heard Via</th>
              <th className="px-5 py-4">Registered</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10 font-alt text-sm text-charcoal">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-charcoal/50"
                >
                  No registrations match these filters.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="px-5 py-4 font-medium">
                  {r.fullName}
                  {r.notes && (
                    <p className="mt-1 max-w-[220px] text-xs font-normal text-charcoal/50">
                      “{r.notes}”
                    </p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <p>{r.email}</p>
                  {r.phone && <p className="text-xs text-charcoal/50">{r.phone}</p>}
                </td>
                <td className="px-5 py-4">{r.guestType ?? "—"}</td>
                <td className="px-5 py-4 tabular-nums">{r.numberOfGuests}</td>
                <td className="px-5 py-4">{r.hearAboutUs || "—"}</td>
                <td className="px-5 py-4 whitespace-nowrap text-charcoal/60">
                  {format(r.createdAt, "d MMM yyyy, HH:mm")}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold tracking-widest uppercase ${
                      r.status === "confirmed"
                        ? "bg-gold/20 text-bronze"
                        : "bg-rose-gold/15 text-rose-gold"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <form action={setRegistrationStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={r.status === "confirmed" ? "cancelled" : "confirmed"}
                    />
                    <button
                      type="submit"
                      className="text-xs font-semibold text-bronze underline decoration-gold underline-offset-4 hover:text-gold"
                    >
                      {r.status === "confirmed" ? "Cancel" : "Reconfirm"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
