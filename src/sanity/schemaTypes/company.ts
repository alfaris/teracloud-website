import { defineField, defineType } from "sanity";
import { orderField } from "./fields";

export const company = defineType({
  name: "company",
  title: "Company",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "relation",
      type: "string",
      options: { list: [{ title: "Sister company", value: "sister" }, { title: "Partner", value: "partner" }], layout: "radio" },
      validation: (r) => r.required(),
    }),
    orderField,
    defineField({ name: "url", title: "Website", type: "url", validation: (r) => r.required() }),
    defineField({
      name: "logo",
      description: "Path to a logo in the site's public/logos folder, e.g. /logos/ibm.png.",
      type: "string",
      validation: (r) => r.required().regex(/^\/logos\//, { name: "path under /logos/" }),
    }),
    defineField({ name: "description", description: "Shown for sister companies.", type: "text", rows: 3 }),
  ],
  orderings: [{ title: "Site order", name: "order", by: [{ field: "relation", direction: "desc" }, { field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "relation" } },
});
