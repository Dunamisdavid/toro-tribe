'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { sfx } from '@/lib/fx';
import { fmt } from '@/lib/utils';
import { Bull, Menu, Plus, Shield, Vol, VolX, WalletIcon } from './icons';
import { Avatar } from './ui';

export const NAV = [
  { href: '/', label: 'Home', long: 'Home' },
  { href: '/bounties', label: 'Bounties', long: 'Explore Bounties' },
  { href: '/opportunities', label: 'Opportunities', long: 'Opportunities' },
  { href: '/ambassadors', label: 'Ambassadors', long: 'Ambassadors' },
  { href: '/integrity', label: 'Integrity', long: 'Integrity Board' },
  { href: '/news', label: "What's New", long: "What's New" },
  { href: '/guide', label: 'Guide', long: 'How it Works & FAQ' },
];

export function Logo({ sub = 'TOROTEAMS · BY TORONET' }: { sub?: string }) {
  return (
    <Link className="logo" href="/" aria-label="Toro Tribe home">
      <span className="lmark"><svg width="21" height="21" viewBox="0 0 24 24" fill="#1A1109"><path d="M2 4q3 7 7 8l3 9 3-9q4-1 7-8-4 4-8 4h-4Q6 8 2 4z" /></svg></span>
      <span><span className="lword">TORO&nbsp;TRIBE</span><div className="lsub">{sub}</div></span>
    </Link>
  );
}

export function Header() {
  const { S, update, openDrawer, connectModal } = useStore();
  const path = usePathname();
  const [menuAt, setMenuAt] = useState<string | null>(null); // path the menu was opened on
  const menu = menuAt === path; // navigating closes it
  const setMenu = (v: boolean | ((m: boolean) => boolean)) => setMenuAt((typeof v === 'function' ? v(menu) : v) ? path : null);
  const isOn = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => { const t = e.target as Element; if (!t.closest('.mmenu') && !t.closest('#menuBtn')) setMenu(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('click', close); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', esc); };
  }, [menu]); // eslint-disable-line react-hooks/exhaustive-deps

  const w = S.wallet;
  const toggleSound = () => { update((s) => { s.muted = !s.muted; }); if (S.muted) setTimeout(() => sfx('tick'), 0); };

  return (
    <>
      <header className="top" id="top">
        <div className="tprog" id="tprog" />
        <Logo />
        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => (
            <Link key={n.href} className={`nlink ${isOn(n.href) ? 'on' : ''}`} href={n.href} aria-current={isOn(n.href) ? 'page' : undefined} title={n.long}>{n.label}</Link>
          ))}
        </nav>
        <div className="tright">
          <Link className="btn btn-gold btn-sm" href="/post" id="postCta"><Plus s={12} /> Post a Bounty</Link>
          <button className="ibtn" id="sndBtn" onClick={toggleSound} aria-pressed={!S.muted} title={S.muted ? 'Sound off — click to unmute' : 'Sound on — click to mute'}>
            {S.muted ? <VolX /> : <Vol />}
          </button>
          <span id="walletSlot">
            {w.connected ? (
              <button className="wchip" onClick={() => openDrawer({ type: 'wallet' })} title="Your ToroNet Wallet">
                <Avatar name={w.name} hue="#C68642" size={26} />
                <span className="bal mono">{fmt(w.balance)} T$</span><span className="isep">·</span>
                <span className="isc"><Shield s={11} /><span className="mono">{w.integrity}</span></span>
              </button>
            ) : (
              <button className="btn btn-net btn-sm" onClick={() => connectModal()} aria-label="Connect Wallet"><WalletIcon s={14} /><span className="wtxt"> Connect Wallet</span></button>
            )}
          </span>
          <button className="ibtn mbtn" id="menuBtn" onClick={() => setMenu((m) => !m)} aria-expanded={menu} title="Menu"><Menu /></button>
        </div>
      </header>
      <div className={`mmenu ${menu ? 'open' : ''}`} id="mmenu">
        {NAV.map((n) => <Link key={n.href} className="nlink" href={n.href}>{n.long}</Link>)}
        <Link className="btn btn-gold" href="/post">Post a Bounty</Link>
      </div>
    </>
  );
}

/** Static header shown for the split second before the app state loads in the browser. */
export function HeaderFallback() {
  return (
    <header className="top" id="top">
      <Logo />
      <nav className="nav" aria-label="Primary">
        {NAV.map((n) => <Link key={n.href} className="nlink" href={n.href}>{n.label}</Link>)}
      </nav>
      <div className="tright"><Link className="btn btn-gold btn-sm" href="/post"><Plus s={12} /> Post a Bounty</Link><span className="ibtn"><Bull s={16} /></span></div>
    </header>
  );
}
