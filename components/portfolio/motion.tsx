"use client";

import { useEffect, useState, type RefObject } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { afterIntro } from "./splash";

type Scope = RefObject<HTMLElement | null>;

/** Only temporary inline styles: the approved CSS is always the resting state. */
export function useHeroMotion(scope: Scope) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)" }, (context) => {
      if (!context.conditions?.motion) return;
      const root = scope.current;
      const mobile = context.conditions.mobile;
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut", duration: mobile ? 1.4 : 1.7, immediateRender: false } });
      // The portrait stays painted for LCP; only its inner image settles.
      timeline.from(".hero-photo img", { scale: 1.06, duration: 2.1, transformOrigin: "50% 45%", clearProps: "transform,transformOrigin" }, 0)
        .from(".hero-heading", { y: mobile ? 18 : 30, opacity: 0.5, duration: 1.5, clearProps: "transform,opacity" }, 0.08)
        .from(".hero-outline span", { x: mobile ? 18 : 44, opacity: 0.1, stagger: 0.18, clearProps: "transform,opacity" }, 0.24)
        .from(".hero-stars .reference-star", { scale: 0.45, rotation: -24, stagger: 0.18, duration: 1.2, clearProps: "transform" }, 0.4)
        .from(".hero-links a", { y: 14, opacity: 0.15, stagger: 0.14, duration: 1.05, clearProps: "transform,opacity" }, 0.9)
        .from(".hero-statement", { opacity: 0.35, duration: 1.1, clearProps: "opacity" }, 1.15);
      // Start when actually visible, including a return from an anchor or restored scroll.
      // Ordinary scrolling/touching must not instantly cancel the sequence.
      let ready = false, visible = false, disposed = false;
      const start = () => { if (!disposed && ready && visible && document.documentElement.dataset.intro !== "pending") timeline.restart(); };
      const cancelIntro = afterIntro(start);
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (ready && visible) start();
        else if (!visible) timeline.progress(1).pause();
      }, { threshold: 0.15 });
      if (root) observer.observe(root);
      const image = root?.querySelector("img");
      Promise.all([document.fonts.ready, image?.decode().catch(() => undefined)]).then(() => {
        if (disposed) return;
        ready = true;
        start();
      });
      return () => { disposed = true; observer.disconnect(); cancelIntro(); };
    }, scope);
    return () => media.revert();
  }, { scope });
}

export function useHeaderMotion(scope: Scope) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const entrance = gsap.from(".editorial-brand, .editorial-nav > a, .editorial-actions", {
        paused: true, immediateRender: false, y: -6, opacity: 0.35, duration: 0.9, stagger: 0.07, ease: "power2.inOut", clearProps: "transform,opacity",
      });
      return afterIntro(() => entrance.play());
    }, scope);
    return () => media.revert();
  }, { scope });
}

export function useOverlayMotion(scope: Scope, open: boolean) {
  useGSAP(() => {
    if (!open || !scope.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(scope.current, { opacity: 0.6, duration: 0.2, clearProps: "opacity" });
      gsap.from(scope.current!.querySelectorAll(".mobile-editorial-nav > *, .search-heading, .search-input"), {
        y: 6, duration: 0.25, stagger: 0.035, ease: "power2.out", clearProps: "transform",
      });
    });
    return () => media.revert();
  }, { scope, dependencies: [open], revertOnUpdate: true });
}

export function useActiveNavigation(scope: Scope) {
  useGSAP(() => {
    const root = scope.current;
    if (!root) return;
    const links = document.querySelectorAll<HTMLAnchorElement>(".editorial-nav a, .section-mini-nav a[href^='#']:not(.pill):not(.editorial-brand), .project-mini-nav nav a:not(.pill)");
    const original = Array.from(links, link => [link, link.getAttribute("aria-current")] as const);
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.isIntersecting);
      if (!entry) return;
      const id = entry.target.id;
      const active = id === "about" ? "#about" : id === "experience" ? "#experience" : id === "archive" ? "#archive" : id === "home" || id === "contact" || id === "contents" ? "" : "#projects";
      links.forEach((link, index) => {
        const value = active ? (link.hash === active ? "location" : null) : original[index][1];
        if (value === null) link.removeAttribute("aria-current"); else link.setAttribute("aria-current", value);
      });
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    root.querySelectorAll("main > section").forEach(section => observer.observe(section));
    const skills = root.querySelector("#skills");
    const skillsObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) links.forEach(link => { if (link.hash === "#skills") link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current"); });
      else if (Array.from(links).some(link => link.hash === "#skills" && link.hasAttribute("aria-current"))) {
        const resume = root.querySelector("#experience")?.getBoundingClientRect();
        if (resume && resume.top <= innerHeight * .25 && resume.bottom > innerHeight * .25) links.forEach(link => { if (link.hash === "#experience") link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current"); });
      }
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    if (skills) skillsObserver.observe(skills);
    return () => { observer.disconnect(); skillsObserver.disconnect(); original.forEach(([link, value]) => { if (value === null) link.removeAttribute("aria-current"); else link.setAttribute("aria-current", value); }); };
  }, { scope });
}

// Keep ScrollTrigger and the below-fold choreography off the initial render path.
const SectionMotion = dynamic(() => import("./section-motion").catch(() => ({ default: function MotionUnavailable() { return null; } })), { ssr: false });

export function DeferredSectionMotion({ scope }: { scope: Scope }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, idle = 0, timer = 0;
    let disposed = false;
    const start = () => { if (!disposed && !preference.matches && document.documentElement.dataset.intro !== "pending") setReady(true); };
    const schedule = () => {
      cancelAnimationFrame(frame); if (idle) window.cancelIdleCallback(idle); clearTimeout(timer);
      if (preference.matches) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(start, { timeout: 1500 });
          else timer = window.setTimeout(start, 200);
        });
      });
    };
    const cancelIntro = afterIntro(schedule);
    window.addEventListener("wheel", start, { passive: true, once: true });
    window.addEventListener("touchstart", start, { passive: true, once: true });
    window.addEventListener("keydown", start, { once: true });
    preference.addEventListener("change", schedule);
    return () => {
      disposed = true;
      cancelIntro();
      cancelAnimationFrame(frame); if (idle) window.cancelIdleCallback(idle); clearTimeout(timer);
      window.removeEventListener("wheel", start); window.removeEventListener("touchstart", start); window.removeEventListener("keydown", start); preference.removeEventListener("change", schedule);
    };
  }, []);
  return ready ? <SectionMotion scope={scope} /> : null;
}
