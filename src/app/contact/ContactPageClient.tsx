"use client";

import { useState } from "react";
import { Mail, Send, Paperclip, Loader2, ChevronDown, Check } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { Footer } from "@/components/landing/Footer";
import { CornerBrackets } from "@/components/ui/CornerBrackets";

const AGENDA_OPTIONS = [
  { value: "general",     label: "General Query" },
  { value: "sponsorship", label: "Sponsorship & Partnership" },
  { value: "events",      label: "Events & Collaboration" },
  { value: "media",       label: "Media & Press" },
  { value: "other",       label: "Other" },
];

const CONTACTS = [
  { index: "01", label: "For Queries",                    email: "awssbg.srmist@gmail.com" },
  { index: "02", label: "For Sponsorships & Partnerships", email: "sponsorship.awssbg.srmist@gmail.com" },
];

type Status = "idle" | "loading" | "success" | "error";

export function ContactPageClient() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", agenda: "", message: "", attachmentLink: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.agenda) { setErrorMsg("Please select an agenda."); return; }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Something went wrong.");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", agenda: "", message: "", attachmentLink: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const inputClass =
    "w-full bg-transparent border-2 border-on-surface/15 px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors duration-200";

  return (
    <>
      <main className="pt-24 pb-stack-lg min-h-screen">
        {/* Hero */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12 md:mb-16">
          <div className="max-w-3xl">
            <h1 className="font-display text-[40px] sm:text-[56px] md:text-[72px] leading-[0.95] tracking-tight text-on-surface font-bold mb-4">
              Get in Touch.
            </h1>
            <p className="text-label-md text-on-surface-variant leading-relaxed border-l-2 border-primary/40 pl-5">
              Whether you want to collaborate, sponsor an event, or just say hello — we&rsquo;re all ears.
            </p>
          </div>
        </section>

        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* 5-column split from lg, matching the children's lg:col-span-2/3.
              It used to start at md, so from 768 to 1023px each child took one
              fifth: the form was squeezed into a narrow strip with 3/5 empty. */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-16">

            {/* Left — contact info */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] text-primary mb-6 border-b-2 border-on-surface/10 pb-3">
                  Direct Contact
                </h2>
                <div className="flex flex-col">
                  {CONTACTS.map((c) => (
                    <div key={c.index} className="py-5 border-b border-on-surface/10 first:border-t">
                      <p className="font-display text-[10px] text-primary tracking-[0.2em] mb-1">{c.index}</p>
                      <p className="text-xs uppercase tracking-wide text-on-surface-variant/60 mb-2">{c.label}</p>
                      <a
                        href={`mailto:${c.email}`}
                        className="flex items-center gap-2 font-bold text-sm text-on-surface hover:text-primary transition-colors break-all"
                      >
                        <Mail size={14} className="shrink-0" />
                        {c.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] text-primary mb-4 border-b-2 border-on-surface/10 pb-3">
                  What We&rsquo;re Open To
                </h2>
                <ul className="flex flex-col gap-3 text-sm text-on-surface-variant">
                  {[
                    "Sponsorships & Brand Partnerships",
                    "Event Collaborations & Co-hosting",
                    "Speaker Sessions & Workshops",
                    "Media & Press Enquiries",
                    "General Queries",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <h2 className="text-xs uppercase tracking-[0.2em] text-primary mb-6 border-b-2 border-on-surface/10 pb-3">
                Send an Enquiry
              </h2>

              {status === "success" ? (
                <div className="border-2 border-primary/30 bg-primary/5 p-8 text-center">
                  <p className="font-display text-2xl font-bold text-on-surface mb-2">Message sent.</p>
                  <p className="text-sm text-on-surface-variant">We&rsquo;ll get back to you shortly.</p>
                  <button onClick={() => setStatus("idle")} className="mt-6 text-xs uppercase tracking-wide text-primary hover:underline">
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-name" className="text-xs uppercase tracking-wide text-on-surface-variant/60">Name *</label>
                      <input id="contact-name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-email" className="text-xs uppercase tracking-wide text-on-surface-variant/60">Email *</label>
                      <input id="contact-email" required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="your@email.com" className={inputClass} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-agenda" className="text-xs uppercase tracking-wide text-on-surface-variant/60">Agenda *</label>
                    <Select.Root value={form.agenda} onValueChange={(v) => set("agenda", v)}>
                      <Select.Trigger className={`${inputClass} flex items-center justify-between cursor-pointer data-[placeholder]:text-on-surface-variant/40`}>
                        <Select.Value placeholder="Select an agenda" />
                        <Select.Icon>
                          <ChevronDown size={14} className="text-on-surface-variant/60 shrink-0" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          position="popper"
                          sideOffset={4}
                          className="z-50 w-[var(--radix-select-trigger-width)] bg-surface-container-lowest border-2 border-on-surface/15 shadow-lg overflow-hidden"
                        >
                          <Select.Viewport>
                            {AGENDA_OPTIONS.map((o) => (
                              <Select.Item
                                key={o.value}
                                value={o.value}
                                className="flex items-center justify-between px-4 py-3 text-sm text-on-surface cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none transition-colors duration-150 data-[state=checked]:text-primary data-[state=checked]:font-semibold"
                              >
                                <Select.ItemText>{o.label}</Select.ItemText>
                                <Select.ItemIndicator>
                                  <Check size={12} />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-subject" className="text-xs uppercase tracking-wide text-on-surface-variant/60">Subject *</label>
                    <input id="contact-subject" required value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Brief subject line" className={inputClass} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-message" className="text-xs uppercase tracking-wide text-on-surface-variant/60">Message *</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Tell us more..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-attachment" className="text-xs uppercase tracking-wide text-on-surface-variant/60 flex items-center gap-1.5">
                      <Paperclip size={11} /> Attachment Link <span className="text-on-surface-variant/40">(optional)</span>
                    </label>
                    <input id="contact-attachment" value={form.attachmentLink} onChange={(e) => set("attachmentLink", e.target.value)} placeholder="https://drive.google.com/..." className={inputClass} />
                  </div>

                  {errorMsg && (
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-2 flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white text-xs uppercase tracking-[0.15em] font-bold hover:bg-primary/90 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <><Loader2 size={14} className="animate-spin" /> Sending…</>
                    ) : (
                      <><Send size={14} /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
        {/* Map */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-16 md:pt-20 pb-stack-lg">
          <div className="relative border-2 border-on-surface/10 min-h-[260px]">
            <CornerBrackets className="z-10" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3190.6140405386013!2d80.04169612823796!3d12.823465079563613!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f76d4cecae21%3A0x4ffbf1222ec00611!2sS.R.M%20UNIVERSITY%20-K.T.R%20Campus!5e1!3m2!1sen!2sin!4v1781811459471!5m2!1sen!2sin"
              className="w-full h-full min-h-[260px]"
              style={{ border: 0, filter: "saturate(0.6) brightness(0.75) contrast(1.1)" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="AWS Student Builder Group at SRMIST — SRM University, Kattankulathur"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
