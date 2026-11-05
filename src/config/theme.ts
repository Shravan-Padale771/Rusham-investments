/**
 * RUSHAM INVESTMENT — CENTRALIZED THEME
 * ---------------------------------------------------------------------------
 * This is the ONLY file where brand colours, fonts and layout sizes are defined.
 * `ThemeStyle` (src/components/layout/ThemeStyle.tsx) converts this object into
 * CSS custom properties at render time, and Tailwind utilities
 * (bg-background, text-foreground, bg-accent …) read those variables.
 *
 * To re-brand the site, edit the hex values in `palette`, or re-point a
 * semantic role in `semantic` to a different palette key.
 *
 * Colour distribution: 70% mint · 15% forest · 10% sage · 4% amber · 1% lavender.
 * No gradients are used anywhere.
 */

/** Raw brand palette (the only place hex values live). */
const palette = {
  forest: "#181F1C",
  amber: "#EE964B",
  lavender: "#B298DC",
  mint: "#EFF9F0",
  sage: "#748B75",

  // Supporting tints/shades derived from the brand palette
  mist: "#E3EDE4", // muted mint surface
  line: "#D5E2D6", // hairline borders on mint
  sageDeep: "#47594A", // sage darkened for accessible small text on mint
  forestSoft: "#232C27", // raised surface on forest
  forestLine: "#34413A", // hairline borders on forest
} as const;

export type PaletteKey = keyof typeof palette;

/** Semantic roles → palette keys. Change a role here and the whole site follows. */
const semantic = {
  background: "mint",
  foreground: "forest",
  primary: "forest",
  secondary: "sage",
  accent: "amber",
  highlight: "lavender",
  muted: "mist",
  border: "line",
  softText: "sageDeep",
  darkBackground: "forest",
  darkForeground: "mint",
  darkSurface: "forestSoft",
  darkBorder: "forestLine",
  sageBackground: "sage",
} as const satisfies Record<string, PaletteKey>;

export const theme = {
  palette,
  semantic,

  /** Flattened colours (palette + resolved semantic roles). */
  colors: {
    ...palette,
    ...(Object.fromEntries(
      Object.entries(semantic).map(([role, key]) => [role, palette[key]]),
    ) as Record<keyof typeof semantic, string>),
  },

  /** Display names. The actual loading happens in src/lib/fonts.ts via next/font. */
  fonts: {
    heading: "DM Serif Display",
    subheading: "Manrope",
    body: "DM Sans",
  },

  animation: {
    enabled: true,
    smoothScroll: true,
    reducedMotionSupport: true,
  },

  layout: {
    maxWidth: "1440px",
    contentWidth: "1240px",
    navbarHeight: "84px",
  },
} as const;

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** Builds the `:root { … }` block injected by <ThemeStyle />. */
export function buildThemeCss(): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(theme.palette)) {
    lines.push(`--theme-${kebab(key)}:${value};`);
  }
  for (const [role, key] of Object.entries(theme.semantic)) {
    lines.push(`--theme-${kebab(role)}:var(--theme-${kebab(key)});`);
  }

  lines.push(`--layout-max:${theme.layout.maxWidth};`);
  lines.push(`--layout-content:${theme.layout.contentWidth};`);
  lines.push(`--navbar-height:${theme.layout.navbarHeight};`);

  return `:root{${lines.join("")}}`;
}
