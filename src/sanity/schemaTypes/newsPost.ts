import { defineArrayMember, defineField, defineType } from "sanity";
import { NEWS_TOPICS } from "../../content/types";

export const newsPost = defineType({
  name: "newsPost",
  title: "News post",
  type: "document",
  fields: [
    defineField({
      name: "url",
      title: "Link",
      description: "The LinkedIn post (… → Copy link to post), or any other article.",
      type: "url",
      validation: (r) => r.required().uri({ scheme: ["https"] }),
    }),
    defineField({ name: "title", description: "A short headline for the site.", type: "string", validation: (r) => r.required().max(100) }),
    defineField({ name: "date", description: "When it was posted.", type: "date", validation: (r) => r.required() }),
    defineField({
      name: "summary",
      description: "One or two sentences. Shown on the card; the full post stays on LinkedIn.",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(280),
    }),
    defineField({
      name: "topics",
      description: "Culture and hiring posts also appear on the Careers page.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: NEWS_TOPICS.map((t) => ({ title: t[0].toUpperCase() + t.slice(1), value: t })), layout: "grid" },
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "image",
      description: "Optional. The post's photo works well.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          description: "What the image shows, for screen readers.",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
    }),
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date", media: "image" } },
});
