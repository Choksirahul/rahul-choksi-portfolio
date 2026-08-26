/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { ArrowLeft, Download, Mail } from "lucide-react";
import { portfolioLinks } from "@/data/links";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <main className="not-found-shell">
    <div className="not-found-grid" aria-hidden="true" />
    <section className="not-found-card" aria-labelledby="not-found-title">
      <a className="not-found-brand" href="/" aria-label="Rahul Choksi, home"><span>RC_</span> Rahul Choksi</a>
      <p className="section-eyebrow">404 · Route unavailable</p>
      <h1 id="not-found-title">Page not found.</h1>
      <p>The page may have moved, or the address may be incorrect. The portfolio and résumé are still available below.</p>
      <div className="not-found-actions">
        <a className="button primary" href="/"><ArrowLeft size={17} /> Return home</a>
        <a className="button" href={portfolioLinks.resume}><Download size={17} /> View Resume</a>
        <a className="not-found-contact" href={portfolioLinks.emailHref}><Mail size={15} /> Contact Rahul</a>
      </div>
    </section>
  </main>;
}
