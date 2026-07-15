import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import { adminUsers, eventSettings } from "../lib/db/schema";

// Override via ADMIN_EMAIL / ADMIN_PASSWORD in .env.local (never commit real values)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@pastryquin.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "RfF5QS7kpTMF80zXXyAjyUEy";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const settings = await db.select().from(eventSettings);
  if (settings.length === 0) {
    await db.insert(eventSettings).values({
      eventName: "Pastry Quin Cake Runway",
      tagline: "A Celebration of Cake Artistry",
      eventDate: new Date("2026-08-03T14:00:00+03:00"),
      venue: "White Cake Residence",
      registrationOpen: true,
    });
    console.log("Seeded event_settings");
  } else {
    console.log("event_settings already present, skipping");
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await db
    .insert(adminUsers)
    .values({
      email: ADMIN_EMAIL,
      passwordHash,
      fullName: "Pastry Quin Admin",
      role: "admin",
    })
    .onConflictDoNothing({ target: adminUsers.email });
  console.log(`Seeded admin user: ${ADMIN_EMAIL}`);
}

main().then(() => process.exit(0));
