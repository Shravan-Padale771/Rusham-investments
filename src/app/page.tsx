
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
    title: "Rusham Investment | Financial Planning & Wealth Management",

    description:
      "Rusham Investment offers financial planning, mutual fund investments, SIP planning, wealth management, tax planning and insurance solutions to help you build and protect your wealth.",

    path: "/",

    keywords: [
      "Rusham Investment",
      "Rusham Investment Pune",
      "Rusham Investment financial services",
      "Rusham Investment mutual funds",
      "Rusham Investment financial planning",
      "Rusham Investment wealth management",
    ],
  }),

  title: {
    absolute: "Rusham Investment | Financial Planning & Wealth Management",
  },
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
