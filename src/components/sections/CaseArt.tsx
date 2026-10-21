// Brand illustrations for case studies, used until real project imagery
// exists. Each `visual` is its own scene (kernel, mainframe, SCADA, …) drawn
// in the brand palette inside a shared frame: ink ground, faint grid, a blue
// glow and brace corners from the logomark. `seed` adds small variations so
// two case studies sharing a scene still differ.
import type { ReactNode } from "react";
import type { CaseVisual } from "@/content/types";

const W = 400;
const H = 260;
const WHITE = "#ffffff";
const B300 = "#8f8ff0";
const BLUE = "#2a2add";
const INK = "#0e0e12";

// The scenes keep their content within y 45–215 so the 21:9 crop on the case
// study page still shows all of it.

function rand(seed: number) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
type R = () => number;

const fixed = (n: number) => Math.round(n * 10) / 10;
const pts = (xs: [number, number][]) => xs.map(([x, y]) => `${fixed(x)},${fixed(y)}`).join(" ");

function Kernel({ r }: { r: R }) {
  const cx = 200;
  const cy = 130;
  const pins = [-21, -7, 7, 21];
  const traces: ReactNode[] = [];
  // Traces leave the die on all four sides, bend once and end in a via.
  for (const side of [-1, 1]) {
    pins.forEach((p, i) => {
      const x0 = cx + side * 42;
      const bend = cx + side * (70 + r() * 40);
      const y1 = cy + p * (1.6 + r() * 1.2);
      const x1 = cx + side * (150 + r() * 30);
      traces.push(
        <g key={`h${side}${i}`}>
          <polyline points={pts([[x0, cy + p], [bend, cy + p], [bend + side * Math.abs(y1 - cy - p), y1], [x1, y1]])} />
          <circle cx={fixed(x1)} cy={fixed(y1)} r={3} fill={INK} stroke={B300} />
        </g>,
      );
    });
    pins.forEach((p, i) => {
      const y0 = cy + side * 42;
      const y1 = cy + side * (70 + r() * 10);
      traces.push(
        <g key={`v${side}${i}`}>
          <polyline points={pts([[cx + p, y0], [cx + p, y1], [cx + p * 1.8, y1 + side * 6]])} />
          <circle cx={fixed(cx + p * 1.8)} cy={fixed(y1 + side * 6)} r={2.5} fill={INK} stroke={B300} />
        </g>,
      );
    });
  }
  return (
    <g>
      <g fill="none" stroke={B300} strokeWidth={1.5} strokeLinejoin="round" opacity={0.75}>
        {traces}
      </g>
      <rect x={cx - 64} y={cy - 64} width={128} height={128} rx={18} fill="none" stroke={B300} strokeDasharray="2 6" strokeLinecap="round" opacity={0.5} />
      <g stroke={WHITE} strokeWidth={2} strokeLinecap="round">
        {pins.map((p) => (
          <g key={p}>
            <line x1={cx + p} y1={cy - 34} x2={cx + p} y2={cy - 42} />
            <line x1={cx + p} y1={cy + 34} x2={cx + p} y2={cy + 42} />
            <line x1={cx - 34} y1={cy + p} x2={cx - 42} y2={cy + p} />
            <line x1={cx + 34} y1={cy + p} x2={cx + 42} y2={cy + p} />
          </g>
        ))}
      </g>
      <rect x={cx - 34} y={cy - 34} width={68} height={68} rx={10} fill={INK} stroke={WHITE} strokeWidth={2} />
      <rect x={cx - 20} y={cy - 20} width={40} height={40} rx={6} fill={BLUE} />
      <path
        d={`M ${cx - 5} ${cy - 10} q -5 0 -5 5 v 2 q 0 3 -3 3 q 3 0 3 3 v 2 q 0 5 5 5 M ${cx + 5} ${cy - 10} q 5 0 5 5 v 2 q 0 3 3 3 q -3 0 -3 3 v 2 q 0 5 -5 5`}
        fill="none"
        stroke={WHITE}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Mainframe({ r }: { r: R }) {
  const racks = [52, 112, 172];
  const history: [number, number][] = [];
  let y = 170;
  for (let i = 0; i <= 6; i++) {
    history.push([244 + i * 14, y]);
    y -= 2 + r() * 12;
  }
  const [lx, ly] = history[history.length - 1];
  const fx = 362;
  const fy = ly - 34 - r() * 10;
  return (
    <g>
      {racks.map((x, i) => (
        <g key={x}>
          <rect x={x} y={62} width={48} height={150} rx={6} fill={INK} stroke={WHITE} strokeWidth={1.5} />
          {Array.from({ length: 9 }, (_, j) => {
            const sy = 74 + j * 15;
            const on = r() > 0.35;
            return (
              <g key={j}>
                <rect x={x + 7} y={sy} width={34} height={9} rx={2} fill="none" stroke={B300} strokeOpacity={0.45} />
                <circle cx={x + 35} cy={sy + 4.5} r={1.8} fill={on ? (i === 1 && j === 3 ? WHITE : B300) : "none"} stroke={B300} strokeOpacity={0.6} strokeWidth={0.8} />
                <line x1={x + 11} y1={sy + 4.5} x2={fixed(x + 17 + r() * 12)} y2={sy + 4.5} stroke={WHITE} strokeOpacity={0.35} strokeWidth={1.2} strokeLinecap="round" />
              </g>
            );
          })}
        </g>
      ))}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <line x1={240} y1={190} x2={368} y2={190} stroke={WHITE} strokeOpacity={0.25} />
        <line x1={240} y1={70} x2={240} y2={190} stroke={WHITE} strokeOpacity={0.25} />
        {[100, 130, 160].map((gy) => (
          <line key={gy} x1={240} y1={gy} x2={368} y2={gy} stroke={WHITE} strokeOpacity={0.08} />
        ))}
        <polygon points={pts([[lx, ly], [fx, fy - 22], [fx, fy + 22]])} fill={B300} fillOpacity={0.18} stroke="none" />
        <polyline points={pts(history)} stroke={WHITE} strokeWidth={2} />
        <line x1={lx} y1={fixed(ly)} x2={fx} y2={fixed(fy)} stroke={B300} strokeWidth={2} strokeDasharray="4 5" />
        <line x1={lx} y1={64} x2={lx} y2={190} stroke={WHITE} strokeOpacity={0.3} strokeDasharray="2 4" />
      </g>
      <circle cx={lx} cy={fixed(ly)} r={4} fill={WHITE} />
      <circle cx={fx} cy={fixed(fy)} r={4} fill={INK} stroke={B300} strokeWidth={2} />
    </g>
  );
}

function Scada({ r }: { r: R }) {
  const floors = [96, 128, 160, 192];
  const sensors = floors.slice(0, 3).map((fy, i) => [fixed(70 + r() * 80), fy + 16, i] as const);
  const value = 0.45 + r() * 0.35;
  const gx = 296;
  const gy = 150;
  const gr = 58;
  const a0 = Math.PI * 1.15;
  const a1 = -Math.PI * 0.15;
  const polar = (a: number, rad: number) => [fixed(gx + rad * Math.cos(a)), fixed(gy - rad * Math.sin(a))] as const;
  const arc = (from: number, to: number) => {
    const [x0, y0] = polar(from, gr);
    const [x1, y1] = polar(to, gr);
    return `M ${x0} ${y0} A ${gr} ${gr} 0 ${from - to > Math.PI ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const va = a0 - (a0 - a1) * value;
  const [nx, ny] = polar(va, gr - 22);
  return (
    <g>
      <g fill="none" stroke={WHITE} strokeWidth={1.5} strokeLinejoin="round">
        <path d="M 52 208 V 96 L 108 66 L 164 96 V 208" />
        <line x1={40} y1={208} x2={176} y2={208} strokeOpacity={0.5} />
        {floors.slice(1).map((fy) => (
          <line key={fy} x1={52} y1={fy} x2={164} y2={fy} strokeOpacity={0.35} />
        ))}
        {floors.slice(0, 3).map((fy) =>
          [64, 92, 120, 148].map((wx) => <rect key={`${fy}${wx}`} x={wx - 2} y={fy + 9} width={12} height={14} rx={2} strokeOpacity={0.3} strokeWidth={1} />),
        )}
      </g>
      <g fill="none" stroke={B300} strokeWidth={1.2} strokeDasharray="2 4" strokeLinecap="round" opacity={0.8}>
        {sensors.map(([sx, sy, i]) => (
          <path key={i} d={`M ${sx} ${sy} C ${sx + 60} ${sy}, 200 ${120 + i * 14}, ${gx - gr - 12} 150`} />
        ))}
      </g>
      {sensors.map(([sx, sy, i]) => (
        <g key={i}>
          <circle cx={sx} cy={sy} r={7} fill={B300} fillOpacity={0.2} />
          <circle cx={sx} cy={sy} r={3} fill={B300} />
        </g>
      ))}
      <g fill="none" strokeLinecap="round">
        <path d={arc(a0, a1)} stroke={WHITE} strokeOpacity={0.15} strokeWidth={10} />
        <path d={arc(a0, va)} stroke={B300} strokeWidth={10} />
        {Array.from({ length: 11 }, (_, i) => {
          const a = a0 - ((a0 - a1) * i) / 10;
          const [x1, y1] = polar(a, gr - 18);
          const [x2, y2] = polar(a, gr - 13);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={WHITE} strokeOpacity={0.4} />;
        })}
        <line x1={gx} y1={gy} x2={nx} y2={ny} stroke={WHITE} strokeWidth={2.5} />
      </g>
      <circle cx={gx} cy={gy} r={5} fill={WHITE} />
      {Array.from({ length: 8 }, (_, i) => {
        const h = fixed(6 + r() * 18);
        return <rect key={i} x={262 + i * 9} y={fixed(212 - h)} width={5} height={h} rx={1.5} fill={i === 5 ? B300 : WHITE} opacity={i === 5 ? 1 : 0.35} />;
      })}
    </g>
  );
}

type Wire = { d: string; x0: number; y0: number; x1: number; y1: number };

function Streams({ r }: { r: R }) {
  const sources = [72, 130, 188].map((y) => ({ x: 34, y: fixed(y + (r() - 0.5) * 10), w: 58, h: 24 }));
  const ops = [98, 162].map((y) => ({ x: 166, y, w: 66, h: 30 }));
  const sink = { x: 306, y: 130, w: 64, h: 36 };
  const wire = (x0: number, y0: number, x1: number, y1: number): Wire => {
    const mx = (x0 + x1) / 2;
    return { d: `M ${x0} ${y0} C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`, x0, y0, x1, y1 };
  };
  const wires = [
    wire(92, sources[0].y, 166, 98),
    wire(92, sources[1].y, 166, 98),
    wire(92, sources[1].y, 166, 162),
    wire(92, sources[2].y, 166, 162),
    wire(232, 98, 306, 124),
    wire(232, 162, 306, 136),
  ];
  // A packet somewhere along a wire (the cubic bezier at t).
  const packet = (w: Wire, t: number) => {
    const mx = (w.x0 + w.x1) / 2;
    const u = 1 - t;
    const x = u ** 3 * w.x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t ** 3 * w.x1;
    const y = u ** 3 * w.y0 + 3 * u * u * t * w.y0 + 3 * u * t * t * w.y1 + t ** 3 * w.y1;
    return [fixed(x), fixed(y)];
  };
  const box = (b: { x: number; y: number; w: number; h: number }, fill: string, k: string) => (
    <rect key={k} x={b.x} y={b.y - b.h / 2} width={b.w} height={b.h} rx={7} fill={fill} stroke={WHITE} strokeWidth={1.5} />
  );
  return (
    <g>
      <g fill="none" stroke={B300} strokeOpacity={0.12}>
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M 0 ${60 + i * 46} C 100 ${30 + i * 46}, 300 ${100 + i * 46}, 400 ${60 + i * 46}`} />
        ))}
      </g>
      <g fill="none" stroke={B300} strokeWidth={1.5}>
        {wires.map((w, i) => (
          <path key={i} d={w.d} />
        ))}
      </g>
      {wires.map((w, i) => {
        const [x, y] = packet(w, 0.25 + r() * 0.5);
        return <circle key={i} cx={x} cy={y} r={3} fill={WHITE} />;
      })}
      {sources.map((s, i) => box(s, INK, `s${i}`))}
      {sources.map((s, i) => (
        <line key={`sl${i}`} x1={s.x + 10} y1={s.y} x2={fixed(s.x + 30 + r() * 14)} y2={s.y} stroke={WHITE} strokeOpacity={0.5} strokeLinecap="round" />
      ))}
      {ops.map((o, i) => box(o, BLUE, `o${i}`))}
      {ops.map((o, i) => (
        <path key={`ol${i}`} d={`M ${o.x + 14} ${o.y + 3} l 6 -6 6 6 6 -6 6 6 6 -6 6 6`} fill="none" stroke={WHITE} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      ))}
      {box(sink, INK, "sink")}
      <g stroke={B300} strokeWidth={4} strokeLinecap="round">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={sink.x + 14 + i * 9} y1={sink.y + 10} x2={sink.x + 14 + i * 9} y2={fixed(sink.y + 6 - r() * 14)} />
        ))}
      </g>
    </g>
  );
}

function Video({ r }: { r: R }) {
  const ox = 104;
  const oy = 130;
  const edges = [
    [262, 66],
    [318, 98],
    [350, 146],
    [300, 188],
    [236, 206],
    [246, 128],
  ].map(([x, y]) => [fixed(x + (r() - 0.5) * 16), fixed(y + (r() - 0.5) * 12)] as const);
  const ctrl = (x: number, y: number) => [fixed((ox + x) / 2 + 20), fixed((oy + y) / 2 - 30)] as const;
  return (
    <g>
      <g fill="none" stroke={B300} strokeLinecap="round" strokeWidth={2}>
        {[44, 66, 90].map((rad, i) => (
          <path
            key={rad}
            d={`M ${fixed(ox + rad * Math.cos(-0.9))} ${fixed(oy + rad * Math.sin(-0.9))} A ${rad} ${rad} 0 0 1 ${fixed(ox + rad * Math.cos(0.9))} ${fixed(oy + rad * Math.sin(0.9))}`}
            opacity={0.7 - i * 0.2}
          />
        ))}
      </g>
      <g fill="none" stroke={WHITE} strokeWidth={1.2} strokeOpacity={0.45}>
        {edges.map(([x, y], i) => {
          const [cx, cy] = ctrl(x, y);
          return <path key={i} d={`M ${ox} ${oy} Q ${cx} ${cy} ${x} ${y}`} />;
        })}
      </g>
      {edges.map(([x, y], i) => {
        const t = 0.45 + r() * 0.35;
        const [cx, cy] = ctrl(x, y);
        const px = (1 - t) ** 2 * ox + 2 * (1 - t) * t * cx + t * t * x;
        const py = (1 - t) ** 2 * oy + 2 * (1 - t) * t * cy + t * t * y;
        return (
          <g key={i}>
            <circle cx={fixed(px)} cy={fixed(py)} r={2.5} fill={B300} />
            <circle cx={x} cy={y} r={11} fill={B300} fillOpacity={0.15} />
            <circle cx={x} cy={y} r={5} fill={INK} stroke={WHITE} strokeWidth={1.5} />
          </g>
        );
      })}
      <circle cx={ox} cy={oy} r={30} fill={BLUE} stroke={WHITE} strokeWidth={2} />
      <path d={`M ${ox - 8} ${oy - 12} L ${ox + 13} ${oy} L ${ox - 8} ${oy + 12} Z`} fill={WHITE} stroke={WHITE} strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
}

function Simulation({ r }: { r: R }) {
  const px = 0.05 + (r() - 0.5) * 0.4;
  const pv = 0.45 + (r() - 0.5) * 0.2;
  const cols = 15;
  const rows = 11;
  const at = (i: number, j: number): [number, number] => {
    const u = (i / (cols - 1)) * 2 - 1;
    const v = j / (rows - 1);
    const h = Math.exp(-((u - px) ** 2 + (v - pv) ** 2 * 1.6) / 0.09) + 0.08 * Math.sin(u * 7 + v * 5);
    return [200 + u * (175 - v * 85), 208 - v * 118 - h * 58];
  };
  const lines: ReactNode[] = [];
  for (let j = 0; j < rows; j++) {
    lines.push(<polyline key={`r${j}`} points={pts(Array.from({ length: cols }, (_, i) => at(i, j)))} strokeOpacity={fixed(0.9 - j * 0.06)} />);
  }
  for (let i = 0; i < cols; i++) {
    lines.push(<polyline key={`c${i}`} points={pts(Array.from({ length: rows }, (_, j) => at(i, j)))} strokeOpacity={0.5} />);
  }
  const [peakX, peakY] = at(Math.round(((px + 1) / 2) * (cols - 1)), Math.round(pv * (rows - 1))).map(fixed);
  return (
    <g>
      <g fill="none" stroke={B300} strokeLinejoin="round">
        {lines}
      </g>
      <line x1={peakX} y1={peakY - 8} x2={peakX} y2={62} stroke={WHITE} strokeOpacity={0.5} strokeDasharray="2 4" />
      <circle cx={peakX} cy={peakY} r={10} fill={WHITE} fillOpacity={0.15} />
      <circle cx={peakX} cy={peakY} r={4} fill={WHITE} />
      <rect x={peakX - 27} y={44} width={54} height={18} rx={5} fill={BLUE} stroke={WHITE} />
      <line x1={peakX - 18} y1={53} x2={peakX + 18} y2={53} stroke={WHITE} strokeWidth={2} strokeLinecap="round" strokeDasharray="6 4" />
    </g>
  );
}

function Gaming({ r }: { r: R }) {
  const hex = (cx: number, cy: number, s: number) =>
    pts(Array.from({ length: 6 }, (_, i) => [cx + s * Math.cos((Math.PI / 3) * i), cy + s * Math.sin((Math.PI / 3) * i)] as [number, number]));
  const hexes: ReactNode[] = [];
  for (let c = 0; c < 16; c++) {
    for (let row = 0; row < 9; row++) {
      hexes.push(<polygon key={`${c}-${row}`} points={hex(10 + c * 27, 10 + row * 31 + (c % 2 ? 15.5 : 0), 15)} />);
    }
  }
  const bars = Array.from({ length: 14 }, (_, i) => fixed(16 + r() * 56 + (i > 9 ? 20 : 0)));
  const line: [number, number][] = bars.map((b, i) => [76 + i * 21, 150 - b * 0.9 - 10]);
  const [ex, ey] = line[line.length - 1].map(fixed);
  const split = fixed(0.38 + r() * 0.24);
  return (
    <g>
      <g fill="none" stroke={B300} strokeOpacity={0.12}>
        {hexes}
      </g>
      <rect x={70} y={50} width={290} height={8} rx={4} fill={WHITE} fillOpacity={0.2} />
      <rect x={70} y={50} width={fixed(290 * split)} height={8} rx={4} fill={B300} />
      <circle cx={fixed(70 + 290 * split)} cy={54} r={6} fill={WHITE} />
      {bars.map((b, i) => {
        const last = i === bars.length - 1;
        return <rect key={i} x={70 + i * 21} y={fixed(210 - b)} width={12} height={b} rx={3} fill={last ? BLUE : WHITE} fillOpacity={last ? 1 : fixed(0.16 + i * 0.02)} stroke={last ? WHITE : "none"} strokeWidth={1.5} />;
      })}
      <polyline points={pts(line)} fill="none" stroke={WHITE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={ex} cy={ey} r={10} fill={B300} fillOpacity={0.3} />
      <circle cx={ex} cy={ey} r={4.5} fill={WHITE} />
    </g>
  );
}

const SCENES: Record<CaseVisual, { Scene: (p: { r: R }) => ReactNode; glow: [number, number] }> = {
  kernel: { Scene: Kernel, glow: [50, 50] },
  mainframe: { Scene: Mainframe, glow: [30, 60] },
  scada: { Scene: Scada, glow: [74, 58] },
  streams: { Scene: Streams, glow: [80, 50] },
  video: { Scene: Video, glow: [26, 50] },
  simulation: { Scene: Simulation, glow: [50, 72] },
  gaming: { Scene: Gaming, glow: [88, 80] },
};

// A sensible scene for content that has no `visual` set (or an unknown one).
const BY_CAPABILITY: Record<string, CaseVisual> = {
  "operating-systems": "kernel",
  "developer-tools": "kernel",
  "cloud-migration": "kernel",
  mainframe: "mainframe",
  "data-platforms": "streams",
  "industrial-energy": "scada",
};

export function caseVisual(item: { visual?: string; capability: string }): CaseVisual {
  return item.visual && item.visual in SCENES ? (item.visual as CaseVisual) : (BY_CAPABILITY[item.capability] ?? "kernel");
}

function Brace({ x, y, sx, sy }: { x: number; y: number; sx: 1 | -1; sy: 1 | -1 }) {
  return <path d={`M ${x} ${y + sy * 16} V ${y + sy * 5} Q ${x} ${y} ${x + sx * 5} ${y} H ${x + sx * 16}`} />;
}

export function CaseArt({ visual, seed, className }: { visual: CaseVisual; seed: number; className?: string }) {
  const { Scene, glow } = SCENES[visual];
  const id = `case-art-${visual}-${seed}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={id} cx={`${glow[0]}%`} cy={`${glow[1]}%`} r="75%">
          <stop offset="0%" stopColor={BLUE} stopOpacity="0.85" />
          <stop offset="55%" stopColor={BLUE} stopOpacity="0.18" />
          <stop offset="100%" stopColor={INK} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={INK} />
      <rect width={W} height={H} fill={`url(#${id})`} />
      <g stroke={WHITE} strokeOpacity={0.05}>
        {Array.from({ length: 19 }, (_, i) => (
          <line key={`x${i}`} x1={(i + 1) * 20} y1={0} x2={(i + 1) * 20} y2={H} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`y${i}`} x1={0} y1={(i + 1) * 20} x2={W} y2={(i + 1) * 20} />
        ))}
      </g>
      <Scene r={rand(seed)} />
      <g fill="none" stroke={B300} strokeWidth={2} strokeLinecap="round" opacity={0.6}>
        <Brace x={20} y={48} sx={1} sy={1} />
        <Brace x={380} y={48} sx={-1} sy={1} />
        <Brace x={20} y={212} sx={1} sy={-1} />
        <Brace x={380} y={212} sx={-1} sy={-1} />
      </g>
    </svg>
  );
}
