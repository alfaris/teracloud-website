// Generative brand artwork per case study (until real project imagery exists):
// nested brace forms and a dot field in the brand palette, seeded per project.
function rand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function CaseArt({ seed, className }: { seed: number; className?: string }) {
  const r = rand(seed);
  const dots = Array.from({ length: 70 }, () => ({ x: r() * 400, y: r() * 260, o: 0.15 + r() * 0.6, s: 1 + r() * 2.2 }));
  const rings = 3 + Math.floor(r() * 3);
  const cx = 120 + r() * 160;
  const cy = 90 + r() * 80;
  const tilt = (r() - 0.5) * 30;
  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`g${seed}`} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#2a2add" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0e0e12" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#g${seed})`} />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.s} fill="#8f8ff0" opacity={d.o} />
      ))}
      <g transform={`translate(${cx} ${cy}) rotate(${tilt})`} fill="none" stroke="#ffffff" strokeLinecap="round">
        {Array.from({ length: rings }, (_, i) => {
          const w = 40 + i * 26;
          const h = 30 + i * 20;
          return (
            <g key={i} opacity={0.85 - i * 0.15} strokeWidth={2.5 - i * 0.3}>
              <path d={`M ${-w / 3} ${-h} Q ${-w} ${-h} ${-w} ${-h / 3} M ${w / 3} ${-h} Q ${w} ${-h} ${w} ${-h / 3}`} />
              <path d={`M ${-w / 3} ${h} Q ${-w} ${h} ${-w} ${h / 3} M ${w / 3} ${h} Q ${w} ${h} ${w} ${h / 3}`} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
