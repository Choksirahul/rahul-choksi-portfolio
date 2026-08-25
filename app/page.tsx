import Portfolio from "./portfolio";
import { getSiteUrl } from "@/lib/site-config";

export default function Home() {
  const siteUrl = getSiteUrl();
  const person = {
    "@context": "https://schema.org", "@type": "Person", name: "Rahul Choksi", jobTitle: "Senior Frontend Developer",
    url: siteUrl, image: `${siteUrl}/images/rahul-choksi-profile.png`,
    email: "mailto:choksirahul22@gmail.com", address: { "@type": "PostalAddress", addressLocality: "Valsad", addressRegion: "Gujarat", addressCountry: "IN" },
    sameAs: ["https://github.com/Choksirahul", "https://www.linkedin.com/in/rahul-choksi-a22a88131"],
    knowsAbout: ["React.js", "Angular", "Next.js", "TypeScript", "Webflow", "Shopify", "Frontend Architecture", "Responsive Web Design"],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} /><Portfolio /></>;
}
