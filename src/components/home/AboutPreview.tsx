import { Compass, HeartHandshake, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const pillars = [
  {
    icon: HeartHandshake,
    title: "Trust and transparency",
    text: "Clear explanations, honest conversations and no jargon for its own sake.",
  },
  {
    icon: Hourglass,
    title: "Long-term thinking",
    text: "Wealth is built through patience, discipline and regular review.",
  },
  {
    icon: Compass,
    title: "Personalised guidance",
    text: "Your goals, responsibilities and comfort with risk set the direction.",
  },
];

export function AboutPreview() {
  return (
    <section className="section-y bg-background" aria-labelledby="about-preview-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="relative">
            <ImageReveal
              src="/images/rahul.png"
              alt="A calm, light-filled private office with a wooden desk and a single plant"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="aspect-[4/5] w-full"
            />
            <div className="absolute -bottom-6 -right-2 max-w-[15rem] rounded-2xl bg-dark p-5 text-dark-foreground sm:-right-6">
              <p className="font-heading text-xl leading-snug">Guidance, not guarantees.</p>
              <p className="mt-2 text-sm text-dark-foreground/75">
                Markets carry risk. We focus on informed, disciplined decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ScrollReveal>
            <p className="eyebrow flex items-center gap-3 text-soft">
              <span aria-hidden="true" className="h-[2px] w-10 bg-accent" />
              About Rusham Investment
            </p>
            <h2 id="about-preview-title" className="display-lg mt-5">
              A thoughtful approach to your financial journey.
            </h2>
            <p className="lead mt-6 text-foreground/80">
              Rusham Investment exists to help individuals make more informed financial decisions. We
              believe good outcomes come from clarity, consistency and a plan that reflects your life,
              not from chasing the market.
            </p>
          </ScrollReveal>

          <ScrollReveal as="ul" stagger={0.12} className="mt-10 divide-y divide-border border-y border-border">
            {pillars.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-5 py-5">
                <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-muted text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="heading-sub text-lg">{title}</h3>
                  <p className="mt-1 text-foreground/75">{text}</p>
                </div>
              </li>
            ))}
          </ScrollReveal>

          <ScrollReveal className="mt-10" delay={0.1}>
            <Button href="/about" variant="secondary">
              Learn more about us
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
