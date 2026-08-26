"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import type { CSSProperties, PointerEvent } from "react";
import type { Project } from "@/data/types";

function ProjectVisual({ type }: { type: Project["visual"] }) {
  if (type === "portal") return <div className="mock-window portal-visual"><div className="mock-sidebar"><i /><i /><i /><i /></div><div className="mock-main"><div className="mock-top" /><div className="quote-row"><span /><span /><span /></div><div className="mock-chart"><i /><i /><i /><i /><i /></div></div></div>;
  if (type === "identity") return <div className="mock-window identity-visual"><div className="identity-ring"><span>ID</span></div><div className="identity-lines"><i /><i /><i /></div><div className="security-chip">TURNSTILE <Check size={12} /></div></div>;
  if (type === "commerce") return <div className="mock-window commerce-visual"><div className="product-device"><i /><span>BrAC</span></div><div className="commerce-copy"><i /><i /><span className="mock-shop">SHOP</span></div></div>;
  return <div className="mock-window dashboard-visual"><div className="dash-nav"><i /><i /><i /></div><div className="dash-body"><div className="dash-stats"><span /><span /><span /></div><div className="dash-table"><i /><i /><i /><i /></div></div></div>;
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  const glow = (event: PointerEvent<HTMLElement>) => { if (reduced) return; const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`); };
  return <motion.article className="case-card" onPointerMove={glow} layout initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .97 }} transition={{ duration: .48, delay: index * .05 }} style={{ "--project-index": `'${project.number}'` } as CSSProperties}>
    <div className="case-visual"><span className="concept-label">Conceptual interface illustration</span><ProjectVisual type={project.visual} /></div>
    <div className="case-content"><div className="case-meta"><span>{project.number}</span><span>{project.period}</span></div><h3>{project.url ? <a className="project-title-link" href={project.url} target="_blank" rel="noopener noreferrer">{project.title}<ArrowUpRight size={22} aria-hidden="true" /></a> : project.title}</h3><dl className="project-facts"><div><dt>My role</dt><dd>{project.role}</dd></div><div><dt>Technology</dt><dd>{project.technologies.join(" · ")}</dd></div></dl><p className="case-overview"><span>Context</span>{project.overview}</p><div className="case-details"><div><h4>What I worked on</h4><ul>{project.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h4>Engineering contribution</h4><p>{project.contribution}</p></div></div></div>
  </motion.article>;
}
