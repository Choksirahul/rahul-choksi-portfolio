"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { About } from "@/components/portfolio/About";
import { Contact } from "@/components/portfolio/Contact";
import { ExperienceTimeline } from "@/components/portfolio/ExperienceTimeline";
import { Footer } from "@/components/portfolio/Footer";
import { Hero } from "@/components/portfolio/Hero";
import { Journey } from "@/components/portfolio/Journey";
import { Loader } from "@/components/portfolio/Loader";
import { Navbar } from "@/components/portfolio/Navbar";
import { Process } from "@/components/portfolio/Process";
import { Projects } from "@/components/portfolio/Projects";
import { Recognition } from "@/components/portfolio/Recognition";
import { SearchPalette } from "@/components/portfolio/SearchPalette";
import { SkillsGrid } from "@/components/portfolio/SkillsGrid";

export default function Portfolio() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollYProgress } = useScroll(); const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: .001 });
  useEffect(() => { const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen((value) => !value); } }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, []);
  return <>
    <Loader />
    <a className="skip-link" href="#main">Skip to content</a>
    <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
    <Navbar openSearch={() => setSearchOpen(true)} />
    <SearchPalette open={searchOpen} close={() => setSearchOpen(false)} />
    <main id="main"><Hero /><About /><ExperienceTimeline /><Projects /><SkillsGrid /><Process /><Journey /><Recognition /><Contact /></main>
    <Footer />
  </>;
}
