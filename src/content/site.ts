import type { SiteSettings } from "./types";

// Identity the code depends on (metadata base, canonical URLs, the UKG job
// board adapter). Change with care.
export const site = {
  name: "Teracloud",
  legalName: "Teracloud ApS",
  url: "https://teracloud.com",
  jobBoardUrl:
    "https://recruiting.ultipro.com/VMS1002VMOO/JobBoard/570f45ca-1f4d-4b93-b817-af69fc1457f9/",
} as const;

export const nav = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/work", label: "Work" },
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/careers", label: "Careers" },
  { href: "/hackathon", label: "Hackathon" },
  { href: "/about", label: "About" },
] as const;

// Company-wide copy used across pages. Pages read it through
// src/lib/content.ts.
export const siteSettings: SiteSettings = {
  email: "info@teracloud.com",
  address: {
    street: "Nicolai Eigtveds Gade 26, 5.",
    postalCode: "1402",
    city: "København K",
    country: "Denmark",
  },
  founded: 2015,
  tagline: "Systems engineering, from the operating system up.",
  description:
    "Teracloud is an R&D partner for product companies built on deep technology — operating systems, mainframes, compilers, real-time data and industrial energy software. 200+ engineers across 8 hubs.",
  whistleblowerUrl: "https://whistleblowersoftware.com/secure/teracloud",
  stats: [
    { value: 10, label: "Years of systems engineering", suffix: "+" },
    { value: 200, label: "Engineers & specialists", suffix: "+" },
    { value: 8, label: "Engineering hubs", suffix: "" },
    { value: 12, label: "Active projects", suffix: "" },
  ],
  principles: [
    {
      title: "Proven practice",
      body: "Years of systems work let us spot problems before they ship. We use tested engineering practices so results land as planned.",
    },
    {
      title: "The right method for the job",
      body: "Waterfall, Scrum, Kanban — different products need different rhythms. Our teams work in whichever one the project demands.",
    },
    {
      title: "Always learning",
      body: "In-house training, paid external courses and senior engineers who make time to teach. Learning is part of the job, not extra to it.",
    },
    {
      title: "Many perspectives",
      body: "Engineers of many nationalities, backgrounds and ages work across our hubs. That range makes our solutions sturdier.",
    },
  ],
  benefits: [
    {
      title: "Teamwork",
      body: "We work best together. Knowledgeable colleagues, open discussion and plenty of chances to bounce ideas around.",
    },
    {
      title: "Wellness",
      body: "Modern offices, a good kitchen, quiet zones, and health and sports benefits for the long run.",
    },
    {
      title: "Training",
      body: "Regular internal sessions led by experienced colleagues, and we pay for the external courses you take.",
    },
    {
      title: "Hard problems",
      body: "Kernels, compilers, mainframes, real-time systems. The work is not easy — that is what makes better engineers.",
    },
  ],
  hiringSteps: [
    { title: "Apply", body: "Send your application through our job board. A real person reads it." },
    { title: "Intro call", body: "A short conversation about you, the role and the team." },
    { title: "Technical talk", body: "A practical discussion with engineers you would work with — no trick puzzles." },
    { title: "Offer", body: "We move quickly and tell you clearly where you stand." },
  ],
  crossCutting: [
    {
      title: "Quality assurance",
      body: "Automation, performance, scalability, regression, integration, globalization and functional testing — across web, desktop, mobile, server and API.",
    },
    {
      title: "Support & professional services",
      body: "Technical support at every level, and services that help customers get the full value of their software.",
    },
  ],
};
