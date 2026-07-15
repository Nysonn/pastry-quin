"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  eventSettings,
  registrations,
  vendorApplications,
} from "@/lib/db/schema";
import { destroySession, getSession } from "@/lib/auth/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function setRegistrationStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!id || !["confirmed", "cancelled"].includes(status)) return;
  await db
    .update(registrations)
    .set({ status })
    .where(eq(registrations.id, id));
  revalidatePath("/admin/dashboard/registrations");
  revalidatePath("/admin/dashboard");
}

export async function setVendorStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!id || !["pending", "approved", "rejected"].includes(status)) return;
  await db
    .update(vendorApplications)
    .set({ status })
    .where(eq(vendorApplications.id, id));
  revalidatePath("/admin/dashboard/vendors");
  revalidatePath("/admin/dashboard");
}

export type SettingsState = { error: string | null; saved: boolean };

export async function updateEventSettings(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  await requireAdmin();

  const eventName = String(formData.get("eventName") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const eventDateRaw = String(formData.get("eventDate") ?? "");
  const registrationOpen = formData.get("registrationOpen") === "on";

  if (!eventName || !venue || !eventDateRaw) {
    return { error: "Event name, venue and date are all required.", saved: false };
  }
  const eventDate = new Date(eventDateRaw);
  if (Number.isNaN(eventDate.getTime())) {
    return { error: "That date doesn't look valid.", saved: false };
  }

  const [existing] = await db.select().from(eventSettings).limit(1);
  if (existing) {
    await db
      .update(eventSettings)
      .set({
        eventName,
        tagline,
        venue,
        eventDate,
        registrationOpen,
        updatedAt: new Date(),
      })
      .where(eq(eventSettings.id, existing.id));
  } else {
    await db.insert(eventSettings).values({
      eventName,
      tagline,
      venue,
      eventDate,
      registrationOpen,
    });
  }

  revalidatePath("/", "layout");
  return { error: null, saved: true };
}
