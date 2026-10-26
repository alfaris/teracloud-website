"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { submitContact, type ContactState } from "./actions";
import { track } from "@/components/layout/Analytics";

const intents = [
  { value: "partnership", label: "A project or partnership" },
  { value: "careers", label: "Careers at Teracloud" },
  { value: "general", label: "Something else" },
] as const;

type Intent = (typeof intents)[number]["value"];

export function ContactForm() {
  const params = useSearchParams();
  const initial = (intents.find((i) => i.value === params.get("intent"))?.value ?? "partnership") as Intent;
  const [intent, setIntent] = useState<Intent>(initial);
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const uid = useId();
  const err = state.errors ?? {};
  // Controlled fields: React resets uncontrolled forms after every action, which
  // would wipe what the visitor typed whenever validation or sending fails.
  const [values, setValues] = useState({ name: "", email: "", company: "", message: "" });
  const [consent, setConsent] = useState(false);
  const bind = (name: keyof typeof values) => ({
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [name]: e.target.value })),
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") track("Contact submit", { intent });
    // Only when a submission succeeds, not when the intent toggle changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // After a failed submit, move focus to the first field that needs attention.
  useEffect(() => {
    if (state.status !== "error" || !state.errors) return;
    const first = Object.keys(state.errors)[0];
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl bg-blue-50 p-8">
        <p className="t-h3">Message sent.</p>
        <p className="mt-3 text-gray">Thanks, {values.name.split(" ")[0] || "and welcome"}. We usually reply within two working days, to {values.email}.</p>
      </div>
    );
  }

  const field = (name: string) => ({
    id: `${uid}-${name}`,
    name,
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `${uid}-${name}-err` : undefined,
  });
  const input = "mt-2 block w-full rounded-xl border border-line bg-white px-4 py-3 text-base transition-colors focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20 aria-[invalid=true]:border-red-600";
  const errorFor = (name: string) =>
    err[name] ? <p id={`${uid}-${name}-err`} className="mt-1.5 text-sm text-red-700">{err[name]}</p> : null;

  return (
    <form ref={formRef} action={action} noValidate className="space-y-6">
      <fieldset>
        <legend className="font-semibold">What would you like to talk about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {intents.map((i) => (
            <label
              key={i.value}
              className={clsx(
                "cursor-pointer rounded-full border px-4 py-2.5 font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue",
                intent === i.value ? "border-blue bg-blue text-white" : "border-line hover:border-blue",
              )}
            >
              <input type="radio" name="intent" value={i.value} checked={intent === i.value} onChange={() => setIntent(i.value)} className="sr-only" />
              {i.label}
            </label>
          ))}
        </div>
      </fieldset>

      {intent === "careers" && (
        <p className="rounded-xl bg-mist p-4 text-gray">
          Applying for a job? Use the <Link href="/careers#roles" className="text-blue underline underline-offset-4">open roles</Link> page — every application goes through our job board. Use this form for other questions about working here.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="font-medium">Your name</label>
          <input {...field("name")} {...bind("name")} type="text" autoComplete="name" required className={input} />
          {errorFor("name")}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="font-medium">Work email</label>
          <input {...field("email")} {...bind("email")} type="email" autoComplete="email" required className={input} />
          {errorFor("email")}
        </div>
      </div>
      <div>
        <label htmlFor={`${uid}-company`} className="font-medium">
          Company <span className="font-normal text-gray">(optional)</span>
        </label>
        <input {...field("company")} {...bind("company")} type="text" autoComplete="organization" className={input} />
      </div>
      <div>
        <label htmlFor={`${uid}-message`} className="font-medium">
          {intent === "partnership" ? "Tell us about your project" : "How can we help?"}
        </label>
        <textarea {...field("message")} {...bind("message")} rows={6} required className={input} />
        {errorFor("message")}
      </div>
      <div aria-hidden className="hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div>
        <label className="flex items-start gap-3">
          <input {...field("consent")} type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-5 accent-[var(--tc-blue)]" />
          <span className="text-gray">
            I&apos;ve read the <Link href="/privacy" className="text-blue underline underline-offset-4">privacy policy</Link> and agree that Teracloud can use these details to reply to me.
          </span>
        </label>
        {errorFor("consent")}
      </div>
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-7 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}
