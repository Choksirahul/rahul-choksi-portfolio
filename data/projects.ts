import type { ArchiveProject, Project, ProjectCategory } from "./types";

export const projectFilters: Array<"All" | ProjectCategory> = ["All", "React", "Webflow", "Shopify", "Enterprise"];

export const projects: Project[] = [
  {
    number: "01", title: "TimePayment — Customer & Vendor Portal", period: "May 2026 — Present",
    categories: ["React", "Enterprise"], technologies: ["React.js", "Enterprise portals", "Frontend architecture"], visual: "portal",
    role: "Lead frontend development",
    overview: "Customer and Vendor portals focused on equipment rental and quotation management workflows.",
    responsibilities: ["Lead frontend development across both portal experiences", "Build responsive interfaces for quotation generation and customer interactions", "Create reusable UI components for enterprise-level usability"],
    contribution: "Improving workflow efficiency and application responsiveness across both platforms.",
  },
  {
    number: "02", title: "MajorKey Tech — Identity Platform", period: "Apr 2026 — Present",
    categories: ["Webflow"], technologies: ["Webflow", "SEO optimization", "UI enhancements"], visual: "identity",
    role: "Frontend optimization and architecture",
    overview: "An identity platform strengthened through targeted frontend, performance, and accessibility work.",
    responsibilities: ["Improve SEO implementation and frontend performance", "Resolve UI issues across multiple platform sections", "Contribute to architecture and planning for the Glossary module"],
    contribution: "Replaced Google reCAPTCHA with Cloudflare Turnstile to improve security and accessibility.",
  },
  {
    number: "03", title: "Keepr — Alcohol Testing Platform", period: "Jul 2024 — Apr 2026",
    categories: ["Shopify"], technologies: ["Shopify", "eCommerce", "Responsive development"], visual: "commerce",
    role: "Shopify frontend development",
    overview: "A Shopify storefront for an alcohol testing platform focused on smart BrAC testing devices.",
    responsibilities: ["Develop and optimize storefront experiences", "Improve navigation and the customer engagement flow", "Implement responsive layouts and frontend enhancements"],
    contribution: "Created a more seamless cross-device storefront experience.",
  },
  {
    number: "04", title: "DUI — Affiliate Dashboard", period: "Jul 2024 — Apr 2026",
    categories: ["React", "Enterprise"], technologies: ["React.js", "REST APIs", "Dashboard development"], visual: "dashboard",
    role: "React frontend development",
    overview: "A secure affiliate dashboard for partners to access customer information and documents.",
    responsibilities: ["Integrate REST APIs for real-time interactions and data workflows", "Build reusable frontend components", "Optimize responsiveness across devices"],
    contribution: "Established a modern, scalable dashboard UI architecture with improved usability.",
  },
];

export const archiveProjects: ArchiveProject[] = [
  { title: "My Healthy Work", type: "Admin Portal", technologies: ["PS/Figma to HTML"] },
  { title: "1Talent", type: "Product interface", technologies: ["PS/Figma to HTML"] },
  { title: "DRC", type: "Taxation Site", technologies: ["Responsive UI"] },
  { title: "Mesh01", type: "Product Testing", technologies: ["Frontend UI"] },
  { title: "MUTE", type: "Electric Moped Landing Page", technologies: ["Webflow"] },
  { title: "MajorKey Tech", type: "Landing Page", technologies: ["Webflow"] },
];
