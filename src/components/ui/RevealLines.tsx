// Headline lines that rise in sequence. Pure CSS so the text is in the
// server-rendered HTML and paints immediately (it is often the LCP element).
export function RevealLines({ lines, className, delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <span className="line-rise block" style={{ animationDelay: `${delay + i * 0.09}s` }}>
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}

// Above-the-fold fade-up, CSS only.
export function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`fade-up ${className ?? ""}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
