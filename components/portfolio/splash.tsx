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
      else if (document.activeElement === skip.current) skip.current?.blur();
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
      const lines = element.querySelectorAll<SVGGeometryElement>(".celestial-construction, .celestial-orbit");
      lines.forEach(line => { const length = line.getTotalLength(); gsap.set(line, { strokeDasharray: length, strokeDashoffset: length }); });
      timeline.fromTo(".celestial-nodes circle", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.09, ease: "power2.out" }, 0)
        .to(".celestial-construction", { strokeDashoffset: 0, duration: 1.5, stagger: 0.22, ease: "power2.inOut" }, 0.4)
        .to(".celestial-orbit", { strokeDashoffset: 0, duration: 1.3, stagger: 0.15, ease: "sine.inOut" }, 1.15)
        .fromTo(".celestial-core", { scale: 0.35, rotation: -45, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, svgOrigin: "100 100", duration: 1.3 }, 1.25)
        .fromTo(".celestial-halo", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 0.65, duration: 1.4 }, 1.2)
        .fromTo(".celestial-satellites", { rotation: -35, opacity: 0 }, { rotation: 20, opacity: 1, svgOrigin: "100 100", duration: 1.8 }, 1.25)
        .fromTo(".splash-name > span", { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" }, 1.5)
        .fromTo(".splash-role", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 1.85)
        .to(".celestial-construction, .celestial-nodes", { opacity: 0.25, duration: 0.65 }, 2.65)
        .addPause(3.2, () => { if (assetsReady) timeline.play(); })
        .to(".splash-name, .splash-role, .splash-top, .splash-bottom", { opacity: 0, y: -12, duration: 0.55 }, 3.2)
        .to(".celestial-core", { rotation: 90, scale: 1.35, svgOrigin: "100 100", duration: 0.8 }, 3.2)
        .to(".celestial-symbol", { scale: 1.3, opacity: 0, duration: 0.8 }, 3.4)
        .to(".celestial-halo", { scale: 1.7, opacity: 0, duration: 0.75 }, 3.4)
        .to(".splash-aperture", { xPercent: index => index % 2 ? 105 : -105, yPercent: index => index < 2 ? -25 : 25, duration: 1.05, stagger: 0.025, ease: "power3.inOut" }, 3.3);

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
    <div className="splash-apertures" aria-hidden="true">{[0, 1, 2, 3].map(index => <div className={`splash-aperture aperture-${index}`} key={index} />)}</div>
    <div className="splash-center">
      <div className="celestial-emblem" aria-hidden="true"><div className="celestial-halo" /><svg className="celestial-symbol" viewBox="0 0 200 200" fill="none">
        <g className="celestial-nodes" fill="currentColor">{[[100,12],[188,100],[100,188],[12,100],[100,46],[154,100],[100,154],[46,100]].map(([cx,cy], index) => <circle cx={cx} cy={cy} r={index < 4 ? 2 : 1.4} key={index} />)}</g>
        <path className="celestial-construction" d="M100 12 188 100 100 188 12 100Z" stroke="currentColor" strokeOpacity=".25" strokeWidth=".6" />
        <g className="celestial-nodes" fill="currentColor">{[[100,12],[188,100],[100,188],[12,100],[100,46],[154,100],[100,154],[46,100]].map(([cx,cy], index) => <circle cx={cx} cy={cy} r={index < 4 ? 2 : 1.4} key={index} />)}</g>
        <path className="celestial-construction" d="M100 12v176M12 100h176" stroke="currentColor" strokeOpacity=".3" strokeWidth=".6" />
        <ellipse className="celestial-orbit" cx="100" cy="100" rx="87" ry="39" transform="rotate(-35 100 100)" stroke="currentColor" strokeOpacity=".55" strokeWidth=".7" />
        <ellipse className="celestial-orbit" cx="100" cy="100" rx="66" ry="83" transform="rotate(35 100 100)" stroke="currentColor" strokeOpacity=".25" strokeWidth=".7" />
        <g className="celestial-core" fill="currentColor"><path d="m100 46 12 42-12 12-12-12Z" /><path d="m154 100-42 12-12-12 12-12Z" /><path d="m100 154-12-42 12-12 12 12Z" /><path d="m46 100 42-12 12 12-12 12Z" /></g>
        <g className="celestial-satellites" fill="currentColor"><circle cx="28" cy="130" r="2.5" /><circle cx="155" cy="47" r="2" /><path d="m164 127 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" /></g>
      </svg></div>
      <h2 id="splash-name" className="splash-name"><span>Rahul</span> <span>Choksi<i>.</i></span></h2><p className="splash-role">Senior Frontend Developer</p>
    </div>
    <div className="splash-bottom"><div><span>THOUGHTFUL DESIGN</span><span>SOUND ARCHITECTURE</span></div></div>
  </div>;
}
