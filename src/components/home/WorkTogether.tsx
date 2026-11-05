import { approachSteps } from "@/config/approach";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function WorkTogether() {
  return (
    <section className="section-y bg-background text-dark" aria-labelledby="work-together-title">
      <div className="container-x">
        <ScrollReveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3">
              <span aria-hidden="true" className="h-[2px] w-10 bg-dark" />
              How we work together
            </p>
            <h2 id="work-together-title" className="display-lg mt-5">
              A simple, considered process.
            </h2>
          </div>
          <p className="lead lg:col-span-5">
            Four steps that keep every conversation focused on you, your goals and the decisions
            that matter.
          </p>
        </ScrollReveal>

        <ScrollReveal as="ol" stagger={0.1} className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-dark/25 sm:grid-cols-2 lg:grid-cols-4">
          {approachSteps.map((step) => (
            <li key={step.no} className="flex flex-col bg-sage-bg p-8 lg:p-9">
              <span className="font-heading text-5xl leading-none">{step.no}</span>
              <h3 className="heading-sub mt-8 text-xl leading-snug">{step.title}</h3>
              <p className="mt-3 text-dark/85">{step.text}</p>
            </li>
          ))}
        </ScrollReveal>

        <ScrollReveal className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-dark p-8 text-dark-foreground sm:flex-row sm:items-center sm:p-10">
          <p className="display-md max-w-xl">Ready to start a conversation about your goals?</p>
          <Button href="/contact" variant="accent">
            Talk to Our Team
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
