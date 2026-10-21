// GROQ projections shaped like the types in src/content/types.ts.
// References are flattened to slugs, matching the local files.

export const capabilitiesQuery = /* groq */ `
*[_type == "capability" && defined(slug.current)] | order(order asc, title asc) {
  "slug": slug.current,
  title,
  short,
  summary,
  "builds": coalesce(builds[]{ title, body }, []),
  "stack": coalesce(stack, []),
  "offices": coalesce(offices[]->slug.current, []),
  "work": coalesce(work[]->slug.current, [])
}`;

export const caseStudiesQuery = /* groq */ `
*[_type == "caseStudy" && defined(slug.current)] | order(order asc, title asc) {
  "slug": slug.current,
  title,
  client,
  "capability": capability->slug.current,
  summary,
  challenge,
  "approach": coalesce(approach, []),
  "stack": coalesce(stack, []),
  outcome,
  "offices": coalesce(offices[]->slug.current, []),
  art
}`;

export const officesQuery = /* groq */ `
*[_type == "office" && defined(slug.current)] | order(order asc, city asc) {
  "slug": slug.current,
  city,
  country,
  region,
  address,
  "focus": coalesce(focus, []),
  "coords": [coords.lat, coords.lng]
}`;

export const companiesQuery = /* groq */ `
*[_type == "company"] | order(order asc, name asc) {
  name,
  url,
  logo,
  "description": coalesce(description, ""),
  relation
}`;

// Newest first; the site never shows more than a page of them.
export const newsQuery = /* groq */ `
*[_type == "newsPost" && defined(url)] | order(date desc)[0...24] {
  "id": _id,
  title,
  date,
  summary,
  url,
  "topics": coalesce(topics, []),
  "image": select(defined(image.asset) => {
    "src": image.asset->url,
    "alt": coalesce(image.alt, ""),
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  })
}`;

export const siteSettingsQuery = /* groq */ `
*[_id == "siteSettings"][0] {
  email,
  address,
  founded,
  tagline,
  description,
  whistleblowerUrl,
  "stats": coalesce(stats[]{ value, label, "suffix": coalesce(suffix, "") }, []),
  "principles": coalesce(principles[]{ title, body }, []),
  "benefits": coalesce(benefits[]{ title, body }, []),
  "hiringSteps": coalesce(hiringSteps[]{ title, body }, []),
  "crossCutting": coalesce(crossCutting[]{ title, body }, [])
}`;
