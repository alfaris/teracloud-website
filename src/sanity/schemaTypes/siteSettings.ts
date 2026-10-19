import { defineArrayMember, defineField, defineType } from "sanity";
import { titledTextArray } from "./fields";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "company", title: "Company", default: true },
    { name: "pages", title: "Page copy" },
  ],
  fields: [
    defineField({ name: "tagline", type: "string", group: "company", validation: (r) => r.required() }),
    defineField({
      name: "description",
      description: "Default meta description for search results and link previews.",
      type: "text",
      rows: 3,
      group: "company",
      validation: (r) => r.required().max(300),
    }),
    defineField({ name: "email", type: "email", group: "company", validation: (r) => r.required() }),
    defineField({
      name: "address",
      type: "object",
      group: "company",
      fields: [
        defineField({ name: "street", type: "string", validation: (r) => r.required() }),
        defineField({ name: "postalCode", type: "string", validation: (r) => r.required() }),
        defineField({ name: "city", type: "string", validation: (r) => r.required() }),
        defineField({ name: "country", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({ name: "founded", type: "number", group: "company", validation: (r) => r.required().integer() }),
    defineField({ name: "whistleblowerUrl", title: "Whistleblower hotline URL", type: "url", group: "company", validation: (r) => r.required() }),
    defineField({
      name: "stats",
      description: "The numbers on the home page.",
      type: "array",
      group: "pages",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", type: "number", validation: (r) => r.required() }),
            defineField({ name: "suffix", description: "e.g. +", type: "string" }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", value: "value", suffix: "suffix" }, prepare: ({ title, value, suffix }) => ({ title, subtitle: `${value}${suffix ?? ""}` }) },
        }),
      ],
    }),
    { ...titledTextArray("principles", "How we work", "Home and About pages."), group: "pages" },
    { ...titledTextArray("benefits", "Benefits", "Home and Careers pages."), group: "pages" },
    { ...titledTextArray("hiringSteps", "Hiring steps", "Careers page."), group: "pages" },
    { ...titledTextArray("crossCutting", "Cross-cutting services", "Capabilities page."), group: "pages" },
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
