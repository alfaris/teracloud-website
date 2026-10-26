"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { sendMail } from "@/lib/mail";

export type ContactState = { status: "idle" | "success" | "error"; message?: string; errors?: Record<string, string> };

const schema = z.object({
  intent: z.enum(["partnership", "careers", "general"]),
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.email("Enter an email address like name@company.com."),
  company: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10, "Add a few more words — at least 10 characters.").max(5000),
  consent: z.literal("on", { message: "Tick the box to confirm you've read the privacy policy." }),
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
    return { status: "error", message: `${Object.keys(errors).length === 1 ? "One field needs" : `${Object.keys(errors).length} fields need`} attention. Check the messages below each field.`, errors };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return { status: "error", message: "You've sent several messages in a few minutes. Wait a moment and try again, or email info@teracloud.com." };

  const { intent, name, email, company, message } = parsed.data;
  // Optional per-intent inboxes, e.g. CONTACT_TO_PARTNERSHIP=sales@teracloud.com.
  const to = process.env[`CONTACT_TO_${intent.toUpperCase()}`] || process.env.CONTACT_TO || "info@teracloud.com";
  const from = process.env.CONTACT_FROM ?? "Teracloud website <website@teracloud.com>";

  const result = await sendMail({
    from,
    to,
    replyTo: email,
    subject: `[${intent}] ${name}${company ? ` — ${company}` : ""}`,
    text: `Intent: ${intent}\nName: ${name}\nEmail: ${email}\nCompany: ${company ?? "-"}\n\n${message}`,
  });

  if (result === "unconfigured") {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] No SMTP_HOST or RESEND_API_KEY set — message not sent:", { intent, name, email, company });
      return { status: "success" };
    }
    return { status: "error", message: "We can't send messages from this form right now. Your text is still here, so you can copy it into an email to info@teracloud.com." };
  }
  if (result === "failed") {
    return { status: "error", message: "We couldn't send your message. Your text is still here: try again, or email it to info@teracloud.com." };
  }
  return { status: "success" };
}
