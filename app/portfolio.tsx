"use client";

import Image from "next/image";
import {
  ArrowDown, BriefcaseBusiness, Download, ExternalLink, GitBranch,
  Mail, MapPin, Menu, Search, X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { education } from "@/data/experience";
import { portfolioLinks } from "@/data/links";
import { archiveProjects, projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import Splash from "@/components/portfolio/splash";
import RunningText from "@/components/portfolio/running-text";
import ScrollToTop from "@/components/portfolio/scroll-to-top";
import { useActiveNavigation, useHeaderMotion, useHeroMotion, useOverlayMotion, DeferredSectionMotion } from "@/components/portfolio/motion";

const nav = [
  { label: "About me", href: "#about" },
  { label: "Resume", href: "#experience" },
  { label: "Work", href: "#projects" },
];
const headerNav = [
  nav[0],
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  nav[2],
  { label: "Archive", href: "#archive" },
];

const career = [
    ["2018—Present", "Sr. Associate L1 · Frontend Developer", "1Rivet · Valsad, India"],
    ["2024—2026", "Product & commerce delivery", "Keepr and DUI platforms"],
    ["2026—Present", "Enterprise frontend leadership", "TimePayment and MajorKey Tech"],
  ];


function Star({ tone = "coral" }: { tone?: "coral" | "mustard" | "ivory" }) {
  return <span className={`reference-star ${tone}`} aria-hidden="true" />;
}

function Brand() {
  return <a className="editorial-brand" href="#home" aria-label="Rahul Choksi, home"><Star /><span>Rahul Choksi</span></a>;
}

function Header({ onSearch }: { onSearch: () => void }) {
  const header = useRef<HTMLElement>(null);
  const mobileMenu = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  useHeaderMotion(header);
  useOverlayMotion(mobileMenu, open);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = header.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      const value = window.scrollY < 24 ? "true" : "false";
      if (element && element.dataset.atTop !== value) element.dataset.atTop = value;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.removeEventListener("scroll", scroll); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 1100px)");
    const resize = () => { if (desktop.matches) setOpen(false); };
    window.addEventListener("keydown", dismiss);
    desktop.addEventListener("change", resize);
    return () => { window.removeEventListener("keydown", dismiss); desktop.removeEventListener("change", resize); };
  }, [open]);
  return <header ref={header} className="editorial-header">
    <Brand />
    <nav className="editorial-nav" aria-label="Primary navigation">{headerNav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
    <div className="editorial-actions">
      <button className="plain-icon global-search-trigger" onClick={() => { setOpen(false); onSearch(); }} aria-label="Search portfolio" aria-haspopup="dialog" aria-keyshortcuts="Control+k Meta+k" title="Search portfolio (⌘K / Ctrl+K)"><Search size={19} /></button>
      <a className="pill mustard" href="#contact">Get in touch!</a>
      <button ref={menuButton} className="plain-icon mobile-trigger" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-controls="mobile-navigation" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav ref={mobileMenu} id="mobile-navigation" className="mobile-editorial-nav" aria-label="Mobile navigation">
      {headerNav.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
      <a href="#contact" onClick={() => setOpen(false)}>Get in touch!</a>
      <button onClick={() => { setOpen(false); onSearch(); }}><Search size={18} /> Search portfolio</button>
      <a href={portfolioLinks.resume} download="Rahul-Choksi-Resume.pdf"><Download size={18} /> Download resume</a>
    </nav>}
  </header>;
}

function SearchOverlay({ open, close }: { open: boolean; close: () => void }) {
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDivElement>(null);
  useOverlayMotion(dialog, open);
  const items = useMemo(() => [
    ...headerNav.map((item) => ({ title: item.label, detail: "Page section", href: item.href })),
    { title: "Contact Rahul", detail: "Contact details and professional links", href: "#contact" },
    ...projects.map((item, index) => ({ title: item.title, detail: item.technologies.join(" · "), href: index === 0 ? "#projects" : `#project-${String(index + 1).padStart(2, "0")}` })),
    ...archiveProjects.map((item, index) => ({ title: item.title, detail: item.type, href: index < 2 ? `#project-0${index + 5}` : "#archive" })),
    ...skillGroups.flatMap((group) => group.items.map((item) => ({ title: item, detail: group.title, href: "#skills" }))),
    ...education.map(item => ({ title: item.title, detail: `${item.period} · ${item.place} · ${item.result}`, href: "#experience" })),
    ...career.map(([period, title, place]) => ({ title, detail: `${period} · ${place}`, href: "#experience" })),
    { title: "Download Rahul’s Resume", detail: "PDF résumé", href: portfolioLinks.resume },
    { title: "Email Rahul", detail: portfolioLinks.email, href: portfolioLinks.emailHref },
  ], []);
  const results = items.filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(query.toLowerCase())).slice(0, 12);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
      ? document.activeElement : document.querySelector<HTMLElement>(".global-search-trigger");
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector("input")?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const controls = dialog.current?.querySelectorAll<HTMLElement>('a[href], button, input');
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", keyboard);
    return () => { document.body.style.overflow = prior; window.removeEventListener("keydown", keyboard); const target = previousFocus?.isConnected ? previousFocus : document.querySelector<HTMLElement>(".global-search-trigger"); target?.focus({ preventScroll: true }); };
  }, [open, close]);
  if (!open) return null;
  return <div className="search-backdrop"><button className="search-dismiss" onClick={close} aria-label="Close search" tabIndex={-1} /><div ref={dialog} className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
    <div className="search-heading"><span className="search-monogram">RC_</span><div><h2 id="search-title">Search Rahul’s Portfolio</h2><p>Projects, skills, experience, and shortcuts.</p></div><button className="search-close" onClick={close} aria-label="Close search"><X /></button></div>
    <label className="search-input"><span className="sr-only">Search projects, skills, and technologies</span><Search size={21} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, skills, technologies…" /></label>
    <div className="search-results">{results.length ? results.map((item) => <a className="search-result" href={item.href} key={`${item.title}-${item.detail}`} onClick={close} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}><span className="result-icon">{item.title.slice(0, 1)}</span><span className="result-copy"><strong>{item.title}</strong><small>{item.detail}</small></span><ExternalLink size={15} /></a>) : <p className="search-empty">No matches. Try React, Shopify, education, or contact.</p>}</div>
  </div></div>;
}

function Hero() {
  const hero = useRef<HTMLElement>(null);
  useHeroMotion(hero);
  return <section ref={hero} className="editorial-hero" id="home">
    <h1 className="hero-heading">PORTFOLIO</h1>
    <div className="hero-outline" aria-hidden="true"><span>PORTFOLIO</span><span>PORTFOLIO</span><span>PORTFOLIO</span></div>
    <div className="hero-photo" aria-hidden="true"><Image src="/images/rahul-choksi-profile.png" alt="" fill loading="eager" fetchPriority="high" sizes="(max-width: 767px) 70vw, (max-width: 1279px) 38vw, 525px" /></div>
    <div className="hero-stars" aria-hidden="true"><Star tone="mustard" /><Star tone="mustard" /><Star tone="mustard" /></div>
    <p className="hero-statement">I build responsive, high-performance web products where thoughtful design meets sound frontend architecture.</p>
    <div className="hero-links"><a href={portfolioLinks.github} target="_blank" rel="noopener noreferrer">GH: /Choksirahul</a><a href={portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer">LI: /rahul-choksi</a><a href={portfolioLinks.emailHref}>EM: choksirahul22</a></div>
    <a className="scroll-disc" href="#about" aria-label="Scroll to About me"><span>Scroll<br />down</span><ArrowDown size={21} /></a>
  </section>;
}

function AboutResume() {
  return <>
    <section className="intro-section paper" id="about">
      <div className="section-mini-nav"><Brand /><div>{nav.map((item) => <a key={item.href} href={item.href} aria-current={item.href === "#about" ? "location" : undefined}>{item.label}</a>)}<a className="pill mustard" href="#contact">Get in touch!</a></div></div>
      <div className="intro-grid editorial-shell">
        <div className="intro-copy"><h2>Hello,<br />I’m Rahul!</h2><p>I’m a Senior Frontend Developer based in Valsad, India, with 8+ years of experience creating scalable web applications and polished digital experiences.</p><a className="search-link" href={portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer"><Search size={20} /> linkedin.com/in/rahul-choksi</a></div>
        <div className="intro-portrait"><div className="portrait-block"><Image src="/images/rahul-choksi-profile.png" alt="Rahul Choksi, Senior Frontend Developer" fill sizes="(max-width: 800px) 82vw, 420px" /></div><span className="floating-pill one">8+ years</span><span className="floating-pill two">Frontend</span><aside className="contact-card"><h2>Contact</h2><p><MapPin size={17} /> Valsad, Gujarat, India</p><a href={portfolioLinks.emailHref}><Mail size={17} /> {portfolioLinks.email}</a><a href={portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={17} /> LinkedIn profile</a></aside></div>
      </div>
    </section>
    <section className="resume-section" id="experience">
      <div className="resume-word" aria-hidden="true">RESUME<br />RESUME<br />RESUME</div>
      <div className="resume-grid editorial-shell">
        <div className="resume-left">
          <h2>Education</h2>
          <div className="reference-timeline education-list">{education.map((item) => <article key={item.period}><Star /><span>{item.period}</span><div><h3>{item.title}</h3><p>{item.place}</p><strong>{item.result}</strong></div></article>)}</div>
          <div className="experience-box"><h2>Experience</h2><div className="reference-timeline experience-timeline">{career.map(([period, title, place]) => <article key={`${period}-${title}`}><Star tone="ivory" /><span>{period}</span><div><h3>{title}</h3><p>{place}</p></div></article>)}</div><div className="trait-row"><span>Reusable UI</span><span>Responsive</span><span>Performance</span><span>Accessibility</span></div></div>
        </div>
        <div className="skills-column" id="skills"><h2>Technical skills</h2><div className="skill-groups">{skillGroups.map((group) => <article key={group.title}><h3>{group.title}</h3><div>{group.items.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div></div>
      </div>
      <div className="resume-extras editorial-shell">
        <section><h2>Languages</h2><div className="language-grid"><article><strong>JavaScript</strong><span>Advanced</span></article><article><strong>TypeScript</strong><span>Professional</span></article><article><strong>HTML & CSS</strong><span>Advanced</span></article></div></section>
        <section><h2>Activities</h2><div className="reference-timeline compact-timeline"><article><Star /><span>2018</span><div><h3>iFest · DAIICT</h3><p>Runner-up</p></div></article><article><Star /><span>2014—18</span><div><h3>Academic excellence</h3><p>B.Tech C.G.P.A. 9.3/10</p></div></article></div></section>
        <section className="interests"><h2>Interests</h2><div><article><span>UI</span><p>Interface<br />craft</p></article><article><span>DS</span><p>Design<br />systems</p></article><article><span>PX</span><p>Performance<br />engineering</p></article><article><span>A11Y</span><p>Accessible<br />products</p></article></div></section>
      </div>
    </section>
  </>;
}

function Contents() {
  const items = [["01", "Enterprise", "TimePayment portals", "#projects"], ["02", "Identity", "MajorKey platform", "#project-02"], ["03", "Commerce", "Keepr storefront", "#project-03"], ["04", "Dashboard", "DUI affiliate tools", "#project-04"]];
  return <section className="contents-section" id="contents"><div className="editorial-shell"><h2><span className="contents-stars"><Star /><Star /></span>Contents<Star /></h2><div className="contents-grid">{items.map(([, title, copy, href]) => <a href={href} key={title}><h3>{title}</h3><p>{copy}</p></a>)}</div></div></section>;
}

function SectionBanner({ children }: { children: React.ReactNode }) {
  return <div className={`black-banner${children === "Frontend Development" ? " work-opening-banner" : children === "Selected Projects" ? " selected-projects-banner" : ""}`}><h2><Star tone="mustard" />{children}{(children === "Frontend Development" || children === "Selected Projects") && <><Star tone="mustard" /><Star tone="mustard" /></>}</h2></div>;
}

function BrowserMock({ kind }: { kind: string }) {
  if (kind === "portal") return <div className="browser-mock portal-mock"><div className="browser-bar"><i /><i /><i /><span>customer.portal</span></div><div className="portal-layout"><aside><b>TP</b><i /><i /><i /><i /></aside><main><div className="mock-heading"><span /><small /></div><div className="metric-row"><i /><i /><i /></div><div className="mock-table"><span /><span /><span /><span /><span /></div></main></div></div>;
  if (kind === "identity") return <div className="browser-mock identity-mock"><div className="browser-bar"><i /><i /><i /><span>identity.platform</span></div><div className="identity-layout"><div className="identity-lock">ID</div><h4>Identity, secured.</h4><p>Accessible verification · SEO foundations · Glossary architecture</p><div><span>TURNSTILE</span><span>WCAG</span><span>SEO</span></div></div></div>;
  if (kind === "commerce") return <div className="browser-mock commerce-mock"><div className="commerce-device"><span>BrAC</span><i /></div><div><p>Smart alcohol testing</p><h4>Know your number.</h4><span className="mock-buy">Shop devices</span></div></div>;
  return <div className="browser-mock dashboard-mock"><div className="browser-bar"><i /><i /><i /><span>affiliate.dashboard</span></div><div className="dashboard-layout"><aside><b>DUI</b><i /><i /><i /></aside><main><div className="chart"><i /><i /><i /><i /><i /></div><div className="dash-list"><span /><span /><span /></div></main></div></div>;
}

function ProjectTileArt({ kind }: { kind: number }) {
  return <svg className="project-tile-art" viewBox="0 0 160 115" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 0 && <><rect x="17" y="12" width="126" height="91" rx="5" /><path d="M17 30h126M49 30v73M27 42h12m-12 13h12m-12 13h12" /><circle cx="77" cy="54" r="10" /><path d="M59 82c0-20 36-20 36 0M107 46h23m-23 12h17m-23 19h23m-23 12h17" /></>}
    {kind === 1 && <><path d="M20 44h120v58H20zM15 44l12-25h106l12 25M25 19l-4 25m31-25-2 25m30-25v25m28-25 2 25m23-25 6 25M15 44q13 17 26 0 13 17 26 0 13 17 26 0 13 17 26 0 13 17 26 0" /><rect x="33" y="65" width="31" height="25" /><path d="M88 102V66h32v36M101 80h5" /></>}
    {kind === 2 && <><path d="M43 10h58l22 22v72H43zM101 10v22h22M57 48h51M57 59h51M57 70h20M57 87h20" /><path d="M99 76v19m6-16c-12-7-20 7-6 7s5 14-6 7" /><path d="M32 24H24v73h8" /></>}
    {kind === 3 && <><path d="M22 78h83v17H22zM38 78V48h39v30M77 59h21l15 19M48 48V37h19v11M105 78l12-31 18 6-7 36M118 45l8-23 19 7-9 23" /><circle cx="43" cy="95" r="10" /><circle cx="91" cy="95" r="10" /><path d="M33 60h32M53 48v30" /></>}
    {kind === 4 && <><rect x="12" y="17" width="107" height="70" rx="4" /><path d="M12 32h107M25 44h42v30H25zM77 45h28M77 56h21M77 68h25M58 87v12m-17 0h37" /><rect x="110" y="49" width="36" height="57" rx="5" className="tile-art-solid" /><path d="M122 56h12m-16 10h20m-20 9h20m-20 9h15m-8 14h5" /></>}
    {kind === 5 && <><rect x="18" y="14" width="56" height="40" rx="4" /><rect x="86" y="14" width="56" height="40" rx="4" /><rect x="18" y="66" width="56" height="36" rx="4" /><rect x="86" y="66" width="56" height="36" rx="4" /><path d="M30 27h32m-32 12h20M98 26h32m-32 14h32M32 84h28m41-8-6 8 6 8m26-16 6 8-6 8m-11-18-5 20" /></>}
    {kind === 6 && <><rect x="14" y="13" width="42" height="26" rx="4" /><rect x="104" y="13" width="42" height="26" rx="4" /><rect x="59" y="76" width="42" height="26" rx="4" /><path d="M56 26h39m-6-6 6 6-6 6M125 39v19H80v18M35 39v19h45M28 26h13m77 0h13M71 89h18" /><path d="M75 53l5 5-5 5" /></>}
    {kind === 7 && <><rect x="59" y="9" width="42" height="25" rx="4" /><rect x="12" y="76" width="37" height="27" rx="4" /><rect x="62" y="76" width="37" height="27" rx="4" /><rect x="112" y="76" width="37" height="27" rx="4" /><path d="M80 34v21M30 76V55h100v21M80 55v21M72 21h16M23 89h15m35 0h15m35 0h15" /><circle cx="80" cy="55" r="4" className="tile-art-solid" /></>}
    {kind === 8 && <><rect x="17" y="15" width="126" height="87" rx="5" /><path d="M17 32h126M29 25h2m8 0h2m8 0h2" /><circle cx="61" cy="65" r="23" /><path d="m50 65 8 8 15-17M98 49h29M98 62h21M98 76h25M98 89h15" /></>}
  </svg>;
}

function LeadProject() {
  const project = projects[0];
  return <section className="lead-project case-study" id="projects">
    <div className="project-mini-nav"><Brand /><nav aria-label="Project navigation"><a href="#about">About me</a><a href="#projects" aria-current="location">Work</a><a className="pill mustard" href="#contact">Get in touch!</a></nav></div>
    <div className="project-opening">
      <RunningText className="running-type">ENTERPRISE PORTAL</RunningText>
      <div className="editorial-shell">
        <div className="case-number">01</div>
        <div className="project-intro"><div className="project-intro-copy"><h2>TimePayment</h2><p className="project-role">Customer & Vendor Portal</p><p>{project.overview}</p><div className="project-byline"><span>{project.period}</span><span>{project.role}</span></div></div><figure className="lead-mock"><BrowserMock kind={project.visual} /><figcaption>Illustrative interface · actual product screens not shown</figcaption></figure></div>
        <div className="project-summary-grid">
          <div className="project-visual-story"><div className="project-detail-grid" aria-label="Frontend focus areas">{["Customer portal", "Vendor portal", "Quotations", "Equipment rental", "Responsive UI", "Components", "Workflows", "Architecture", "Usability"].map((label, index) => <div className={`project-detail-tile tile-${index % 3}`} key={label}><ProjectTileArt kind={index} /><strong>{label}</strong></div>)}</div><p>{project.overview}</p><p>{project.contribution}</p></div>
          <div className="project-goals"><h3>The goals</h3><ul className="project-goal-panel">{project.responsibilities.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul><h4>Skills acquired</h4><div className="tag-row"><span>Frontend leadership</span><span>Component architecture</span><span>Responsive development</span><span>Enterprise usability</span></div><h4 className="project-tools-heading">Tools & Apps</h4><div className="project-tool-grid">{[["Re", "React.js", "Reusable interface components"], ["JS", "JavaScript", "Application interactions"], ["Git", "Git", "Version control"], ["API", "REST APIs", "Connected data workflows"]].map(([mark, title, description]) => <article key={title}><span aria-hidden="true">{mark}</span><div><strong>{title}</strong><p>{description}</p></div></article>)}</div></div>
        </div>
      </div>
    </div>
    <ProjectTasks />
  </section>;
}

function ProjectTasks() {
  const project = projects[0];
  return <section className="project-tasks" id="project-tasks" aria-labelledby="project-tasks-title">
    <div className="task-research editorial-shell"><h3 id="project-tasks-title">The tasks</h3><h4>01 - Frontend planning</h4><div className="task-research-columns"><article><h5>Interface</h5><p>Responsive customer and vendor experiences for equipment rental and quotation management.</p></article><article><h5>Target</h5><p>Customers and vendors managing quotations, rental equipment, and their interactions across both portals.</p></article><article><h5>Values</h5><p>Reusable components<br />Enterprise usability<br />Responsive application workflows</p></article></div></div>
    <div className="task-execution"><div className="task-execution-grid editorial-shell">
      <figure className="task-phone"><div className="task-phone-notch" /><div className="task-phone-screen"><div className="task-phone-brand">TP <span>TimePayment</span></div><p className="task-phone-eyebrow">CUSTOMER & VENDOR PORTAL</p><h4>Connected<br />workflows.</h4><ProjectTileArt kind={0} /><div className="task-phone-divider" /><h5>Frontend development</h5><p>{project.overview}</p><ul>{project.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div><figcaption>Illustrative interface</figcaption></figure>
      <article className="task-execution-card"><div className="task-execution-art"><ProjectTileArt kind={5} /></div><h4>02 - Component system</h4><p>{project.responsibilities[2]}.</p><p>Responsive interfaces for quotation generation and customer interactions.</p><div className="task-palette" role="img" aria-label="Project presentation color palette"><span /><span /><span /><span /></div></article>
      <article className="task-execution-card"><div className="task-execution-art"><ProjectTileArt kind={6} /></div><h4>03 - Workflow delivery</h4><p>{project.responsibilities[0]}.</p><p>{project.contribution}</p></article>
    </div></div>
    <div className="task-results editorial-shell"><h3>The results</h3><div className="task-results-band"><div className="task-results-copy"><p>{project.contribution}</p><ul>{project.responsibilities.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></div><aside className="task-results-overview"><div className="task-results-stars"><Star tone="mustard" /><Star tone="mustard" /></div><p className="task-overview-period">{project.period}</p><h4>Delivery overview</h4><p>Customer & Vendor Portal</p><dl><div><dt>Frontend role</dt><dd>Lead development</dd></div><div><dt>Core framework</dt><dd>React.js</dd></div><div><dt>Focus</dt><dd>Reusable UI</dd></div><div><dt>Workflows</dt><dd>Rental & quotations</dd></div></dl><Star tone="mustard" /></aside></div><footer><span>Project 01 | TimePayment</span><span>Frontend Development</span></footer></div>
  </section>;
}

function ProjectSpread({ project, index }: { project: (typeof projects)[number]; index: number }) {
  if (index === 0) return <IdentityProject project={project} />;
  if (index === 1) return <CommerceSpread project={project} />;
  if (index === 2) return <DashboardSpread project={project} />;
  return <section className={`project-spread spread-${index + 2}`} id={`project-${project.number}`}><RunningText className="running-type">{index === 0 ? "IDENTITY PLATFORM" : index === 1 ? "ECOMMERCE EXPERIENCE" : "AFFILIATE DASHBOARD"}</RunningText><div className="editorial-shell spread-grid"><div className="spread-copy"><span className="spread-number">{project.number}</span><p className="section-kicker">{project.period}</p><h2>{project.title.split(" — ")[0]}</h2><h3>{project.title.split(" — ")[1]}</h3><p>{project.overview}</p><div className="tag-row">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div></div><div className="spread-visual"><BrowserMock kind={project.visual} /></div><div className="spread-detail"><h3>What I worked on</h3><ul>{project.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul><div><p><strong>Contribution:</strong> {project.contribution}</p>{project.url && <a href={project.url} target="_blank" rel="noopener noreferrer">View live platform <ExternalLink size={15} /></a>}</div></div></div></section>;
}

function IdentityPoster({ variant }: { variant: number }) {
  const labels = ["Search & performance", "Interface quality", "Glossary architecture", "Accessible security"];
  return <div className={`identity-poster identity-poster-${variant}`}><div className="identity-poster-contours" aria-hidden="true"><svg viewBox="0 0 240 300" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth=".65">{Array.from({ length: 16 }, (_, index) => <path key={index} d={`M-20 ${index * 17} C60 ${index * 17 - 80} 140 ${index * 17 + 110} 260 ${index * 17 + 10}`} />)}</svg></div><p className="identity-poster-brand">MAJORKEY<br />TECH</p><div className="identity-poster-orb" aria-hidden="true" /><div className="identity-poster-vector"><ProjectTileArt kind={[8, 4, 7, 0][variant]} /></div><p className="identity-poster-word" aria-hidden="true">{["DISCOVER", "REFINE", "STRUCTURE", "SECURE"][variant]}</p><div className="identity-poster-caption"><span>{String(variant + 1).padStart(2, "0")}</span><h3>{labels[variant]}</h3><p>{["SEO implementation and frontend performance.", "UI improvements across platform sections.", "Planning and architecture for the Glossary module.", "Cloudflare Turnstile for security and accessibility."][variant]}</p></div></div>;
}

function IdentityProject({ project }: { project: (typeof projects)[number] }) {
  const colors = ["#fcbd59", "#e76b6b", "#678949", "#3a6c6d"];
  return <section className="identity-project" id="project-02" aria-labelledby="identity-project-title"><RunningText className="identity-running">IDENTITY PLATFORM</RunningText><div className="identity-project-shell"><header className="identity-project-heading"><h2 id="identity-project-title"><span>MajorKey Tech</span>Identity Platform</h2><span className="identity-project-number">02</span></header><div className="identity-exhibit"><div className="identity-exhibit-backdrop" aria-hidden="true" /><div className="identity-poster-row">{[0, 1, 2].map((variant) => <IdentityPoster key={variant} variant={variant} />)}</div><div className="identity-display"><div className="identity-display-frame"><IdentityPoster variant={3} /></div><div className="identity-display-stand" aria-hidden="true" /><div className="identity-display-shadow" aria-hidden="true" /></div></div><div className="identity-production"><div><h3>Tools</h3><div className="identity-tools"><span title="Webflow">Wf</span></div></div><div><h3>Color palette</h3><div className="identity-swatches">{colors.map((color) => <div key={color}><span style={{ backgroundColor: color }} /><small>{color}</small></div>)}</div></div></div><div className="identity-project-copy"><p>{project.overview}</p><div><p>{project.responsibilities[0]}.</p><p>{project.responsibilities[2]}.</p></div><div><p>{project.contribution}</p><p>{project.responsibilities[1]}.</p></div></div><footer className="identity-project-footer"><span>Project 02 | MajorKey Tech — Identity Platform</span><span>Webflow | Frontend Development</span></footer></div></section>;
}

function ArchiveFeature({ project, index }: { project: (typeof archiveProjects)[number]; index: number }) {
  return <ArchiveShowcase project={project} index={index} />;
}

function SpreadMeta({ tools, colors }: { tools: string[]; colors: string[] }) {
  return <div className="showcase-meta"><div><h3>Tools</h3><div className="showcase-tools">{tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div><div><h3>Color palette</h3><div className="showcase-colors">{colors.map((color) => <div key={color}><span style={{ backgroundColor: color }} /><small>{color}</small></div>)}</div></div></div>;
}

function InterfaceSheet({ title, kind = 5 }: { title: string; kind?: number }) {
  return <div className="interface-sheet"><div className="interface-sheet-bar"><i /><i /><i /></div><div className="interface-sheet-heading"><span>FRONTEND EXPERIENCE</span><div className="interface-sheet-title">{title}</div></div><ProjectTileArt kind={kind} /><div className="interface-sheet-lines" aria-hidden="true"><i /><i /><i /><i /></div></div>;
}

function ShowcaseLaptop({ title, kind = 5 }: { title: string; kind?: number }) {
  return <div className="showcase-laptop" aria-label={`${title}, illustrative interface`}><div className="showcase-laptop-screen"><InterfaceSheet title={title} kind={kind} /></div><div className="showcase-laptop-base" /></div>;
}

function ShowcaseFooter({ number, title, category }: { number: string; title: string; category: string }) {
  return <footer className="showcase-footer"><span>Project {number} | {title}</span><span>{category} | Frontend Development</span></footer>;
}

function CommerceSpread({ project }: { project: (typeof projects)[number] }) {
  return <section className="commerce-showcase showcase-section" id="project-03"><div className="showcase-shell"><span className="showcase-number">03</span><div className="commerce-showcase-copy"><h2><span>Keepr</span>Alcohol Testing Platform</h2><p>{project.overview}</p><SpreadMeta tools={["Shopify"]} colors={["#aa0924", "#4e0308", "#f1e0c4"]} /><a className="showcase-live" href={project.url} target="_blank" rel="noopener noreferrer">View live platform <ExternalLink size={15} /></a></div><div className="commerce-sheets" aria-label="Illustrative storefront layouts"><div className="commerce-sheet-front"><p>KEEPR</p><h3>Know your<br />number.</h3><ProjectTileArt kind={3} /><span>Smart BrAC testing devices</span><div className="commerce-sheet-strip">{project.technologies.join(" · ")}</div></div><div className="commerce-sheet-back"><p>KEEPR</p><h3>Storefront<br />experience</h3><InterfaceSheet title="Responsive commerce" kind={4} /><p>{project.contribution}</p></div></div><div className="commerce-showcase-detail">{project.responsibilities.map((item) => <p key={item}>{item}.</p>)}</div><ShowcaseFooter number="03" title="Keepr — Alcohol Testing Platform" category="Shopify" /></div></section>;
}

function DashboardSpread({ project }: { project: (typeof projects)[number] }) {
  return <section className="dashboard-showcase showcase-section" id="project-04"><RunningText className="showcase-running">DASHBOARD DEVELOPMENT</RunningText><div className="showcase-shell"><span className="showcase-number">04</span><div className="dashboard-showcase-hero"><div><h2>DUI</h2><p className="showcase-subtitle">Affiliate Dashboard</p><p>{project.overview}</p><SpreadMeta tools={["React", "API"]} colors={["#7cbcc0", "#565656", "#ffffff"]} /></div><ShowcaseLaptop title="Affiliate dashboard" kind={0} /></div><div className="dashboard-showcase-collage"><div className="dashboard-page-board" aria-label="Illustrative component and workflow layouts">{["Partner access", "Documents", "REST APIs", "Reusable UI", "Responsive views", "Data workflows"].map((title, index) => <InterfaceSheet title={title} kind={[0, 2, 6, 5, 4, 7][index]} key={title} />)}<div className="board-laptop"><ShowcaseLaptop title="Partner workspace" kind={0} /></div></div><div className="dashboard-feature-pages"><div className="dashboard-cover"><p>AFFILIATE PLATFORM</p><h3>Connected.<br />Scalable.</h3><ProjectTileArt kind={7} /></div><div className="dashboard-document"><h3>Frontend delivery</h3><ProjectTileArt kind={6} /><p>{project.contribution}</p></div><div className="dashboard-small-pages"><InterfaceSheet title="API integration" kind={6} /><InterfaceSheet title="Responsive UI" kind={4} /></div></div></div><div className="showcase-detail-columns">{project.responsibilities.map((item) => <p key={item}>{item}.</p>)}</div><ShowcaseFooter number="04" title="DUI — Affiliate Dashboard" category="React" /></div></section>;
}

function ArchiveShowcase({ project, index }: { project: (typeof archiveProjects)[number]; index: number }) {
  const number = String(index + 5).padStart(2, "0");
  if (index === 0) return <section className="admin-showcase showcase-section" id={`project-${number}`}><div className="showcase-shell"><span className="showcase-number">05</span><div className="admin-showcase-hero"><div className="admin-page-board" aria-label="Illustrative admin portal layouts"><InterfaceSheet title="Admin portal" kind={0} /><InterfaceSheet title="Interface structure" kind={7} /><InterfaceSheet title="UI components" kind={5} /><InterfaceSheet title="Responsive layout" kind={4} /></div><div className="admin-showcase-copy"><h2>My Healthy<br />Work</h2><p>{project.type} · {project.technologies.join(" · ")}</p><SpreadMeta tools={["HTML", "CSS"]} colors={["#92474c", "#746c65", "#efedde"]} /></div></div><div className="admin-bottom-spreads"><InterfaceSheet title="Interface composition" kind={5} /><InterfaceSheet title="Frontend structure" kind={7} /><ShowcaseLaptop title="My Healthy Work" kind={0} /></div><ShowcaseFooter number="05" title={project.title} category={project.type} /></div></section>;
  return <section className="product-showcase showcase-section" id={`project-${number}`}><RunningText className="showcase-running">PRODUCT INTERFACE</RunningText><div className="showcase-shell"><header className="product-showcase-heading"><h2><span>1Talent</span>Product Interface</h2><span className="showcase-number">06</span></header><div className="product-showcase-main"><div className="product-interface-mockups"><div><InterfaceSheet title="1Talent" kind={0} /></div><div><InterfaceSheet title="Component library" kind={5} /></div><div><InterfaceSheet title="Product interface" kind={4} /></div></div><div className="product-cover"><p>FRONTEND IMPLEMENTATION</p><h3>Thoughtful<br /><mark>interfaces.</mark><br />Consistent<br /><mark>experiences.</mark></h3><ProjectTileArt kind={5} /><p>{project.technologies.join(" · ")}</p></div></div><div className="product-detail-pages">{["Layout", "Navigation", "Components", "Responsive", "Interactions"].map((title, item) => <InterfaceSheet title={title} kind={[7, 6, 5, 4, 8][item]} key={title} />)}</div><div className="product-production-row"><SpreadMeta tools={["HTML", "CSS"]} colors={["#404c62", "#ffc100", "#d5d8e0"]} /><p>{project.title} · {project.type}</p><p>{project.technologies.join(" · ")}</p></div><ShowcaseFooter number="06" title={project.title} category={project.type} /></div></section>;
}

function ArchiveIcon({ index }: { index: number }) {
  return <svg viewBox="0 0 180 140" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {index === 0 && <><path d="M48 14h59l25 25v85H48zM107 14v25h25M64 52h34M64 65h34M64 78h20M64 105h20" /><path d="M108 79v30m9-24c-18-12-28 10-9 10s8 22-9 11" /><path d="M36 30H25v82h11" /></>}
    {index === 1 && <><rect x="46" y="24" width="87" height="101" rx="8" /><rect x="68" y="14" width="43" height="22" rx="5" /><path d="m61 59 7 7 13-14m10 8h25m-55 24 7 7 13-14m10 8h25m-55 23h55" /><path d="M26 46v52m-8-44h16m-16 36h16M153 57v38m-7-30h14m-14 22h14" /></>}
    {index === 2 && <><circle cx="46" cy="108" r="18" /><circle cx="139" cy="108" r="18" /><path d="M31 92h62l18-27h16l12 43M53 108h43l15-43M97 65l-8-28h-14M78 37h22M38 91l16-31h29l14 32M50 60h38M127 65l-5-15h-14" /><path d="m68 70-9 13h13l-8 14" /></>}
    {index === 3 && <><rect x="17" y="21" width="146" height="104" rx="7" /><path d="M17 43h146M29 32h2m10 0h2m10 0h2" /><path d="m90 57 30 10v22c0 16-30 29-30 29S60 105 60 89V67z" /><path d="m76 86 10 10 20-23M31 61h15m-15 13h11m96-13h12m-12 13h12" /></>}
  </svg>;
}

function Archive() {
  return <section className="archive-section" id="archive"><RunningText className="running-type">PROJECT ARCHIVE</RunningText><div className="editorial-shell"><div className="archive-heading"><span>07—10</span><h2>More selected<br />frontend work</h2><p>Additional product, marketing, and platform work delivered across responsive UI and no-code ecosystems.</p></div><div className="archive-grid compact-archive">{archiveProjects.slice(2).map((project, index) => <article key={project.title}><span>{String(index + 7).padStart(2, "0")}</span><div className={`archive-art archive-vector art-${index + 3}`}><ArchiveIcon index={index} /></div><h3>{project.title}</h3><p>{project.type}</p><div>{project.technologies.map((tech) => <small key={tech}>{tech}</small>)}</div></article>)}</div></div></section>;
}

function Contact() {
  return <section className="contact-section" id="contact"><div className="contact-title"><Star tone="mustard" /><div><h2>THANK YOU!</h2><i>THANK YOU!</i><i>THANK YOU!</i></div></div><p>Have a frontend challenge, product idea, or team that values thoughtful engineering? I’d be glad to hear about it.</p><div className="contact-actions"><a href={portfolioLinks.emailHref}><Mail /> Email me</a><a href={portfolioLinks.resume} download="Rahul-Choksi-Resume.pdf"><Download /> Resume</a></div><nav aria-label="Contact links"><a href={portfolioLinks.github} target="_blank" rel="noopener noreferrer"><GitBranch /> /Choksirahul</a><a href={portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness /> /rahul-choksi</a><a href={portfolioLinks.emailHref}><Mail /> {portfolioLinks.email}</a></nav><small>© {new Date().getFullYear()} Rahul Choksi · Senior Frontend Developer</small></section>;
}

export default function Portfolio() {
  const main = useRef<HTMLElement>(null);
  useActiveNavigation(main);
  const [searchOpen, setSearchOpen] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useEffect(() => {
    let frame = 0;
    const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen((value) => !value); } };
    const update = () => { frame = 0; const total = document.documentElement.scrollHeight - window.innerHeight; if (progress.current) progress.current.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`; };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("keydown", handler); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll); update();
    return () => { window.removeEventListener("keydown", handler); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return <><Splash /><a className="skip-link" href="#main">Skip to content</a><div ref={progress} className="editorial-progress" style={{ transform: "scaleX(0)" }} aria-hidden="true" /><Header onSearch={() => setSearchOpen(true)} /><SearchOverlay open={searchOpen} close={closeSearch} /><main ref={main} id="main"><DeferredSectionMotion scope={main} /><Hero /><AboutResume /><Contents /><SectionBanner>Frontend Development</SectionBanner><LeadProject /><SectionBanner>Selected Projects</SectionBanner>{projects.slice(1).map((project, index) => <ProjectSpread project={project} index={index} key={project.number} />)}{archiveProjects.slice(0, 2).map((project, index) => <ArchiveFeature project={project} index={index} key={project.title} />)}<Archive /><Contact /></main><ScrollToTop /></>;
}
