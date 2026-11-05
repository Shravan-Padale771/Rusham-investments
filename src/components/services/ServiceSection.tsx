import { Check } from "lucide-react";
import type { Service } from "@/config/services";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ServiceIllustration } from "./ServiceIllustration";

export function ServiceSection({ service, index }: { service: Service; index: number }) {
  const flip = index % 2 === 1;
  const tone = flip ? "sage" : "dark";

  return (
    <section
      id={service.id}
      aria-labelledby={`${service.id}-title`}
      className={`section-y ${index % 2 === 0 ? "bg-background" : "bg-muted"}`}
    >
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <ScrollReveal className={`lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
          <div
            className={`aspect-[4/3] overflow-hidden rounded-[2rem] ${
              tone === "dark" ? "text-dark-foreground" : "text-dark"
            }`}
          >
            <ServiceIllustration id={service.id} tone={tone} />
          </div>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-6" delay={0.1}>
          <p className="flex items-baseline gap-4">
            <span className="font-heading text-5xl text-sage">{service.number}</span>
            <span className="eyebrow text-soft">Service</span>
          </p>
          <h2 id={`${service.id}-title`} className="display-lg mt-4">
            {service.title}
          </h2>
          <p className="lead mt-5 text-foreground/80">{service.description}</p>

          <ul className="mt-8 space-y-3.5">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-3.5">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-dark">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button href={`/contact?service=${service.id}#enquiry`}>{service.cta}</Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
