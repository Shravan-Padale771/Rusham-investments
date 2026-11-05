import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/config/services";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ServicesPreview() {
  return (
    <section className="section-y bg-muted" aria-labelledby="services-preview-title">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--navbar-height)+2.5rem)]">
            <ScrollReveal>
              <p className="eyebrow flex items-center gap-3 text-soft">
                <span aria-hidden="true" className="h-[2px] w-10 bg-accent" />
                What we offer
              </p>
              <h2 id="services-preview-title" className="display-lg mt-5">
                Guidance for every stage of life.
              </h2>
              <p className="lead mt-6 text-foreground/80">
                From first SIP to long-term wealth planning, explore financial guidance shaped around
                your goals and investment horizon.
              </p>
              <div className="mt-8">
                <Button href="/services">View all services</Button>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal as="ul" stagger={0.08} y={20} className="lg:col-span-8">
          {services.map((s) => (
            <li key={s.id} className="border-t border-foreground/15 last:border-b">
              <Link
                href={`/services#${s.id}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-1 py-7 transition-[padding] duration-300 hover:pl-3 sm:gap-x-8 sm:py-8"
              >
                <span className="font-heading text-2xl text-soft sm:text-3xl">{s.number}</span>
                <span>
                  <span className="heading-sub block text-xl sm:text-2xl">{s.title}</span>
                  <span className="mt-1.5 block max-w-xl text-foreground/75">{s.short}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 place-items-center rounded-full border border-foreground/25 text-foreground transition-colors duration-300 group-hover:border-accent group-hover:bg-accent"
                >
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </Link>
            </li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
