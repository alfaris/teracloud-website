import { z } from "zod";

// Shared by the server action and by the static (GitHub Pages) build, which
// validates in the browser and hands the message to the visitor's email app.
export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  /** "mailto": the message was handed to the visitor's email app, not sent. */
  via?: "server" | "mailto";
  /** With via "mailto": the composed email, shown so it can be copied if no email app opened. */
  email?: { to: string; subject: string; body: string; href: string };
};

export const contactSchema = z.object({
  intent: z.enum(["partnership", "careers", "general"]),
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.email("Enter an email address like name@company.com."),
  company: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10, "Add a few more words — at least 10 characters.").max(5000),
  consent: z.literal("on", { message: "Tick the box to confirm you've read the privacy policy." }),
});

export function validateContact(form: FormData) {
  const parsed = contactSchema.safeParse(Object.fromEntries(form));
  if (parsed.success) return { data: parsed.data } as const;
  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
  const n = Object.keys(errors).length;
  const state: ContactState = {
    status: "error",
    message: `${n === 1 ? "One field needs" : `${n} fields need`} attention. Check the messages below each field.`,
    errors,
  };
  return { state } as const;
}
