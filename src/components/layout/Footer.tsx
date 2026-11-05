import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { legalNav, mainNav } from "@/config/navigation";
import { services } from "@/config/services";
import { Logo } from "@/components/ui/Logo";

const socialLabels: Record<string, string> = {
  linkedin: "in",
  instagram: "ig",
  facebook: "fb",
  x: "x",
  youtube: "yt",
};

const linkClass =
  "inline-block text-dark-foreground/75 transition-colors duration-200 hover:text-accent";

export function Footer() {
  const socials = Object.entries(site.social).filter(([, url]) => url);
  const { email, phone, address } = site.contact;

  return (
    <footer className="bg-dark text-dark-foreground">
      <div className="container-wide section-y !pb-12">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="dark" />
            <p className="mt-6 max-w-sm text-dark-foreground/75">
              {site.name} offers thoughtful financial planning and disciplined investment guidance,
              built around your goals and your comfort with risk.
            </p>
            <p className="font-heading mt-8 max-w-xs text-2xl leading-snug text-dark-foreground">
              {site.tagline}
            </p>
          </div>

          <nav aria-label="Footer navigation" className="lg:col-span-2 lg:col-start-6">
            <h2 className="eyebrow mb-5 !font-sub text-accent">Navigate</h2>
            <ul className="space-y-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer services" className="lg:col-span-3">
            <h2 className="eyebrow mb-5 !font-sub text-accent">Services</h2>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`} className={linkClass}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1">
            <h2 className="eyebrow mb-5 !font-sub text-accent">Contact</h2>
            <ul className="space-y-3 text-dark-foreground/75">
              {email && (
                <li className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <a href={`mailto:${email}`} className="hover:text-accent">
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-accent">
                    {phone}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{address}</span>
                </li>
              )}
              <li>
                <Link href="/contact" className={linkClass}>
                  Send an enquiry →
                </Link>
              </li>
            </ul>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-3" aria-label="Social media">
                {socials.map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${site.name} on ${name}`}
                      className="grid h-11 w-11 place-items-center rounded-full border border-dark-border text-dark-foreground transition-colors hover:border-accent hover:bg-accent hover:text-dark"
                    >
                      <span className="label-sub text-xs uppercase">{socialLabels[name] ?? name.slice(0, 2)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-16 border-t border-dark-border pt-8">
          {site.regulatoryDisclosures.length > 0 && (
            <ul className="mb-4 space-y-1 text-sm text-dark-foreground/75">
              {site.regulatoryDisclosures.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
          <p className="max-w-4xl text-sm text-dark-foreground/75">{site.riskDisclaimer}</p>
          <div className="mt-6 flex flex-col gap-4 text-sm text-dark-foreground/70 md:flex-row md:items-center md:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
