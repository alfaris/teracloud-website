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
      "25 Teraclouders from our offices worldwide met outside Tbilisi for three days of software engineering, competing to build the most innovative and profitable product — with time for football and sightseeing, too.",
    highlights: [
      {
        title: "Winner: a three-person team",
        body: "The recap post names the winners and thanks everyone who took part.",
      },
      {
        title: "Entry: embedded AI for predictive maintenance",
        body: "One team built an embedded AI sensor that analyses machine vibration data to spot early signs of equipment failure.",
      },
    ],
    stats: [
      { value: 25, label: "Teraclouders" },
      { value: 3, label: "Days" },
    ],
    url: "https://www.linkedin.com/posts/teracloud-global-hackathon-last-week-ugcPost-7508442628795891712-pEHZ/",
    source: "Teracloud company LinkedIn post, 2026-09-23; theme and entry from https://dk.linkedin.com/in/vadim-ilves",
  },
  {
    year: 2025,
    city: "Cairo",
    country: "Egypt",
    dates: "23–25 September",
    summary:
      "Hosted by our Egyptian colleagues: a two-day tech marathon to devise new ways to improve our products, swap ideas and build team spirit across departments — with time among the pyramids, too.",
    highlights: [
      {
        title: "Winner: THMI Edge automatic deployment",
        body: "The judges were unanimous: a way to deploy the THMI Edge data-collection agent straight from the THMI Portal interface.",
      },
    ],
    stats: [
      { value: 36, label: "Teraclouders" },
      { value: 9, label: "Teams" },
      { value: 6, label: "Offices" },
      { value: 5, label: "Judges" },
    ],
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7380604046551875584/",
    source: "Teracloud company LinkedIn post, 2025-10-05",
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
