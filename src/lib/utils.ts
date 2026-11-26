export const now = () => Date.now();
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
export const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));
export const initials = (n: string) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ago(t: number) {
  const d = now() - t;
  if (d < 60e3) return 'just now';
  if (d < 3600e3) return Math.floor(d / 60e3) + 'm ago';
  if (d < 86400e3) return Math.floor(d / 3600e3) + 'h ago';
  return Math.floor(d / 86400e3) + 'd ago';
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
