"use server";

import { headers } from "next/headers";
import { z } from "zod";

export type ContactState = { status: "idle" | "success" | "error"; message?: string; errors?: Record<string, string> };

const schema = z.object({
  intent: z.enum(["partnership", "careers", "general"]),
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.email("Please enter a valid email address."),
  company: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10, "Please write a few words about your request.").max(5000),
  consent: z.literal("on", { message: "Please confirm you have read the privacy policy." }),
});

// Best-effort per-instance rate limit; swap for a shared store in production.
const hits = new Map<string, number[]>();
function limited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > 5;
}

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: real people never fill this hidden field.
  if (form.get("website")) return { status: "success" };

  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { status: "error", message: "Please check the highlighted fields.", errors };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return { status: "error", message: "Too many messages. Please try again in a few minutes." };

  const { intent, name, email, company, message } = parsed.data;
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO ?? "info@teracloud.com";
  const from = process.env.CONTACT_FROM ?? "Teracloud website <website@teracloud.com>";

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY not set — message not sent:", { intent, name, email, company });
      return { status: "success" };
    }
    return { status: "error", message: "The form is temporarily unavailable. Please email info@teracloud.com." };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `[${intent}] ${name}${company ? ` — ${company}` : ""}`,
      text: `Intent: ${intent}\nName: ${name}\nEmail: ${email}\nCompany: ${company ?? "-"}\n\n${message}`,
    }),
  });
  if (!res.ok) return { status: "error", message: "Something went wrong sending your message. Please email info@teracloud.com." };
  return { status: "success" };
}
