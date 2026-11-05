import { DM_Sans, DM_Serif_Display, Manrope } from "next/font/google";

// Display names mirror `theme.fonts` in src/config/theme.ts.
// next/font requires literal options, so the loaders live here.
export const headingFont = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-dm-serif",
});

export const subFont = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
});

export const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-dm-sans",
});
