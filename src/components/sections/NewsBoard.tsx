"use client";

import { useState } from "react";
import clsx from "clsx";
import { NEWS_TOPICS, type NewsPost } from "@/content/types";
import { NewsCards } from "./NewsCards";

const label = (t: string) => t[0].toUpperCase() + t.slice(1);

// All news with a topic filter. Filtering happens in the browser; every post
// is in the server-rendered HTML.
export function NewsBoard({ posts }: { posts: NewsPost[] }) {
  const [topic, setTopic] = useState<string>("all");
  const topics = NEWS_TOPICS.filter((t) => posts.some((p) => p.topics.includes(t)));
  const shown = topic === "all" ? posts : posts.filter((p) => p.topics.includes(topic as NewsPost["topics"][number]));
  return (
    <div>
      <div role="group" aria-label="Filter by topic" className="mb-10 flex flex-wrap gap-2">
        {["all", ...topics].map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={topic === t}
            onClick={() => setTopic(t)}
            className={clsx(
              "min-h-11 rounded-full border px-5 font-medium transition-colors",
              topic === t ? "border-blue bg-blue text-white" : "border-line bg-white hover:border-blue hover:text-blue",
            )}
          >
            {t === "all" ? `All (${posts.length})` : label(t)}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">{shown.length} posts shown</p>
      <NewsCards key={topic} posts={shown} />
    </div>
  );
}
