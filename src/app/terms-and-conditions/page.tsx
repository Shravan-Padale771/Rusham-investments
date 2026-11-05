import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms and Conditions",
  description: "The terms that apply when you use the Rusham Investment website.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      description="The terms that apply when you browse or use this website."
    >
      <p>
        By accessing {site.url.replace("https://", "")} you agree to these terms. If you do not agree, please do not
        use the website.
      </p>
      <h2>Informational purpose</h2>
      <p>
        Content on this website is provided for general information and education. It is not an offer, solicitation or
        personalised recommendation to buy or sell any security or financial product.
      </p>
      <h2>No guarantee of returns</h2>
      <p>
        {site.riskDisclaimer} Past performance is not an indicator of future results, and nothing on this website
        guarantees any return.
      </p>
      <h2>Use of the website</h2>
      <ul>
        <li>You agree to use the website lawfully and not to attempt to disrupt or misuse it.</li>
        <li>You agree to provide accurate information when you contact us.</li>
        <li>Automated or abusive submissions through the contact form are prohibited.</li>
      </ul>
      <h2>Intellectual property</h2>
      <p>
        The text, design, logo and other material on this website belong to {site.name} or its licensors and may not be
        reproduced without permission.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, {site.name} is not liable for losses arising from reliance on information
        published on this website. Please seek advice suited to your own circumstances before making financial
        decisions.
      </p>
      <h2>Changes</h2>
      <p>We may revise these terms at any time. Continued use of the website means you accept the updated terms.</p>
    </LegalPage>
  );
}
