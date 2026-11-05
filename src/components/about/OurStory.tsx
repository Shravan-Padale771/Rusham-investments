import { about } from "@/config/about";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function OurStory() {
  return (
    <section className="section-y bg-muted" aria-labelledby="story-title">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
        <ScrollReveal className="lg:col-span-5">
          <p className="eyebrow flex items-center gap-3 text-soft">
            <span aria-hidden="true" className="h-[2px] w-10 bg-accent" />
            Our story
          </p>
          <h2 id="story-title" className="display-lg mt-5">
            Why Rusham Investment exists.
          </h2>
        </ScrollReveal>

        <ScrollReveal className="space-y-6 lg:col-span-7" delay={0.1}>
          {about.story.map((p, i) => (
            <p
              key={i}
              className={i === 0 ? "font-heading text-[clamp(1.5rem,1.6vw+1rem,2.1rem)] leading-snug" : "lead text-foreground/80"}
            >
              {p}
            </p>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
