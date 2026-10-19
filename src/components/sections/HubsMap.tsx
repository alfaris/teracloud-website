import Link from "next/link";
import { offices } from "@/content/offices";

// Equirectangular projection cropped to the longitudes/latitudes our hubs span,
// with arcs from Copenhagen HQ. Decorative; the list beside it is the content.
const W = 1000;
const H = 500;
const LNG_MIN = -85;
const LNG_MAX = 125;
const LAT_TOP = 64;
const LAT_BOTTOM = -40;
const project = ([lat, lng]: [number, number]) => [
  ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W,
  ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * H,
];

// Hand-placed labels so the dense European cluster stays legible.
const LABEL: Record<string, { dx: number; dy: number; end?: boolean }> = {
  copenhagen: { dx: -14, dy: -8, end: true },
  malmo: { dx: 14, dy: -8 },
  stuttgart: { dx: -14, dy: 8, end: true },
  athens: { dx: 10, dy: 20 },
  yerevan: { dx: 14, dy: 5 },
  cairo: { dx: 14, dy: 10 },
  boston: { dx: 14, dy: 5 },
  perth: { dx: -14, dy: 5, end: true },
};

export function HubsMap() {
  const hq = project(offices[0].coords);
  return (
    <div className="grid items-center gap-12 lg:grid-cols-12">
      <div className="relative lg:col-span-8">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
          <defs>
            <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="rgb(255 255 255 / 0.12)" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#dots)" />
          <g stroke="rgb(255 255 255 / 0.07)" strokeWidth="1">
            {[-60, -30, 0, 30, 60, 90, 120].map((lng) => {
              const [x] = project([0, lng]);
              return <line key={lng} x1={x} x2={x} y1={0} y2={H} />;
            })}
            {[60, 30, 0, -30].map((lat) => {
              const [, y] = project([lat, 0]);
              return <line key={lat} x1={0} x2={W} y1={y} y2={y} />;
            })}
          </g>
          {offices.slice(1).map((o) => {
            const [x, y] = project(o.coords);
            const mx = (hq[0] + x) / 2;
            const my = Math.min(hq[1], y) - Math.abs(x - hq[0]) * 0.3 + (y > hq[1] ? 40 : -20);
            return (
              <path key={o.slug} d={`M ${hq[0]} ${hq[1]} Q ${mx} ${my} ${x} ${y}`} fill="none" stroke="#8f8ff0" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="3 5" />
            );
          })}
          {offices.map((o, i) => {
            const [x, y] = project(o.coords);
            return (
              <g key={o.slug}>
                <circle cx={x} cy={y} r={i === 0 ? 16 : 11} fill="#2a2add" opacity="0.35">
                  <animate attributeName="r" values={i === 0 ? "12;22;12" : "8;15;8"} dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.45;0;0.45" dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                </circle>
                <circle cx={x} cy={y} r={i === 0 ? 7 : 5} fill={i === 0 ? "#ffffff" : "#8f8ff0"} />
                <text
                  x={x + (LABEL[o.slug]?.dx ?? 12)}
                  y={y + (LABEL[o.slug]?.dy ?? 4)}
                  textAnchor={LABEL[o.slug]?.end ? "end" : "start"}
                  fill="rgb(255 255 255 / 0.8)"
                  fontSize="17"
                  fontWeight="600"
                >
                  {o.city}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-5 lg:col-span-4 lg:grid-cols-1">
        {offices.map((o) => (
          <li key={o.slug}>
            <Link href={`/locations/${o.slug}`} className="group block">
              <span className="font-semibold text-white group-hover:text-blue-300">{o.city}</span>
              <span className="block text-sm text-white/55">{o.country}{o.slug === "copenhagen" ? " · HQ" : ""}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
