import { z } from "zod";

export const GUEST_TYPES = [
  "Cake Enthusiast",
  "Cake Designer",
  "Pastry Professional",
  "Event Planner",
  "Luxury Brand",
  "Hospitality Professional",
  "Food Lover",
  "Lifestyle Influencer",
  "Corporate Client",
  "Media & Press",
] as const;

export const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please tell us your full name (at least 2 characters)."),
  email: z.email("That email looks incomplete — please check it."),
  phone: z.string().max(30).optional().or(z.literal("")),
  guestType: z.enum(GUEST_TYPES).optional(),
  numberOfGuests: z.coerce
    .number<number>()
    .int("Guests must be a whole number.")
    .min(1, "You are at least one guest!")
    .max(10, "For parties larger than 10, please contact us directly."),
  hearAboutUs: z.string().max(200).optional().or(z.literal("")),
  notes: z
    .string()
    .max(500, "Please keep notes under 500 characters.")
    .optional()
    .or(z.literal("")),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
