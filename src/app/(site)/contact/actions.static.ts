// Stand-in for ./actions in the static export (GitHub Pages), which has no
// server to send mail from: next.config.ts aliases ./actions to this file
// when GITHUB_PAGES=true. The form is validated the same way, then opened as
// a pre-filled email in the visitor's own email app.
import { siteSettings } from "@/content/site";
import { validateContact, type ContactState } from "./schema";

export type { ContactState };

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  if (form.get("website")) return { status: "success" };
  const result = validateContact(form);
  if (!result.data) return result.state;

  const { intent, name, email, company, message } = result.data;
  const subject = `[${intent}] ${name}${company ? ` — ${company}` : ""}`;
  const body = `${message}\n\n—\n${name}\n${email}${company ? `\n${company}` : ""}`;
  window.location.href = `mailto:${siteSettings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { status: "success", via: "mailto" };
}
