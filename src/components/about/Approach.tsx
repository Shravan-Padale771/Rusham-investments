import { approachSteps } from "@/config/approach";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Approach() {
  return (
    <section className="section-y bg-sage-bg text-dark" aria-labelledby="approach-title">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--navbar-height)+2.5rem)]">
            <p className="eyebrow flex items-center gap-3">
              <span aria-hidden="true" className="h-[2px] w-10 bg-dark" />
              Our approach
            </p>
            <h2 id="approach-title" className="display-lg mt-5">
              Four steps, one clear direction.
            </h2>
            <p className="lead mt-6">
              A structured conversation keeps decisions grounded in your goals, not in market noise.
            </p>
          </div>
        </div>

        <ScrollReveal as="ol" stagger={0.1} y={24} className="lg:col-span-8">
          {approachSteps.map((s) => (
            <li
              key={s.no}
              className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-dark/30 py-8 last:border-b sm:gap-x-10"
            >
              <span className="font-heading text-5xl leading-none sm:text-6xl">{s.no}</span>
              <div>
                <h3 className="heading-sub text-xl sm:text-2xl">{s.title}</h3>
                <p className="mt-2 max-w-xl">{s.text}</p>
              </div>
            </li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
