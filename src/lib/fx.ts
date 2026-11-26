'use client';
/* Sound effects + coin-burst particles, ported from the prototype. */
import { prefersReducedMotion } from './utils';

let AC: AudioContext | null = null;
let muted = false;
export const setMuted = (m: boolean) => { muted = m; };

export type Sfx = 'tick' | 'coin' | 'connect' | 'chord' | 'err';
export function sfx(name: Sfx) {
  if (muted || typeof window === 'undefined') return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    AC = AC || new Ctx();
    if (AC.state === 'suspended') AC.resume();
    const ac = AC, t = ac.currentTime;
    const note = (f0: number, f1: number, st: number, d: number, v: number, type: OscillatorType = 'triangle') => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, t + st);
      o.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + st + d);
      g.gain.setValueAtTime(v, t + st);
      g.gain.exponentialRampToValueAtTime(0.0001, t + st + d);
      o.connect(g); g.connect(ac.destination);
      o.start(t + st); o.stop(t + st + d + 0.02);
    };
    if (name === 'tick') note(880, 990, 0, 0.06, 0.045);
    else if (name === 'coin') { note(659, 659, 0, 0.14, 0.06, 'sine'); note(880, 880, 0.07, 0.14, 0.06, 'sine'); note(1109, 1109, 0.14, 0.22, 0.06, 'sine'); note(1319, 1319, 0.21, 0.3, 0.04, 'sine'); }
    else if (name === 'connect') { note(523, 784, 0, 0.22, 0.06); note(784, 1046, 0.12, 0.25, 0.05, 'sine'); }
    else if (name === 'chord') { note(392, 392, 0, 0.4, 0.05, 'sine'); note(494, 494, 0.05, 0.4, 0.05, 'sine'); note(587, 587, 0.1, 0.5, 0.06, 'sine'); }
    else if (name === 'err') note(200, 120, 0, 0.16, 0.05);
  } catch { /* audio not available */ }
}

/* ---------- coin burst ---------- */
type Part = { x: number; y: number; vx: number; vy: number; g: number; life: number; age: number; s: number; c: string; coin: boolean; rot: number; vr: number };
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let parts: Part[] = [];
let running = false;

export function registerFxCanvas(c: HTMLCanvasElement | null) {
  canvas = c;
  ctx = c ? c.getContext('2d') : null;
  if (c) sizeFx();
}
export function sizeFx() {
  if (!canvas || !ctx) return;
  const d = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * d; canvas.height = innerHeight * d;
  canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
  ctx.setTransform(d, 0, 0, d, 0, 0);
}

export function burst(el?: Element | null, n = 30) {
  if (prefersReducedMotion() || !ctx) return;
  let x = innerWidth / 2, y = 120;
  const t = el || document.getElementById('walletSlot');
  if (t) { const r = t.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, sp = 2.5 + Math.random() * 6.5;
    parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4.5, g: 0.17, life: 55 + Math.random() * 30, age: 0, s: 2.5 + Math.random() * 4,
      c: Math.random() < 0.6 ? '#C68642' : Math.random() < 0.5 ? '#DDAA72' : '#B47436', coin: Math.random() < 0.45, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3 });
  }
  if (!running) { running = true; requestAnimationFrame(loop); }
}

function loop() {
  if (!ctx) { running = false; return; }
  const c = ctx;
  c.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.age < p.life);
  for (const p of parts) {
    p.age++; p.vy += p.g; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    c.globalAlpha = 1 - p.age / p.life; c.save(); c.translate(p.x, p.y); c.rotate(p.rot);
    if (p.coin) {
      c.fillStyle = p.c; c.beginPath();
      c.ellipse(0, 0, p.s, Math.max(0.4, p.s * Math.abs(Math.cos(p.age * 0.12))), 0, 0, 7); c.fill();
      c.strokeStyle = '#5D3F1F'; c.lineWidth = 1; c.stroke();
    } else { c.fillStyle = p.c; c.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); }
    c.restore();
  }
  c.globalAlpha = 1;
  if (parts.length) requestAnimationFrame(loop);
  else { running = false; c.clearRect(0, 0, innerWidth, innerHeight); }
}
