// Degrees → brand-map dot coordinates, shared by the SVG map and the 3D map.
// The brand map ("The Map") is a Mercator projection. These constants were
// fitted to coastline landmarks on the dot grid (Iberia, North Cape, Florida,
// Cape York, Tasmania, Cape Agulhas, Cape Horn…) and are accurate to about
// one dot.
const COL_PER_DEG = 0.5401;
const COL_AT_0 = 95.23;
const ROW_PER_MERC_DEG = -0.5268;
const ROW_AT_EQUATOR = 54.62;

const mercator = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;

/** Fractional [column, row] on the dot grid for a [lat, lng]. */
export const toDot = ([lat, lng]: [number, number]): [number, number] => [
  COL_PER_DEG * lng + COL_AT_0,
  ROW_PER_MERC_DEG * mercator(lat) + ROW_AT_EQUATOR,
];
