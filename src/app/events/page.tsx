import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import EventCard from "@/components/events/EventCard";
import { Footer } from "@/components/landing/Footer";
import { getPastEventEdges } from "@/lib/meetup";
import { CalendarDays, Globe2, Link2 } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  path: "/events",
  title: "Events",
  description:
    "Past workshops, hackathons, and events from the AWS Student Builder Group at SRMIST.",
});

// Meetup's API is unofficial/reverse-engineered and occasionally rejects a
// request (401/503) even when the credentials are fine — ISR caching turned
// a single bad build into a permanently-stale page. Fetching fresh on every
// request (getPastEventEdges retries once internally too) means a flaky
// Meetup response can delay a page load by a second, at worst — never
// freeze wrong data in place.
export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const edges = await getPastEventEdges();

  const stats = [
    { index: "01", icon: CalendarDays, label: "Sessions", value: `${edges.length} Hosted` },
    { index: "02", icon: Globe2, label: "Formats", value: "Online & Physical" },
    { index: "03", icon: Link2, label: "Platform", value: "Meetup" },
  ];

  return (
    <>
    <main className="pt-24 pb-stack-lg min-h-screen">
      {/* Hero */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12 md:mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">
          Workshops, Hackathons &amp; Meetups
        </p>
        <h1 className="font-display text-[40px] sm:text-[56px] md:text-[72px] leading-[0.98] tracking-tight mb-4 text-on-surface font-bold">
          Events.
        </h1>
        <p className="text-label-md text-on-surface-variant leading-relaxed max-w-2xl border-l-2 border-primary/40 pl-5">
          A record of the sessions run by AWS Student Builder Group at SRMIST — every
          one hosted and RSVP&apos;d through our community Meetup group.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-16 md:mb-20">
        <h2 className="font-label-sm text-sm uppercase tracking-[0.2em] text-primary mb-6 border-b-2 border-on-surface/10 pb-3">
          At a Glance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-l border-on-surface/10">
          {stats.map((stat) => (
            stat.label === "Platform" ? (
              <a
                key={stat.index}
                href="https://www.meetup.com/awssbg-srmist/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 border-r border-b border-on-surface/10 hover:bg-surface-container-lowest transition-colors"
              >
                <div className="flex items-center gap-2 font-display text-xs text-primary tracking-[0.2em] mb-3">
                  <stat.icon className="h-3.5 w-3.5" />
                  {stat.index}
                </div>
                <h4 className="font-headline-md text-on-surface mb-1 font-bold">{stat.value}</h4>
                <p className="text-sm text-on-surface-variant">{stat.label}</p>
              </a>
            ) : (
              <div key={stat.index} className="p-6 border-r border-b border-on-surface/10">
                <div className="flex items-center gap-2 font-display text-xs text-primary tracking-[0.2em] mb-3">
                  <stat.icon className="h-3.5 w-3.5" />
                  {stat.index}
                </div>
                <h4 className="font-headline-md text-on-surface mb-1 font-bold">{stat.value}</h4>
                <p className="text-sm text-on-surface-variant">{stat.label}</p>
              </div>
            )
          ))}
        </div>
      </section>

      {/* Past Events */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-16 md:mb-20">
        <h2 className="font-label-sm text-sm uppercase tracking-[0.2em] text-primary mb-6 border-b-2 border-on-surface/10 pb-3">
          Past Events
        </h2>

        {edges.length === 0 ? (
          <div className="border-2 border-on-surface/10 p-8 text-center bg-surface-container-lowest text-on-surface">
            <p className="text-lg font-semibold">No past events found.</p>
            <p className="mt-2 text-sm text-on-surface-variant">Check back later.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {edges.map(({ node }: { node: Record<string, unknown> }) => (
              <EventCard key={String(node.id)} node={node} />
            ))}
          </div>
        )}
      </section>
    </main>
    <Footer />
    </>
  );
}
