import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { CommunityMarquee } from "@/components/landing/CommunityMarquee";
import { AboutSection } from "@/components/landing/AboutSection";
import { ProjectsTeaser } from "@/components/landing/ProjectsTeaser";
import { ExploreDomains } from "@/components/landing/ExploreDomains";
import { BuildTogetherCta } from "@/components/landing/BuildTogetherCta";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: { absolute: "AWS Student Builder Group at SRMIST | Student Tech Community" },
  description:
    "AWS Student Builder Group at SRMIST is the official student tech community at SRM Kattankulathur, Tamil Nadu — building on AWS, AI, data engineering, and modern software development.",
  alternates: {
    canonical: "https://awssbg-srmist.in",
  },
  openGraph: {
    url: "https://awssbg-srmist.in",
  },
};

export default function Home() {
  return (
    <>
      {/* overflow-x-clip: on desktop the hero globe is shifted right and
          extends past the viewport edge, which made the whole page scroll
          sideways. Clip (not hidden) so no scroll container is created. */}
      <main className="pt-24 min-h-screen overflow-x-clip">
        <Hero />
        <CommunityMarquee />
        <AboutSection />
        <ExploreDomains />
        <ProjectsTeaser />
      </main>
      <BuildTogetherCta />
      <Footer />
    </>
  );
}
