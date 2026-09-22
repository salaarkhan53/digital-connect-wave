'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

/**
 * Single registration point. Importing gsap from here guarantees the plugins
 * are registered exactly once, which is the most common cause of silent
 * ScrollTrigger failures.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  // Cheaper scroll bookkeeping; we never need callbacks on every pixel.
  ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
