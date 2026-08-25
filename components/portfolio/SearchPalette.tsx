"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Clock3, Search, X } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { navigation } from "@/data/navigation";
import { archiveProjects, projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import type { SearchItem } from "@/data/types";

const baseItems: SearchItem[] = [
  ...navigation.map((item) => ({
    title: item.label,
    subtitle: `Jump to ${item.label.toLowerCase()}`,
    href: item.href,
    group: "Navigation",
    keywords: [item.label, "section", "navigation"],
  })),
  ...projects.map((item) => ({
    title: item.title,
    subtitle: item.technologies.join(" · "),
    href: "#projects",
    group: "Projects",
    keywords: [
      ...item.technologies,
      ...item.categories,
      item.overview,
      ...item.responsibilities,
    ],
  })),
  ...archiveProjects.map((item) => ({
    title: item.title,
    subtitle: item.type,
    href: "#archive",
    group: "Project archive",
    keywords: [...item.technologies, item.type],
  })),
  ...skillGroups.flatMap((group) =>
    group.items.map((skill) => ({
      title: skill,
      subtitle: `${group.title} skill`,
      href: "#skills",
      group: "Skills",
      keywords: [skill, group.title],
    })),
  ),
  {
    title: "1Rivet",
    subtitle: "Sr Associate L1 · Frontend Developer",
    href: "#experience",
    group: "Experience",
    keywords: [
      "React",
      "Angular",
      "Next.js",
      "Webflow",
      "Shopify",
      "REST APIs",
      "experience",
    ],
  },
  {
    title: "B.Tech — Computer Science & Engineering",
    subtitle: "ITM Vocational University · 9.3/10",
    href: "#education",
    group: "Education",
    keywords: ["education", "degree", "college", "computer science"],
  },
  {
    title: "Microsoft Exam 70-480",
    subtitle: "HTML5, JavaScript and CSS3 · 757/1000",
    href: "#recognition",
    group: "Certifications",
    keywords: ["certificate", "certification", "Microsoft", "award"],
  },
  {
    title: "Let’s work together → Contact Rahul",
    subtitle: "Start a conversation by email",
    href: "#contact",
    group: "Contact",
    keywords: ["hire", "hire Rahul", "work together"],
  },
  {
    title: "Email Rahul",
    subtitle: "choksirahul22@gmail.com",
    href: "mailto:choksirahul22@gmail.com",
    group: "Contact",
    keywords: ["contact", "email"],
  },
  {
    title: "Explore GitHub",
    subtitle: "github.com/Choksirahul",
    href: "https://github.com/Choksirahul",
    group: "Contact",
    keywords: ["contact", "code", "GitHub"],
  },
  {
    title: "LinkedIn",
    subtitle: "Connect with Rahul",
    href: "https://www.linkedin.com/in/rahul-choksi-a22a88131",
    group: "Contact",
    keywords: ["contact", "LinkedIn", "profile"],
  },
  {
    title: "Download Rahul’s Resume",
    subtitle: "Open the PDF résumé",
    href: "/Rahul-Choksi-Resume.pdf",
    group: "Actions",
    keywords: ["resume", "résumé", "CV", "download"],
  },
];

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return text;
  const parts = text.split(
    new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"),
  );
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index}>{part}</mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function SearchPalette({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (
      normalized
        ? baseItems.filter((item) =>
            [item.title, item.subtitle, ...item.keywords]
              .join(" ")
              .toLowerCase()
              .includes(normalized),
          )
        : baseItems.slice(0, 8)
    ).slice(0, 12);
  }, [query]);
  useEffect(() => {
    if (!open) {
      previousFocus.current?.focus();
      return;
    }
    previousFocus.current = document.activeElement as HTMLElement;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setQuery("");
      setActive(0);
      setRecent(JSON.parse(localStorage.getItem("portfolio-searches") || "[]"));
      input.current?.focus();
    }, 20);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = priorOverflow;
    };
  }, [open]);
  const choose = (item: SearchItem) => {
    const updated = [
      item.title,
      ...recent.filter((value) => value !== item.title),
    ].slice(0, 4);
    localStorage.setItem("portfolio-searches", JSON.stringify(updated));
    setRecent(updated);
    close();
    if (item.href.startsWith("#"))
      document
        .querySelector(item.href)
        ?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        });
    else if (item.href.startsWith("http")) {
      const opened = window.open(item.href, "_blank", "noopener,noreferrer");
      if (opened) opened.opener = null;
    } else window.open(item.href, "_self");
  };
  const keyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, results.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    }
    if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      choose(results[active]);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
    if (event.key === "Tab") {
      const focusable = Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input, a[href]",
        ) || [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="search-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={close}
        >
          <motion.div
            ref={dialog}
            className="search-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-title"
            onMouseDown={(event) => event.stopPropagation()}
            onKeyDown={keyDown}
            initial={{ opacity: 0, y: -18, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.985 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="search-heading">
              <span className="search-monogram">RC_</span>
              <div>
                <h2 id="search-title">Search Rahul’s Portfolio</h2>
                <p>Projects, skills, experience, education, and shortcuts.</p>
              </div>
              <kbd>⌘ K</kbd>
            </div>
            <div className="search-input">
              <Search size={21} />
              <input
                ref={input}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                placeholder="Search projects, skills, technologies..."
                aria-label="Search Rahul's portfolio"
                aria-activedescendant={
                  results[active] ? `search-result-${active}` : undefined
                }
              />
              <button onClick={close} aria-label="Close search">
                <X size={18} />
              </button>
            </div>
            {!query && recent.length > 0 && (
              <div className="recent-searches">
                <span>
                  <Clock3 size={13} /> Recent
                </span>
                {recent.map((value) => (
                  <button key={value} onClick={() => setQuery(value)}>
                    {value}
                  </button>
                ))}
              </div>
            )}
            <div
              className="search-results"
              role="listbox"
              aria-label="Portfolio search results"
            >
              {results.length ? (
                results.map((item, index) => (
                  <Fragment key={`${item.group}-${item.title}`}>
                    {(index === 0 ||
                      results[index - 1].group !== item.group) && (
                      <div className="result-section" role="presentation">
                        {item.group}
                      </div>
                    )}
                    <button
                      id={`search-result-${index}`}
                      className={`search-result${active === index ? " active" : ""}`}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => choose(item)}
                      role="option"
                      aria-selected={active === index}
                    >
                      <span className="result-icon">
                        {item.group.slice(0, 1)}
                      </span>
                      <span className="result-copy">
                        <strong>
                          <Highlight text={item.title} query={query} />
                        </strong>
                        <small>{item.subtitle}</small>
                      </span>
                      <span className="result-group">{item.group}</span>
                      <ArrowUpRight size={15} />
                    </button>
                  </Fragment>
                ))
              ) : (
                <div className="search-empty">
                  No results for “{query}”. Try React, Webflow, education, or
                  contact.
                </div>
              )}
            </div>
            <div className="search-footer">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> Navigate
              </span>
              <span>
                <kbd>↵</kbd> Open
              </span>
              <span>
                <kbd>Esc</kbd> Close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
