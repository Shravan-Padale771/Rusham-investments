
import type { Metadata } from "next";
import { site } from "@/config/site";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  image = "/images/logo.png",
  keywords = [],
  noIndex = false,
}: PageMeta): Metadata {
  const normalizedPath =
    path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;

  const url = new URL(normalizedPath, site.url).toString();

  const socialTitle = `${title} | ${site.name}`;

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,

    metadataBase: new URL(site.url),

    alternates: {
      canonical: url,
    },

    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: site.name,
      title: socialTitle,
      description,
      images: [
        {
          url: image,
          alt: `${site.name} - ${title}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}
