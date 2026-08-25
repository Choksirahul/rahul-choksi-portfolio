import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getSiteUrl } from "@/lib/site-config";
import "./globals.css";

export function generateMetadata(): Metadata {
  const metadataBase = new URL(getSiteUrl());
  return {
    metadataBase,
    title: { default: "Rahul Choksi — Senior Frontend Developer", template: "%s | Rahul Choksi" },
    description: "Senior Frontend Developer with 8+ years of experience building scalable web applications using React, Angular, Next.js, TypeScript, Webflow and Shopify.",
    keywords: ["Rahul Choksi", "Senior Frontend Developer", "React Developer", "Angular Developer", "Next.js Developer", "Webflow Developer", "Shopify Developer", "Frontend Development", "Valsad"],
    authors: [{ name: "Rahul Choksi" }], creator: "Rahul Choksi",
    alternates: { canonical: "/" },
    openGraph: { type: "website", title: "Rahul Choksi — Senior Frontend Developer", description: "8+ years building thoughtful frontend systems with React, Angular, Next.js, Webflow, and Shopify.", siteName: "Rahul Choksi Portfolio", images: [{ url: "/images/rahul-choksi-og.png", width: 1730, height: 909, alt: "Rahul Choksi — Senior Frontend Developer · React, Angular, Next.js, Webflow" }] },
    twitter: { card: "summary_large_image", title: "Rahul Choksi — Senior Frontend Developer", description: "8+ years building thoughtful frontend systems with React, Angular, Next.js, Webflow, and Shopify.", images: ["/images/rahul-choksi-og.png"] },
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "dark light", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f5f7fb" }, { media: "(prefers-color-scheme: dark)", color: "#08090d" }] };

const themeScript = `(function(){try{var p=localStorage.getItem('portfolio-theme')||'system';var d=p==='system'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):p;document.documentElement.dataset.theme=d;document.documentElement.dataset.themePreference=p}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.dataset.themePreference='system'}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>{children}</body>
    </html>
  );
}
