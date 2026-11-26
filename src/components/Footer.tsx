'use client';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Globe, SafetyShield } from './icons';
import { Logo } from './Header';

const SOCIAL = [
  { net: 'X', title: 'X / Twitter', d: 'M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L5 21H1.9l7.3-8.3L2.2 3h6.4l4.4 5.9L17.5 3zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3z' },
  { net: 'Telegram', title: 'Telegram', d: 'M21.9 4.6 18.9 19c-.2 1-.8 1.2-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-.9.5l.3-4.6L18.2 6c.4-.3-.1-.5-.6-.2L7.3 12.3l-4.5-1.4c-1-.3-1-1 .2-1.4l17.6-6.8c.8-.3 1.5.2 1.3 1.9z' },
  { net: 'GitHub', title: 'GitHub', d: 'M12 2A10 10 0 0 0 8.8 21.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5A3.9 3.9 0 0 1 6.7 8.7a3.6 3.6 0 0 1 .1-2.7s.9-.3 2.8 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z' },
];

export function Footer() {
  const { toast } = useStore();
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div className="fcol fbrand">
            <Logo sub="THE ASPIRATIONS ECONOMY" />
            <p>Where the versatile ToroNet community comes together. Builders find talent. Fulfillers get work done. Aspirers earn Toro$ to fund their aspirations.</p>
          </div>
          <div className="fcol"><h4>Platform</h4><Link href="/bounties">Explore Bounties</Link><Link href="/opportunities">Opportunities</Link><Link href="/ambassadors">Ambassadors</Link><Link href="/integrity">Integrity Board</Link></div>
          <div className="fcol"><h4>Resources</h4><Link href="/post">Post a Bounty</Link><Link href="/news">What&apos;s New</Link><Link href="/guide">How it Works &amp; FAQ</Link><Link href="/opportunities?tab=academy">ToroTeams Academy</Link></div>
          <div className="fcol"><h4>Ecosystem</h4>
            <Link href="/bounties?project=torobuild">ToroBuild · Layer 1</Link><Link href="/bounties?project=toroforge">ToroForge · Dev tools</Link>
            <Link href="/bounties?project=connectworld">ConnectWorld · Payments</Link><Link href="/bounties?project=agrifi">AgriFi · Agriculture</Link><Link href="/bounties?project=plastoken">Plastoken · Climate</Link>
          </div>
        </div>
        <div className="fsafety">
          <SafetyShield />
          <p><b>Remember —</b> ToroNet doesn&apos;t lend, grant or guarantee. It enables everyone of them to come together around your aspiration. Bounties are work-for-reward agreements with terms locked in escrow (Rule 1: the terms are always clear).</p>
        </div>
        <div className="fbottom">
          <span>© 2026 ToroNet · Toro Tribe</span><span className="dim">Toro$ is a community work token.</span>
          <div className="fsocial">
            {SOCIAL.map((s) => (
              <button key={s.net} className="ibtn" title={s.title}
                onClick={() => toast({ msg: `The tribe's ${s.net} opens inside the ToroNet app — connect your wallet there.`, type: 'info', icon: <Globe s={14} /> })}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d={s.d} /></svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
