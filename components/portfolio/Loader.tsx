"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function Loader() {
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();
  useEffect(() => { const seen = sessionStorage.getItem("portfolio-intro-seen"); if (!seen && !reduced) sessionStorage.setItem("portfolio-intro-seen", "true"); const timer = setTimeout(() => setVisible(false), seen || reduced ? 0 : 880); return () => clearTimeout(timer); }, [reduced]);
  return <AnimatePresence>{visible && <motion.div className="loader" exit={{ opacity: 0 }} transition={{ duration: .28 }} aria-label="Loading portfolio" role="status"><motion.div className="loader-mark" initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><span>RC_</span></motion.div><div className="loader-track"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .65, ease: [.22,1,.36,1] }} /></div><p>FRONTEND · SYSTEMS · EXPERIENCE</p></motion.div>}</AnimatePresence>;
}
