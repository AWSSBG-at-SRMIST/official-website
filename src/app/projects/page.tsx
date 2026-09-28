import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { ExternalLink, Star } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { getOrgRepos } from "@/lib/github";

export const metadata: Metadata = pageMetadata({
  path: "/projects",
  title: "Projects",
  description:
    "Explore the open-source software built by the AWS Student Builder Group at SRMIST community.",
});

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-400",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-400",
  Go: "bg-cyan-400",
  Rust: "bg-orange-400",
  "C++": "bg-pink-400",
  Java: "bg-red-400",
  Shell: "bg-emerald-400",
};

export default async function ProjectsPage() {
  const repos = await getOrgRepos();

  return (
    <>
      <main className="pt-24 pb-stack-lg min-h-screen">
        {/* Hero */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">
            Open Source Software
          </p>
          <h1 className="font-display text-[40px] sm:text-[56px] md:text-[72px] leading-[0.98] tracking-tight mb-4 text-on-surface font-bold">
            Projects.
          </h1>
          <p className="text-label-md text-on-surface-variant leading-relaxed max-w-2xl border-l-2 border-primary/40 pl-5">
            Real projects. Real stakes. Everything we ship lives here — built by our
            members on AWS, shipped to production, and open for the world to use.
          </p>
        </section>

        {/* Projects grid */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {repos.length === 0 ? (
            <div className="border-2 border-on-surface/10 p-12 text-center bg-surface-container-lowest">
              <p className="font-display text-2xl font-bold text-on-surface">No projects found.</p>
              <p className="text-on-surface-variant text-sm mt-2">
                Check back soon or visit our{" "}
                <a
                  href="https://github.com/AWSSBG-at-SRMIST"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub organization
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col border-2 border-on-surface/10 hover:border-primary/40 bg-surface-container-lowest hover:bg-surface-container transition-all duration-200 overflow-hidden"
                >
                  {/* GitHub OG preview image */}
                  <div className="relative w-full aspect-[1200/630] border-b-2 border-on-surface/8">
                    <Image
                      src={`https://opengraph.githubassets.com/1/AWSSBG-at-SRMIST/${repo.name}`}
                      alt={`${repo.name} preview`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col gap-3 p-5 flex-1">
                    {/* Name */}
                    <h2 className="font-bold text-on-surface text-base leading-snug group-hover:text-primary transition-colors duration-200">
                      {repo.name}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-on-surface-variant leading-relaxed flex-1 line-clamp-3">
                      {repo.description ?? "No description provided."}
                    </p>

                    {/* Topics */}
                    {repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {repo.topics.slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-primary/25 text-primary"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer row */}
                    <div className="flex items-center justify-between pt-3 border-t border-on-surface/8">
                      <div className="flex items-center gap-3 text-on-surface-variant text-xs">
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <span className={`h-2.5 w-2.5 rounded-full ${LANGUAGE_COLORS[repo.language] ?? "bg-on-surface-variant"}`} />
                            {repo.language}
                          </span>
                        )}
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={11} />
                            {repo.stargazers_count}
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-on-surface-variant group-hover:text-primary transition-colors duration-200 uppercase tracking-wide">
                        View <ExternalLink size={11} />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
