import { about } from "@/config/about";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Values() {
  return (
    <section className="section-y bg-background" aria-labelledby="values-title">
      <div className="container-x">
        <ScrollReveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3 text-soft">
            <span aria-hidden="true" className="h-[2px] w-10 bg-accent" />
            Our values
          </p>
          <h2 id="values-title" className="display-lg mt-5">
            The principles behind every conversation.
          </h2>
        </ScrollReveal>

        <ScrollReveal
          as="ul"
          stagger={0.08}
          y={20}
          className="mt-14 grid gap-x-10 gap-y-2 border-t border-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {about.values.map((v, i) => (
            <li key={v.title} className="border-b border-border py-8">
              <span className="font-heading text-3xl text-sage">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="heading-sub mt-4 text-xl">{v.title}</h3>
              <p className="mt-2 text-foreground/75">{v.text}</p>
            </li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
