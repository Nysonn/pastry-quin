import { db } from "@/lib/db";
import { eventSettings, type EventSettings } from "@/lib/db/schema";

const FALLBACK_SETTINGS: Omit<EventSettings, "id"> = {
  eventName: "Pastry Quin Cake Runway",
  tagline: "A Celebration of Cake Artistry",
  eventDate: new Date("2026-08-03T14:00:00+03:00"),
  venue: "White Cake Residence",
  registrationOpen: true,
  updatedAt: new Date(),
};

export async function getEventSettings(): Promise<
  EventSettings | (Omit<EventSettings, "id"> & { id: null })
> {
  try {
    const rows = await db.select().from(eventSettings).limit(1);
    if (rows[0]) return rows[0];
  } catch (error) {
    console.error("Failed to load event settings, using fallback:", error);
  }
  return { ...FALLBACK_SETTINGS, id: null };
}
