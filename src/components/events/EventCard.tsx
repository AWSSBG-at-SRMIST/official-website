"use client";

import { useState } from "react";
import { Calendar, ExternalLink, ImageOff } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { node: any };

// Fixed locale, not `undefined` — `undefined` resolves to the runtime's own
// locale, which differs between the Node server (SSR) and the browser
// (client), producing two different date strings for the same render and
// triggering a hydration mismatch. The time zone is fixed for the same
// reason: without it the server (UTC on Vercel) printed a 9:00 PM IST event
// as 03:30 PM. Events are held in India, so show IST for everyone.
function formatDate(iso?: string) {
  if (!iso) return "TBD";
  try {
    return new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    }) + " IST";
  } catch {
    return iso;
  }
}

function excerpt(text?: string, length = 140) {
  if (!text) return "";
  const plain = text.replace(/\n+/g, " ").replace(/\*\*/g, "");
  return plain.length > length ? `${plain.slice(0, length).trim()}…` : plain;
}

// Meetup descriptions come back as loose markdown (**bold**, "* bullet"
// lines) — this renders just those two constructs rather than dumping the
// raw asterisks as literal text.
function renderInline(text: string, keyPrefix: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyPrefix}-${i}`} className="font-semibold text-on-surface">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    )
  );
}

function renderDescription(text: string) {
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  function flushList(key: string) {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={key} className="list-disc pl-5 space-y-1 my-2">
        {listBuffer.map((item, i) => (
          <li key={i}>{renderInline(item, `${key}-li-${i}`)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  }

  text.split("\n").forEach((line, idx) => {
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^[*-]\s+(.*)$/);
    if (bulletMatch) {
      listBuffer.push(bulletMatch[1]);
    } else {
      flushList(`list-${idx}`);
      if (trimmed) blocks.push(<p key={`p-${idx}`} className="mb-2 last:mb-0">{renderInline(trimmed, `p-${idx}`)}</p>);
    }
  });
  flushList("list-end");

  return blocks;
}

export default function EventCard({ node }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const desc = node.description ?? "";
  const short = excerpt(desc, 240);
  const needsToggle = desc.replace(/\s+/g, "").length > short.replace(/\s+/g, "").length;
  const hasImage = Boolean(node.displayPhoto?.highResUrl) && !imgError;

  return (
    <article className="border-2 border-on-surface/10 bg-surface flex flex-col h-full">
      <div className="relative w-full h-48 bg-surface-container-lowest border-b-2 border-on-surface/10 flex-shrink-0">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={node.displayPhoto.highResUrl}
            alt={node.title ?? "Event cover"}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-on-surface-variant/60">
            <ImageOff className="h-7 w-7" />
            <span className="text-xs uppercase tracking-[0.2em]">No image</span>
          </div>
        )}

        <span className="absolute top-3 left-3 px-2 py-1 border-2 border-primary bg-surface text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
          {node.eventType ?? "Event"}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col text-on-surface">
        <h2 className="font-headline-md text-on-surface font-bold leading-tight">{node.title}</h2>

        <div className="flex items-center gap-1.5 mt-2 text-xs text-primary uppercase tracking-[0.15em]">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(node.dateTime)}
        </div>

        <div className="mt-3 text-sm text-on-surface-variant leading-relaxed flex-1">
          {expanded ? renderDescription(desc) : short}
        </div>

        {needsToggle && (
          <button
            onClick={() => setExpanded((s) => !s)}
            className="mt-2 self-start text-xs uppercase tracking-[0.15em] text-primary hover:underline"
          >
            {expanded ? "Show less" : "View more"}
          </button>
        )}

        <div className="mt-4 pt-4 border-t-2 border-on-surface/10">
          <a
            href={node.eventUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            View on Meetup
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
