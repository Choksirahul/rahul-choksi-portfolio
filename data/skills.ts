import { Boxes, Braces, CodeXml, GitBranch, Layers3, PlugZap, Sparkles } from "lucide-react";
import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  { title: "Frontend Engineering", items: ["HTML5", "CSS3", "SCSS", "JavaScript (ES6+)", "TypeScript"], icon: CodeXml, size: "feature" },
  { title: "React Ecosystem", items: ["React.js", "Next.js", "Redux Toolkit", "Context API"], icon: Braces, size: "standard" },
  { title: "Enterprise UI", items: ["Angular 16+", "Tailwind CSS", "Bootstrap", "CSS Modules", "Responsive Design"], icon: Layers3, size: "standard" },
  { title: "Web Platforms", items: ["Webflow", "Shopify"], icon: Boxes, size: "compact" },
  { title: "Integration", items: ["Node.js", "REST APIs", "Postman"], icon: PlugZap, size: "compact" },
  { title: "Delivery Workflow", items: ["Git", "GitHub", "Agile/Scrum", "SDLC"], icon: GitBranch, size: "compact" },
  { title: "Performance + SEO", items: ["Component-based Architecture", "Performance Optimization", "SEO", "Cross-browser Compatibility", "UI/UX Implementation", "Responsive Development"], icon: Sparkles, size: "wide" },
];
