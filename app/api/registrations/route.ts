import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import { getEventSettings } from "@/lib/db/queries";
import { registrationSchema } from "@/lib/validation/registration";

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

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }

  const settings = await getEventSettings();
  if (!settings.registrationOpen) {
    return NextResponse.json(
      {
        error:
          "RSVPs for Cake Runway are currently closed. Follow @pastryquin for updates.",
      },
      { status: 403 }
    );
  }

  const data = parsed.data;
  try {
    await db.insert(registrations).values({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || null,
      guestType: data.guestType || null,
      numberOfGuests: data.numberOfGuests ?? 1,
      hearAboutUs: data.hearAboutUs || null,
      notes: data.notes || null,
    });
  } catch (error) {
    console.error("Failed to insert registration:", error);
    return NextResponse.json(
      { error: "We couldn't save your RSVP — please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
