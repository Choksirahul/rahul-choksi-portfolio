"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/experience";
import { Reveal, SectionHeading } from "./ui";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null); const inView = useInView(ref, { once: true }); const reduced = useReducedMotion(); const [count, setCount] = useState(0);
  useEffect(() => { if (!inView) return; if (reduced) { const timer = setTimeout(() => setCount(value), 0); return () => clearTimeout(timer); } const start = performance.now(); const duration = 900; let frame = 0; const tick = (now: number) => { const progress = Math.min((now - start) / duration, 1); setCount(Math.round(value * (1 - Math.pow(1 - progress, 3)))); if (progress < 1) frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame); }, [inView, reduced, value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export function About() {
  return <section className="section about section-anchor" id="about"><div className="shell"><SectionHeading eyebrow="01 · About" title="Systems thinking. Human outcomes." copy="I work where design systems, product requirements, and clean implementation meet." />
    <div className="about-grid"><Reveal className="about-statement" variant="left"><p>My focus is simple: make complex products feel clear. I translate design intent into reusable components, connect interfaces to real data, and pay attention to the performance and responsive details that determine whether a product feels finished.</p></Reveal><Reveal className="about-detail"><p>Across enterprise applications, product dashboards, marketing sites, and eCommerce platforms, I collaborate closely with design, backend, QA, and delivery teams to ship reliable experiences.</p><div className="about-tags"><span>Component architecture</span><span>Responsive UI</span><span>Performance</span><span>SEO</span></div></Reveal></div>
    <div className="stats-grid">{stats.map((stat, index) => <motion.article key={stat.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }}><strong><Counter value={stat.value} suffix={stat.suffix} /></strong><span>{stat.label}</span></motion.article>)}</div>
  </div></section>;
}
