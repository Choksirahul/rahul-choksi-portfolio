"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Scope = RefObject<HTMLElement | null>;

/** Section entrances share a rhythm, but use the composition's own visual groups. */
export default function SectionMotion({ scope }: { scope: Scope }) {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)", pointer: "(hover: hover) and (pointer: fine)" }, (context) => {
      if (!context.conditions?.motion || !scope.current) return;
      const root = scope.current;
      const mobile = context.conditions.mobile;
      const select = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, root);
      const cleanups: Array<() => void> = [];
      // Move exactly one of two identical groups: each repeat lands on the same pixels.
      select("[data-marquee]").forEach(element => {
        const track = element.querySelector<HTMLElement>(".marquee-track");
        const group = element.querySelector<HTMLElement>(".marquee-group");
        if (!track || !group) return;
        let visible = false, disposed = false, frame = 0;
        const loop = gsap.to(track, { xPercent: -50, duration: group.offsetWidth / (mobile ? 22 : 32), ease: "none", repeat: -1, paused: true });
        const sync = () => { if (visible && !document.hidden && !(context.conditions?.pointer && element.matches(":hover"))) loop.play(); else loop.pause(); };
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
        observer.observe(element);
        const resize = () => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => { if (!disposed) loop.duration(group.offsetWidth / (mobile ? 22 : 32)); });
        };
        element.addEventListener("pointerenter", sync); element.addEventListener("pointerleave", sync);
        document.addEventListener("visibilitychange", sync); window.addEventListener("resize", resize, { passive: true });
        document.fonts.ready.then(() => { if (!disposed) resize(); });
        cleanups.push(() => {
          disposed = true; observer.disconnect(); cancelAnimationFrame(frame);
          element.removeEventListener("pointerenter", sync); element.removeEventListener("pointerleave", sync);
          document.removeEventListener("visibilitychange", sync); window.removeEventListener("resize", resize);
        });
      });
      const reveal = (trigger: Element, targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) => {
        // immediateRender:false leaves untouched content visible before its trigger.
        return gsap.from(targets, {
          duration: mobile ? 1 : 1.2, ease: "power2.inOut", immediateRender: false,
          clearProps: "transform,opacity,clipPath,transformOrigin", ...vars,
          scrollTrigger: { trigger, start: "top 90%", once: true, fastScrollEnd: true },
        });
      };
      const group = (selector: string, children: string, vars: gsap.TweenVars) => {
        select(selector).forEach((element) => {
          const targets = element.querySelectorAll(children);
          if (targets.length) reveal(element, targets, vars);
        });
      };

      // About: typography leads; the portrait's inner image follows without moving its frame.
      const aboutReveal = (selector: string, targets: string, vars: gsap.TweenVars) => {
        select(selector).forEach(element => {
          gsap.from(element.querySelectorAll(targets), {
            duration: 1.5, ease: "power2.inOut", immediateRender: false,
            clearProps: "transform,opacity,transformOrigin", ...vars,
            // Replay on re-entry so navigating back to About still shows the choreography.
            scrollTrigger: { trigger: element, start: "top 82%", toggleActions: "restart complete restart complete" },
          });
        });
      };
      aboutReveal(".intro-copy", "h2, .search-link", { y: mobile ? 18 : 28, opacity: 0.25, stagger: 0.22 });
      aboutReveal(".intro-portrait", ".portrait-block img", { scale: 1.07, duration: 1.9 });
      aboutReveal(".intro-portrait", ".floating-pill", { y: 18, opacity: 0.2, stagger: 0.24, delay: 0.25 });
      aboutReveal(".contact-card", "h2, p, a", { y: 14, opacity: 0.25, stagger: 0.12 });

      // Existing timeline connectors gain scroll progress, not new structure or entries.
      select(".reference-timeline article").forEach((entry) => {
        const marker = entry.querySelector(".reference-star");
        const copy = entry.querySelectorAll(":scope > span:not(.reference-star), :scope > div");
        reveal(entry, copy, { x: mobile ? 6 : 12, stagger: 0.07 });
        if (marker) reveal(entry, marker, { scale: 0.6, rotation: -15, duration: 0.45 });
        gsap.fromTo(entry, { "--timeline-progress": 0 }, {
          "--timeline-progress": 1, ease: "none",
          scrollTrigger: { trigger: entry, start: "top 75%", end: "bottom 50%", scrub: 0.25 },
        });
        ScrollTrigger.create({ trigger: entry, start: "top 60%", end: "bottom 40%", onToggle: self => entry.toggleAttribute("data-motion-active", self.isActive) });
        cleanups.push(() => entry.removeAttribute("data-motion-active"));
      });
      group(".skill-groups article", "h3, :scope > div", { y: 9, stagger: 0.1 });
      group(".language-grid, .interests > div", "article", { y: 8, stagger: 0.07 });

      // Contents and banners repeat the Hero's three-beat registration rhythm.
      group(".contents-section", "h2, .contents-grid > a", { y: 12, stagger: 0.09 });
      group(".black-banner", "h2", { y: 14, duration: 0.75 });
      group(".black-banner", ".reference-star", { scale: 0.55, rotation: -12, stagger: 0.1 });

      // Shutters stay confined to artwork; the overlapping goals/tasks titles remain unclipped.
      group(".project-intro", ".lead-mock .browser-mock", { clipPath: "inset(0 100% 0 0)", duration: 0.85 });
      group(".project-detail-grid", ".project-detail-tile", { scale: 0.97, stagger: { each: 0.045, grid: "auto", from: "start" } });
      group(".project-goals", ".project-goal-panel, .project-tool-grid", { y: 12, stagger: 0.12 });
      group(".task-research", ".task-research-columns > article", { x: -10, stagger: 0.1 });
      group(".task-execution-grid", ".task-phone, .task-execution-art", { clipPath: "inset(0 0 100% 0)", stagger: 0.12 });
      group(".task-results", ".task-results-overview", { y: 15, duration: 0.75 });
      group(".identity-exhibit", ".identity-poster-row > *, .identity-display-frame", { clipPath: "inset(0 0 100% 0)", stagger: 0.1, duration: 0.85 });
      group(".commerce-sheets", ".commerce-sheet-front, .commerce-sheet-back", { opacity: 0.35, stagger: 0.14 });
      group(".dashboard-showcase-hero", ".showcase-laptop-screen", { clipPath: "inset(0 100% 0 0)", duration: 0.8 });
      group(".dashboard-feature-pages", ".dashboard-cover, .dashboard-document, .dashboard-small-pages", { y: 12, stagger: 0.1 });
      group(".admin-bottom-spreads", ":scope > .interface-sheet, .showcase-laptop-screen", { clipPath: "inset(0 0 100% 0)", stagger: 0.1 });
      group(".admin-showcase-hero", ".admin-page-board .interface-sheet", { opacity: 0.5, stagger: 0.08 });
      group(".product-showcase-main", ".product-cover", { clipPath: "inset(0 100% 0 0)", duration: 0.8 });
      group(".product-interface-mockups", ".interface-sheet", { opacity: 0.5, stagger: 0.08 });
      group(".product-detail-pages", ":scope > .interface-sheet", { y: 10, stagger: 0.07 });
      group(".archive-heading", "h2", { y: 14 });
      group(".contact-title", "h2, i", { x: mobile ? 8 : 20, opacity: 0.4, stagger: 0.1 });
      group(".contact-section", ".contact-title > .reference-star", { scale: 0.55, rotation: -18, duration: 0.7 });

      // Trace selected existing strokes, rather than hiding complete icons or adding new SVGs.
      select(".task-execution-art svg, .archive-vector svg").forEach((svg) => {
        const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path")).slice(0, 3);
        paths.forEach((path, index) => {
          const length = path.getTotalLength();
          if (!length) return;
          gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
            strokeDashoffset: 0, duration: 0.7, delay: index * 0.08, ease: "power2.inOut", immediateRender: false,
            clearProps: "strokeDasharray,strokeDashoffset",
            scrollTrigger: { trigger: svg, start: "top 90%", once: true, fastScrollEnd: true },
          });
        });
      });

      if (context.conditions.pointer) {
        // Perspective Echo is limited to decorative artwork, never body text or moving targets.
        select(".archive-grid article, .project-detail-tile").forEach((card) => {
          const art = card.querySelector("svg");
          if (!art) return;
          const hover = gsap.to(art, { y: -4, rotation: -2, duration: 0.3, ease: "power2.out", paused: true });
          const enter = () => hover.play();
          const leave = () => hover.reverse();
          card.addEventListener("pointerenter", enter); card.addEventListener("pointerleave", leave);
          cleanups.push(() => { card.removeEventListener("pointerenter", enter); card.removeEventListener("pointerleave", leave); });
        });
        // One bounded magnetic interaction per area; actual navigation remains native.
        const buttons = [...select(".contact-actions a, .intro-copy .search-link"), ...document.querySelectorAll<HTMLElement>(".editorial-actions > .pill")];
        buttons.forEach((button) => {
          const x = gsap.quickTo(button, "x", { duration: 0.3, ease: "power3.out" });
          const y = gsap.quickTo(button, "y", { duration: 0.3, ease: "power3.out" });
          let rect: DOMRect | null = null;
          const enter = () => { rect = button.getBoundingClientRect(); };
          const move = (event: PointerEvent) => {
            if (!rect || document.activeElement === button) return;
            x(gsap.utils.clamp(-3, 3, (event.clientX - rect.left - rect.width / 2) * 0.06));
            y(gsap.utils.clamp(-3, 3, (event.clientY - rect.top - rect.height / 2) * 0.06));
          };
          const reset = () => { x(0); y(0); rect = null; };
          button.addEventListener("pointerenter", enter); button.addEventListener("pointermove", move); button.addEventListener("pointerleave", reset); button.addEventListener("focus", reset);
          cleanups.push(() => { button.removeEventListener("pointerenter", enter); button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", reset); button.removeEventListener("focus", reset); });
        });
      }
      // Refresh after fonts/images resolve; cancelled safely on unmount or media change.
      let disposed = false;
      const refresh = () => { if (!disposed) ScrollTrigger.refresh(true); };
      Promise.all([document.fonts.ready, ...Array.from(root.querySelectorAll("img")).map(image => image.decode().catch(() => undefined))]).then(refresh);
      return () => { disposed = true; cleanups.forEach(cleanup => cleanup()); };
    }, scope);
    return () => media.revert();
  }, { scope });
  return null;
}
