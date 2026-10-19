import { defineField, defineType } from "sanity";
import { orderField, slugField, tagsField } from "./fields";

export const office = defineType({
  name: "office",
  title: "Office",
  type: "document",
  fields: [
    defineField({ name: "city", type: "string", validation: (r) => r.required() }),
    slugField("city"),
    orderField,
    defineField({ name: "country", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "region",
      type: "string",
      options: { list: ["Europe", "Americas", "MENA", "Asia-Pacific"], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "address", description: "Leave empty until confirmed.", type: "string" }),
    tagsField("focus", "Focus areas"),
    defineField({
      name: "coords",
      title: "Map position",
      description: "Places the hub on the map. The first office in site order is drawn as HQ.",
      type: "geopoint",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [{ title: "Site order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "city", subtitle: "country" } },
});
