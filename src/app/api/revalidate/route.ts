import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { isContentType } from "@/sanity/tags";

// Sanity GROQ webhook target. Configure it to POST on create/update/delete
// with the projection {_type} and SANITY_REVALIDATE_SECRET as its secret; see
// README. Expires every cached read of that document type.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return Response.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });

  try {
    // `true` waits out Content Lake's eventual consistency before we expire.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) return Response.json({ message: "Invalid signature" }, { status: 401 });
    if (!isContentType(body?._type)) return Response.json({ message: "Unknown or missing _type" }, { status: 400 });

    // A webhook can't read-its-own-write like updateTag; expire immediately so
    // the next visit renders the published content instead of stale.
    revalidateTag(body._type, { expire: 0 });
    return Response.json({ revalidated: [body._type], now: Date.now() });
  } catch (err) {
    console.error("Revalidation webhook failed", err);
    return Response.json({ message: "Bad request" }, { status: 400 });
  }
}
