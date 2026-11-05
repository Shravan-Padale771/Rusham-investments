import type { Metadata } from "next";
import { site } from "@/config/site";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

/** Shared per-page metadata: title, description, canonical, Open Graph and Twitter. */
export function pageMetadata({ title, description, path, noIndex }: PageMeta): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
      images: [{ url: "/images/about-hero.jpg", width: 1024, height: 1024, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: ["/images/about-hero.jpg"],
    },
  };
}
