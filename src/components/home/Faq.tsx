"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Do you guarantee returns?",
    a: "No. Investments in the securities market are subject to market risk and no one can responsibly guarantee returns. Our role is to help you understand the risks, your options and the importance of a disciplined, long-term approach.",
  },
  {
    q: "I am new to investing. Where should I begin?",
    a: "Start by clarifying what you are saving for and when you will need the money. From there, we can talk through emergency funds, regular investing through SIPs and how much risk you are comfortable with.",
  },
  {
    q: "What is the difference between SIP and lumpsum investing?",
    a: "A SIP invests a fixed amount at regular intervals, building discipline and averaging your purchase cost over time. A lumpsum invests a larger amount at once. Which suits you depends on your cash flow, horizon and risk comfort.",
  },
  {
    q: "How do I get in touch?",
    a: "Use the enquiry form on our Contact page. Tell us a little about what you are looking for and our team will review your message and reply by email.",
  },
  {
    q: "Is the information I share kept private?",
    a: "We only use the details you submit to respond to your enquiry. Please read our Privacy Policy for how information is handled, and avoid sharing sensitive credentials such as passwords or OTPs.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-y bg-background" aria-labelledby="faq-title">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="eyebrow flex items-center gap-3 text-soft">
            <span aria-hidden="true" className="h-[2px] w-10 bg-accent" />
            Good to know
          </p>
          <h2 id="faq-title" className="display-lg mt-5">
            Questions, answered honestly.
          </h2>
        </div>

        <ul className="divide-y divide-border border-y border-border lg:col-span-8">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="heading-sub text-lg sm:text-xl">{item.q}</span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-foreground/25"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-foreground/80">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
