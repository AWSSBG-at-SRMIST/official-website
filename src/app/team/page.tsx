import type { Metadata } from "next";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { Footer } from "@/components/landing/Footer";
import { TeamPageClient } from "@/components/team/TeamPageClient";
import { getTeamMembers } from "@/lib/team-data";
import { getHonoraryMembers } from "@/lib/honorary-members";
import { buildTeamTree } from "@/lib/team-tree";
import { getTeamPhotoMap } from "@/lib/team-photos";

export const metadata: Metadata = pageMetadata({
  path: "/team",
  title: "Team",
  description:
    "Meet the student builders, leads, and mentors behind AWS Student Builder Group at SRMIST — the student tech community at SRM Kattankulathur, Tamil Nadu.",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl("/") },
    { "@type": "ListItem", position: 2, name: "Team", item: siteUrl("/team") },
  ],
};

// Team roster lives in DynamoDB and changes rarely — a short revalidation
// window keeps the page fresh without refetching on every request.
export const revalidate = 300;

export default async function TeamPage() {
  const [members, honoraryMembers, photoMap] = await Promise.all([
    getTeamMembers(),
    getHonoraryMembers(),
    getTeamPhotoMap(),
  ]);

  let teamData;
  try {
    teamData = buildTeamTree(members, honoraryMembers, photoMap);
  } catch {
    teamData = buildTeamTree([], [], {});
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TeamPageClient data={teamData} />
      <Footer />
    </>
  );
}
