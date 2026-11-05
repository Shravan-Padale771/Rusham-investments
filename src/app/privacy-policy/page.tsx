import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Rusham Investment collects, uses and protects the information you share through this website.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How we collect, use and protect the information you share through this website."
    >
      <p>
        {site.name} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what information we collect
        through {site.url.replace("https://", "")} and how it is used.
      </p>
      <h2>Information we collect</h2>
      <p>When you submit the enquiry form we collect the details you provide:</p>
      <ul>
        <li>Full name, email address and phone number</li>
        <li>Subject, service of interest and the content of your message</li>
        <li>The date and time of submission</li>
      </ul>
      <p>
        We also use basic technical information (such as your IP address) transiently to prevent spam and abuse,
        for example to limit repeated submissions.
      </p>
      <h2>How we use your information</h2>
      <ul>
        <li>To read and respond to your enquiry</li>
        <li>To send you an acknowledgement that your enquiry was received</li>
        <li>To keep the website secure and prevent misuse</li>
      </ul>
      <p>We do not sell your personal information.</p>
      <h2>Sharing and retention</h2>
      <p>
        Your information is shared only with service providers needed to operate the website and deliver email, and
        where required by law. We retain enquiries only for as long as needed to respond and to maintain reasonable
        business records.
      </p>
      <h2>Your choices</h2>
      <p>
        You may ask us to access, correct or delete the information you have submitted by contacting us through the
        enquiry form. Please do not share passwords, OTPs, card or net-banking details with us.
      </p>
      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The latest version will always be available on this page.</p>
    </LegalPage>
  );
}
