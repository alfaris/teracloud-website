// LinkedIn activity shown on the site. Add a post by copying its link on
// LinkedIn (… → Copy link to post) into a new entry; see README → Editing
// content. The three newest appear on the home page, the three newest tagged
// culture or hiring on Careers. With no posts both sections are left out.
//
//   {
//     id: "2026-10-offsite",              // any unique text
//     title: "Our Cairo team's offsite",  // short headline, ≤ 100 characters
//     date: "2026-10-12",                 // YYYY-MM-DD
//     summary: "One or two sentences about the post.",
//     url: "https://www.linkedin.com/posts/…",
//     topics: ["culture"],                // company, engineering, culture, hiring
//     // Optional photo: put the file in public/news/ and describe it.
//     image: { src: "/news/offsite.jpg", alt: "The team on a boat", width: 1200, height: 675 },
//   },
import type { NewsPost } from "./types";

export const news: NewsPost[] = [
  {
    id: "2026-10-workplace",
    title: "Teracloud as a workplace, from the inside",
    date: "2026-10-14",
    summary:
      "What it takes to thrive here: people are trusted with responsibility, learn while doing, and grow by staying curious, open to feedback and proactive.",
    url: "https://www.linkedin.com/posts/teracloud-as-workplace-from-an-insider-perspective-share-7516075386900942848-khlA/",
    topics: ["hiring", "culture"],
  },
  {
    id: "2026-10-nubistech",
    title: "Nubistech is born",
    date: "2026-10-07",
    summary:
      "After a long legal and financial process, our Cairo-based lab is now officially a Teracloud lab: Nubistech. Welcome to our Egyptian colleagues.",
    url: "https://www.linkedin.com/posts/nubistech-is-born-this-last-quarter-ugcPost-7513524061847842816-oun7/",
    topics: ["company"],
  },
  {
    id: "2026-09-greece-3",
    title: "Teracloud Greece turns 3",
    date: "2026-09-30",
    summary:
      "The Athens team celebrated three years by the beach: volleyball, table tennis, a waterpark, a birthday dinner and a game of Guess Who that revealed some hidden talents.",
    url: "https://www.linkedin.com/posts/teracloud-greece-is-3-this-year-our-ugcPost-7510973637416595457-ahZ7/",
    topics: ["culture", "company"],
  },
  {
    id: "2026-09-hackathon-tbilisi",
    title: "Teracloud Global Hackathon 2026",
    date: "2026-09-23",
    summary:
      "25 Teraclouders from our offices worldwide met outside Tbilisi, Georgia, for three days of engineering, competing to build the most innovative product.",
    url: "https://www.linkedin.com/posts/teracloud-global-hackathon-last-week-ugcPost-7508442628795891712-pEHZ/",
    topics: ["engineering", "culture", "company"],
  },
  {
    id: "2026-09-french-friday",
    title: "Je ne regrette rien: a French Friday bar",
    date: "2026-09-01",
    summary:
      "Copenhagen went French for Friday bar — Côtes-du-Rhône, cheese, a quiz on French-Quebec expressions and a mock-ranting contest.",
    url: "https://www.linkedin.com/posts/je-ne-regrette-rien-c%C3%B4tes-du-rh%C3%B4ne-ugcPost-7500457948045819904-yWmb/",
    topics: ["culture"],
  },
  {
    id: "2026-08-armenia-6",
    title: "Six years of Teracloud Armenia",
    date: "2026-08-26",
    summary:
      "Our Yerevan colleagues marked six years with homemade tiramisu and some very inventive team games.",
    url: "https://www.linkedin.com/posts/6-years-of-teracloud-armenia-our-yerevan-ugcPost-7498295800989401088-DWXS/",
    topics: ["culture", "company"],
  },
  {
    id: "2026-08-crossword",
    title: "Mini TC crossword: our three core values",
    date: "2026-08-19",
    summary:
      "Teracloud is guided by three core values. Do you know them by heart? A small crossword to find out.",
    url: "https://www.linkedin.com/posts/mini-crossword-ugcPost-7495745583278690304-_9I6/",
    topics: ["culture"],
  },
  {
    id: "2026-07-canal-cones",
    title: "Canal Cones",
    date: "2026-07-15",
    summary:
      "Summer heat called for an ice-cream Friday bar by the water for the Copenhagen team.",
    url: "https://www.linkedin.com/posts/canal-cones-adapting-to-the-rise-in-ugcPost-7483058550467035136-rdOt/",
    topics: ["culture"],
  },
  {
    id: "2026-07-eurovision",
    title: "TC-GR goes Eurovision",
    date: "2026-07-01",
    summary:
      "Our Greek colleagues held a Eurovision night with a themed quiz, pizza and the classic songs.",
    url: "https://www.linkedin.com/posts/tc-gr-as-youve-guessed-from-ugcPost-7478003544684441616-Tpuz/",
    topics: ["culture"],
  },
  {
    id: "2026-03-po-training",
    title: "Product Owner training, hosted by our Egypt team",
    date: "2026-03-04",
    summary:
      "Our Egypt team ran a hands-on Product Owner workshop for colleagues from Armenia, the US, Copenhagen and Greece, with technical exercises and product-ownership simulations.",
    url: "https://www.linkedin.com/posts/teracloud-product-owner-training-our-egypt-ugcPost-7434885363636281344-5goM/",
    topics: ["engineering", "culture"],
  },
  {
    id: "2025-10-hackathon-cairo",
    title: "Teracloud Global Hackathon 2025: the results",
    date: "2025-10-05",
    summary:
      "36 Teraclouders from 6 offices formed 9 teams in Cairo. The judges unanimously picked THMI Edge automatic deployment as the winner.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7380604046551875584/",
    topics: ["company", "engineering", "culture"],
  },
];
