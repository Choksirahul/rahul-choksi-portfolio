"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Preference = "dark" | "light" | "system";

const nextPreference: Record<Preference, Preference> = { dark: "light", light: "system", system: "dark" };

function applyTheme(preference: Preference) {
  const resolved = preference === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<Preference>("system");
  useEffect(() => {
    const frame = requestAnimationFrame(() => setPreference((document.documentElement.dataset.themePreference as Preference) || "system"));
    const media = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => { if (((localStorage.getItem("portfolio-theme") as Preference) || "system") === "system") applyTheme("system"); };
    media.addEventListener("change", sync);
    return () => { cancelAnimationFrame(frame); media.removeEventListener("change", sync); };
  }, []);
  const cycle = () => {
    const next = nextPreference[preference];
    setPreference(next); localStorage.setItem("portfolio-theme", next); applyTheme(next);
  };
  const Icon = preference === "dark" ? Moon : preference === "light" ? Sun : Laptop;
  return <button className="icon-button theme-toggle" onClick={cycle} aria-label={`Theme: ${preference}. Switch theme mode`} title={`Theme: ${preference}`}><Icon size={17} /><span className="sr-only">{preference} theme</span></button>;
}
