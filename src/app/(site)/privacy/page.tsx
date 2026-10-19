import { readFile } from "node:fs/promises";
import path from "node:path";
import { PageHeader } from "@/components/layout/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description: "How Teracloud collects, uses and protects personal information.",
  path: "/privacy",
});

// Policy text migrated verbatim from the previous site (last modified 2024-07-30).
async function getPolicy() {
  "use cache";
  return readFile(path.join(process.cwd(), "src/content/legal/privacy.html"), "utf8");
}

export default async function PrivacyPage() {
  const html = await getPolicy();
  return (
    <>
      <PageHeader title="Privacy policy" crumbs={[{ href: "/privacy", label: "Privacy policy" }]} />
      <div className="container-tc py-16">
        <article className="prose-tc legal" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </>
  );
}
