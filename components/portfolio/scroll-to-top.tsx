"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { afterIntro } from "./splash";

export default function ScrollToTop() {
  const button = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const element = button.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const visible = window.scrollY > 120;
      if (element.dataset.visible === String(visible)) return;
      element.dataset.visible = String(visible);
      element.tabIndex = visible ? 0 : -1;
      element.setAttribute("aria-hidden", String(!visible));
      if (!visible && document.activeElement === element) document.querySelector<HTMLElement>(".editorial-brand")?.focus({ preventScroll: true });
      element.dispatchEvent(new Event("scroll-top:visibility"));
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.removeEventListener("scroll", scroll); cancelAnimationFrame(frame); };
  }, []);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const element = button.current;
      if (!element) return;
      const orbit = gsap.to(".scroll-top-orbit", { rotation: 360, svgOrigin: "24 24", duration: 16, repeat: -1, ease: "none", paused: true });
      const arrow = gsap.to(".scroll-top-arrow", { y: -3, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true });
      const sync = () => {
        const paused = element.dataset.visible !== "true" || document.hidden || document.documentElement.dataset.intro === "pending" || element.matches(":focus-visible") || (matchMedia("(hover:hover) and (pointer:fine)").matches && element.matches(":hover"));
        orbit.paused(paused); arrow.paused(paused);
      };
      const cancelIntro = afterIntro(sync);
      const events = ["pointerenter", "pointerleave", "focus", "blur", "scroll-top:visibility"];
      events.forEach(event => element.addEventListener(event, sync));
      document.addEventListener("visibilitychange", sync);
      return () => { cancelIntro(); events.forEach(event => element.removeEventListener(event, sync)); document.removeEventListener("visibilitychange", sync); };
    }, button);
    return () => media.revert();
  }, { scope: button });
  return <a ref={button} className="scroll-to-top" href="#home" aria-label="Scroll to top" title="Back to top">
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <g className="scroll-top-orbit"><circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 5" opacity=".4" /><path d="m24 0 1.6 4.4L30 6l-4.4 1.6L24 12l-1.6-4.4L18 6l4.4-1.6Z" fill="currentColor" /></g>
      <path className="scroll-top-arrow" d="M24 34V15m-8 8 8-8 8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </a>;
}
