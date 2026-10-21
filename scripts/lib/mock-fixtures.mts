// Test-only documents the mock API serves on top of the seed, so sections
// that have no local fallback content (news) render in the Sanity test run.
// Not real posts; never seed these into a real dataset.
export const fixtures = [
  {
    _id: "image-fixture",
    _type: "sanity.imageAsset",
    url: "/logos/ibm.png",
    metadata: { dimensions: { width: 126, height: 50 } },
  },
  {
    _id: "newsPost-fixture-1",
    _type: "newsPost",
    url: "https://www.linkedin.com/company/teracloud-llc/posts/",
    title: "Test post: engineering update",
    date: "2026-10-01",
    summary: "Fixture for the mock Sanity API.",
    topics: ["engineering"],
    image: { _type: "image", alt: "Test image", asset: { _type: "reference", _ref: "image-fixture" } },
  },
  {
    _id: "newsPost-fixture-2",
    _type: "newsPost",
    url: "https://www.linkedin.com/company/teracloud-llc/posts/",
    title: "Test post: team offsite",
    date: "2026-09-15",
    summary: "Fixture for the mock Sanity API.",
    topics: ["culture"],
  },
  {
    _id: "newsPost-fixture-3",
    _type: "newsPost",
    url: "https://example.com/article",
    title: "Test post: we are hiring",
    date: "2026-08-20",
    summary: "Fixture for the mock Sanity API.",
    topics: ["hiring"],
  },
  {
    _id: "newsPost-fixture-4",
    _type: "newsPost",
    url: "https://www.linkedin.com/company/teracloud-llc/posts/",
    title: "Test post: oldest",
    date: "2026-07-01",
    summary: "Fixture for the mock Sanity API.",
    topics: ["company"],
  },
];
