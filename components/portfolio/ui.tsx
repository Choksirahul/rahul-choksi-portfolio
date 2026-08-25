"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0, variant = "up" }: { children: ReactNode; className?: string; delay?: number; variant?: "up" | "fade" | "scale" | "left" }) {
  const reduced = useReducedMotion();
  const starts = { up: { opacity: 0, y: 34 }, fade: { opacity: 0 }, scale: { opacity: 0, scale: .96 }, left: { opacity: 0, x: -34 } };
  return <motion.div className={className} initial={reduced ? false : starts[variant]} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: .72, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

export function SectionHeading({ eyebrow, title, copy, align = "left" }: { eyebrow: string; title: string; copy?: string; align?: "left" | "center" }) {
  return <Reveal className={`section-heading ${align === "center" ? "center" : ""}`}><span className="section-eyebrow">{eyebrow}</span><div className="heading-mask"><h2>{title}</h2></div>{copy && <p>{copy}</p>}</Reveal>;
}

export function MagneticLink({ href, children, className = "", download, target }: { href: string; children: ReactNode; className?: string; download?: boolean | string; target?: string }) {
  const reduced = useReducedMotion();
  return <motion.a href={href} className={`button ${className}`} download={download} target={target} rel={target ? "noreferrer" : undefined} whileHover={reduced ? undefined : { y: -3, scale: 1.015 }} whileTap={{ scale: .97 }} transition={{ type: "spring", stiffness: 340, damping: 22 }}>{children}</motion.a>;
}
