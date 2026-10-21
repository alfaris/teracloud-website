"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { LOGOMARK_PATHS, LOGOMARK_VIEWBOX, type BraceKey } from "./logomark";

const BLUE = new THREE.Color("#2a2add");

// Deterministic PRNG so the particle layout is pure and identical every render.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const SCALE = 1 / 70; // svg units → world units (mark ≈ 3.7 × 4.2)

// Direction each brace segment travels when the mark "opens" on scroll.
const OPEN_DIR: Record<BraceKey, [number, number]> = {
  topLeft: [-0.35, 1],
  topRight: [0.35, 1],
  bottomLeft: [-0.35, -1],
  bottomRight: [0.35, -1],
};

function useBraceGeometries() {
  return useMemo(() => {
    const loader = new SVGLoader();
    const out = {} as Record<BraceKey, THREE.ExtrudeGeometry>;
    (Object.keys(LOGOMARK_PATHS) as BraceKey[]).forEach((key) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${LOGOMARK_PATHS[key]}"/></svg>`;
      const shapes = loader.parse(svg).paths.flatMap((p) => p.toShapes());
      const geo = new THREE.ExtrudeGeometry(shapes, {
        depth: 34,
        bevelEnabled: true,
        bevelThickness: 6,
        bevelSize: 4,
        bevelSegments: 6,
        curveSegments: 24,
      });
      // Centre on the mark's midpoint and flip Y (SVG y grows downward).
      geo.translate(-LOGOMARK_VIEWBOX.width / 2, -LOGOMARK_VIEWBOX.height / 2, -17);
      geo.scale(SCALE, -SCALE, SCALE);
      geo.computeVertexNormals();
      out[key] = geo;
    });
    return out;
  }, []);
}

type SharedState = { scroll: number; pointer: THREE.Vector2 };

function Braces({ state }: { state: React.RefObject<SharedState> }) {
  const geos = useBraceGeometries();
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<Partial<Record<BraceKey, THREE.Mesh>>>({});
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: BLUE,
        metalness: 0.3,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
        iridescence: 0.35,
        iridescenceIOR: 1.4,
        envMapIntensity: 1.8,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((frame, dt) => {
    const s = state.current;
    const g = group.current;
    if (!s || !g) return;
    const t = frame.clock.elapsedTime;
    // Ease toward pointer + slow idle drift.
    const targetY = s.pointer.x * 0.45 + Math.sin(t * 0.25) * 0.12;
    const targetX = -s.pointer.y * 0.3 + Math.cos(t * 0.2) * 0.06;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, dt);
    g.position.y = Math.sin(t * 0.6) * 0.05;

    const open = 0.18 + s.scroll * 1.4 + (Math.sin(t * 0.8) + 1) * 0.03;
    (Object.keys(OPEN_DIR) as BraceKey[]).forEach((k) => {
      const m = meshes.current[k];
      if (!m) return;
      const [dx, dy] = OPEN_DIR[k];
      m.position.x = THREE.MathUtils.damp(m.position.x, dx * open, 6, dt);
      m.position.y = THREE.MathUtils.damp(m.position.y, dy * open, 6, dt);
    });
  });

  return (
    <group ref={group}>
      {(Object.keys(geos) as BraceKey[]).map((k) => (
        <mesh
          key={k}
          ref={(m) => {
            if (m) meshes.current[k] = m;
          }}
          geometry={geos[k]}
          material={material}
        />
      ))}
    </group>
  );
}

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uScroll;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aSize;
  varying float vAlpha;
  varying float vMix;
  void main() {
    vec3 p = position;
    float t = uTime * 0.35 + aSeed * 6.2831;
    p.x += sin(t + p.y * 1.7) * 0.06;
    p.y += cos(t * 0.9 + p.x * 1.3) * 0.06;
    p.z += sin(t * 1.1 + p.x) * 0.06;
    // Cloud breathes outward as the braces open.
    p *= 1.0 + uScroll * 0.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // Pointer repulsion in view space.
    vec2 d = mv.xy - uPointer * 2.2;
    float f = smoothstep(1.1, 0.0, length(d));
    mv.xy += normalize(d + 1e-4) * f * 0.35;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (8.0 / -mv.z);
    vAlpha = 0.35 + 0.65 * fract(aSeed * 13.7);
    vMix = fract(aSeed * 7.3);
  }
`;

const particleFragment = /* glsl */ `
  varying float vAlpha;
  varying float vMix;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    vec3 c = mix(vec3(0.56, 0.56, 0.94), vec3(1.0), vMix * 0.6);
    gl_FragColor = vec4(c, a * vAlpha);
  }
`;

function Cloud({ state, count }: { state: React.RefObject<SharedState>; count: number }) {
  const { gl } = useThree();
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const random = mulberry32(20151);
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Ellipsoidal "cloud" volume sitting inside the braces, denser at the core.
      const u = random();
      const v = random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = Math.pow(random(), 0.6);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.45;
      pos[i * 3 + 1] = r * Math.cos(phi) * 1.0;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.9;
      seed[i] = random();
      size[i] = 1.2 + random() * 2.6;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2() },
          uScroll: { value: 0 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
        },
      }),
    [gl],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((frame, dt) => {
    const s = state.current;
    const mat = points.current?.material as THREE.ShaderMaterial | undefined;
    if (!s || !mat) return;
    const u = mat.uniforms;
    u.uTime.value = frame.clock.elapsedTime;
    u.uPointer.value.lerp(s.pointer, 1 - Math.exp(-4 * dt));
    u.uScroll.value = s.scroll;
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

function Rig({ state }: { state: React.RefObject<SharedState> }) {
  useFrame(({ camera, size }) => {
    // Keep the mark comfortably framed on narrow screens.
    const aspect = size.width / size.height;
    const z = aspect < 0.8 ? 13 : aspect < 1.2 ? 12 : 11;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z + (state.current?.scroll ?? 0) * 1.5, 0.1);
  });
  return null;
}

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  const state = useRef<SharedState>({ scroll: 0, pointer: new THREE.Vector2() });
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      state.current.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    const onScroll = () => {
      const h = wrapper.current?.offsetHeight || window.innerHeight;
      state.current.scroll = Math.min(Math.max(window.scrollY / h, 0), 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8.5], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop="always"
        onCreated={({ gl, setFrameloop }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          // Stop rendering entirely while the hero is off-screen.
          const io = new IntersectionObserver(([entry]) => {
            setFrameloop(entry.isIntersecting ? "always" : "never");
          });
          if (wrapper.current) io.observe(wrapper.current);
          requestAnimationFrame(() => onReady?.());
        }}
        aria-hidden
      >
        <Rig state={state} />
        <group scale={0.82}>
          <Braces state={state} />
          <Cloud state={state} count={2200} />
        </group>
        {/* Studio lighting built from lightformers — no external HDR download. */}
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={2.4} position={[0, 4, 3]} scale={[10, 2, 1]} color="#ffffff" />
          <Lightformer intensity={1.6} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} color="#8f8ff0" />
          <Lightformer intensity={1.2} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#2a2add" />
          <Lightformer intensity={0.8} position={[0, -4, -2]} scale={[10, 2, 1]} color="#ffffff" />
        </Environment>
        <ambientLight intensity={0.25} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} color="#ffffff" />
      </Canvas>
    </div>
  );
}
