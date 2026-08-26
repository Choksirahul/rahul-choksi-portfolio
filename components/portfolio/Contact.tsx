"use client";

import { AlertCircle, BriefcaseBusiness, Check, Copy, ExternalLink, GitBranch, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { portfolioLinks } from "@/data/links";
import { MagneticLink, Reveal } from "./ui";

export function Contact() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(portfolioLinks.email); setCopyState("copied"); }
    catch { setCopyState("failed"); }
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyState("idle"), 2500);
  };
  const CopyIcon = copyState === "copied" ? Check : copyState === "failed" ? AlertCircle : Copy;
  const copyLabel = copyState === "copied" ? "Copied ✓" : copyState === "failed" ? "Copy unavailable" : "Copy email";
  const copyStatus = copyState === "copied" ? "Email address copied to clipboard" : copyState === "failed" ? "Copy unavailable. Use the email link instead." : "";
  return <section className="section contact section-anchor" id="contact"><div className="shell"><Reveal variant="scale"><div className="contact-panel"><div className="contact-glow" /><span className="section-eyebrow">10 · Contact</span><h2>Let’s build something meaningful.</h2><p>Have a frontend challenge, a product idea, or a team that values thoughtful engineering? I’d be glad to hear about it.</p><div className="contact-actions"><MagneticLink href={portfolioLinks.emailHref} className="primary"><Mail size={18} /> Start a conversation <span aria-hidden="true">→</span></MagneticLink><button className="button copy-button" onClick={copyEmail}><CopyIcon size={18} />{copyLabel}</button><span className="sr-only" role="status" aria-live="polite">{copyStatus}</span></div><div className="contact-links"><a href={portfolioLinks.github} target="_blank" rel="noopener noreferrer"><GitBranch size={20} /><span><small>Code & projects</small>GitHub</span><ExternalLink size={16} /></a><a href={portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={20} /><span><small>Professional profile</small>LinkedIn</span><ExternalLink size={16} /></a></div></div></Reveal></div></section>;
}
