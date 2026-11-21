"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const INTRO_EVENT = "portfolio:intro-complete";

export function afterIntro(callback: () => void) {
  if (document.documentElement.dataset.intro !== "pending") { callback(); return () => {}; }
  window.addEventListener(INTRO_EVENT, callback, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, callback);
}

export default function Splash() {
  const splash = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    const element = splash.current;
    if (!element || document.documentElement.dataset.intro !== "pending") return;
    let finished = false;
    const previousFocus = document.activeElement;
    const content = Array.from(document.querySelectorAll<HTMLElement>("main, .editorial-header, .skip-link"));
    const inertStates = content.map(node => node.inert);
    content.forEach(node => { node.inert = true; });
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const restore = () => content.forEach((node, index) => { node.inert = inertStates[index]; });
    const finish = (focus = false) => {
      if (finished) return;
      finished = true;
      document.documentElement.dataset.intro = "complete";
      try { sessionStorage.setItem("portfolio-intro-seen", "1"); } catch { /* Storage is optional. */ }
      restore();
      window.dispatchEvent(new Event(INTRO_EVENT));
      if (focus) document.querySelector<HTMLElement>(".editorial-brand")?.focus({ preventScroll: true });
      else if (previousFocus instanceof HTMLElement && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
      else if (document.activeElement === skip.current) document.querySelector<HTMLElement>(".editorial-brand")?.focus({ preventScroll: true });
    };
    const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" }, onComplete: () => finish() });
    let assetsReady = false;
    const assetsLoaded = () => {
      if (finished) return;
      assetsReady = true;
      if (timeline.paused()) timeline.play();
    };
    const assetTimeout = window.setTimeout(assetsLoaded, 2000);
    const heroImage = document.querySelector<HTMLImageElement>(".hero-photo img");
    Promise.all([document.fonts.ready, heroImage?.decode().catch(() => undefined)]).then(assetsLoaded);
    if (preference.matches) finish();
    else {
      skip.current?.focus({ preventScroll: true });
      timeline.from(".splash-star", { scale: 0.5, rotation: -90, opacity: 0.4, duration: 1.1 }, 0)
        .fromTo(".splash-name", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 0.1)
        .fromTo(".splash-role", { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.4)
        .fromTo(".splash-track > span", { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 1.2 }, 0)
        .addPause(1.8, () => { if (assetsReady) timeline.play(); })
        .to(element, { yPercent: -100, duration: 1.05, ease: "power3.inOut" }, 1.8);
    }
    const dismiss = () => { timeline.kill(); finish(true); };
    const keyboard = (event: KeyboardEvent) => {
      if (finished) return;
      if (event.key === "Escape") { event.preventDefault(); dismiss(); }
      else if (event.key === "Tab") { event.preventDefault(); skip.current?.focus(); }
      else if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key) && document.activeElement !== skip.current) event.preventDefault();
    };
    const release = () => { if (!finished) { finished = true; timeline.kill(); restore(); } };
    const changed = () => { if (preference.matches) dismiss(); };
    skip.current?.addEventListener("click", dismiss);
    const button = skip.current;
    window.addEventListener("keydown", keyboard);
    window.addEventListener(INTRO_EVENT, release);
    window.addEventListener("hashchange", dismiss);
    preference.addEventListener("change", changed);
    // Independent bootstrap timeout also releases the page if this bundle fails.
    return () => {
      finished = true;
      clearTimeout(assetTimeout);
      button?.removeEventListener("click", dismiss);
      window.removeEventListener("keydown", keyboard); window.removeEventListener(INTRO_EVENT, release); preference.removeEventListener("change", changed);
      window.removeEventListener("hashchange", dismiss);
      restore();
    };
  }, { scope: splash });
  return <div ref={splash} className="portfolio-splash" role="dialog" aria-modal="true" aria-labelledby="splash-name">
    <div className="splash-top"><span>PORTFOLIO / FRONTEND</span><button ref={skip} type="button">Skip intro <span aria-hidden="true">↗</span></button></div>
    <div className="splash-center"><span className="reference-star mustard splash-star" aria-hidden="true" /><h2 id="splash-name" className="splash-name">Rahul Choksi<span>.</span></h2><p className="splash-role">Senior Frontend Developer</p></div>
    <div className="splash-bottom"><div className="splash-track" aria-hidden="true"><span /></div><div><span>THOUGHTFUL DESIGN</span><span>SOUND ARCHITECTURE</span></div></div>
  </div>;
}
