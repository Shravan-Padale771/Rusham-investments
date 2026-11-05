import type { ReactNode } from "react";
import { PageHero } from "@/components/ui/PageHero";

interface LegalPageProps {
  title: string;
  description: string;
  children: ReactNode;
}

/** Shared shell for legal pages. Content is a general draft and should be reviewed by qualified counsel. */
export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={description} />
      <section className="bg-background pb-24 sm:pb-32">
        <div className="container-x">
          <article className="max-w-3xl space-y-5 text-foreground/85 [&_h2]:font-sub [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2 [&_a]:underline [&_a]:underline-offset-4">
            {children}
            <p className="mt-12 rounded-2xl border border-border bg-muted p-5 text-sm">
              This page is a general draft prepared for the website and does not constitute legal advice. It should
              be reviewed by a qualified legal professional and updated to reflect the company&apos;s final
              registrations and practices before reliance.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
