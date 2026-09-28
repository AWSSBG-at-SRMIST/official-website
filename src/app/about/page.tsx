import type { Metadata } from "next";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { Cloud, Compass, Rocket, Globe2 } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { CornerBrackets } from "@/components/ui/CornerBrackets";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About",
  description:
    "Learn about AWS Student Builder Group at SRMIST — the official student tech community at SRM KTR focused on AWS, AI, data engineering, and modern software. Our mission, vision, and why we exist.",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl("/") },
    { "@type": "ListItem", position: 2, name: "About", item: siteUrl("/about") },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is AWS Student Builder Group at SRMIST?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AWS Student Builder Group at SRMIST is the official student tech community at SRM Institute of Science and Technology, Kattankulathur. We work across AWS products, AI, data engineering, cloud infrastructure, and modern software development — building real projects and preparing students for industry roles.",
      },
    },
    {
      "@type": "Question",
      name: "How can I join AWS Student Builder Group at SRMIST?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can join AWS Student Builder Group at SRMIST by applying during our open recruitment periods. Visit the Recruitments page on our website to apply. AWS SBG at SRMIST is open to students from every department and every year — no prior experience required.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need prior experience to join AWS SBG at SRMIST?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. AWS Student Builder Group at SRMIST is open to every department and every year — no prior experience required. We have structured learning tracks covering AWS fundamentals, AI, data engineering, DevOps, and software development from the ground up.",
      },
    },
    {
      "@type": "Question",
      name: "What does AWS Student Builder Group at SRMIST do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AWS SBG at SRMIST runs hands-on workshops, real-world project teams, AWS certification prep, and events across AI, data, cloud, and software development. We connect students with the AWS Community Builders and AWS Heroes network and prepare them for roles in tech, DevOps, and platform engineering.",
      },
    },
    {
      "@type": "Question",
      name: "Where is AWS Student Builder Group at SRMIST located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AWS Student Builder Group at SRMIST operates under the Department of Computing Technologies, School of Computing, SRM Institute of Science and Technology, Kattankulathur, Tamil Nadu, India (SRM KTR).",
      },
    },
  ],
};

const missionItems = [
  {
    index: "01",
    title: "Hands-On Learning",
    description: "Labs and live deployments, not slideware.",
  },
  {
    index: "02",
    title: "Certification Pathways",
    description: "Structured prep toward AWS certifications that actually mean something on a resume.",
  },
  {
    index: "03",
    title: "Real Projects, Real Stakes",
    description: "Production-grade builds, not toy demos.",
  },
  {
    index: "04",
    title: "Career Runway",
    description: "Direct prep for Cloud, DevOps, and Platform roles — interviews, resumes, referrals.",
  },
  {
    index: "05",
    title: "A Network, Not Just a Club",
    description: "Ties to AWS Community Builders, AWS Heroes, and other university chapters that outlast your time here.",
  },
  {
    index: "06",
    title: "Leadership Experience",
    description: "Run real teams and own real outcomes — manager and associate roles across every domain.",
  },
];

const whyItems = [
  {
    index: "01",
    icon: Cloud,
    title: "A Dedicated AWS-First Ecosystem",
    description:
      "SRMIST's first student-led community fully dedicated to cloud computing on AWS — from fundamentals to advanced architecture, reflecting real-world usage patterns.",
  },
  {
    index: "02",
    icon: Compass,
    title: "Structured Learning Pathways",
    description:
      "Clearly defined tracks moving from cloud fundamentals toward infrastructure as code, container orchestration, serverless architecture, and cloud security.",
  },
  {
    index: "03",
    icon: Rocket,
    title: "Industry-Aligned Projects",
    description:
      "Project teams take on real problems — internal tools, open-source contributions, and startup-style cloud solutions with production constraints.",
  },
  {
    index: "04",
    icon: Globe2,
    title: "AWS & Community Engagement",
    description:
      "Active engagement with AWS Community Builders, AWS Heroes, and student community programs — placing SRMIST in the broader AWS student network.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="pt-24 pb-stack-lg min-h-screen">
        {/* Hero */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">
            The Official Student-Led AWS Cloud Computing Community at SRMIST, KTR
          </p>
          <h1 className="font-display text-[40px] sm:text-[56px] md:text-[64px] leading-[0.98] tracking-tight mb-4 text-on-surface font-bold">
            About AWS SBG at SRMIST.
          </h1>
        </section>

        {/* Introduction */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-16 md:mb-20">
          <div className="flex items-center justify-between mb-6 border-b-2 border-on-surface/10 pb-3">
            <h2 className="font-label-sm text-sm uppercase tracking-[0.2em] text-primary">
              Introduction
            </h2>
            <span className="font-display text-xs text-on-surface-variant/50 tracking-[0.2em] uppercase">
              Est. 2025
            </span>
          </div>
          <p className="text-label-md text-on-surface-variant leading-relaxed">
            SRMIST has clubs for AI, robotics, IoT, and general software &mdash; but
            none built specifically around the cloud, where most of that software
            actually has to run. AWS Student Builder Group at SRMIST exists to close
            that gap: a community for people who want to stop reading about
            infrastructure and start operating it. We sit under the Department of
            Computing Technologies, School of Computing, SRMIST &ndash; KTR, but the
            work is run by students, for students.
          </p>
        </section>

        {/* Vision */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-16 md:mb-20">
          <h2 className="font-label-sm text-sm uppercase tracking-[0.2em] text-primary mb-6 border-b-2 border-on-surface/10 pb-3">
            Vision
          </h2>
          <p className="font-display font-bold text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight text-on-surface">
            A campus where the next AWS-certified engineer, the next cloud founder,
            and the next open-source maintainer all got their start in the same room.
          </p>
        </section>

        {/* Mission */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-16 md:mb-20">
          <h2 className="font-label-sm text-sm uppercase tracking-[0.2em] text-primary mb-6 border-b-2 border-on-surface/10 pb-3">
            Mission
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-on-surface/10">
            {missionItems.map((item) => (
              <div key={item.index} className="p-6 border-r border-b border-on-surface/10">
                <div className="font-display text-xs text-primary tracking-[0.2em] mb-3">
                  {item.index}
                </div>
                <h4 className="font-headline-md text-on-surface mb-2 font-bold">{item.title}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why AWS Student Builder Group at SRMIST */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-16 md:mb-20">
          <h2 className="font-label-sm text-sm uppercase tracking-[0.2em] text-primary mb-6 border-b-2 border-on-surface/10 pb-3">
            Why AWS Student Builder Group at SRMIST?
          </h2>
          <p className="text-label-md text-on-surface-variant leading-relaxed mb-8">
            Most existing technical clubs at SRMIST concentrate on general software
            development, AI, robotics, or IoT. Cloud computing, when covered, is
            usually treated as a supporting tool rather than a core discipline. This
            club is built on the belief that cloud skills must be learned through
            consistent practice, not isolated sessions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {whyItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.index}
                  className="border-2 border-on-surface/10 hover:border-primary/40 transition-colors duration-300 p-6 bg-surface-container-lowest"
                >
                  <div className="flex items-start justify-between mb-6">
                    <Icon size={26} className="text-primary" />
                    <span className="font-display text-xs text-on-surface-variant tracking-[0.2em]">
                      {item.index}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-base text-on-surface font-bold leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Strategic Outlook */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
          <div className="relative border-2 border-primary/40 p-8 sm:p-12 text-center md:text-left">
            <CornerBrackets />
            <div className="relative z-10 max-w-2xl mx-auto md:mx-0">
              <h2 className="font-display text-2xl sm:text-3xl md:text-[40px] leading-tight tracking-tight mb-4 text-on-surface font-bold">
                A center of excellence for cloud computing.
              </h2>
              <p className="text-label-md text-on-surface-variant">
                AWS Student Builder Group at SRMIST combines hands-on practice,
                industry alignment, and community engagement to prepare students for
                modern cloud-driven careers. Open to every department, every year
                &mdash; no prior cloud experience required.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
