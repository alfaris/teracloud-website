"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { LAND_DOTS, MAP_COLS, MAP_ROWS } from "./world-dots";

export type Hub3D = { slug: string; label: string; col: number; row: number; hq: boolean };

const DOT = 0.1; // world units per map dot
const PLANE_W = MAP_COLS * DOT;
const TILT = -0.52; // resting tilt of the map, in radians
const BLUE_300 = new THREE.Color("#8f8ff0");
const WHITE = new THREE.Color("#ffffff");

// Dot-grid coordinates → world position on the (untilted) map plane.
const toWorld = (col: number, row: number) => new THREE.Vector3((col - (MAP_COLS - 1) / 2) * DOT, -(row - (MAP_ROWS - 1) / 2) * DOT, 0);

function landPositions() {
  const pts: number[] = [];
  for (const m of LAND_DOTS.matchAll(/M(\d+) (\d+)h(\d+)/g)) {
    const x = +m[1];
    const y = +m[2];
    for (let i = 0; i <= +m[3]; i++) {
      const p = toWorld(x + i, y);
      pts.push(p.x, p.y, 0);
    }
  }
  return new Float32Array(pts);
}

const landVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uHubs[12];
  uniform int uHubCount;
  uniform vec3 uActive;
  varying float vGlow;
  varying float vShimmer;
  void main() {
    vec3 p = position;
    float wave = sin(uTime * 0.7 + p.x * 0.55 + p.y * 0.35);
    p.z += wave * 0.035;
    float glow = 0.0;
    for (int i = 0; i < 12; i++) {
      if (i >= uHubCount) break;
      glow = max(glow, smoothstep(1.1, 0.0, distance(p.xy, uHubs[i].xy)));
    }
    float focus = smoothstep(1.6, 0.0, distance(p.xy, uActive.xy)) * uActive.z;
    vGlow = max(glow * 0.6, focus);
    vShimmer = wave;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + vGlow * 1.4) * uPixelRatio * (16.0 / -mv.z);
  }
`;

const landFragment = /* glsl */ `
  uniform float uIntro;
  varying float vGlow;
  varying float vShimmer;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.2, d);
    vec3 c = mix(vec3(1.0), vec3(0.56, 0.56, 0.94), vGlow);
    float alpha = (0.3 + 0.08 * vShimmer + 0.55 * vGlow) * a * uIntro;
    gl_FragColor = vec4(c, alpha);
  }
`;

type Shared = { pointer: THREE.Vector2; active: string | null; labels: Map<string, HTMLSpanElement> };

// 0 → 1 over the first 1.8 s: the map tilts in and the routes draw.
const introAt = (t: number) => Math.min(1, t / 1.8);

function Land({ hubs, shared }: { hubs: Hub3D[]; shared: React.RefObject<Shared> }) {
  const { gl } = useThree();
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(landPositions(), 3));
    return g;
  }, []);
  const material = useMemo(() => {
    const hubVecs = Array.from({ length: 12 }, (_, i) => (hubs[i] ? toWorld(hubs[i].col, hubs[i].row) : new THREE.Vector3()));
    return new THREE.ShaderMaterial({
      vertexShader: landVertex,
      fragmentShader: landFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
        uHubs: { value: hubVecs },
        uHubCount: { value: Math.min(hubs.length, 12) },
        uActive: { value: new THREE.Vector3(0, 0, 0) },
        uIntro: { value: 0 },
      },
    });
  }, [gl, hubs]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, dt) => {
    const mat = points.current?.material as THREE.ShaderMaterial | undefined;
    const s = shared.current;
    if (!mat || !s) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uIntro.value = Math.min(1, 0.35 + introAt(state.clock.elapsedTime) * 0.65);
    const target = hubs.find((h) => h.slug === s.active);
    const u = mat.uniforms.uActive.value as THREE.Vector3;
    if (target) {
      const w = toWorld(target.col, target.row);
      u.x = w.x;
      u.y = w.y;
    }
    u.z = THREE.MathUtils.damp(u.z, target ? 1 : 0, 6, dt);
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

// An arc from HQ to a hub that rises off the map, with light flowing along it.
function Route({ from, to, index, shared, slug }: { from: THREE.Vector3; to: THREE.Vector3; index: number; shared: React.RefObject<Shared>; slug: string }) {
  const curve = useMemo(() => {
    const mid = from.clone().lerp(to, 0.5);
    mid.z = 0.35 + from.distanceTo(to) * 0.16;
    return new THREE.QuadraticBezierCurve3(from, mid, to);
  }, [from, to]);
  const line = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
    const m = new THREE.LineBasicMaterial({ color: BLUE_300, transparent: true, opacity: 0.3, depthWrite: false });
    return new THREE.Line(g, m);
  }, [curve]);
  const FLOW = 3;
  const flow = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(FLOW * 3), 3));
    const m = new THREE.PointsMaterial({ color: WHITE, size: 0.12, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
    return new THREE.Points(g, m);
  }, []);

  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
      flow.geometry.dispose();
      (flow.material as THREE.Material).dispose();
    },
    [line, flow],
  );

  const p = useMemo(() => new THREE.Vector3(), []);
  const lineRef = useRef<THREE.Line>(null);
  const flowRef = useRef<THREE.Points>(null);
  useFrame((state, dt) => {
    const s = shared.current;
    const ln = lineRef.current;
    const fl = flowRef.current;
    if (!s || !ln || !fl) return;
    const on = s.active === slug;
    // Routes draw in one after another during the intro.
    const drawn = THREE.MathUtils.clamp(introAt(state.clock.elapsedTime) * 1.6 - index * 0.08, 0, 1);
    ln.geometry.setDrawRange(0, Math.floor(drawn * 81));
    const mat = ln.material as THREE.LineBasicMaterial;
    mat.opacity = THREE.MathUtils.damp(mat.opacity, s.active && !on ? 0.12 : on ? 0.95 : 0.5, 6, dt);
    const attr = fl.geometry.getAttribute("position") as THREE.BufferAttribute;
    const speed = on ? 0.45 : 0.18;
    for (let i = 0; i < FLOW; i++) {
      const t = (state.clock.elapsedTime * speed + i / FLOW + index * 0.13) % 1;
      curve.getPoint(t * drawn, p);
      attr.setXYZ(i, p.x, p.y, p.z);
    }
    attr.needsUpdate = true;
    (fl.material as THREE.PointsMaterial).opacity = drawn * (s.active && !on ? 0.25 : 0.9);
  });

  return (
    <>
      <primitive ref={lineRef} object={line} />
      <primitive ref={flowRef} object={flow} />
    </>
  );
}

function Hub({ hub, index, shared, onHover, onSelect }: { hub: Hub3D; index: number; shared: React.RefObject<Shared>; onHover: (slug: string | null) => void; onSelect: (slug: string) => void }) {
  const ring = useRef<THREE.Mesh>(null);
  const dot = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => toWorld(hub.col, hub.row), [hub]);
  const screen = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const s = shared.current;
    if (!s || !ring.current || !dot.current) return;
    const on = s.active === hub.slug;
    const t = (state.clock.elapsedTime * 0.6 + index * 0.17) % 1;
    const base = hub.hq ? 0.22 : 0.16;
    ring.current.scale.setScalar(base + t * (on ? 0.55 : 0.32));
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * (on ? 0.9 : 0.55) * introAt(state.clock.elapsedTime);
    const lift = on ? 0.18 : 0;
    dot.current.position.z = THREE.MathUtils.damp(dot.current.position.z, lift, 8, dt);
    dot.current.scale.setScalar(THREE.MathUtils.damp(dot.current.scale.x, on ? 1.6 : 1, 8, dt));
    // Place this hub's HTML label (rendered outside the canvas) over its marker.
    const el = s.labels.get(hub.slug);
    if (el && dot.current) {
      dot.current.getWorldPosition(screen).project(state.camera);
      el.style.transform = `translate(-50%, -100%) translate(${((screen.x + 1) / 2) * state.size.width}px, ${((1 - screen.y) / 2) * state.size.height - 14}px)`;
      el.style.opacity = String((hub.hq || on ? 1 : 0) * introAt(state.clock.elapsedTime));
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    onHover(hub.slug);
  };
  const out = () => {
    document.body.style.cursor = "";
    onHover(null);
  };

  return (
    <group position={pos}>
      <mesh ref={ring}>
        <ringGeometry args={[0.8, 1, 48]} />
        <meshBasicMaterial color={hub.hq ? WHITE : BLUE_300} transparent depthWrite={false} />
      </mesh>
      <mesh ref={dot}>
        <circleGeometry args={[hub.hq ? 0.09 : 0.07, 24]} />
        <meshBasicMaterial color={hub.hq ? WHITE : BLUE_300} />
      </mesh>
      {/* Generous invisible hit target for hover and click. */}
      <mesh onPointerOver={over} onPointerOut={out} onClick={() => onSelect(hub.slug)}>
        <circleGeometry args={[0.32, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

// Fits the map to the canvas width; starts flat (matching the SVG it replaces),
// then tilts into perspective and follows the pointer slightly.
function Rig({ shared, children }: { shared: React.RefObject<Shared>; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ camera, size, clock }, dt) => {
    const s = shared.current;
    const g = group.current;
    if (!s || !g) return;
    const ease = 1 - Math.pow(1 - introAt(clock.elapsedTime), 3);
    const fov = (camera as THREE.PerspectiveCamera).fov;
    const hfov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(fov / 2)) * (size.width / size.height));
    camera.position.set(0, 0, (PLANE_W * 0.47) / Math.tan(hfov / 2));
    camera.lookAt(0, 0, 0);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, TILT * ease + s.pointer.y * 0.06, 4, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, s.pointer.x * 0.08, 4, dt);
    // The SVG it replaces has label room above the map; start level with it, then
    // lift the tilted map so it fills the frame.
    g.position.y = THREE.MathUtils.damp(g.position.y, -0.5 + ease * 1.15, 4, dt);
  });
  return <group ref={group}>{children}</group>;
}

function Scene({ hubs, shared, onHover, onSelect }: { hubs: Hub3D[]; shared: React.RefObject<Shared>; onHover: (s: string | null) => void; onSelect: (s: string) => void }) {
  const hq = hubs.find((h) => h.hq) ?? hubs[0];
  const from = useMemo(() => toWorld(hq.col, hq.row), [hq]);
  return (
    <Rig shared={shared}>
      <Land hubs={hubs} shared={shared} />
      {hubs
        .filter((h) => h !== hq)
        .map((h, i) => (
          <Route key={h.slug} slug={h.slug} index={i} from={from} to={toWorld(h.col, h.row)} shared={shared} />
        ))}
      {hubs.map((h, i) => (
        <Hub key={h.slug} hub={h} index={i} shared={shared} onHover={onHover} onSelect={onSelect} />
      ))}
    </Rig>
  );
}

export default function HubsMap3D({
  hubs,
  active,
  onHover,
  onSelect,
  onReady,
}: {
  hubs: Hub3D[];
  active: string | null;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
  onReady: () => void;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const shared = useRef<Shared>({ pointer: new THREE.Vector2(), active: null, labels: new Map() });

  useEffect(() => {
    shared.current.active = active;
  }, [active]);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      shared.current.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    const onLeave = () => shared.current.pointer.set(0, 0);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 30, near: 0.1, far: 100, position: [0, 0, 30] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ setFrameloop }) => {
          // Stop rendering while the map is off-screen.
          const io = new IntersectionObserver(([entry]) => setFrameloop(entry.isIntersecting ? "always" : "never"));
          if (wrapper.current) io.observe(wrapper.current);
          requestAnimationFrame(() => onReady());
        }}
        aria-hidden
      >
        <Scene hubs={hubs} shared={shared} onHover={onHover} onSelect={onSelect} />
      </Canvas>
      {/* City labels: plain HTML positioned each frame by the hubs. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {hubs.map((h) => (
          <span
            key={h.slug}
            ref={(el) => {
              if (el) shared.current.labels.set(h.slug, el);
              else shared.current.labels.delete(h.slug);
            }}
            style={{ opacity: 0 }}
            className="absolute left-0 top-0 whitespace-nowrap rounded-full bg-ink-900/85 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/15 transition-opacity duration-200"
          >
            {h.label}
          </span>
        ))}
      </div>
    </div>
  );
}
