import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface CtaBandProps {
  title: string;
  text?: string;
  label: string;
  href: string;
}

/** Charcoal call-to-action card inside a mint section. */
export function CtaBand({ title, text, label, href }: CtaBandProps) {
  return (
    <section className="section-y bg-background">
      <div className="container-x">
        <ScrollReveal className="relative overflow-hidden rounded-[2rem] bg-dark px-7 py-14 text-dark-foreground sm:px-14 sm:py-20">
          <span
            aria-hidden="true"
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-dark-border"
          />
          <span
            aria-hidden="true"
            className="absolute -right-4 -top-4 h-28 w-28 rounded-full bg-accent"
          />
          <div className="relative max-w-3xl">
            <h2 className="display-lg">{title}</h2>
            {text && <p className="lead mt-5 max-w-xl text-dark-foreground/80">{text}</p>}
            <div className="mt-9">
              <Button href={href} variant="accent">
                {label}
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
