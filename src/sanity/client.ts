import { createClient, type QueryParams } from "@sanity/client";
import { apiHost, apiVersion, dataset, projectId } from "./env";

// Published content only, straight from the API (not the CDN): Next's cache
// sits in front, and the revalidation webhook must read what was just published.
const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: "published",
      ...(apiHost ? { apiHost, useProjectHostname: false } : {}),
    })
  : null;

export function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  if (!client) throw new Error("sanityFetch called without SANITY_PROJECT_ID");
  return client.fetch<T>(query, params);
}
