import Portfolio from "./portfolio";
import { getSiteUrl } from "@/lib/site-config";
import { portfolioLinks } from "@/data/links";

export default function Home() {
  const siteUrl = getSiteUrl();
  const person = {
    "@context": "https://schema.org", "@type": "Person", name: "Rahul Choksi", jobTitle: "Senior Frontend Developer",
    url: siteUrl, image: `${siteUrl}/images/rahul-choksi-profile.png`,
    email: portfolioLinks.emailHref, address: { "@type": "PostalAddress", addressLocality: "Valsad", addressRegion: "Gujarat", addressCountry: "IN" },
    sameAs: [portfolioLinks.github, portfolioLinks.linkedin],
    knowsAbout: ["React.js", "Angular", "Next.js", "TypeScript", "Webflow", "Shopify", "Frontend Architecture", "Responsive Web Design"],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} /><Portfolio /></>;
}
