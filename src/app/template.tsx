import type { ReactNode } from "react";

/**
 * Subtle route transition: a CSS-only opacity fade (see `.page-enter` in globals.css).
 * It works with server-rendered HTML (no hidden-until-hydration state), never delays
 * navigation, and avoids transforms so GSAP pinning is never affected.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
