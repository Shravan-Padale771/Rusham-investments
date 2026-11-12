
import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const lastModified = new Date();

const routes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  {
    path: "/",
    priority: 1.0,
    changeFrequency: "weekly",
  },
  {
    path: "/about",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/services",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/services/mutual-funds",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  {
    path: "/services/health-insurance",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/services/life-insurance",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/services/motor-insurance",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/services/financial-planning",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  {
    path: "/services/wealth-management",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  {
    path: "/services/sip-goal-investing",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  {
    path: "/services/tax-planning",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/calculators",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/contact",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/privacy-policy",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    path: "/terms-and-conditions",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    path: "/disclaimer",
    priority: 0.3,
    changeFrequency: "yearly",
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = site.url.replace(/\/+$/, "");

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
