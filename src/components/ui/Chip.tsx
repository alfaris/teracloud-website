import clsx from "clsx";

export function Chip({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2.5 py-1 font-mono text-[0.8125rem]",
        dark ? "bg-white/8 text-white/80" : "bg-mist text-ink",
      )}
    >
      {children}
    </span>
  );
}

export function ChipList({ items, dark, label = "Technology" }: { items: readonly string[]; dark?: boolean; label?: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((s) => (
        <li key={s}>
          <Chip dark={dark}>{s}</Chip>
        </li>
      ))}
    </ul>
  );
}
