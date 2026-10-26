import Link from "next/link";
import type { Office } from "@/content/types";
import { getOffices } from "@/lib/content";
import { LAND_DOTS, MAP_COLS, MAP_ROWS } from "./world-dots";

// The brand world map (dot-matrix land, leader-line labels with coordinates)
// with arcs from HQ, the first office in site order. Decorative; the list
// beside it is the content.
const U = 8; // SVG units per dot
const W = MAP_COLS * U;
const H = MAP_ROWS * U;
const PAD_TOP = 80; // room for labels above the northernmost hubs
// The brand map is a Mercator projection, not a plain lat/lng grid. These
// constants map degrees to dot columns/rows; they were fitted to coastline
// landmarks on the dot grid (Iberia, North Cape, Florida, Cape York,
// Tasmania, Cape Agulhas, Cape Horn…) and are accurate to about one dot.
const COL_PER_DEG = 0.5401;
const COL_AT_0 = 95.23;
const ROW_PER_MERC_DEG = -0.5268;
const ROW_AT_EQUATOR = 54.62;
const mercator = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
const project = ([lat, lng]: [number, number]) => [
  (COL_PER_DEG * lng + COL_AT_0) * U + U / 2,
  (ROW_PER_MERC_DEG * mercator(lat) + ROW_AT_EQUATOR) * U + U / 2,
];

const CITY = 30; // font sizes and line heights, in SVG units
const COORD = 20;
const LINE = 35;

// Where each label sits relative to its hub, in dots, following the printed
// map. Unknown offices get a label to the right.
const LABEL: Record<string, { dx: number; dy: number; end?: boolean }> = {
  copenhagen: { dx: -2, dy: -10, end: true },
  stuttgart: { dx: -3, dy: 5, end: true },
  athens: { dx: -3, dy: 9, end: true },
  yerevan: { dx: 8, dy: -5 },
  cairo: { dx: 7, dy: 4 },
  boston: { dx: -4, dy: -7, end: true },
  perth: { dx: -6, dy: 5, end: true },
};
const DEFAULT_LABEL = { dx: 6, dy: -4 };

const fmt = ([lat, lng]: [number, number]) =>
  `${Math.abs(lat).toFixed(1)}° ${lat >= 0 ? "N" : "S"} ${Math.abs(lng).toFixed(1)}° ${lng >= 0 ? "E" : "W"}`;

// Hubs closer than this (in dots) share one label, like Copenhagen and Malmö.
const MERGE = 1.5;

function labelGroups(offices: Office[]) {
  const groups: Office[][] = [];
  for (const o of offices) {
    const [x, y] = project(o.coords);
    const near = groups.find((g) => {
      const [gx, gy] = project(g[0].coords);
      return Math.hypot(gx - x, gy - y) < MERGE * U;
    });
    if (near) near.push(o);
    else groups.push([o]);
  }
  return groups;
}

export async function HubsMap() {
  const offices = await getOffices();
  const hq = offices[0];
  const [hx, hy] = project(hq.coords);
  return (
    <div className="grid items-center gap-12 lg:grid-cols-12">
      <div className="relative lg:col-span-8">
        <svg viewBox={`0 ${-PAD_TOP} ${W} ${H + PAD_TOP}`} className="h-auto w-full" aria-hidden>
          <path
            d={LAND_DOTS}
            transform={`translate(${U / 2} ${U / 2}) scale(${U})`}
            fill="none"
            stroke="rgb(255 255 255 / 0.3)"
            strokeWidth="0.4"
            strokeLinecap="round"
            strokeDasharray="0 1"
          />
          <g fill="none" stroke="#8f8ff0" strokeOpacity="0.35" strokeWidth="1.5">
            {offices.slice(1).map((o) => {
              const [x, y] = project(o.coords);
              const mx = (hx + x) / 2;
              const my = Math.min(hy, y) - Math.abs(x - hx) * 0.25 - 10;
              return <path key={o.slug} d={`M ${hx} ${hy} Q ${mx} ${my} ${x} ${y}`} />;
            })}
          </g>
          <circle cx={hx} cy={hy} r="12" fill="none" stroke="#8f8ff0" strokeWidth="1.5">
            <animate attributeName="r" values="9;20;9" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur="3s" repeatCount="indefinite" />
          </circle>
          {offices.map((o) => {
            const [x, y] = project(o.coords);
            const isHq = o === hq;
            return <circle key={o.slug} cx={x} cy={y} r={isHq ? 7 : 5} fill={isHq ? "#ffffff" : "#8f8ff0"} />;
          })}
          {/* Too small to read on phones; the list carries the same content. */}
          <g className="max-sm:hidden">
            {labelGroups(offices).map((g) => {
              const lead = g[0];
              const isHq = g.includes(hq);
              const { dx, dy, end } = LABEL[lead.slug] ?? DEFAULT_LABEL;
              const [x, y] = project(lead.coords);
              const ax = x + dx * U;
              const ay = y + dy * U;
              const lines = g.map((o) => `${o.city}, ${o.country}`);
              const coords = (isHq ? "Headquarters · " : "") + g.map((o) => fmt(o.coords)).join(" · ");
              const height = lines.length * LINE + COORD + 4;
              const top = dy < 0 ? ay - height : ay;
              const anchor = end ? "end" : "start";
              return (
                <g key={lead.slug}>
                  <line x1={x} y1={y} x2={ax} y2={ay} stroke="#8f8ff0" strokeOpacity="0.7" strokeWidth="1.5" />
                  <text textAnchor={anchor} fill="rgb(255 255 255 / 0.9)" fontSize={CITY} fontWeight="600">
                    {lines.map((l, i) => (
                      <tspan key={l} x={ax} y={top + CITY + i * LINE}>{l}</tspan>
                    ))}
                  </text>
                  <text
                    x={ax}
                    y={top + lines.length * LINE + COORD - 2}
                    textAnchor={anchor}
                    fill={isHq ? "#8f8ff0" : "rgb(255 255 255 / 0.55)"}
                    fontSize={COORD}
                    letterSpacing="0.5"
                    className="font-mono"
                  >
                    {coords}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-5 lg:col-span-4 lg:grid-cols-1">
        {offices.map((o) => (
          <li key={o.slug}>
            <Link href={`/locations/${o.slug}`} className="group block">
              <span className="font-semibold text-white group-hover:text-blue-300">{o.city}</span>
              <span className="block text-sm text-white/55">{o.country}{o === hq ? " · HQ" : ""}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
