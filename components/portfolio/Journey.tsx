import { GraduationCap } from "lucide-react";
import { education, journey } from "@/data/experience";
import { Reveal, SectionHeading } from "./ui";

export function Journey() {
  return <><section className="section journey section-anchor" id="journey"><div className="shell"><SectionHeading eyebrow="07 · Career journey" title="Built through steady progression." copy="From computer science foundations to enterprise frontend architecture." />
    <div className="journey-line">{journey.map((item, index) => <Reveal className="journey-stop" delay={index * .06} key={item.year}><article><span className="journey-year">{item.year}</span><i /><h3>{item.title}</h3><p>{item.copy}</p></article></Reveal>)}</div>
  </div></section>
  <section className="section education section-anchor" id="education"><div className="shell"><SectionHeading eyebrow="08 · Education" title="Strong technical foundations." />
    <div className="education-grid">{education.map((item, index) => <Reveal key={item.title} delay={index * .06}><article><div className="education-icon"><GraduationCap size={22} /></div><span>{item.period}</span><h3>{item.title}</h3><p>{item.place}</p><strong>{item.result}</strong></article></Reveal>)}</div>
  </div></section></>;
}
