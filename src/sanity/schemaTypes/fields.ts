import { defineArrayMember, defineField } from "sanity";

export const slugField = (source: string) =>
  defineField({
    name: "slug",
    type: "slug",
    description: "Used in the page URL. Changing it breaks existing links.",
    options: { source, maxLength: 96 },
    validation: (r) => r.required(),
  });

// Lists render in this order on the site; lower comes first.
export const orderField = defineField({
  name: "order",
  type: "number",
  description: "Position in lists on the site. Lower numbers come first.",
  initialValue: 100,
  validation: (r) => r.required().integer().min(0),
});

export const tagsField = (name: string, title?: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [defineArrayMember({ type: "string" })],
    options: { layout: "tags" },
  });

export const refsField = (name: string, to: string, title?: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "reference", to: [{ type: to }] })],
    validation: (r) => r.unique(),
  });

export const titledTextArray = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [defineArrayMember({ type: "titledText" })],
  });
