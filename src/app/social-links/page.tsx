import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SiMeetup, SiInstagram, SiGithub, SiWhatsapp } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";

export const metadata: Metadata = pageMetadata({
  path: "/social-links",
  title: "Social Links",
  description:
    "All official social media links for AWS Student Builder Group at SRMIST.",
});

const socials = [
  {
    label: "Instagram",
    handle: "@awssbg.at.srmist",
    href: "https://www.instagram.com/awssbg.at.srmist/",
    icon: SiInstagram,
    color: "hover:border-pink-500 hover:text-pink-500",
  },
  {
    label: "LinkedIn",
    handle: "awssbg-at-srmist",
    href: "https://www.linkedin.com/company/awssbg-at-srmist",
    icon: FaLinkedin,
    color: "hover:border-blue-500 hover:text-blue-500",
  },
  {
    label: "Meetup",
    handle: "awssbg-at-srmist",
    href: "https://www.meetup.com/awssbg-at-srmist/",
    icon: SiMeetup,
    color: "hover:border-red-500 hover:text-red-500",
  },
  {
    label: "GitHub",
    handle: "AWSSBG-at-SRMIST",
    href: "https://github.com/AWSSBG-at-SRMIST",
    icon: SiGithub,
    color: "hover:border-on-surface hover:text-on-surface",
  },
  {
    label: "WhatsApp Community",
    handle: "Join our community",
    href: "https://chat.whatsapp.com/D9OKcELrR1E6Ch2fIqRwuZ",
    icon: SiWhatsapp,
    color: "hover:border-green-500 hover:text-green-500",
  },
];

export default function SocialLinksPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="max-w-xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Find us on</p>
          <h1 className="font-display font-bold text-[40px] sm:text-[56px] leading-[0.95] tracking-tight mb-12">
            Our Socials.
          </h1>

          <div className="flex flex-col gap-4">
            {socials.map(({ label, handle, href, icon: Icon, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-5 border-2 border-on-surface/15 p-5 transition-all duration-200 ${color}`}
              >
                <Icon size={24} className="shrink-0 transition-colors duration-200" />
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm uppercase tracking-wide text-on-surface group-hover:inherit transition-colors duration-200">
                    {label}
                  </span>
                  <span className="text-on-surface-variant text-xs mt-0.5 truncate">
                    {handle}
                  </span>
                </div>
                <span className="ml-auto text-on-surface-variant text-xs uppercase tracking-wide shrink-0 group-hover:text-inherit transition-colors duration-200">
                  Visit →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
