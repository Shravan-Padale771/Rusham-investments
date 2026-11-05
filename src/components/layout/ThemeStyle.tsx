import { buildThemeCss } from "@/config/theme";

/** Injects CSS variables generated from src/config/theme.ts (single source of truth). */
export function ThemeStyle() {
  return <style id="rusham-theme" dangerouslySetInnerHTML={{ __html: buildThemeCss() }} />;
}
