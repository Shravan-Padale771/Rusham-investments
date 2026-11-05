"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis, getLenis } from "@/hooks/useLenis";

/** Mounts the single smooth-scroll instance and resyncs ScrollTrigger on route changes. */
export function SmoothScroll() {
  useLenis();
  const pathname = usePathname();

  useEffect(() => {
    const hasHash = window.location.hash.length > 0;
    if (!hasHash) getLenis()?.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
