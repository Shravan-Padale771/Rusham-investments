import type { Metadata } from "next";
import { Info } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { services } from "@/config/services";
import { site } from "@/config/site";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceSection } from "@/components/services/ServiceSection";
import { CtaBand } from "@/components/ui/CtaBand";

export const metadata: Metadata = pageMetadata({
  title: "Our Services",
  description:
    "Explore mutual fund guidance, stock market education, financial planning, wealth management, SIP and goal-based investing and tax planning awareness from Rusham Investment.",
  path: "/services",
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${site.name} services`,
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.title,
    url: `${site.url}/services#${s.id}`,
  })),
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Thoughtful Financial Solutions for Every Stage of Life."
        description="Explore financial guidance and investment-related services designed around your goals, priorities and investment horizon."
      >
        <nav aria-label="Services index" className="rise mt-12 border-t border-border pt-6" style={{ animationDelay: "0.4s" }}>
          <ul className="flex flex-wrap gap-3">
            {services.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="label-sub inline-flex min-h-11 items-center gap-2 rounded-full border border-foreground/25 px-5 text-sm transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  <span className="text-soft">{s.number}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {services.map((service, i) => (
        <ServiceSection key={service.id} service={service} index={i} />
      ))}

      <section className="bg-background pb-4" aria-label="Important information">
        <div className="container-x">
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-muted p-6 sm:p-8">
            <Info className="mt-1 h-5 w-5 shrink-0 text-soft" aria-hidden="true" />
            <div className="space-y-2 text-sm text-foreground/80">
              <p className="heading-sub text-base text-foreground">Important information</p>
              <p>
                Content on this website is for general information and educational purposes only. It is not an
                offer, solicitation or personalised investment recommendation, and no returns are guaranteed.
                The scope of any service — for example mutual fund distribution versus regulated investment
                advice — depends on the registrations and authorisations held, which will be disclosed
                wherever applicable.
              </p>
              <p>{site.riskDisclaimer}</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Not Sure Where to Begin?"
        text="Share a little about your goals and we will help you work out the right first step."
        label="Talk to Our Team"
        href="/contact"
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </>
  );
}
