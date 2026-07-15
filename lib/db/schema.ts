import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const eventSettings = pgTable("event_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventName: text("event_name").notNull().default("Pastry Quin Cake Runway"),
  tagline: text("tagline").notNull().default("A Celebration of Cake Artistry"),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  venue: text("venue").notNull().default("White Cake Residence"),
  registrationOpen: boolean("registration_open").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const registrations = pgTable(
  "registrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    guestType: text("guest_type"),
    numberOfGuests: integer("number_of_guests").notNull().default(1),
    hearAboutUs: text("hear_about_us"),
    notes: text("notes"),
    status: text("status").notNull().default("confirmed"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("registrations_email_idx").on(table.email),
    index("registrations_created_at_idx").on(table.createdAt),
  ]
);

export const vendorApplications = pgTable(
  "vendor_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessName: text("business_name").notNull(),
    contactName: text("contact_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    vendorCategory: text("vendor_category").notNull(),
    websiteOrInstagram: text("website_or_instagram"),
    message: text("message"),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("vendor_applications_status_idx").on(table.status),
    index("vendor_applications_created_at_idx").on(table.createdAt),
  ]
);

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name"),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Registration = typeof registrations.$inferSelect;
export type VendorApplication = typeof vendorApplications.$inferSelect;
export type EventSettings = typeof eventSettings.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
