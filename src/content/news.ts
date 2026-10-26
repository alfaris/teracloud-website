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
    id: "2025-10-hackathon-cairo",
    title: "Teracloud Global Hackathon 2025: the results",
    date: "2025-10-05",
    summary:
      "36 Teraclouders from 6 offices formed 9 teams in Cairo. The judges unanimously picked THMI Edge automatic deployment as the winner.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7380604046551875584/",
    topics: ["company", "engineering", "culture"],
  },
];
