'use client';

import { useEffect, useRef } from 'react';

type Tone = 'light' | 'dark';

/** Per-tone look. Kept here so the two variants cannot drift apart by accident. */
const TONES = {
  /** Blue on the white editorial bands. */
  light: {
    dot: '11, 112, 224',
    alpha: [0.24, 0.52] as const,
    radius: [1.2, 2.9] as const,
    /** Area in px² per particle. Lower is denser. */
    per: 13000,
    link: null as string | null,
  },
  /**
   * Brighter, sparser and joined up, for the footer. The links are what make
   * it read as a different thing from the plain sprinkles on the light bands
   * rather than the same effect twice.
   */
  dark: {
    dot: '110, 227, 255',
    alpha: [0.2, 0.55] as const,
    radius: [0.9, 2] as const,
    per: 19000,
    link: '46, 168, 255' as string | null,
  },
} satisfies Record<Tone, unknown>;

/** Cursor influence, in CSS pixels. */
const PUSH_RADIUS = 130;
const PUSH_STRENGTH = 34;
/** How hard a particle is pulled back to where it belongs. */
const SPRING = 0.014;
const DAMPING = 0.88;
/** Only drawn between particles closer together than this. */
const LINK_DISTANCE = 130;

type Particle = {
  /** Where it rests. */
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  /** Phase offsets, so the idle drift is not in lockstep. */
  px: number;
  py: number;
};

/**
 * A field of drifting dots that scatter away from the cursor and settle back.
 *
 * Decorative and inert: it sits behind its section's content, never takes
 * pointer events, and is invisible to assistive technology.
 *
 * Three things keep it from costing anything meaningful. It only animates
 * while its section is on screen, the particle count is derived from the area
 * rather than fixed so a tall band does not get a dense one, and under
 * `prefers-reduced-motion` it paints one static frame and stops — no loop, no
 * pointer listener.
 */
export function ParticleField({
  tone = 'light',
  className = '',
}: {
  tone?: Tone;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cfg = TONES[tone];
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = true;
    // Parked far enough away that nothing is pushed until the pointer arrives.
    let pointerX = -9999;
    let pointerY = -9999;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const build = () => {
      const rect = host.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      // 2 is plenty for 2px dots and halves the fill cost of a 3x screen.
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Bounded so a very tall band is not overrun and a short one is not bare.
      const count = Math.round(Math.min(110, Math.max(18, (w * h) / cfg.per)));

      particles = Array.from({ length: count }, () => {
        const x = rand(0, w);
        const y = rand(0, h);
        return {
          hx: x,
          hy: y,
          x,
          y,
          vx: 0,
          vy: 0,
          r: rand(cfg.radius[0], cfg.radius[1]),
          a: rand(cfg.alpha[0], cfg.alpha[1]),
          px: Math.random() * Math.PI * 2,
          py: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      if (cfg.link) {
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i += 1) {
          for (let j = i + 1; j < particles.length; j += 1) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = Math.hypot(dx, dy);
            if (d > LINK_DISTANCE) continue;
            ctx.strokeStyle = `rgba(${cfg.link}, ${(1 - d / LINK_DISTANCE) * 0.16})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgba(${cfg.dot}, ${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Unused when the loop is not running; keeps the signature honest.
      void t;
    };

    const step = (now: number) => {
      const t = now / 1000;

      for (const p of particles) {
        // A slow wander, so the field is alive before anyone touches it.
        const driftX = Math.sin(t * 0.22 + p.px) * 6;
        const driftY = Math.cos(t * 0.19 + p.py) * 6;

        let ax = (p.hx + driftX - p.x) * SPRING;
        let ay = (p.hy + driftY - p.y) * SPRING;

        const dx = p.x - pointerX;
        const dy = p.y - pointerY;
        const d = Math.hypot(dx, dy);

        if (d < PUSH_RADIUS && d > 0.01) {
          const force = (1 - d / PUSH_RADIUS) ** 2 * PUSH_STRENGTH;
          ax += (dx / d) * force * 0.06;
          ay += (dy / d) * force * 0.06;
        }

        p.vx = (p.vx + ax) * DAMPING;
        p.vy = (p.vy + ay) * DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      draw(now);
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || motionQuery.matches) return;
      running = true;
      raf = requestAnimationFrame(step);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
    };

    const onPointerLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
    };

    build();
    draw(0);

    if (motionQuery.matches) {
      // One static frame is the whole effect under reduced motion.
      return () => {};
    }

    // On the window rather than the canvas: the canvas takes no pointer
    // events, so it would never hear about the cursor crossing it.
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: '120px' },
    );
    io.observe(host);

    const ro = new ResizeObserver(() => {
      build();
      /*
       * Always, not only when the loop is stopped. Setting `canvas.width` in
       * `build` clears the canvas, and this observer fires on `observe()`: for
       * a section below the fold that landed between the loop starting and the
       * intersection observer stopping it, the pending frame was cancelled
       * before it ever repainted and the field stayed blank.
       */
      draw(0);
    });
    ro.observe(host);

    if (visible) start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [tone]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ${className}`}
    />
  );
}
