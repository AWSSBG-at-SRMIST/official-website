import type { Metadata } from "next";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";
import { Space_Grotesk, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { BackgroundNetwork } from "@/components/layout/BackgroundNetwork";
import { Loader } from "@/components/layout/Loader";
import { Navbar } from "@/components/landing/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import ChatWidget from "@/components/chat/ChatWidget";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AWS Student Builder Group at SRMIST",
    template: "%s | AWS SBG at SRMIST",
  },
  description:
    "AWS Student Builder Group at SRMIST is the official student tech community at SRM KTR, Kattankulathur — building on AWS, AI, data engineering, cloud infrastructure, and modern software development.",
  keywords: [
    "AWS Student Builder Group SRMIST",
    "AWS SBG SRMIST",
    "student tech community SRMIST",
    "AWS club SRM",
    "AWS student community India",
    "tech community SRM Kattankulathur",
    "AWS certification students SRMIST",
    "tech club SRMIST",
    "SRMIST student tech community",
    "AWS student builder group India",
    "AI community SRMIST",
    "data engineering club SRMIST",
  ],
  authors: [{ name: "AWS Student Builder Group at SRMIST", url: SITE_URL }],
  creator: "AWS Student Builder Group at SRMIST",
  publisher: "AWS Student Builder Group at SRMIST",
  openGraph: {
    siteName: "AWS Student Builder Group at SRMIST",
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    title: "AWS Student Builder Group at SRMIST",
    description:
      "Official student tech community at SRMIST, SRM KTR — building on AWS, AI, data engineering, and modern software. Join India's top student builder community.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "AWS Student Builder Group at SRMIST",
    description:
      "Official student tech community at SRMIST, SRM KTR — building on AWS, AI, data engineering, and modern software. Join India's top student builder community.",
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AWS Student Builder Group at SRMIST",
  alternateName: ["AWS SBG SRMIST", "AWSSBG SRMIST", "AWS SBG at SRM"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "AWS Student Builder Group at SRMIST is the official student tech community at SRM Institute of Science and Technology, Kattankulathur, Tamil Nadu. Focused on AWS products, AI, data engineering, cloud infrastructure, and modern software development.",
  foundingDate: "2025",
  location: {
    "@type": "Place",
    name: "SRM Institute of Science and Technology",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kattankulathur",
      addressRegion: "Tamil Nadu",
      postalCode: "603203",
      addressCountry: "IN",
    },
  },
  sameAs: [
    "https://www.instagram.com/awssbg.at.srmist/",
    "https://www.linkedin.com/company/awssbg-at-srmist",
    "https://www.meetup.com/awssbg-at-srmist/",
    "https://github.com/AWSSBG-at-SRMIST",
  ],
  memberOf: {
    "@type": "CollegeOrUniversity",
    name: "SRM Institute of Science and Technology",
    url: "https://www.srmist.edu.in",
  },
  knowsAbout: [
    "Amazon Web Services",
    "Artificial Intelligence",
    "Data Engineering",
    "Cloud Computing",
    "AWS Certification",
    "Machine Learning",
    "DevOps",
    "Serverless Computing",
    "Infrastructure as Code",
    "Modern Software Development",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AWS Student Builder Group at SRMIST",
  url: SITE_URL,
  description:
    "Official website of AWS Student Builder Group at SRMIST — student tech community at SRM KTR, Kattankulathur, Tamil Nadu.",
  publisher: {
    "@type": "Organization",
    name: "AWS Student Builder Group at SRMIST",
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${geist.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Loader />
        <BackgroundNetwork />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
