"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { BriefcaseBusiness, ExternalLink, MapPin } from "lucide-react";
import { useRef } from "react";
import { responsibilities } from "@/data/experience";
import { portfolioLinks } from "@/data/links";
import { Reveal, SectionHeading } from "./ui";

export function ExperienceTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start .8", "end .35"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });
  return (
    <section className="section experience section-anchor" id="experience">
      <div className="shell">
        <SectionHeading
          eyebrow="02 · Experience"
          title="Eight years of shipping, learning, and refining."
          copy="A long-running professional chapter shaped by varied products, platforms, and cross-functional teams."
        />
        <div className="experience-timeline" ref={ref}>
          <div className="timeline-rail">
            <motion.span style={{ scaleY: progress }} />
          </div>
          <Reveal className="experience-card" variant="scale">
            <div className="experience-card-top">
              <div className="company-mark">
                <BriefcaseBusiness size={22} />
              </div>
              <div>
                <span className="mono-label">Jun 2018 — Present</span>
                <h3>
                  <a
                    className="verified-link"
                    href={portfolioLinks.company}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    1Rivet <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </h3>
                <p>Sr. Associate L1 · Frontend Developer</p>
              </div>
              <div className="location">
                <MapPin size={15} /> Valsad, India
              </div>
            </div>
            <div className="experience-body">
              <div>
                <h4>Responsibilities</h4>
                <ul>
                  {responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <aside>
                <h4>Technologies</h4>
                <div className="tag-cloud">
                  {[
                    "React.js",
                    "Angular",
                    "Next.js",
                    "TypeScript",
                    "JavaScript",
                    "SCSS",
                    "REST APIs",
                    "Webflow",
                    "Shopify",
                    "Git",
                  ].map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </aside>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
