'use client';
/* Scroll-reveal (.rv → .in), count-up numbers (.cnt), scroll progress bar, sticky-header shadow, background parallax and the coin-burst canvas. */
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { registerFxCanvas, sizeFx } from '@/lib/fx';
import { clamp, fmt, prefersReducedMotion } from '@/lib/utils';

function countUp(el: HTMLElement) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const to = +(el.dataset.to || 0);
  if (prefersReducedMotion()) { el.textContent = fmt(to); return; }
  const t0 = performance.now(), dur = 950;
  const step = (t: number) => {
    const k = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(to * e);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function PageEffects() {
  const path = usePathname();
  const fx = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    registerFxCanvas(fx.current);
    addEventListener('resize', sizeFx);
    return () => { removeEventListener('resize', sizeFx); registerFxCanvas(null); };
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [path]);

  // reveal-on-scroll for every .rv element, including ones React adds later
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      el.classList.add('in');
      io.unobserve(el);
      el.querySelectorAll<HTMLElement>('.cnt').forEach(countUp);
      if (el.classList.contains('cnt')) countUp(el);
    }), { threshold: 0.12 });
    const scan = () => document.querySelectorAll<HTMLElement>('.rv:not([data-io])').forEach((el) => { el.dataset.io = '1'; io.observe(el); });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  // scroll progress, header shadow, background parallax
  useEffect(() => {
    let busy = false;
    const reduced = prefersReducedMotion();
    const on = () => {
      if (busy) return; busy = true;
      requestAnimationFrame(() => {
        busy = false;
        const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
        const bar = document.getElementById('tprog'); if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
        document.getElementById('top')?.classList.toggle('scrolled', y > 10);
        const bg = document.querySelector<HTMLElement>('.bg'); if (bg && !reduced) bg.style.transform = `translateY(${y * 0.05}px)`;
      });
    };
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  return <canvas id="fx" ref={fx} aria-hidden="true" />;
}

export function Background() {
  return (
    <>
      <div className="bg" aria-hidden="true"><div className="blob b1" /><div className="blob b2" /><div className="blob b3" /><div className="blob b4" /></div>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
