"use client";

import type { PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { skillGroups } from "@/data/skills";
import { Reveal, SectionHeading } from "./ui";

export function SkillsGrid() {
  const reduced = useReducedMotion();
  const move = (event: PointerEvent<HTMLElement>) => { if (reduced || matchMedia("(pointer: coarse)").matches) return; const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--rx", `${((event.clientY - rect.top) / rect.height - .5) * -2}deg`); event.currentTarget.style.setProperty("--ry", `${((event.clientX - rect.left) / rect.width - .5) * 2}deg`); };
  const reset = (event: PointerEvent<HTMLElement>) => { event.currentTarget.style.setProperty("--rx", "0deg"); event.currentTarget.style.setProperty("--ry", "0deg"); };
  return <section className="section skills section-anchor" id="skills"><div className="shell"><SectionHeading eyebrow="05 · Skills" title="A toolkit designed for range." copy="Frontend foundations, modern frameworks, delivery platforms, and the engineering practices that hold them together." />
    <div className="skills-bento">{skillGroups.map((group, index) => { const Icon = group.icon; return <Reveal className={`skill-tile ${group.size || "standard"}`} delay={index * .035} key={group.title}><article onPointerMove={move} onPointerLeave={reset}><div className="skill-tile-top"><span>{String(index + 1).padStart(2, "0")}</span><Icon size={22} /></div><h3>{group.title}</h3><div className="skill-pills">{group.items.map((item) => <span key={item}>{item}</span>)}</div></article></Reveal>; })}</div>
  </div></section>;
}
