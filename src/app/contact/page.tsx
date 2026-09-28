import type { Metadata } from "next";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact",
  description:
    "Get in touch with AWS Student Builder Group at SRMIST for collaborations, sponsorships, or general queries. Reach the student tech community at SRM Kattankulathur.",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl("/") },
    { "@type": "ListItem", position: 2, name: "Contact", item: siteUrl("/contact") },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactPageClient />
    </>
  );
}
