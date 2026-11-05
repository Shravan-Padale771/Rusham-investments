/**
 * Editable business information.
 * Leave a value as an empty string until the real, verified detail is available —
 * empty values are simply hidden across the website (nothing is invented).
 */
export const site = {
  name: "Rusham Investment",
  shortName: "Rusham",
  url: "https://rushaminvestment.in",
  description:
    "Rusham Investment offers thoughtful financial planning, mutual fund guidance and disciplined investment education to help you build, protect and grow your wealth with confidence.",
  tagline: "Thoughtful financial guidance for a more confident tomorrow.",

  contact: {
    email: "", // e.g. "hello@rushaminvestment.in"
    phone: "", // e.g. "+91 00000 00000"
    address: "", // full office address
    hours: "", // e.g. "Mon – Sat, 10:00 AM – 6:00 PM"
  } as { email: string; phone: string; address: string; hours: string },

  social: {
    linkedin: "",
    instagram: "",
    facebook: "",
    x: "",
    youtube: "",
  } as Record<string, string>,

  /**
   * Regulatory disclosures (e.g. AMFI ARN, SEBI registration, IRDAI).
   * Add ONLY after verification — they are displayed in the footer when present.
   * Example: ["AMFI-registered Mutual Fund Distributor — ARN-XXXXX"]
   */
  regulatoryDisclosures: [] as string[],

  riskDisclaimer:
    "Investments in securities market are subject to market risks. Read all related documents carefully before investing.",

  /** Media assets */
  media: {
    videoDesktop: "/videos/coins-optimized.mp4",
    videoMobile: "/videos/coins-mobile.mp4",
    poster: "/images/hero-poster.webp",
  },
} as const;

export type SiteConfig = typeof site;
