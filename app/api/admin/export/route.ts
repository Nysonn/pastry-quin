import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { registrations, vendorApplications } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = value instanceof Date ? value.toISOString() : String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replaceAll('"', '""')}"`;
  return str;
}

function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(row.map(csvEscape).join(","));
  }
  return lines.join("\r\n");
}

export async function GET(request: Request) {
  // The proxy already guards /api/admin/*; this is defense in depth.
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const table = new URL(request.url).searchParams.get("table");

  if (table === "registrations") {
    const rows = await db
      .select()
      .from(registrations)
      .orderBy(desc(registrations.createdAt));
    const csv = toCsv(
      [
        "Full Name",
        "Email",
        "Phone",
        "Guest Type",
        "Number of Guests",
        "Heard About Us",
        "Notes",
        "Status",
        "Registered At",
      ],
      rows.map((r) => [
        r.fullName,
        r.email,
        r.phone,
        r.guestType,
        r.numberOfGuests,
        r.hearAboutUs,
        r.notes,
        r.status,
        r.createdAt,
      ])
    );
    return csvResponse(csv, "cake-runway-registrations.csv");
  }

  if (table === "vendors") {
    const rows = await db
      .select()
      .from(vendorApplications)
      .orderBy(desc(vendorApplications.createdAt));
    const csv = toCsv(
      [
        "Business Name",
        "Contact Name",
        "Email",
        "Phone",
        "Category",
        "Website / Instagram",
        "Message",
        "Status",
        "Applied At",
      ],
      rows.map((v) => [
        v.businessName,
        v.contactName,
        v.email,
        v.phone,
        v.vendorCategory,
        v.websiteOrInstagram,
        v.message,
        v.status,
        v.createdAt,
      ])
    );
    return csvResponse(csv, "cake-runway-vendor-applications.csv");
  }

  return Response.json(
    { error: "Unknown table — use ?table=registrations or ?table=vendors" },
    { status: 400 }
  );
}

function csvResponse(csv: string, filename: string) {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
