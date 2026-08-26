"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDownRight,
  BriefcaseBusiness,
  Download,
  GitBranch,
  Mail,
  MapPin,
} from "lucide-react";
import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import { portfolioLinks } from "@/data/links";
import { MagneticLink } from "./ui";

const technologies = [
  "React",
  "Angular",
  "Next.js",
  "TypeScript",
  "Webflow",
  "Shopify",
];

function TechnologyConstellation() {
  return (
    <div className="tech-constellation" aria-hidden="true">
      <i className="constellation-line line-a" />
      <i className="constellation-line line-b" />
      <i className="constellation-line line-c" />
      <i className="constellation-line line-d" />
      {technologies.map((technology, index) => (
        <span className={`tech-node node-${index + 1}`} key={technology}>
          <i />
          <b>{technology}</b>
        </span>
      ))}
    </div>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const imageRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 48]);
  const move = (event: PointerEvent<HTMLElement>) => {
    if (reduced || matchMedia("(pointer: coarse)").matches) return;
    const target = event.currentTarget;
    cancelAnimationFrame(frame.current);
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    frame.current = requestAnimationFrame(() => {
      target.style.setProperty("--hero-x", `${x * 9}px`);
      target.style.setProperty("--hero-y", `${y * 7}px`);
    });
  };
  const reset = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--hero-x", "0px");
    event.currentTarget.style.setProperty("--hero-y", "0px");
  };
  return (
    <section
      className="hero section-anchor"
      id="home"
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <div className="hero-ambient" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="grid-overlay" aria-hidden="true" />
      <div className="shell hero-grid">
        <div className="hero-content">
          <motion.div
            className="status-pill"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72 }}
          >
            <i /> Senior Frontend Developer <span>·</span> 8+ years{" "}
            <span>·</span>
            <MapPin size={13} /> Valsad, India
          </motion.div>
          <motion.p
            className="hero-name"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78 }}
          >
            Rahul Choksi <span>RC_</span>
          </motion.p>
          <h1 aria-label="Building digital experiences where engineering meets design.">
            {[
              "Building digital",
              "experiences where",
              "engineering meets",
              "design.",
            ].map((line, index) => (
              <span
                className={`hero-line${index === 3 ? " accent-line" : ""}`}
                key={line}
              >
                <motion.span
                  initial={reduced ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.95 + index * 0.1,
                    duration: 0.72,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="hero-copy"
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.18, duration: 0.6 }}
          >
            I build responsive, high-performance web products that connect sound
            frontend architecture with thoughtful UX.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            <MagneticLink href="#projects" className="primary">
              Explore work <ArrowDownRight size={18} />
            </MagneticLink>
            <MagneticLink
              href={portfolioLinks.resume}
              download="Rahul-Choksi-Resume.pdf"
            >
              <Download size={17} /> Download Resume
            </MagneticLink>
          </motion.div>
          <motion.div
            className="hero-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.42 }}
          >
            <div className="hero-tech" aria-label="Primary technologies">
              {technologies.map((item, index) => (
                <span key={item}>
                  {item}
                  {index < technologies.length - 1 && <i>·</i>}
                </span>
              ))}
            </div>
            <nav className="hero-social" aria-label="Professional profiles">
              <a
                href={portfolioLinks.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitBranch size={13} /> GitHub
              </a>
              <a
                href={portfolioLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BriefcaseBusiness size={13} /> LinkedIn
              </a>
              <a href={portfolioLinks.emailHref}>
                <Mail size={13} /> Email
              </a>
            </nav>
          </motion.div>
        </div>
        <motion.div
          className="portrait-stage"
          ref={imageRef}
          style={{ y: imageY }}
          initial={
            reduced
              ? false
              : { opacity: 0, clipPath: "inset(0 0 100% 0 round 42px)" }
          }
          animate={{ opacity: 1, clipPath: "inset(0 0 0% 0 round 42px)" }}
          transition={{ delay: 1.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="portrait-glow" />
          <TechnologyConstellation />
          <div className="portrait-glass">
            <Image
              src="/images/rahul-choksi-profile.png"
              width={760}
              height={760}
              priority
              sizes="(max-width: 620px) 88vw, (max-width: 900px) 420px, 410px"
              alt="Rahul Choksi, Senior Frontend Developer"
            />
          </div>
          <div className="experience-orbit">
            <strong>8+</strong>
            <span>
              years
              <br />
              experience
            </span>
          </div>
          <div className="image-note">
            <span>01</span>
            <p>
              Engineering
              <br />
              meets design
            </p>
          </div>
        </motion.div>
      </div>
      <a href="#about" className="scroll-indicator">
        <span>Scroll</span>
        <i />
      </a>
    </section>
  );
}
