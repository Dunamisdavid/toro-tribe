import Link from 'next/link';
import { Arrow } from './icons';

/** Placeholder for pages still being moved over from the Qwen prototype. */
export function PortingNext({ kicker, title, gold, sub }: { kicker: string; title: string; gold: string; sub: string }) {
  return (
    <div className="wrap">
      <div className="page-head">
        <div className="kicker">{kicker}</div>
        <h1>{title} <span className="grad-gold">{gold}</span></h1>
        <p className="sub">{sub}</p>
      </div>
      <div className="card" style={{ padding: 28, textAlign: 'center' }}>
        <p className="mut">This page is next in the build. Its design and behaviour come straight from the prototype.</p>
        <Link className="btn btn-gold" style={{ marginTop: 16 }} href="/bounties">Explore Bounties <Arrow s={13} /></Link>
      </div>
    </div>
  );
}
