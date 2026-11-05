import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStory } from "@/components/about/OurStory";
import { MissionVision } from "@/components/about/MissionVision";
import { Values } from "@/components/about/Values";
import { Approach } from "@/components/about/Approach";
import { CtaBand } from "@/components/ui/CtaBand";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Learn about Rusham Investment — our philosophy, mission, values and the four-step approach behind our thoughtful, long-term guidance on wealth creation.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <MissionVision />
      <Values />
      <Approach />
      <CtaBand
        title="Let's Start a Conversation."
        text="Tell us about your goals and we will take it from there — no pressure, no jargon."
        label="Get in touch"
        href="/contact"
      />
    </>
  );
}
