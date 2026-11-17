import Link from "next/link";
import type { Office } from "@/content/types";
import { getOffices } from "@/lib/content";
import { LAND_DOTS, MAP_COLS, MAP_ROWS } from "./world-dots";
import { toDot } from "./map-projection";
import { HubsMapStage } from "./HubsMapStage";
import { HubsMapInteractive } from "./HubsMapInteractive";

// The brand world map (dot-matrix land, leader-line labels with coordinates)
// with arcs from HQ, the first office in site order. Pointing at a hub on the
// map or in the list highlights its dot, route and label, and clicking it on
// the map opens its page (HubsMapInteractive). The SVG is aria-hidden; the
// list beside it is the content, and the way in for keyboards and screen readers.
const U = 8; // SVG units per dot
const W = MAP_COLS * U;
const H = MAP_ROWS * U;
const PAD_TOP = 80; // room for labels above the northernmost hubs
const project = (coords: [number, number]) => {
  const [col, row] = toDot(coords);
  return [col * U + U / 2, row * U + U / 2];
};

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

// Highlight transitions for the hub dots, routes and labels.
const FADE = "transition-[opacity,stroke-opacity,stroke-width,scale] duration-300";

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

// `interactive` (the Locations page) upgrades the map to three.js where the
// device can handle it. Every map responds to hover either way.
export async function HubsMap({ interactive = false }: { interactive?: boolean } = {}) {
  const offices = await getOffices();
  const hq = offices[0];
  const [hx, hy] = project(hq.coords);
  const hubs = offices.map((o) => {
    const [col, row] = toDot(o.coords);
    return { slug: o.slug, label: o === hq ? `${o.city} · HQ` : o.city, col, row, hq: o === hq };
  });
  const groups = labelGroups(offices);
  const sharesDot = new Set(groups.flatMap((g) => g.slice(1).map((o) => o.slug)));
  const wrap = (svg: React.ReactNode) => (interactive ? <HubsMapStage hubs={hubs}>{svg}</HubsMapStage> : svg);
  return (
    <HubsMapInteractive className="group/map grid items-center gap-12 lg:grid-cols-12">
      <div className="relative lg:col-span-8">
        {wrap(
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
          <g fill="none" stroke="#8f8ff0" strokeWidth="1.5">
            {offices.slice(1).map((o) => {
              const [x, y] = project(o.coords);
              const mx = (hx + x) / 2;
              const my = Math.min(hy, y) - Math.abs(x - hx) * 0.25 - 10;
              return (
                <path
                  key={o.slug}
                  data-hub={o.slug}
                  d={`M ${hx} ${hy} Q ${mx} ${my} ${x} ${y}`}
                  className={`${FADE} [stroke-opacity:0.35] group-data-[hovering=true]/map:[stroke-opacity:0.15] data-[active=true]:![stroke-opacity:1] data-[active=true]:[stroke-width:2.5]`}
                />
              );
            })}
          </g>
          <circle cx={hx} cy={hy} r="12" fill="none" stroke="#8f8ff0" strokeWidth="1.5">
            <animate attributeName="r" values="9;20;9" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur="3s" repeatCount="indefinite" />
          </circle>
          {offices.map((o) => {
            const [x, y] = project(o.coords);
            const isHq = o === hq;
            // A hub drawn on top of another (Malmö on Copenhagen) would steal
            // its clicks, so only the first of each group takes the pointer.
            // The others are reached through their label line and the list.
            const shadowed = sharesDot.has(o.slug);
            return (
              <g key={o.slug} data-hub={o.slug} className={shadowed ? "group/hub pointer-events-none" : "group/hub cursor-pointer"}>
                {/* Invisible, larger target so the small dot is easy to point at. */}
                {!shadowed && <circle cx={x} cy={y} r={18} fill="transparent" />}
                <circle
                  cx={x}
                  cy={y}
                  r={isHq ? 7 : 5}
                  fill={isHq ? "#ffffff" : "#8f8ff0"}
                  className={`${FADE} origin-center [transform-box:fill-box] group-data-[hovering=true]/map:opacity-50 group-data-[active=true]/hub:!opacity-100 group-data-[active=true]/hub:scale-[1.6]`}
                />
              </g>
            );
          })}
          {/* Too small to read on phones; the list carries the same content. */}
          <g className="max-sm:hidden">
            {groups.map((g) => {
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
                <g
                  key={lead.slug}
                  data-hub={lead.slug}
                  data-hubs={g.map((o) => o.slug).join(" ")}
                  className={`${FADE} cursor-pointer group-data-[hovering=true]/map:opacity-40 data-[active=true]:!opacity-100`}
                >
                  <line x1={x} y1={y} x2={ax} y2={ay} className="pointer-events-none" stroke="#8f8ff0" strokeOpacity="0.7" strokeWidth="1.5" />
                  <text textAnchor={anchor} fill="rgb(255 255 255 / 0.9)" fontSize={CITY} fontWeight="600">
                    {lines.map((l, i) => (
                      <tspan key={l} data-hub={g[i].slug} x={ax} y={top + CITY + i * LINE}>{l}</tspan>
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
        </svg>,
        )}
      </div>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-5 lg:col-span-4 lg:grid-cols-1">
        {offices.map((o) => (
          <li key={o.slug}>
            <Link href={`/locations/${o.slug}`} data-hub={o.slug} className="group block">
              <span className="font-semibold text-white group-hover:text-blue-300 group-data-[active=true]:text-blue-300">{o.city}</span>
              <span className="block text-sm text-white/55">{o.country}{o === hq ? " · HQ" : ""}</span>
            </Link>
          </li>
        ))}
      </ul>
    </HubsMapInteractive>
  );
}
