import { z } from "zod";

export const VENDOR_CATEGORIES = [
  "Cake Designer",
  "Pastry Chef",
  "Wedding Decor Company",
  "Florist",
  "Photographer",
  "Bridal Designer",
  "Jewelry Brand",
  "Luxury Hotel",
  "Event Planner",
  "Beverage Company",
  "Lifestyle Brand",
] as const;

export const vendorSchema = z.object({
  businessName: z
    .string()
    .min(2, "Please tell us your business name (at least 2 characters)."),
  contactName: z
    .string()
    .min(2, "Please tell us who we should speak to (at least 2 characters)."),
  email: z.email("That email looks incomplete — please check it."),
  phone: z.string().max(30).optional().or(z.literal("")),
  vendorCategory: z.enum(VENDOR_CATEGORIES, {
    error: "Please choose the category that best fits your business.",
  }),
  websiteOrInstagram: z.string().max(200).optional().or(z.literal("")),
  message: z
    .string()
    .max(1000, "Please keep your message under 1000 characters.")
    .optional()
    .or(z.literal("")),
});

export type VendorInput = z.infer<typeof vendorSchema>;
