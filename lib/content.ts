// Event photography — Luxury Cake Showcase.
export const IMAGES = {
  heroCake:
    "https://res.cloudinary.com/df3lhzzy7/image/upload/v1784328765/IMG-20260716-WA0047_gsggoe.jpg",
  showpieceCake:
    "https://res.cloudinary.com/df3lhzzy7/image/upload/v1784330291/IMG-20260718-WA0002_b98uzp.jpg",
} as const;

export const VIDEOS = {
  hero: "https://res.cloudinary.com/df3lhzzy7/video/upload/v1784351353/IMG_8973_adlfpo.mov",
} as const;

export const EVENT = {
  name: "Pastry Quin Cake Runway",
  tagline: "A Luxury Showcase of Cake Artistry",
  motto: "Where cake becomes the moment.",
  presenter: "Pastry Quin",
  partnerLine: "Official Partner — Baileys",
  venue: "Serena Hotel Kigo",
  venueRegion: "Entebbe, Uganda",
  saveTheDate: "3rd August 2026",
  gatesNote: "Gates close at 2 PM",
  contactPhone: "0760856437",
  rsvpDeadline: "25th July",
  // Shown on the invitation's final screen — edit freely.
  websiteLabel: "Visit Our Website",
} as const;

export const DRESS_CODE = {
  eyebrow: "What To Wear",
  title: "Dress the part",
  intro:
    "This is a runway, not a garden party. Think tailored silhouettes, rich jewel tones, and a touch of drama — dressing that photographs as beautifully as the cakes.",
  categories: [
    {
      label: "Cocktail Chic",
      description: "Sharp tailoring, statement fabrics, elevated separates.",
    },
    {
      label: "Editorial Edge",
      description: "Bold color, directional accessories, confident silhouettes.",
    },
  ],
} as const;

export const REASONS = [
  "Couture cakes, one artist's vision",
  "A runway format never seen before",
  "Premium tastings and signature pairings",
  "An evening styled down to the last detail",
] as const;
