"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The hero symbol, behind one interface.
 *
 * `webgl` generates the mark live from its own geometry. The other two
 * variants are wired so a supplied frame sequence or video can be dropped in
 * later without touching the hero — pass `source` and the matching props.
 */
export type SymbolSource = "webgl" | "frames" | "video";

// Three.js is ~150 KB gzipped and never needed for first paint.
// The static mark already sits underneath while this loads, so the dynamic
// import needs no loading state of its own.
const SymbolScene = dynamic(() => import("./SymbolScene"), { ssr: false });

const SYMBOL_MASK: React.CSSProperties = {
  WebkitMaskImage: "radial-gradient(closest-side, #000 62%, transparent 96%)",
  maskImage: "radial-gradient(closest-side, #000 62%, transparent 96%)",
};

function StaticMark() {
  return (
    <Image
      src="/brand/mark.webp"
      alt=""
      width={1200}
      height={648}
      priority
      aria-hidden="true"
      className="h-full w-full object-contain drop-shadow-[0_0_80px_rgb(12_123_240/0.45)]"
    />
  );
}

/**
 * Whether this device should run the live scene at all.
 *
 * Three.js is around 150 KB gzipped and costs real main-thread time to parse
 * and initialise. On a cheap phone, or a metered connection, that is a bad
 * trade for a decorative mark — so those visitors get the static brand PNG,
 * which is the same symbol without the motion.
 */
function useWebglSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    type Nav = Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };

    const detect = () => {
      const nav = navigator as Nav;

      if (nav.connection?.saveData) return false;
      if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) {
        return false;
      }
      if (
        typeof nav.hardwareConcurrency === "number" &&
        nav.hardwareConcurrency < 4
      ) {
        return false;
      }

      try {
        const canvas = document.createElement("canvas");
        return Boolean(
          canvas.getContext("webgl2") ??
            canvas.getContext("webgl") ??
            canvas.getContext("experimental-webgl"),
        );
      } catch {
        return false;
      }
    };

    // Creating a throwaway WebGL context is not free, and setting state
    // synchronously inside an effect re-renders before the browser has painted.
    // Neither needs to happen until the static mark is on screen.
    const frame = requestAnimationFrame(() => setSupported(detect()));
    return () => cancelAnimationFrame(frame);
  }, []);

  return supported;
}

/**
 * Holds the WebGL scene back until the main thread is idle.
 *
 * Compiling the shaders and building the bloom passes costs a few hundred
 * milliseconds of blocking time, and doing that during load pushes it straight
 * into Total Blocking Time — the page looks ready but does not respond. The
 * static mark is on screen throughout, so nothing is missing while we wait.
 */
function useIdle(timeout = 1500) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      const id = ric(() => setIdle(true), { timeout });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setIdle(true), 300);
    return () => window.clearTimeout(id);
  }, [timeout]);
  return idle;
}

/** True while the element is anywhere near the viewport. */
function useInView<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // A generous margin means the scene is already running by the time the
      // mark scrolls back into view, rather than starting cold.
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

export function HeroSymbol({
  source = "webgl",
  videoSrc,
  className = "",
}: {
  source?: SymbolSource;
  /** Only used when source is "video". */
  videoSrc?: string;
  className?: string;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const webgl = useWebglSupport();
  const idle = useIdle();
  const inView = useInView(wrapper);
  const [reduced, setReduced] = useState(false);
  // Set once the WebGL context exists and has drawn, so the cross-fade starts
  // against a real frame rather than an empty canvas.
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    // Read on the next frame rather than synchronously, for the same reason.
    const frame = requestAnimationFrame(onChange);
    mq.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(frame);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  if (source === "video" && videoSrc) {
    return (
      <div className={className}>
        <video
          src={videoSrc}
          autoPlay={!reduced}
          loop
          muted
          playsInline
          aria-hidden="true"
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  const showScene = Boolean(webgl) && source === "webgl" && idle;

  return (
    // The outer element keeps exactly the className the caller gave it — adding
    // `relative` here collides with an `absolute` passed in and collapses the
    // box. The inner div provides the positioning context instead.
    <div ref={wrapper} className={className}>
      <div className="relative h-full w-full">
        {/*
        The brand PNG holds the space from first paint, and stays for anyone
        without WebGL or on a device that should not pay for it. It is the same
        mark, so the fallback loses the motion, not the meaning.

        It fades out as the live scene fades in — swapping them instantly reads
        as a glitch, because the two are lit differently.
      */}
        <div
          className="absolute inset-0 transition-opacity duration-[620ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{ opacity: sceneReady ? 0 : 1 }}
        >
          <StaticMark />
        </div>

        {showScene && (
          <div
            className="absolute inset-0 transition-opacity duration-[620ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
            /*
            Bloom blurs across the whole framebuffer, so the canvas carries a
            faint uniform lift that its own bounds cut off — a visible rectangle
            over the page. Fading the canvas out before it reaches its edges
            dissolves that boundary while keeping the glow. The mask belongs to
            the canvas alone; applying it to the PNG only dims the fallback.
          */
            style={{ ...SYMBOL_MASK, opacity: sceneReady ? 1 : 0 }}
          >
            <SymbolScene
              reduced={reduced}
              active={inView}
              onReady={() => setSceneReady(true)}
              className="!h-full !w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
