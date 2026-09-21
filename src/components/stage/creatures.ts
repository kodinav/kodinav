/**
 * The creatures of the film, as geometry. Each one is a signed-distance field
 * built from a few soft primitives; `sampleStage` scatters points over its
 * surface (position, normal, and which part of the body each point belongs
 * to, so the film can swing a leg or beat a wing).
 *
 * Pure maths, no DOM: it runs in a worker (see `sampler.worker.ts`).
 * All creatures face +x, fit inside a unit-and-a-bit sphere, and are original.
 */

export const STAGE = { cells: 0, fish: 1, tetrapod: 2, firstBird: 3, egg: 4, bird: 5 } as const;

/* Parts. 0 is always "body". */
export const PART = {
  body: 0,
  // tetrapod limbs / bird wings
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  lureStalk: 5,
  eyeHole: 6,
  eyeRing: 7,
  lureBulb: 8,
  head: 9,
} as const;

const hyp = Math.hypot;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function ell(px: number, py: number, pz: number, rx: number, ry: number, rz: number) {
  const k0 = hyp(px / rx, py / ry, pz / rz);
  const k1 = Math.max(hyp(px / (rx * rx), py / (ry * ry), pz / (rz * rz)), 1e-4);
  return (k0 * (k0 - 1)) / k1;
}
function cone(
  px: number, py: number, pz: number,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  r1: number, r2: number,
) {
  const pax = px - ax, pay = py - ay, paz = pz - az;
  const bax = bx - ax, bay = by - ay, baz = bz - az;
  const h = clamp01((pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz));
  return hyp(pax - bax * h, pay - bay * h, paz - baz * h) - (r1 + (r2 - r1) * h);
}
/** Rotate the point (x, y) by angle a. */
const rx = (x: number, y: number, a: number) => Math.cos(a) * x - Math.sin(a) * y;
const ry = (x: number, y: number, a: number) => Math.sin(a) * x + Math.cos(a) * y;

/* A soft union that also remembers which primitive was nearest. */
let acc = 0;
let best = 0;
let part = 0;
function begin() {
  acc = 1e9;
  best = 1e9;
  part = 0;
}
function add(d: number, id: number, k: number) {
  if (d < best) {
    best = d;
    part = id;
  }
  if (k <= 0 || acc > 1e8) acc = Math.min(acc, d);
  else {
    const h = clamp01(0.5 + (0.5 * (d - acc)) / k);
    acc = d + (acc - d) * h - k * h * (1 - h);
  }
}

function fish(x: number, y: number, z: number) {
  begin();
  add(ell(x - 0.1, y, z, 0.82, 0.235, 0.14), PART.body, 0); //        a sleek body…
  add(cone(x, y, z, -0.4, 0, 0, -0.88, 0, 0, 0.095, 0.036), PART.body, 0.12); // …a narrow wrist to the tail
  // a deeply forked tail
  const tx = x + 0.84;
  for (const s of [1, -1]) {
    const ux = rx(tx, y, s * 0.78), uy = ry(tx, y, s * 0.78);
    add(ell(ux + 0.29, uy, z, 0.37, 0.085, 0.02), PART.body, 0.05);
  }
  // dorsal, swept back
  add(ell(x - 0.04 + (y - 0.22) * 1.0, y - 0.22, z, 0.32, 0.23, 0.018), PART.body, 0.04);
  add(ell(x + 0.5 + (y - 0.13) * 0.8, y - 0.13, z, 0.1, 0.06, 0.016), PART.body, 0.03);
  // anal and pelvic fins
  add(ell(x + 0.3 - (y + 0.2) * 0.75, y + 0.2, z, 0.16, 0.11, 0.02), PART.body, 0.035);
  add(ell(x - 0.12 - (y + 0.24) * 0.6, y + 0.24, z + 0.05, 0.11, 0.07, 0.018), PART.body, 0.03);
  // pectoral, held out toward the viewer
  {
    const hx0 = x - 0.36, hy0 = y + 0.08, hz0 = z + 0.13;
    const hx = rx(hx0, hy0, 0.55), hy = ry(hx0, hy0, 0.55);
    const gx = rx(hx, hz0, 0.6), gz = ry(hx, hz0, 0.6);
    add(ell(gx + 0.14, hy, gz, 0.18, 0.08, 0.02), PART.body, 0.03);
  }
  // the lantern it will carry through the deep
  add(cone(x, y, z, 0.56, 0.23, 0, 0.74, 0.55, 0, 0.022, 0.015), PART.lureStalk, 0.02);
  add(cone(x, y, z, 0.74, 0.55, 0, 0.98, 0.5, 0, 0.015, 0.012), PART.lureStalk, 0.01);
  add(hyp(x - 1.02, y - 0.47, z) - 0.06, PART.lureBulb, 0);
  return acc;
}

function limb(x: number, y: number, z: number, xs: number, zs: number, id: number) {
  const sx = xs, sy = -0.05, sz = zs * 0.2;
  const ex = xs + 0.02, ey = -0.13, ez = zs * 0.4;
  const fx = xs + 0.1, fy = -0.3, fz = zs * 0.44;
  add(cone(x, y, z, sx, sy, sz, ex, ey, ez, 0.085, 0.058), id, 0.05);
  add(cone(x, y, z, ex, ey, ez, fx, fy, fz, 0.058, 0.042), id, 0.03);
  add(ell(x - fx - 0.06, y - fy, z - fz, 0.115, 0.032, 0.085), id, 0.03);
}
function tetrapod(x: number, y: number, z: number) {
  begin();
  add(ell(x + 0.04, y - 0.02, z, 0.62, 0.17, 0.25), PART.body, 0);
  add(ell(x - 0.66, y - 0.05, z, 0.3, 0.095, 0.24), PART.head, 0.1); // a wide, flat head
  add(cone(x, y, z, -0.45, 0, 0, -1.12, -0.06, 0, 0.13, 0.02), PART.body, 0.1);
  add(ell(x + 0.76, y - 0.08, z, 0.32, 0.07, 0.02), PART.body, 0.04); // what is left of the fin
  limb(x, y, z, 0.36, -1, PART.a);
  limb(x, y, z, 0.36, 1, PART.b);
  limb(x, y, z, -0.38, -1, PART.c);
  limb(x, y, z, -0.38, 1, PART.d);
  return acc;
}

function firstBird(x: number, y: number, z: number) {
  begin();
  {
    const bx = x + 0.02, by = y + 0.05;
    add(ell(rx(bx, by, -0.42), ry(bx, by, -0.42), z, 0.44, 0.27, 0.22), PART.body, 0);
  }
  add(cone(x, y, z, 0.26, 0.14, 0, 0.5, 0.56, 0, 0.12, 0.085), PART.head, 0.1);
  add(hyp(x - 0.5, y - 0.56, z) - 0.125, PART.head, 0.05);
  add(cone(x, y, z, 0.58, 0.55, 0, 0.86, 0.5, 0, 0.058, 0.012), PART.head, 0.03); // a toothed snout, not yet a beak
  {
    const wx = x + 0.1, wy = y, wz = z + 0.2;
    add(ell(rx(wx, wy, -0.3), ry(wx, wy, -0.3), wz, 0.44, 0.17, 0.05), PART.body, 0.04); // wing, folded
  }
  {
    const tx = x + 0.78, ty = y + 0.32;
    add(ell(rx(tx, ty, -0.42), ry(tx, ty, -0.42), z, 0.5, 0.075, 0.14), PART.body, 0.08); // a long feathered tail
  }
  add(cone(x, y, z, 0.02, -0.24, -0.08, 0.06, -0.6, -0.1, 0.06, 0.026), PART.body, 0.04);
  add(cone(x, y, z, 0.02, -0.24, 0.08, 0.0, -0.6, 0.1, 0.06, 0.026), PART.body, 0.04);
  add(cone(x, y, z, -0.06, -0.62, -0.1, 0.18, -0.62, -0.1, 0.024, 0.018), PART.body, 0);
  add(cone(x, y, z, -0.1, -0.62, 0.1, 0.12, -0.62, 0.1, 0.024, 0.018), PART.body, 0);
  return acc;
}

function egg(x0: number, y0: number, z: number) {
  begin();
  const x = rx(x0, y0, 0.16), y = ry(x0, y0, 0.16) + 0.12;
  const k = 1 + 0.24 * Math.max(-1, Math.min(1, y));
  add((hyp(x * k, y * 0.8, z * k) - 0.5) * 0.8, PART.body, 0);
  return acc;
}

function wing(x: number, y: number, z: number, sgn: number, inner: number, outer: number) {
  // at rest the wings are flat; the film folds them at the shoulder and the wrist
  // shoulder at (0.10, 0.07, ±0.10); wrist 0.52 along the span, swept back 0.12
  const qx0 = x - 0.1, qy = y - 0.07, qz = (z - sgn * 0.1) * sgn;
  const qx = qx0 + 0.23 * qz;
  add(ell(qx + 0.06, qy, qz - 0.27, 0.33, 0.032, 0.31), inner, 0.06); // a broad arm
  const oz = qz - 0.52;
  const ox = qx + 0.1 * oz;
  add(ell(ox + 0.1, qy, oz - 0.26, 0.25, 0.026, 0.36), outer, 0.06); //  tapering to a hand
  add(ell(ox + 0.2 + 0.5 * (oz - 0.4), qy, oz - 0.4, 0.13, 0.02, 0.26), outer, 0.04); // trailing primaries
}
function bird(x: number, y: number, z: number) {
  begin();
  add(ell(x, y, z, 0.46, 0.15, 0.15), PART.body, 0);
  add(hyp(x - 0.5, y - 0.07, z) - 0.105, PART.head, 0.08);
  add(cone(x, y, z, 0.58, 0.06, 0, 0.77, 0.03, 0, 0.045, 0.008), PART.head, 0.025);
  add(ell(x + 0.6, y, z, 0.3, 0.03, 0.2), PART.body, 0.06); // tail fan
  wing(x, y, z, -1, PART.a, PART.b);
  wing(x, y, z, 1, PART.c, PART.d);
  return acc;
}

const FIELDS = [null, fish, tetrapod, firstBird, egg, bird] as const;
const BOXES: [number, number, number][] = [
  [0, 0, 0],
  [1.2, 0.72, 0.4],
  [1.25, 0.5, 0.62],
  [1.3, 0.8, 0.4],
  [0.62, 0.8, 0.6],
  [1.05, 0.4, 1.4],
];
/* Eyes: a hole in the dots with a bright ring round it. */
const EYES: Record<number, [number, number, number][]> = {
  1: [[0.66, 0.075, -0.125]],
  2: [[0.74, 0.135, -0.13]],
  3: [[0.55, 0.6, -0.11]],
  5: [[0.54, 0.105, -0.09]],
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type StageCloud = { stage: number; pos: Float32Array; nrm: Float32Array };

/** n points on the surface of one creature: pos = x, y, z, part · nrm = x, y, z. Sorted nose to tail. */
export function sampleStage(stage: number, n: number): StageCloud {
  const rand = rng(977 + stage * 7919);
  const px = new Float32Array(n), py = new Float32Array(n), pz = new Float32Array(n), pp = new Float32Array(n);
  const nx = new Float32Array(n), ny = new Float32Array(n), nz = new Float32Array(n);

  if (stage === STAGE.cells) {
    // Directions on a sphere; the film places them (and parts them, as the cell divides).
    for (let i = 0; i < n; i++) {
      const u = rand() * 2 - 1, a = rand() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      px[i] = nx[i] = s * Math.cos(a);
      py[i] = ny[i] = u;
      pz[i] = nz[i] = s * Math.sin(a);
      pp[i] = i % 7 === 0 ? 1 : 0; // one in seven belongs to the nucleus
    }
  } else {
    const f = FIELDS[stage]!;
    const [bx, by, bz] = BOXES[stage];
    const eyes = EYES[stage] ?? [];
    const e = 0.0025;
    let i = 0;
    let guard = 0;
    while (i < n && guard++ < n * 40) {
      let x = (rand() * 2 - 1) * bx, y = (rand() * 2 - 1) * by, z = (rand() * 2 - 1) * bz;
      let d = f(x, y, z);
      if (d > 0.5) continue;
      let gx = 0, gy = 0, gz = 0;
      for (let k = 0; k < 7; k++) {
        gx = f(x + e, y, z) - f(x - e, y, z);
        gy = f(x, y + e, z) - f(x, y - e, z);
        gz = f(x, y, z + e) - f(x, y, z - e);
        const gl = hyp(gx, gy, gz) || 1;
        gx /= gl; gy /= gl; gz /= gl;
        x -= gx * d; y -= gy * d; z -= gz * d;
        d = f(x, y, z);
        if (Math.abs(d) < 0.0012) break;
      }
      if (Math.abs(d) > 0.003) continue;
      let id: number = part; // set by the last call to the field
      for (const [ex, ey, ez] of eyes) {
        const r = hyp(x - ex, y - ey, z - ez);
        if (r < 0.042) id = PART.eyeHole;
        else if (r < 0.072) id = PART.eyeRing;
      }
      px[i] = x; py[i] = y; pz[i] = z; pp[i] = id;
      nx[i] = gx; ny[i] = gy; nz[i] = gz;
      i++;
    }
  }

  // Nose to tail, so that in a change of form heads become heads and tails become tails.
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => px[b] - px[a]);
  const pos = new Float32Array(n * 4), nrm = new Float32Array(n * 3);
  order.forEach((j, i) => {
    pos[i * 4] = px[j]; pos[i * 4 + 1] = py[j]; pos[i * 4 + 2] = pz[j]; pos[i * 4 + 3] = pp[j];
    nrm[i * 3] = nx[j]; nrm[i * 3 + 1] = ny[j]; nrm[i * 3 + 2] = nz[j];
  });
  return { stage, pos, nrm };
}
