import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Every indexable page. Pages marked noindex (achievements, until it has
// content; the 404 page) are left out — listing them would contradict
// their own robots tag. Recruitments is a separate app on its own
// subdomain (recruitments.awssbg-srmist.in).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: siteUrl("/about"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl("/projects"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: siteUrl("/events"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: siteUrl("/team"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: siteUrl("/contact"), lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: siteUrl("/social-links"), lastModified, changeFrequency: "yearly", priority: 0.4 },
  ];
}
