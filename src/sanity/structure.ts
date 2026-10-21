import type { StructureResolver } from "sanity/structure";

// Site settings is a singleton: one fixed document, no "create new".
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem().title("Site settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("capability").title("Capabilities"),
      S.documentTypeListItem("caseStudy").title("Case studies"),
      S.documentTypeListItem("office").title("Offices"),
      S.documentTypeListItem("company").title("Companies"),
      S.documentTypeListItem("newsPost").title("News"),
    ]);
