"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const onScroll = () => setVisible(window.scrollY > 700); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <><footer className="footer"><div className="shell footer-grid"><a className="footer-identity" href="#home" aria-label="Rahul Choksi, back to home"><strong>RC_</strong><span>Rahul Choksi<small>Senior Frontend Developer</small></span></a><nav aria-label="Social links"><a href="https://github.com/Choksirahul" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://www.linkedin.com/in/rahul-choksi-a22a88131" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="mailto:choksirahul22@gmail.com">Email</a></nav><span>© {new Date().getFullYear()} Rahul Choksi</span><a className="footer-top" href="#home">Back to top <ArrowUp size={14} /></a></div></footer><a className={`back-top${visible ? " visible" : ""}`} href="#home" aria-label="Back to top"><ArrowUp size={18} /></a></>;
}
