import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

/** Editorial page header used by Services and legal pages. */
export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="bg-background pb-16 pt-14 sm:pt-20 lg:pb-24" aria-labelledby="page-title">
      <div className="container-x">
        <p className="eyebrow rise flex items-center gap-3 text-soft">
          <span aria-hidden="true" className="h-[2px] w-10 bg-accent" />
          {eyebrow}
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1
            id="page-title"
            className="display-xl rise lg:col-span-8"
            style={{ animationDelay: "0.1s" }}
          >
            {title}
          </h1>
          <p className="lead rise text-foreground/80 lg:col-span-4" style={{ animationDelay: "0.25s" }}>
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}
