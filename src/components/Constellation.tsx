'use client';
/* Animated node network behind the home hero; nodes drift away from the pointer. */
import { useEffect, useRef } from 'react';
import { mulberry32, prefersReducedMotion } from '@/lib/utils';

type Node = { x: number; y: number; vx: number; vy: number; s: number; c: string };

export function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext('2d')!, hero = c.parentElement!;
    let w = 0, h = 0, raf = 0, px = -999, py = -999;
    const r = mulberry32(11), hues = ['#C68642', '#C78A48', '#D4A573', '#CC955A', '#BB7C39'];
    const nodes: Node[] = Array.from({ length: 64 }, () => ({ x: r() * 1400, y: r() * 700, vx: (r() - 0.5) * 0.35, vy: (r() - 0.5) * 0.35, s: 1 + r() * 1.6, c: hues[Math.floor(r() * hues.length)] }));
    const size = () => { const b = hero.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 1.75); w = b.width; h = b.height; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size();
    nodes.forEach((n) => { n.x %= Math.max(w, 1); n.y %= Math.max(h, 1); });
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0;
        const dx = n.x - px, dy = n.y - py, d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120 && d2 > 1) { const d = Math.sqrt(d2); n.x += (dx / d) * 0.5; n.y += (dy / d) * 0.5; }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 110 * 110) { ctx.strokeStyle = `rgba(200,140,76,${0.16 * (1 - Math.sqrt(d2) / 110)})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      for (const n of nodes) {
        const dx = n.x - px, dy = n.y - py;
        if (dx * dx + dy * dy < 160 * 160) { ctx.strokeStyle = 'rgba(198,134,66,.22)'; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(px, py); ctx.stroke(); }
        ctx.fillStyle = n.c; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(n.x, n.y, n.s, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
      }
    };
    const loop = () => { raf = 0; if (document.hidden) return; draw(); raf = requestAnimationFrame(loop); };
    const move = (e: PointerEvent) => { const b = c.getBoundingClientRect(); px = e.clientX - b.left; py = e.clientY - b.top; };
    const leave = () => { px = -999; py = -999; };
    hero.addEventListener('pointermove', move); hero.addEventListener('pointerleave', leave);
    addEventListener('resize', size);
    let io: IntersectionObserver | null = null;
    if (prefersReducedMotion()) draw();
    else {
      io = new IntersectionObserver((en) => { if (en[0].isIntersecting && !raf) raf = requestAnimationFrame(loop); else if (!en[0].isIntersecting) { cancelAnimationFrame(raf); raf = 0; } });
      io.observe(hero);
    }
    const vis = () => { if (!document.hidden && !raf && !prefersReducedMotion()) raf = requestAnimationFrame(loop); };
    document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); io?.disconnect(); hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave); removeEventListener('resize', size); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return <canvas id="constel" ref={ref} aria-hidden="true" />;
}
