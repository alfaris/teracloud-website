import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { NewsBoard } from "@/components/sections/NewsBoard";
import { getNews } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "News",
  description: "News from Teracloud's hubs: company milestones, engineering events, the annual hackathon and life in our offices.",
  path: "/news",
});

export default async function NewsPage() {
  const posts = await getNews();
  return (
    <>
      <PageHeader
        label="News"
        title="What's happening across our hubs."
        intro="Milestones, engineering events and life at Teracloud, as shared on our LinkedIn page."
      />
      <Section tone="mist">
        <NewsBoard posts={posts} />
      </Section>
    </>
  );
}
