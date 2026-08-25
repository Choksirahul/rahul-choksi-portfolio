"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BriefcaseBusiness, Download, GitBranch, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ openSearch }: { openSearch: () => void }) {
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState("#home");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 36);
    const observers = navigation.map(({ href }) => {
      const element = document.querySelector(href);
      if (!element) return null;
      const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive(href); }, { rootMargin: "-38% 0px -52% 0px" });
      observer.observe(element); return observer;
    });
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); observers.forEach((item) => item?.disconnect()); };
  }, []);
  useEffect(() => { if (!menuOpen) return; const prior = document.body.style.overflow; document.body.style.overflow = "hidden"; const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } }; window.addEventListener("keydown", escape); return () => { document.body.style.overflow = prior; window.removeEventListener("keydown", escape); }; }, [menuOpen]);
  return <motion.header className={`site-header${compact ? " compact" : ""}`} initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .52, duration: .5 }}>
    <div className="nav-shell shell">
      <a className="brand" href="#home" aria-label="Rahul Choksi, home"><span className="brand-mark">RC</span><span className="brand-name">Rahul Choksi</span></a>
      <nav className="desktop-nav" aria-label="Primary navigation">{navigation.map((item) => <a key={item.href} href={item.href} className={active === item.href ? "active" : ""}>{item.label}</a>)}</nav>
      <div className="nav-actions">
        <button className="search-trigger" onClick={openSearch} aria-label="Open portfolio search"><Search size={16} /><span>Search</span><kbd>⌘ / Ctrl K</kbd></button>
        <ThemeToggle />
        <a className="resume-link" href="/Rahul-Choksi-Resume.pdf" download="Rahul-Choksi-Resume.pdf"><Download size={15} /> Download Resume</a>
        <button ref={menuButton} className="icon-button menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </div>
    <AnimatePresence>{menuOpen && <motion.div id="mobile-navigation" className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}>
      <div className="mobile-menu-kicker"><span>RC_</span><p>Senior Frontend Developer</p></div>
      <nav aria-label="Mobile navigation">{navigation.map((item, index) => <motion.a initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .06 + index * .035 }} key={item.href} href={item.href} className={active === item.href ? "active" : ""} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item.label}</motion.a>)}</nav>
      <div className="mobile-menu-footer"><button onClick={() => { setMenuOpen(false); openSearch(); }}><Search size={18} /> Search portfolio</button><a href="/Rahul-Choksi-Resume.pdf" download="Rahul-Choksi-Resume.pdf"><Download size={18} /> Download Resume</a><a href="https://github.com/Choksirahul" target="_blank" rel="noopener noreferrer"><GitBranch size={18} /> GitHub</a><a href="https://www.linkedin.com/in/rahul-choksi-a22a88131" target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={18} /> LinkedIn</a><div className="mobile-theme"><span>Theme</span><ThemeToggle /></div></div>
    </motion.div>}</AnimatePresence>
  </motion.header>;
}
