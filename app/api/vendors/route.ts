import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendorApplications } from "@/lib/db/schema";
import { vendorSchema } from "@/lib/validation/vendor";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We couldn't read that submission — please try again." },
      { status: 400 }
    );
  }

  const parsed = vendorSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  try {
    await db.insert(vendorApplications).values({
      businessName: data.businessName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone || null,
      vendorCategory: data.vendorCategory,
      websiteOrInstagram: data.websiteOrInstagram || null,
      message: data.message || null,
    });
  } catch (error) {
    console.error("Failed to insert vendor application:", error);
    return NextResponse.json(
      { error: "We couldn't save your application — please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
