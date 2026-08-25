import { Code2, DraftingCompass, Gauge, SearchCheck } from "lucide-react";
import { Reveal, SectionHeading } from "./ui";

const steps = [
  { number: "01", title: "Understand", copy: "Clarify the workflow, user need, constraints, and definition of done.", icon: SearchCheck },
  { number: "02", title: "Structure", copy: "Translate designs and requirements into reusable components and clear frontend architecture.", icon: DraftingCompass },
  { number: "03", title: "Build", copy: "Implement responsive, accessible interfaces and connect them to real data and APIs.", icon: Code2 },
  { number: "04", title: "Refine", copy: "Test across devices, improve performance, resolve edge cases, and polish the experience.", icon: Gauge },
];

export function Process() {
  return <section className="section process"><div className="shell"><SectionHeading eyebrow="06 · Process" title="A practical path from brief to shipped interface." />
    <div className="process-grid">{steps.map((step, index) => { const Icon = step.icon; return <Reveal key={step.title} delay={index * .07}><article><span className="process-number">{step.number}</span><Icon size={24} /><h3>{step.title}</h3><p>{step.copy}</p>{index < steps.length - 1 && <i className="process-connector" />}</article></Reveal>; })}</div>
  </div></section>;
}
