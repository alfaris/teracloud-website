"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useId, useState } from "react";
import clsx from "clsx";
import { submitContact, type ContactState } from "./actions";

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

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl bg-blue-50 p-8">
        <p className="t-h3">Thank you — your message is on its way.</p>
        <p className="mt-3 text-gray">We reply to most messages within two working days.</p>
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
    <form action={action} noValidate className="space-y-6">
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
          Looking to apply? See our <Link href="/careers#roles" className="text-blue underline underline-offset-4">open roles</Link> — applications go through our job board.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="font-medium">Name</label>
          <input {...field("name")} type="text" autoComplete="name" required className={input} />
          {errorFor("name")}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="font-medium">Work email</label>
          <input {...field("email")} type="email" autoComplete="email" required className={input} />
          {errorFor("email")}
        </div>
      </div>
      <div>
        <label htmlFor={`${uid}-company`} className="font-medium">
          Company <span className="font-normal text-gray">(optional)</span>
        </label>
        <input {...field("company")} type="text" autoComplete="organization" className={input} />
      </div>
      <div>
        <label htmlFor={`${uid}-message`} className="font-medium">
          {intent === "partnership" ? "Tell us about your project" : "Your message"}
        </label>
        <textarea {...field("message")} rows={6} required className={input} />
        {errorFor("message")}
      </div>
      <div aria-hidden className="hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div>
        <label className="flex items-start gap-3">
          <input {...field("consent")} type="checkbox" required className="mt-1 size-5 accent-[var(--tc-blue)]" />
          <span className="text-gray">
            I have read the <Link href="/privacy" className="text-blue underline underline-offset-4">privacy policy</Link> and agree that Teracloud may use my details to respond.
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
