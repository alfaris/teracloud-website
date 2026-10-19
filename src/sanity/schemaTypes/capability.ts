import { defineArrayMember, defineField, defineType } from "sanity";
import { orderField, refsField, slugField, tagsField } from "./fields";

export const capability = defineType({
  name: "capability",
  title: "Capability",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slugField("title"),
    orderField,
    defineField({
      name: "short",
      title: "Short description",
      description: "One line, shown on cards and in the capability grid.",
      type: "string",
      validation: (r) => r.required().max(90),
    }),
    defineField({ name: "summary", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({
      name: "builds",
      title: "What we build",
      type: "array",
      of: [defineArrayMember({ type: "titledText" })],
      validation: (r) => r.required().min(1),
    }),
    tagsField("stack", "Stack"),
    refsField("offices", "office", "Teams (offices)"),
    refsField("work", "caseStudy", "Related case studies"),
  ],
  orderings: [{ title: "Site order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "short" } },
});
