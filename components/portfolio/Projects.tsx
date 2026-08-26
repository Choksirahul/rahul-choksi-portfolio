"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { archiveProjects, projectFilters, projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { Reveal, SectionHeading } from "./ui";

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All"); const visible = filter === "All" ? projects : projects.filter((project) => project.categories.includes(filter));
  return <><section className="section projects section-anchor" id="projects"><div className="shell shell-wide"><SectionHeading eyebrow="03 · Selected work" title="Interfaces built for real workflows." copy="Four recent projects, presented through their context, engineering decisions, and contribution—without confidential screens or invented outcomes." />
    <div className="filter-row" aria-label="Filter projects">{projectFilters.map((item) => <button key={item} className={filter === item ? "active" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <motion.div className="case-list" layout><AnimatePresence mode="popLayout">{visible.map((project, index) => <ProjectCard project={project} index={index} key={project.title} />)}</AnimatePresence>{visible.length === 0 && <motion.div className="empty-filter" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No résumé project is tagged {filter}. Explore the broader skill set below.</motion.div>}</motion.div>
  </div></section>
  <section className="section project-archive section-anchor" id="archive"><div className="shell"><SectionHeading eyebrow="04 · Archive" title="Additional work across products and platforms." />
    <div className="archive-list">{archiveProjects.map((project, index) => <Reveal key={project.title} delay={index * .035}><article><span className="archive-number">{String(index + 5).padStart(2, "0")}</span><div><h3>{project.title}</h3><p>{project.type}</p></div><div className="archive-tags">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div></article></Reveal>)}</div>
  </div></section></>;
}
