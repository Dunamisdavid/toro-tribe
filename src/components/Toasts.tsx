'use client';
import { useEffect, useRef, useState } from 'react';
import { useStore, type Toast } from '@/lib/store';
import { Check, Coin, Spark, Trash, X } from './icons';

function ToastItem({ t }: { t: Toast }) {
  const { dismissToast } = useStore();
  const [out, setOut] = useState(false);
  const [paused, setPaused] = useState(false);
  const rem = useRef(t.dur), start = useRef(0), timer = useRef<ReturnType<typeof setTimeout>>(undefined), used = useRef(false);

  const dismiss = () => { clearTimeout(timer.current); setOut(true); setTimeout(() => dismissToast(t.id), 230); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { start.current = Date.now(); timer.current = setTimeout(dismiss, t.dur); return () => clearTimeout(timer.current); }, []);

  const icon = t.icon || (t.type === 'success' ? <Check s={15} /> : t.type === 'danger' ? <Trash s={15} /> : t.type === 'info' ? <Spark s={14} /> : <Coin s={15} />);
  return (
    <div className={`toast ${t.type} ${out ? 'out' : ''}`}
      onMouseEnter={() => { clearTimeout(timer.current); rem.current -= Date.now() - start.current; setPaused(true); }}
      onMouseLeave={() => { start.current = Date.now(); timer.current = setTimeout(dismiss, Math.max(600, rem.current)); setPaused(false); }}>
      <span className="ti">{icon}</span>
      <span className="tm">{t.msg}</span>
      {t.action && <button className="ta" onClick={() => { if (!used.current) { used.current = true; t.action!.fn(); } dismiss(); }}>{t.action.label}</button>}
      <button className="tx" aria-label="Dismiss" onClick={dismiss}><X s={11} /></button>
      <span className="tb" style={{ animationDuration: `${t.dur}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
    </div>
  );
}

export function Toasts() {
  const { toasts } = useStore();
  return <div id="toasts" role="status" aria-live="polite">{toasts.map((t) => <ToastItem key={t.id} t={t} />)}</div>;
}
