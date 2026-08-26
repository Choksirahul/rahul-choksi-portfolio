import type { LucideIcon } from "lucide-react";

export type NavItem = { label: string; href: string };
export type ProjectCategory = "React" | "Angular" | "Next.js" | "Webflow" | "Shopify" | "Enterprise";
export type Project = {
  number: string;
  title: string;
  period: string;
  categories: ProjectCategory[];
  technologies: string[];
  role: string;
  overview: string;
  responsibilities: string[];
  contribution: string;
  visual: "portal" | "identity" | "commerce" | "dashboard";
  url?: string;
};
export type ArchiveProject = { title: string; type: string; technologies: string[] };
export type SkillGroup = { title: string; items: string[]; icon: LucideIcon; size?: "feature" | "wide" | "standard" | "compact" };
export type SearchItem = { title: string; subtitle: string; href: string; group: string; keywords: string[] };
