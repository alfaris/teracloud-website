import clsx from "clsx";

// Section eyebrow framed by the { } motif from the logomark.
export function BraceLabel({ children, className, dark }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <p className={clsx("t-label inline-flex items-center gap-2", dark ? "text-blue-300" : "text-blue", className)}>
      <span aria-hidden className="font-mono text-base font-normal">{"{"}</span>
      <span>{children}</span>
      <span aria-hidden className="font-mono text-base font-normal">{"}"}</span>
    </p>
  );
}
