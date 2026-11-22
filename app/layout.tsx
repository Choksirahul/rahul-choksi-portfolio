import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { Bodoni_Moda, Josefin_Sans } from "next/font/google";
import { getSiteUrl } from "@/lib/site-config";
import "./globals.css";
import "./responsive.css";
import "./splash.css";
import "./header.css";
import "./scroll-to-top.css";

const heroSerif = Bodoni_Moda({ subsets: ["latin"], weight: ["900"], variable: "--font-hero-serif", display: "swap" });
const GeistSans = localFont({ src: "./fonts/GeistSans-latin.woff2", weight: "100 900", variable: "--font-geist-sans", display: "swap", preload: false });
const heroSans = Josefin_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-hero-sans", display: "swap" });

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
    icons: { icon: "/favicon.svg?v=2", shortcut: "/favicon.svg?v=2" },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light", themeColor: "#294a35" };

const themeScript = `(function(){try{var p=localStorage.getItem('portfolio-theme')||'system';var d=p==='system'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):p;document.documentElement.dataset.theme=d;document.documentElement.dataset.themePreference=p}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.dataset.themePreference='system'}})()`;
const introScript = `(function(){try{if(location.hash||sessionStorage.getItem('portfolio-intro-seen')||matchMedia('(prefers-reduced-motion:reduce)').matches)return;document.documentElement.dataset.intro='pending';var block=function(e){if(document.documentElement.dataset.intro==='pending')e.preventDefault()};addEventListener('wheel',block,{passive:false});addEventListener('portfolio:intro-complete',function(){removeEventListener('wheel',block)},{once:true});setTimeout(function(){if(document.documentElement.dataset.intro==='pending'){document.documentElement.dataset.intro='complete';document.querySelectorAll('main,.editorial-header,.skip-link').forEach(function(e){e.inert=false});dispatchEvent(new Event('portfolio:intro-complete'))}},7000)}catch(e){}})()`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} /><script nonce={nonce} dangerouslySetInnerHTML={{ __html: introScript }} /></head>
      <body className={`${GeistSans.variable} ${heroSerif.variable} ${heroSans.variable}`}>{children}</body>
    </html>
  );
}
