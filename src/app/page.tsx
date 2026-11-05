import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Hero } from "@/components/home/Hero";
import { CinematicStory } from "@/components/home/CinematicStory";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { WorkTogether } from "@/components/home/WorkTogether";
import { Faq } from "@/components/home/Faq";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Rusham Investment — Thoughtful Financial Guidance & Wealth Planning",
    description:
      "Thoughtful financial planning and disciplined investment guidance to help you build, protect and grow your wealth with confidence.",
    path: "/",
  }),
  // Absolute title: the layout template would otherwise append the brand twice.
  title: { absolute: "Rusham Investment — Thoughtful Financial Guidance & Wealth Planning" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CinematicStory />
      <AboutPreview />
      <ServicesPreview />
      <WorkTogether />
      <Faq />
    </>
  );
}
