// Placeholder imagery — swap these URLs for real event photography when supplied.
export const IMAGES = {
  heroRunway:
    "https://res.cloudinary.com/df3lhzzy7/image/upload/v1784149298/pexels-newman-photographs-234743505-29891256_yzfosc.jpg",
  editorialCake:
    "https://res.cloudinary.com/df3lhzzy7/image/upload/v1784149298/pexels-efiyo-pictures-1524359565-28209083_w5pmdo.jpg",
  baileysPairing:
    "https://res.cloudinary.com/df3lhzzy7/image/upload/v1784149297/pexels-caleboquendo-3051569_q9cnbp.jpg",
  weddingTable:
    "https://res.cloudinary.com/df3lhzzy7/image/upload/v1784149297/pexels-123396134-9941146_oqq6kg.jpg",
} as const;

export const EVENT = {
  name: "Pastry Quin Cake Runway",
  tagline: "A Celebration of Cake Artistry",
  motto: "Where cake becomes the moment.",
  presenter: "Pastry Quin",
  partner: "Baileys Irish Cream",
  partnerLine: "Official Beverage Partner — Baileys · Made for Celebration",
  dateLabel: "3rd August",
  venue: "White Cake Residence",
} as const;

export const WHY_ATTEND = [
  {
    title: "Discover Luxury Cakes",
    description:
      "Walk among couture-level cakes crafted by Uganda's finest artists — each one a statement piece.",
  },
  {
    title: "Meet Top Cake Artists",
    description:
      "Speak directly with the designers behind the showpieces and commission the cake of your dreams.",
  },
  {
    title: "Runway Cake Presentations",
    description:
      "Watch cakes take the runway in a first-of-its-kind fashion-show format.",
  },
  {
    title: "Network with Wedding Vendors",
    description:
      "Meet planners, florists, photographers and stylists shaping tomorrow's celebrations.",
  },
  {
    title: "Taste Premium Desserts",
    description:
      "Sample refined desserts and patisserie from curated tasting stations throughout the residence.",
  },
  {
    title: "Wedding Inspiration",
    description:
      "Gather ideas from styled installations designed around the season's most beautiful weddings.",
  },
  {
    title: "Baileys Tasting Lounge",
    description:
      "Unwind in the Baileys Experience Lounge with signature pairings and cocktails.",
  },
  {
    title: "Beautiful Photo Moments",
    description:
      "Capture editorial-worthy moments at styled sets designed to be photographed.",
  },
] as const;

export const EXPERIENCES = [
  {
    title: "Luxury Cake Runway",
    description:
      "The signature showcase — couture cakes presented down the runway like fashion pieces.",
  },
  {
    title: "Cake Installations",
    description:
      "Large-scale sculptural cake displays staged throughout the residence.",
  },
  {
    title: "Wedding Inspiration Gallery",
    description:
      "A curated gallery of tablescapes, florals and styling for the season ahead.",
  },
  {
    title: "Dessert Showcase",
    description:
      "A parade of patisserie — from delicate petit fours to show-stopping centrepieces.",
  },
  {
    title: "Baileys Experience Lounge",
    description:
      "Signature welcome drinks, cocktails and cake pairings from our official partner.",
  },
  {
    title: "Live Demonstrations",
    description:
      "Watch master cake artists pipe, sculpt and finish pieces before your eyes.",
  },
  {
    title: "Networking Lounge",
    description:
      "A relaxed space to meet planners, creatives and industry leaders.",
  },
  {
    title: "Photo Booth",
    description:
      "A styled editorial set for portraits worth framing — and sharing.",
  },
  {
    title: "Luxury Styling Displays",
    description:
      "Fashion, jewellery and décor styling moments woven through the event.",
  },
  {
    title: "Vendor Marketplace",
    description:
      "Discover and book the vendors behind everything you fall in love with.",
  },
] as const;

export const AUDIENCE = [
  "Brides",
  "Grooms",
  "Wedding Planners",
  "Cake Designers",
  "Event Planners",
  "Luxury Brands",
  "Hospitality Professionals",
  "Food Lovers",
  "Lifestyle Influencers",
  "Corporate Clients",
] as const;

export const BAILEYS_PAIRINGS = [
  {
    title: "Luxury Cake Pairings",
    description:
      "Signature cakes matched to Baileys serves that draw out cream, cocoa and caramel notes.",
  },
  {
    title: "Dessert Tasting",
    description:
      "Guided tastings through a flight of desserts built around the Baileys flavour profile.",
  },
  {
    title: "Signature Cocktails",
    description:
      "Baileys Original on the rocks, espresso martinis and made-for-celebration serves.",
  },
  {
    title: "Premium Dessert Stations",
    description:
      "Styled stations pairing patisserie with perfectly poured Baileys moments.",
  },
  {
    title: "Interactive Tasting Sessions",
    description:
      "Hands-on sessions where you build and taste your own cake-and-Baileys pairing.",
  },
] as const;

export const VENDOR_TARGETS = [
  "Cake Designers",
  "Pastry Chefs",
  "Wedding Decor Companies",
  "Florists",
  "Photographers",
  "Bridal Designers",
  "Jewelry Brands",
  "Luxury Hotels",
  "Event Planners",
  "Beverage Companies",
  "Lifestyle Brands",
] as const;

export const VENDOR_BENEFITS = [
  {
    title: "A Premium, Curated Audience",
    description:
      "Brides, grooms, planners and high-spending consumers actively investing in celebrations.",
  },
  {
    title: "Wedding Season Positioning",
    description:
      "Meet clients at the exact moment they are planning and booking.",
  },
  {
    title: "Luxury Brand Alignment",
    description:
      "Show your work alongside Baileys and Uganda's leading event creatives.",
  },
  {
    title: "High-Value Content Moments",
    description:
      "Styled, photographed and shared — your brand becomes part of the story.",
  },
  {
    title: "Lasting Brand Visibility",
    description:
      "Impressions that live on long after the final toast, across social and press.",
  },
  {
    title: "Meaningful Connections",
    description:
      "Real conversations with the people creating tomorrow's most beautiful moments.",
  },
] as const;

export const GALLERY = [
  { src: IMAGES.heroRunway, alt: "Luxury cake runway presentation" },
  { src: IMAGES.editorialCake, alt: "Editorial cake styling" },
  { src: IMAGES.baileysPairing, alt: "Baileys dessert pairing" },
  { src: IMAGES.weddingTable, alt: "Wedding inspiration tablescape" },
  { src: IMAGES.editorialCake, alt: "Cake installation detail" },
  { src: IMAGES.weddingTable, alt: "Styled reception table" },
  { src: IMAGES.baileysPairing, alt: "Signature cocktail moment" },
  { src: IMAGES.heroRunway, alt: "Runway cake showcase" },
] as const;
