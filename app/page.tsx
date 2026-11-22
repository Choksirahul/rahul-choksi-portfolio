import Portfolio from "./portfolio";
import { getSiteUrl } from "@/lib/site-config";
import { portfolioLinks } from "@/data/links";
import { headers } from "next/headers";

export default async function Home() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const siteUrl = getSiteUrl();
  const person = {
    "@context": "https://schema.org", "@type": "Person", name: "Rahul Choksi", jobTitle: "Senior Frontend Developer",
    url: siteUrl, image: `${siteUrl}/images/rahul-choksi-profile.png`,
    email: portfolioLinks.emailHref, address: { "@type": "PostalAddress", addressLocality: "Valsad", addressRegion: "Gujarat", addressCountry: "IN" },
    sameAs: [portfolioLinks.github, portfolioLinks.linkedin],
    knowsAbout: ["React.js", "Angular", "Next.js", "TypeScript", "Webflow", "Shopify", "Frontend Architecture", "Responsive Web Design"],
  };
  return <><script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} /><Portfolio /></>;
}
