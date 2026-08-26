import { Award, ExternalLink, Medal, Trophy } from "lucide-react";
import { portfolioLinks } from "@/data/links";
import { Reveal, SectionHeading } from "./ui";

const items = [
  { eyebrow: "Certification", title: "Microsoft Exam 70-480", copy: "Programming in HTML5 with JavaScript and CSS3", detail: "Score · 757/1000", icon: Award, url: portfolioLinks.microsoftCertification },
  { eyebrow: "Award", title: "iFest runner-up", copy: "Mobile App Development at DAIICT Gandhinagar", detail: "Runner-up position", icon: Trophy },
  { eyebrow: "Recognition", title: "Academic Excellence", copy: "Awarded in the second year of college", detail: "3rd Sem SGPA · 10/10", icon: Medal },
];

export function Recognition() {
  return <section className="section recognition section-anchor" id="recognition"><div className="shell"><SectionHeading eyebrow="09 · Recognition" title="Curiosity, backed by outcomes." />
    <div className="recognition-grid">{items.map((item, index) => { const Icon = item.icon; return <Reveal key={item.title} delay={index * .07}><article><div className="recognition-icon"><Icon size={25} /></div><span>{item.eyebrow}</span><h3>{item.url ? <a className="verified-link" href={item.url} target="_blank" rel="noopener noreferrer">{item.title} <ExternalLink size={15} aria-hidden="true" /></a> : item.title}</h3><p>{item.copy}</p><strong>{item.detail}</strong></article></Reveal>; })}</div>
  </div></section>;
}
