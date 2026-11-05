import { about } from "@/config/about";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function MissionVision() {
  const items = [
    { label: "Our mission", text: about.mission },
    { label: "Our vision", text: about.vision },
  ];
  return (
    <section className="section-y bg-dark text-dark-foreground" aria-label="Mission and vision">
      <div className="container-x grid gap-px overflow-hidden rounded-3xl bg-dark-border lg:grid-cols-2">
        {items.map((item, i) => (
          <ScrollReveal key={item.label} delay={i * 0.12} className="bg-dark p-8 sm:p-12 lg:p-14">
            <p className="eyebrow text-accent">{item.label}</p>
            <h2 className="font-heading mt-6 text-[clamp(1.7rem,2vw+1rem,2.75rem)] leading-[1.2]">
              {item.text}
            </h2>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
