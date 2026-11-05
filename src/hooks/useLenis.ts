"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { theme } from "@/config/theme";

let instance: Lenis | null = null;

/** Access the single Lenis instance (null on touch devices / reduced motion). */
export function getLenis() {
  return instance;
}

/**
 * Creates exactly ONE Lenis instance and drives it from GSAP's ticker so that
 * ScrollTrigger and smooth scrolling share a single animation loop.
 * Native scrolling is kept on touch devices and for reduced-motion users.
 */
export function useLenis() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    if (!theme.animation.enabled || !theme.animation.smoothScroll || reduce || coarse) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: { offset: -96 },
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);
}
