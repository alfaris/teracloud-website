import "server-only";
import nodemailer from "nodemailer";

export type Mail = { from: string; to: string; replyTo: string; subject: string; text: string };
export type MailResult = "sent" | "unconfigured" | "failed";

// Sends through the company mail server when SMTP_HOST is set (the default for
// self-hosting), otherwise through Resend when RESEND_API_KEY is set.
export async function sendMail(mail: Mail): Promise<MailResult> {
  try {
    if (process.env.SMTP_HOST) {
      const port = Number(process.env.SMTP_PORT ?? 587);
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465, // 587 and 25 upgrade with STARTTLS
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
        connectionTimeout: 10_000,
      });
      await transport.sendMail(mail);
      return "sent";
    }
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: mail.from, to: mail.to, reply_to: mail.replyTo, subject: mail.subject, text: mail.text }),
        signal: AbortSignal.timeout(10_000),
      });
      return res.ok ? "sent" : "failed";
    }
    return "unconfigured";
  } catch (error) {
    console.error("[mail] send failed:", error instanceof Error ? error.message : error);
    return "failed";
  }
}
