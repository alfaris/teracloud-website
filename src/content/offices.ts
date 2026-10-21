// Site content: edit it here (see README → Editing content). Pages read it
// through src/lib/content.ts.
import type { Office } from "./types";

// Street addresses outside Copenhagen are pending confirmation.
export const offices: Office[] = [
  {
    slug: "copenhagen",
    city: "Copenhagen",
    country: "Denmark",
    region: "Europe",
    address: "Nicolai Eigtveds Gade 26, 5., 1402 København K",
    focus: ["Energy monitoring (SCADA)", "Industrial simulation", "Enterprise operating systems", "Replatforming", "Compilers & tools"],
    coords: [55.676, 12.568],
  },
  {
    slug: "malmo",
    city: "Malmö",
    country: "Sweden",
    region: "Europe",
    focus: ["Energy monitoring (SCADA)", "Enterprise operating systems", "Mainframe capacity planning"],
    coords: [55.605, 13.003],
  },
  {
    slug: "stuttgart",
    city: "Stuttgart",
    country: "Germany",
    region: "Europe",
    focus: ["Enterprise operating systems", "Compilers & tools"],
    coords: [48.775, 9.182],
  },
  {
    slug: "athens",
    city: "Athens",
    country: "Greece",
    region: "Europe",
    focus: ["Real-time analytics (Streams)", "Replatforming", "Mainframe capacity planning"],
    coords: [37.984, 23.728],
  },
  {
    slug: "yerevan",
    city: "Yerevan",
    country: "Armenia",
    region: "Europe",
    focus: ["Gaming portal", "Video stream distribution", "Energy monitoring (SCADA)", "Compilers & tools"],
    coords: [40.179, 44.499],
  },
  {
    slug: "cairo",
    city: "Cairo",
    country: "Egypt",
    region: "MENA",
    focus: ["Industrial heat-pump tools", "Building energy planning & simulation", "AI-assisted reporting"],
    coords: [30.044, 31.236],
  },
  {
    slug: "boston",
    city: "Boston",
    country: "United States",
    region: "Americas",
    focus: ["Real-time analytics", "Enterprise operating systems", "Compilers & tools", "Mainframe capacity planning"],
    coords: [42.36, -71.058],
  },
  {
    slug: "perth",
    city: "Perth",
    country: "Australia",
    region: "Asia-Pacific",
    focus: ["Mainframe capacity planning"],
    coords: [-31.95, 115.86],
  },
];
