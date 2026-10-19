import { defineField, defineType } from "sanity";

export const titledText = defineType({
  name: "titledText",
  title: "Title and text",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", subtitle: "body" } },
});
