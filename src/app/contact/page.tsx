import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Have questions or want to explore your financial goals? Contact Rusham Investment and start a conversation about your financial future.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="bg-background pb-14 pt-14 sm:pt-20" aria-labelledby="contact-title">
        <div className="container-x">
          <p className="eyebrow rise flex items-center gap-3 text-soft">
            <span aria-hidden="true" className="h-[2px] w-10 bg-accent" />
            Contact us
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="display-xl rise lg:col-span-8" style={{ animationDelay: "0.1s" }}>
              Let&apos;s Talk About Your Financial Future.
            </h1>
            <p className="lead rise text-foreground/80 lg:col-span-4" style={{ animationDelay: "0.25s" }}>
              Have questions or want to explore your financial goals? Reach out and start a conversation.
            </p>
          </div>
        </div>
      </section>

      <section id="enquiry" className="bg-background pb-24 sm:pb-32">
        <div className="container-x grid items-start gap-8 lg:grid-cols-12">
          <div className="lg:order-2 lg:col-span-7">
            <Suspense
              fallback={
                <div className="min-h-[40rem] rounded-[2rem] border border-border bg-background" aria-hidden="true" />
              }
            >
              <ContactForm />
            </Suspense>
          </div>
          <div className="lg:order-1 lg:col-span-5 lg:sticky lg:top-[calc(var(--navbar-height)+1.5rem)]">
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  );
}
