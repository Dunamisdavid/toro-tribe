import type { CSSProperties } from 'react';
import { P, TIERS } from '@/lib/data';
import type { ProjectId, TierId } from '@/lib/types';
import { initials } from '@/lib/utils';
import { Shield } from './icons';

type V = CSSProperties & Record<`--${string}`, string | number>;

export function Avatar({ name, hue, size = 34 }: { name: string; hue: string; size?: number }) {
  const style: V = { '--ah': hue, width: size, height: size, fontSize: Math.round(size * 0.34) };
  return <span className="avatar" style={style}>{initials(name)}</span>;
}

export function PTag({ project }: { project: ProjectId }) {
  const p = P[project];
  return <span className="ptag" style={{ '--ph': p.hue } as V}><i />{p.name}</span>;
}

export function IBadge({ n }: { n: number }) {
  return <span className="ib"><Shield s={11} /> {n}</span>;
}

export function TierBadge({ tier }: { tier: TierId | null }) {
  return tier ? <span className={`tier ${TIERS[tier].cls}`}>{TIERS[tier].name}</span> : <span className="tier Aspirer">Aspirer</span>;
}

/** Number that counts up when it scrolls into view (handled by <PageEffects/>). */
export function CountUp({ to }: { to: number }) {
  return <span className="cnt" data-to={to}>0</span>;
}

export const cssVars = (v: Record<string, string | number>) => v as V;
