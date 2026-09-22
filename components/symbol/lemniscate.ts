import * as THREE from 'three';

/**
 * The path the logo's mark traces: a lemniscate of Gerono (the classic
 * figure-eight) lifted into z so the two loops pass over and under each other
 * rather than intersecting flat.
 *
 * Sweeping a tube along this and rendering it as a wireframe reproduces the
 * crosshatched mesh of the logo directly, rather than approximating it.
 */
export class LemniscateCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    /** Half-width of the figure-eight. */
    private readonly scale = 1,
    /** How far the loops lift out of plane. Zero reads flat and lifeless. */
    private readonly depth = 0.2,
  ) {
    super();
  }

  getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const a = t * Math.PI * 2;
    const x = Math.cos(a);
    // sin·cos gives the crossing at the centre; ×1.35 opens the loops out.
    const y = Math.sin(a) * Math.cos(a) * 1.35;
    // One z oscillation per lobe, so the loops pass over and under each other
    // at the crossing. Kept shallow — any deeper and the figure-eight stops
    // reading as a figure-eight from the front.
    const z = Math.sin(a * 2) * this.depth;
    return target.set(x * this.scale, y * this.scale, z * this.scale);
  }
}
