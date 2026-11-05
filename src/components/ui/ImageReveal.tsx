"use client";

import { useEffect, useRef } from "react";
import Image, { type ImageProps } from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { theme } from "@/config/theme";

interface ImageRevealProps extends Omit<ImageProps, "className"> {
  className?: string;
  imageClassName?: string;
}

/**
 * Image with a GSAP clip-path unveil and a very light parallax.
 * Only transform / clip-path are animated.
 */
export function ImageReveal({ className = "", imageClassName = "", alt, ...props }: ImageRevealProps) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current;
    const img = inner.current;
    if (!el || !img) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !theme.animation.enabled) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(14% 14% 14% 14% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
      gsap.fromTo(
        img,
        { yPercent: -5, scale: 1.12 },
        {
          yPercent: 5,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={frame} className={`relative overflow-hidden rounded-3xl ${className}`}>
      <div ref={inner} className="absolute inset-0">
        <Image alt={alt} {...props} className={`object-cover ${imageClassName}`} />
      </div>
    </div>
  );
}
