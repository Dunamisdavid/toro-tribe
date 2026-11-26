'use client';
import type { KeyboardEvent } from 'react';
import { P } from '@/lib/data';
import { useStore } from '@/lib/store';
import type { Bounty } from '@/lib/types';
import { ago, fmt } from '@/lib/utils';
import { Arrow, Check, Coin, Lock, Shield, Star } from './icons';
import { IBadge, PTag, cssVars } from './ui';

interface Props {
  b: Bounty;
  i?: number;
  selMode?: boolean;
  selected?: boolean;
  onToggleSel?: (id: string) => void;
}

export function BountyCard({ b, i = 0, selMode = false, selected = false, onToggleSel }: Props) {
  const { S, update, openDrawer, doClaim } = useStore();
  const p = P[b.project], w = S.wallet;
  const locked = w.connected && b.minInt > w.integrity;
  const watched = S.watch.includes(b.id);

  const open = () => (selMode && onToggleSel ? onToggleSel(b.id) : openDrawer({ type: 'bounty', id: b.id }));
  const onKey = (e: KeyboardEvent) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(); } };
  const toggleWatch = () => update((s) => { const k = s.watch.indexOf(b.id); if (k >= 0) s.watch.splice(k, 1); else s.watch.push(b.id); });

  let btn;
  if (b.status === 'open')
    btn = locked
      ? <span className="lockchip"><Lock s={12} /> {b.minInt}+ needed</span>
      : <button className="btn btn-gold btn-sm" onClick={(e) => { e.stopPropagation(); doClaim(b.id); }}>Claim <Arrow s={12} /></button>;
  else if (b.claimer === 'you' && b.status === 'claimed')
    btn = <button className="btn btn-net btn-sm" onClick={(e) => { e.stopPropagation(); openDrawer({ type: 'bounty', id: b.id }); }}>Deliver →</button>;
  else if (b.claimer === 'you' && b.status === 'review') btn = <span className="status st-review">In review</span>;
  else if (b.status === 'done') btn = <span className="status st-done">Completed</span>;
  else if (b.mine) btn = <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); openDrawer({ type: 'bounty', id: b.id }); }}>Manage</button>;
  else btn = <span className="status st-claimed">Claimed</span>;

  const ribbon = b.status === 'done' && b.claimer === 'you' ? <span className="ribbon rb-done">Earned ✓</span>
    : b.mine ? <span className="ribbon rb-mine">Your post</span>
    : b.claimer === 'you' ? <span className="ribbon rb-you">Yours</span> : null;

  return (
    <article className={`bcard rv ${selected ? 'sel' : ''}`} style={cssVars({ '--ph': p.hue, '--d': Math.min(i, 8) })}
      onClick={open} onKeyDown={onKey} tabIndex={0} role="button" aria-label={`${b.title}, ${b.reward} Toro$`}>
      {ribbon}
      <div className="bc-top">
        <span className={`cbx ${selMode ? 'show' : ''} ${selected ? 'on' : ''}`} role="checkbox" aria-checked={selected} tabIndex={selMode ? 0 : -1}
          onClick={(e) => { e.stopPropagation(); onToggleSel?.(b.id); }}>{selected && <Check s={11} />}</span>
        <PTag project={b.project} />
        <button className={`bc-star ${watched ? 'on' : ''}`} title={watched ? 'Unwatch' : 'Watch'} aria-pressed={watched}
          onClick={(e) => { e.stopPropagation(); toggleWatch(); }}><Star s={15} f={watched} /></button>
      </div>
      <h3>{b.title}</h3>
      <div className="bc-builder">by <b>{b.builder.name}</b> <IBadge n={b.builder.integrity} /></div>
      <div className="bc-meta">
        <span className="m">{b.cat}</span>
        <span className={`m ${locked ? 'lock' : b.minInt === 0 ? 'ok' : ''}`}>{b.minInt === 0 ? 'Open to all' : <><Shield s={10} /> {b.minInt}+</>}</span>
        <span className="m">{ago(b.createdAt)}</span>
      </div>
      <div className="bc-foot"><span className="reward"><Coin s={17} /> {fmt(b.reward)} <small>Toro$</small></span>{btn}</div>
    </article>
  );
}
