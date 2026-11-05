"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { theme } from "@/config/theme";

interface ScrollRevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  /** Reveal each direct child with a short stagger instead of the wrapper itself. */
  stagger?: number;
}

/**
 * Restrained GSAP scroll reveal (fade + small rise), triggered once.
 * Initial hidden state comes from CSS `[data-reveal]` so there is no flash;
 * content is always visible without JS or with reduced motion.
 */
export function ScrollReveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 28,
  stagger,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !theme.animation.enabled) {
      gsap.set(el, { clearProps: "all", opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      if (stagger) {
        const items = Array.from(el.children);
        gsap.set(el, { opacity: 1 });
        gsap.fromTo(
          items,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger,
            delay,
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay,
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, [delay, y, stagger]);

  return (
    <Tag ref={ref} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}
