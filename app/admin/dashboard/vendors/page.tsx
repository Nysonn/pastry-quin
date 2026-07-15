import { format } from "date-fns";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { Download, Search } from "lucide-react";
import { db } from "@/lib/db";
import { vendorApplications } from "@/lib/db/schema";
import { VENDOR_CATEGORIES } from "@/lib/validation/vendor";
import { setVendorStatus } from "../actions";

const inputClass =
  "rounded-xl border border-gold/30 bg-ivory px-4 py-2.5 font-alt text-sm text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

export default async function VendorsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string }>;
}) {
  const { q, category, status } = await searchParams;

  const filters: SQL[] = [];
  if (q) {
    const match = or(
      ilike(vendorApplications.businessName, `%${q}%`),
      ilike(vendorApplications.contactName, `%${q}%`),
      ilike(vendorApplications.email, `%${q}%`)
    );
    if (match) filters.push(match);
  }
  if (category) filters.push(eq(vendorApplications.vendorCategory, category));
  if (status) filters.push(eq(vendorApplications.status, status));

  const rows = await db
    .select()
    .from(vendorApplications)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(vendorApplications.createdAt));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-charcoal">
            Vendor Applications
          </h1>
          <p className="mt-1 font-alt text-sm text-charcoal/60">
            {rows.length} application{rows.length === 1 ? "" : "s"} in view
          </p>
        </div>
        <a
          href="/api/admin/export?table=vendors"
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
            placeholder="Search business, contact or email"
            className={`${inputClass} pl-10`}
          />
        </div>
        <select name="category" defaultValue={category ?? ""} className={inputClass}>
          <option value="">All categories</option>
          {VENDOR_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? ""} className={inputClass}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          type="submit"
          className="rounded-full border border-gold px-6 py-2.5 font-alt text-xs font-semibold tracking-widest text-bronze uppercase transition-colors hover:bg-gold hover:text-ivory"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold/20 bg-ivory shadow-warm">
        <table className="w-full min-w-[960px] text-left">
          <thead>
            <tr className="border-b border-gold/20 font-alt text-xs font-semibold tracking-widest text-bronze uppercase">
              <th className="px-5 py-4">Business</th>
              <th className="px-5 py-4">Contact</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Links</th>
              <th className="px-5 py-4">Applied</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10 font-alt text-sm text-charcoal">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-charcoal/50"
                >
                  No applications match these filters.
                </td>
              </tr>
            )}
            {rows.map((v) => (
              <tr key={v.id} className="align-top">
                <td className="px-5 py-4 font-medium">
                  {v.businessName}
                  {v.message && (
                    <p className="mt-1 max-w-[260px] text-xs font-normal text-charcoal/50">
                      “{v.message}”
                    </p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <p>{v.contactName}</p>
                  <p className="text-xs text-charcoal/50">{v.email}</p>
                  {v.phone && <p className="text-xs text-charcoal/50">{v.phone}</p>}
                </td>
                <td className="px-5 py-4">{v.vendorCategory}</td>
                <td className="px-5 py-4 max-w-[180px] break-words text-xs text-charcoal/60">
                  {v.websiteOrInstagram || "—"}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-charcoal/60">
                  {format(v.createdAt, "d MMM yyyy, HH:mm")}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold tracking-widest uppercase ${
                      v.status === "approved"
                        ? "bg-gold/20 text-bronze"
                        : v.status === "rejected"
                          ? "bg-rose-gold/15 text-rose-gold"
                          : "bg-champagne text-bronze"
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-2">
                    {v.status !== "approved" && (
                      <form action={setVendorStatus}>
                        <input type="hidden" name="id" value={v.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-bronze underline decoration-gold underline-offset-4 hover:text-gold"
                        >
                          Approve
                        </button>
                      </form>
                    )}
                    {v.status !== "rejected" && (
                      <form action={setVendorStatus}>
                        <input type="hidden" name="id" value={v.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-rose-gold underline decoration-rose-gold/50 underline-offset-4 hover:opacity-70"
                        >
                          Reject
                        </button>
                      </form>
                    )}
                    {v.status !== "pending" && (
                      <form action={setVendorStatus}>
                        <input type="hidden" name="id" value={v.id} />
                        <input type="hidden" name="status" value="pending" />
                        <button
                          type="submit"
                          className="text-xs text-charcoal/50 underline underline-offset-4 hover:text-charcoal"
                        >
                          Mark pending
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
