// The annual Teracloud Hackathon. Site content: edit it here (see README →
// Editing content). Newest edition first is not required; pages sort by year.
//
// Facts below come from public LinkedIn posts by Teracloud people; `source`
// records where (it is never shown on the site). Fill in what
// is still missing (dates and themes for 2024–2025, winners, team counts,
// photos) before launch.
import type { HackathonEdition } from "./types";

export const hackathonIntro = {
  title: "Three days to build what's next.",
  summary:
    "Once a year, teams from across Teracloud's hubs set aside day-to-day work to build something new. Each edition has a host country, and the finalists present their projects there in person.",
};

export const hackathonPrinciples = [
  { title: "Cross-hub teams", body: "Teams mix engineers from different offices and projects — the same people who rarely share a codebase share a whiteboard." },
  { title: "Real prototypes", body: "Ideas are judged on what works by demo time, not on slides." },
  { title: "Present in person", body: "Finalists travel to the host country to demo their work to colleagues." },
];

export const hackathonEditions: HackathonEdition[] = [
  {
    year: 2026,
    city: "Tbilisi",
    country: "Georgia",
    dates: "14–16 September",
    theme: "AI and emerging technologies",
    summary:
      "Teams from across the company explored practical applications of AI and emerging technologies.",
    highlights: [
      {
        title: "Embedded AI for predictive maintenance",
        body: "One team built an embedded AI sensor that analyses machine vibration data to spot early signs of equipment failure.",
      },
    ],
    source: "https://dk.linkedin.com/in/vadim-ilves",
  },
  {
    year: 2025,
    city: "Cairo",
    country: "Egypt",
    summary: "The 2025 edition was held in Cairo, home to one of our engineering hubs.",
    highlights: [],
    source: "Confirmed by Ahmed Faris (Teracloud), 2026-10-26",
  },
  {
    year: 2024,
    country: "Armenia",
    dates: "September",
    summary:
      "Our Armenian team hosted the Global Teracloud Hackathon. Winning teams travelled to Armenia to present their projects in person.",
    highlights: [],
    source: "https://am.linkedin.com/in/mary-hakobyan",
  },
];
