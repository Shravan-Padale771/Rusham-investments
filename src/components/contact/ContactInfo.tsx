import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/config/site";

const steps = [
  "You send us your enquiry.",
  "Our team reviews your message.",
  "We reply to you by email.",
];

export function ContactInfo() {
  const { email, phone, address, hours } = site.contact;
  const socials = Object.entries(site.social).filter(([, url]) => url);
  const rows = [
    email && { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    phone && { icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    address && { icon: MapPin, label: "Office", value: address },
    hours && { icon: Clock, label: "Working hours", value: hours },
  ].filter(Boolean) as Array<{ icon: typeof Mail; label: string; value: string; href?: string }>;

  return (
    <aside className="rounded-[2rem] bg-dark p-8 text-dark-foreground sm:p-10" aria-label="Contact information">
      <p className="eyebrow text-accent">Contact details</p>
      <h2 className="display-md mt-4">We&apos;d love to hear from you.</h2>

      {rows.length > 0 ? (
        <ul className="mt-8 space-y-6">
          {rows.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-dark-border text-accent">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="eyebrow !text-[0.68rem] text-dark-foreground/70">{label}</p>
                {href ? (
                  <a href={href} className="mt-1 block break-words hover:text-accent">
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 whitespace-pre-line">{value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-dark-foreground/80">
          The quickest way to reach our team is the enquiry form. Every message is read, and we respond by email.
        </p>
      )}

      {socials.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-3" aria-label="Social media">
          {socials.map(([name, url]) => (
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="label-sub inline-flex min-h-11 items-center rounded-full border border-dark-border px-5 text-sm capitalize transition-colors hover:border-accent hover:bg-accent hover:text-dark"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 border-t border-dark-border pt-8">
        <h3 className="heading-sub text-lg">What happens next</h3>
        <ol className="mt-5 space-y-4">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-highlight font-sub text-sm font-bold text-dark">
                {i + 1}
              </span>
              <span className="text-dark-foreground/85">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
