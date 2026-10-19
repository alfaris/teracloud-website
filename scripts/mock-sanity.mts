// A stand-in for the Sanity query API, serving the seed documents, so the
// Sanity code path can be built and tested without a real project:
//
//   npm run sanity:mock &
//   SANITY_PROJECT_ID=mock SANITY_API_HOST=http://127.0.0.1:4545 npm run build
//
// GROQ is evaluated with groq-js, so the real queries in src/sanity run.
// POST /__mock/patch {"_id": "...", "set": {...}} edits a document in memory,
// to exercise /api/revalidate.
import { createServer } from "node:http";
import { evaluate, parse } from "groq-js";
import { docs } from "./lib/seed-docs.mts";

const port = Number(process.env.PORT ?? 4545);
const dataset: Record<string, unknown>[] = structuredClone(docs);

async function body(req: import("node:http").IncomingMessage) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const send = (status: number, data: unknown) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(data));
  };
  try {
    if (req.method === "POST" && url.pathname === "/__mock/patch") {
      const { _id, set } = await body(req);
      const doc = dataset.find((d) => d._id === _id);
      if (!doc) return send(404, { error: `No document ${_id}` });
      Object.assign(doc, set);
      return send(200, { ok: true, doc });
    }
    if (!/\/data\/query\/[^/]+$/.test(url.pathname)) return send(404, { error: "Not mocked" });

    const input = req.method === "POST" ? await body(req) : null;
    const query: string = input?.query ?? url.searchParams.get("query") ?? "";
    const params: Record<string, unknown> = input?.params ?? {};
    for (const [k, v] of url.searchParams) if (k.startsWith("$")) params[k.slice(1)] = JSON.parse(v);

    const started = Date.now();
    const result = await (await evaluate(parse(query, { params }), { dataset, params })).get();
    send(200, { query, result, ms: Date.now() - started });
  } catch (err) {
    send(400, { error: { description: String(err) } });
  }
}).listen(port, "127.0.0.1", () => console.log(`Mock Sanity API on http://127.0.0.1:${port} (${dataset.length} documents)`));
