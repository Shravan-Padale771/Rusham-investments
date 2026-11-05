import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Disclaimer",
  description: "Important investment risk and regulatory disclosures from Rusham Investment.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="Important information about investment risk and the nature of the content on this website."
    >
      <p className="font-heading text-2xl text-foreground">{site.riskDisclaimer}</p>
      <h2>General information only</h2>
      <p>
        The content on this website is intended to educate and inform. It does not take into account your personal
        objectives, financial situation or needs, and should not be treated as investment, legal or tax advice.
      </p>
      <h2>Market risk</h2>
      <p>
        The value of investments can go down as well as up, and you may get back less than you invested. Mutual fund
        and equity investments are subject to market risks. Please read all scheme-related documents carefully before
        investing.
      </p>
      <h2>No guaranteed returns</h2>
      <p>
        We do not promise or guarantee returns on any product or strategy. Any examples or illustrations are for
        explanation only.
      </p>
      <h2>Regulatory status</h2>
      {site.regulatoryDisclosures.length > 0 ? (
        <ul>
          {site.regulatoryDisclosures.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ) : (
        <p>
          Registration and authorisation details will be published here once verified. Until then, nothing on this
          website should be read as a statement about any registration held.
        </p>
      )}
      <h2>Professional advice</h2>
      <p>
        Please consult a qualified financial, legal or tax professional about your specific circumstances before
        making decisions.
      </p>
    </LegalPage>
  );
}
