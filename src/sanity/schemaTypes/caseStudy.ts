import { defineArrayMember, defineField, defineType } from "sanity";
import { orderField, refsField, slugField, tagsField } from "./fields";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slugField("title"),
    orderField,
    defineField({
      name: "client",
      description: "Keep anonymized unless the client has approved being named.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "capability",
      type: "reference",
      to: [{ type: "capability" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "summary", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "challenge", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({
      name: "approach",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.required().min(1),
    }),
    tagsField("stack", "Stack"),
    defineField({ name: "outcome", type: "text", rows: 3, validation: (r) => r.required() }),
    refsField("offices", "office", "Teams (offices)"),
    defineField({
      name: "art",
      title: "Artwork variant",
      description: "Seed for the generated cover artwork. Each number draws a different pattern; give each case study its own.",
      type: "number",
      initialValue: 1,
      validation: (r) => r.required().integer().min(1).max(999),
    }),
  ],
  orderings: [{ title: "Site order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "client" } },
});
