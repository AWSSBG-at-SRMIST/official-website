import type { Metadata } from "next";

// The site's real address. awssbg-srmist.in (no www) permanently redirects
// here, so canonical URLs, og:url, the sitemap and structured data all use
// this form — Google treats a canonical that redirects as a conflicting
// signal. If the primary domain ever changes in Vercel, change it here.
export const SITE_URL = "https://www.awssbg-srmist.in";

export const SITE_NAME = "AWS Student Builder Group at SRMIST";
const TITLE_SUFFIX = " | AWS SBG at SRMIST"; // matches the title template in app/layout.tsx

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "AWS Student Builder Group at SRMIST — Student Tech Community",
};

// Absolute URL for a site path ("/" → the homepage).
export function siteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

interface PageSeo {
  path: string;
  /** Page title; the layout's template adds " | AWS SBG at SRMIST". */
  title: string | { absolute: string };
  description: string;
  /** Keep the page out of search results (and the sitemap). */
  noindex?: boolean;
}

/**
 * Complete per-page metadata: canonical URL, Open Graph and Twitter card.
 *
 * Next.js replaces (does not merge) a parent's `openGraph` / `twitter` when a
 * page sets its own, so pages that set only `openGraph.url` lost the share
 * image, and pages that set nothing inherited the homepage's og:url, title
 * and description. Building the whole object here keeps every page's link
 * preview complete and pointing at the right page.
 */
export function pageMetadata({ path, title, description, noindex }: PageSeo): Metadata {
  const url = siteUrl(path);
  const shareTitle = typeof title === "string" ? `${title}${TITLE_SUFFIX}` : title.absolute;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      url,
      title: shareTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [OG_IMAGE.url],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
