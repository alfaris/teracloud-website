"use server";

import { headers } from "next/headers";
import { sendMail } from "@/lib/mail";
import { validateContact, type ContactState } from "./schema";

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

  const valid = validateContact(form);
  if (!valid.data) return valid.state;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return { status: "error", message: "You've sent several messages in a few minutes. Wait a moment and try again, or email info@teracloud.com." };

  const { intent, name, email, company, message } = valid.data;
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
