import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-700",
  secondary: "border border-ink/15 text-ink hover:border-blue hover:text-blue",
  ghost: "text-blue hover:text-blue-700 px-0",
  light: "bg-white text-ink hover:bg-blue-50",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant; external?: boolean };

export function Button({ variant = "primary", external, className, children, ...props }: Props) {
  const cls = clsx(
    "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.9375rem] font-semibold transition-colors duration-200",
    styles[variant],
    className,
  );
  const arrow = (
    <span aria-hidden className="transition-transform duration-300 ease-out-quint group-hover:translate-x-1">
      {external ? "↗" : "→"}
    </span>
  );
  if (external) {
    return (
      <a href={String(props.href)} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
        {arrow}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link className={cls} {...props}>
      {children}
      {arrow}
    </Link>
  );
}
