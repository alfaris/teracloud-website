import clsx from "clsx";
import { BraceLabel } from "./BraceLabel";

type Props = {
  id?: string;
  label?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  tone?: "light" | "mist" | "dark";
  className?: string;
  children?: React.ReactNode;
  headingLevel?: "h1" | "h2";
};

export function Section({ id, label, title, intro, tone = "light", className, children, headingLevel = "h2" }: Props) {
  const dark = tone === "dark";
  const H = headingLevel;
  return (
    <section
      id={id}
      className={clsx(
        "py-20 sm:py-28",
        tone === "mist" && "bg-mist",
        dark && "on-dark bg-ink-900 text-white",
        className,
      )}
    >
      <div className="container-tc">
        {(label || title || intro) && (
          <header className="mb-12 max-w-3xl sm:mb-16">
            {label && <BraceLabel dark={dark}>{label}</BraceLabel>}
            {title && <H className={clsx(H === "h1" ? "t-h1" : "t-h2", "mt-4 text-balance")}>{title}</H>}
            {intro && <p className={clsx("t-lead mt-5 text-pretty", dark ? "text-white/70" : "text-gray")}>{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
