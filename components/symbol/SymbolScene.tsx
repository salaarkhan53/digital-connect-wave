'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { KernelSize, Resolution } from 'postprocessing';
import * as THREE from 'three';
import { LemniscateCurve } from './lemniscate';

/* -------------------------------------------------------------------------- */
/*  Shader: gradient along the tube plus a highlight that travels it           */
/* -------------------------------------------------------------------------- */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uBlue;
  uniform vec3 uSpark;
  varying vec2 vUv;

  void main() {
    // uv.x runs the length of the tube: use it as the gradient axis.
    float t = vUv.x;
    vec3 col = mix(uDeep, uBlue, smoothstep(0.0, 0.55, t));
    col = mix(col, uSpark, smoothstep(0.7, 1.0, t) * 0.45);

    /*
     * Two highlights travel the loop. They are deliberately restrained: an
     * additive flare strong enough to reach white clips the wireframe into a
     * solid blown-out patch, and the crosshatch — the whole point of the mark —
     * disappears inside it. So the flare is wide and soft rather than hot, and
     * it brightens toward cyan instead of toward white.
     */
    float head = fract(t - uTime * 0.11);
    float flare = smoothstep(0.11, 0.0, head) + smoothstep(0.11, 0.0, fract(head + 0.5));
    col += uSpark * flare * 0.42;

    // Dim the far side of the tube so the wireframe reads as volume rather
    // than as a flat tangle of lines.
    float depth = 0.55 + 0.45 * sin(vUv.y * 6.2831853);
    col *= depth;

    // Hard ceiling below pure white, so no part of the mesh can clip out.
    gl_FragColor = vec4(min(col, vec3(0.82)), 1.0);
  }
`;

/* -------------------------------------------------------------------------- */
/*  The mark                                                                   */
/* -------------------------------------------------------------------------- */

function Mark({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // The clock is advanced every frame, so it is held in a ref rather than
  // captured from render — the frame loop owns it, not React.
  const elapsed = useRef(0);
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uDeep: { value: new THREE.Color('#063c82') },
          uBlue: { value: new THREE.Color('#0c7bf0') },
          uSpark: { value: new THREE.Color('#6fe3ff') },
        },
        vertexShader,
        fragmentShader,
        // The crosshatch is the wireframe of a dense tube, not a texture.
        wireframe: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  const geometry = useMemo(() => {
    const curve = new LemniscateCurve(1, 0.2);
    // 300 × 10 is where the crosshatch stops looking like a mesh and starts
    // looking like the logo. Every extra segment is another wireframe line to
    // rasterise, and past this the cost climbs faster than the detail does.
    return new THREE.TubeGeometry(curve, 300, 0.085, 10, true);
  }, []);

  useFrame((state, delta) => {
    if (reduced || !group.current) return;

    // Reach the material through the mesh's own ref. Mutating Three.js objects
    // per frame is exactly how the library is meant to be driven, but it has to
    // happen through a ref rather than through a value captured during render.
    elapsed.current += delta;
    const mat = mesh.current?.material as THREE.ShaderMaterial | undefined;
    if (mat) mat.uniforms.uTime.value = elapsed.current;

    // The mark never spins through a full turn: a figure-eight seen edge-on is
    // just a line, so it rocks within a range that always reads as the logo.
    const t = state.clock.elapsedTime;
    const baseY = Math.sin(t * 0.32) * 0.38;
    const baseX = Math.sin(t * 0.24) * 0.1;

    // Damped pointer parallax — a lean, not a follow.
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.05;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.05;

    group.current.rotation.y = baseY + pointer.current.x * 0.3;
    group.current.rotation.x = baseX + pointer.current.y * 0.18;
    group.current.rotation.z = pointer.current.x * 0.04;
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geometry} material={material} />
      <SignalArcs reduced={reduced} />
    </group>
  );
}

/**
 * The three concentric wave arcs that sit inside the right-hand loop of the
 * logo, pulsing outward on a stagger.
 */
function SignalArcs({ reduced }: { reduced: boolean }) {
  const refs = useRef<THREE.Mesh[]>([]);

  const arcs = useMemo(
    () =>
      [0.13, 0.2, 0.27].map((radius, i) => ({
        key: radius,
        geometry: new THREE.TorusGeometry(radius, 0.012, 8, 64, Math.PI * 0.8),
        material: new THREE.MeshBasicMaterial({
          color: new THREE.Color('#2ea8ff'),
          transparent: true,
          opacity: 0.8 - i * 0.15,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      })),
    [],
  );

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      // Staggered breathing — each arc a beat behind the one inside it.
      const pulse = (Math.sin(t * 1.5 - i * 0.85) + 1) / 2;
      mat.opacity = (0.22 + pulse * 0.6) * (1 - i * 0.14);
    });
  });

  // The right lobe of the curve centres near x = +0.5; the arcs open leftward
  // toward the crossing, as they do in the logo.
  return (
    <group position={[0.52, 0, 0.04]} rotation={[0, 0, Math.PI * 1.1]}>
      {arcs.map((arc, i) => (
        <mesh
          key={arc.key}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          geometry={arc.geometry}
          material={arc.material}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */

export default function SymbolScene({
  reduced = false,
  active = true,
  onReady,
  className = '',
}: {
  reduced?: boolean;
  /** False when the mark is scrolled out of view — stops the render loop. */
  active?: boolean;
  /** Fired once the renderer exists, so the caller can cross-fade it in. */
  onReady?: () => void;
  className?: string;
}) {
  return (
    <Canvas
      className={className}
      /*
       * Capped at 1.25, down from 1.5. This scene is fill-rate bound and the
       * mark is now nearly twice as wide, so backing-store pixels rose by
       * 1.9x; on a high-DPI screen a 1.5 cap would have squared that. A soft
       * glowing wireframe under a bloom pass shows no visible difference
       * between the two.
       */
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      /*
       * Pulled in from 3.6, which was framing the mark at roughly two thirds
       * of the canvas it was given and is most of why it read as small.
       *
       * 2.52 was the arithmetic limit: the mark measures 2.06 by 1.59 world
       * units, the vertical field of view shows 0.768 * z of them, and the
       * mask holds the inner 82% at full opacity, which puts the tips exactly
       * on the boundary. Exactly on the boundary is too close in practice --
       * the extremes sat in the first of the fade and read as clipped corners.
       *
       * 3.6 backs off by 30%, so the mark renders at 0.7 of that size with
       * real margin inside the mask. It is still far larger than it was,
       * because the canvas it sits in is now much bigger.
       */
      camera={{ position: [0, 0, 3.6], fov: 42 }}
      // No render loop at all when motion is off, or when the mark has been
      // scrolled past — there is no reason to burn frames on an offscreen
      // canvas while someone reads the rest of the page.
      frameloop={reduced || !active ? 'demand' : 'always'}
      style={{ background: 'transparent' }}
      onCreated={() => {
        // A frame is on the canvas by the next paint, so signal then rather
        // than immediately — otherwise the fade starts against an empty buffer.
        requestAnimationFrame(() => onReady?.());
      }}
    >
      <Mark reduced={reduced} />
      {/*
        Bloom only. A Vignette here would darken the canvas corners, and since
        the canvas is transparent over the page that reads as a visible grey
        rectangle around the mark rather than as depth.
      */}
      <EffectComposer>
        <Bloom
          intensity={1.1}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
          kernelSize={KernelSize.MEDIUM}
          // The bloom pass is a blur, so running it below full resolution is
          // invisible in the result. 0.4 rather than 0.5 buys back most of
          // what the larger canvas costs: a third fewer pixels through the
          // most expensive pass in the scene.
          resolutionX={Resolution.AUTO_SIZE}
          resolutionY={Resolution.AUTO_SIZE}
          resolutionScale={0.4}
        />
      </EffectComposer>
    </Canvas>
  );
}
