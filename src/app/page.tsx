'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BountyCard } from '@/components/BountyCard';
import { Constellation } from '@/components/Constellation';
import { Arrow, Book, Cal, Clock, Coin, Flag, Hammer, Plus, Rocket, Shield, Star, Target, WalletIcon, X } from '@/components/icons';
import { Avatar, CountUp, IBadge, PTag, cssVars } from '@/components/ui';
import { COURSES, NEWS, P } from '@/lib/data';
import { useStore } from '@/lib/store';
import { fmt } from '@/lib/utils';

const LIVE = [
  ['+50 Toro$', 'Kofi onboarded 5 vendors · Lagos'],
  ['+150 Toro$', 'Amara shipped campaign graphics'],
  ['+100 Toro$', 'Musa translated the AgriFi guide'],
  ['Cohort 2', '12 incubator seats · applications open'],
  ['+500 Toro$', 'Plastoken audit bounty is live'],
];

const TICKER: [string, React.ReactNode, string][] = [
  ['#C78A48', <>ConnectWorld needs <b>5 merchant scouts</b> in Lagos</>, ''],
  ['#BB7C39', <>Plastoken launches a <b>recycling bounty</b></>, ''],
  ['#D4A573', <>ToroTeams <b>Incubator Cohort 2</b> applications open</>, ''],
  ['#CA9052', <>ToroNet L1 hits <b>1M gasless transactions</b></>, ''],
  ['#BF7F3B', <>AgriFi Yoruba guide bounty is live</>, '100 Toro$'],
  ['#CC955A', <>“Happiness with Toro” campaign needs designers</>, '150 Toro$'],
  ['#C68642', <>Kofi M. verified 5 vendor onboardings</>, '+50 Toro$'],
];

function Ticker() {
  const row = TICKER.map(([h, t, a], i) => (
    <span key={i} className="tk-item" style={cssVars({ '--th': h })}><i />{t} {a && <span className="amt">{a}</span>}</span>
  ));
  return <div className="ticker" aria-label="Live ecosystem feed"><span className="lbl"><i />LIVE</span><div className="tk-track">{row}{row}</div></div>;
}

function LiveChip() {
  const [i, setI] = useState(0);
  useEffect(() => { const iv = setInterval(() => setI((x) => x + 1), 4200); return () => clearInterval(iv); }, []);
  const ev = LIVE[i % LIVE.length];
  return <span className="livechip" id="livechip" key={i}><span className="dot" /><b>{ev[0]}</b> {ev[1]}</span>;
}

export default function Home() {
  const { S, update, boardRows, myRank } = useStore();
  const open = S.bounties.filter((b) => b.status === 'open');
  const escrow = open.reduce((a, b) => a + b.reward, 0);
  const top = boardRows().slice(0, 5);
  const w = S.wallet;
  const inc = S.apps.incubator.status;

  return (<>
    <section className="hero" id="hero">
      <Constellation />
      <div className="wrap">
        <div>
          <span className="hkick rv in"><span className="dot" />THE ASPIRATIONS ECONOMY · TORONET</span>
          <h1 className="rv in" style={cssVars({ '--d': 1 })}>Earn by doing.<span className="l2">Fulfill your <span className="grad-gold">Aspirations.</span></span></h1>
          <p className="hsub rv in" style={cssVars({ '--d': 2 })}>ToroTeams is where the versatile ToroNet community comes together. Builders find talent. Fulfillers get work done. Aspirers earn Toro$ to fund their aspirations.</p>
          <div className="hctas rv in" style={cssVars({ '--d': 3 })}>
            <Link className="btn btn-gold btn-lg" href="/post"><Plus s={15} /> Post a Bounty</Link>
            <Link className="btn btn-ghost btn-lg" href="/bounties">Start Earning <Arrow s={15} /></Link>
          </div>
          <div className="hstats rv in" style={cssVars({ '--d': 4 })}>
            <div className="hstat"><div className="v"><CountUp to={open.length} /></div><div className="l">Open bounties</div></div>
            <div className="hstat"><div className="v"><CountUp to={escrow} /> <small>T$</small></div><div className="l">Locked in escrow</div></div>
            <div className="hstat"><div className="v"><CountUp to={50} /></div><div className="l">Aspirers ranked</div></div>
            <div className="hstat"><div className="v"><CountUp to={16} /></div><div className="l">Cities active</div></div>
          </div>
          {!S.seenGuide && (
            <div className="gbanner rv in" style={cssVars({ '--d': 5 })}>
              <span>👋</span><span>New to the tribe? See how bounties, escrow and Integrity work in the 2-minute guide. <Link href="/guide">How it Works →</Link></span>
              <button className="ibtn" title="Dismiss" onClick={() => update((s) => { s.seenGuide = true; })}><X s={11} /></button>
            </div>
          )}
        </div>
        <div className="paths">
          <LiveChip />
          <Link className="path rv in" style={cssVars({ '--ph': '#C68642', '--d': 2 })} href="/bounties">
            <span className="go"><Arrow s={15} /></span>
            <div className="role">Aspirers · Talent</div>
            <h3>I want to Earn <Coin s={19} /></h3>
            <p>Claim real bounties across the ecosystem, deliver, and grow the Integrity Score that unlocks bigger work.</p>
          </Link>
          <Link className="path rv in" style={cssVars({ '--ph': '#C78A48', '--d': 3 })} href="/post">
            <span className="go"><Arrow s={15} /></span>
            <div className="role">Builders · Fulfillers</div>
            <h3>I want to Get Work Done <Hammer s={18} /></h3>
            <p>Lock Toro$ in escrow, set a minimum Integrity Score, and mobilize talent that is invested in ToroNet.</p>
          </Link>
        </div>
      </div>
    </section>
    <Ticker />
    <div className="wrap">
      <section className="sect" id="pillars" style={cssVars({ '--acc': 'var(--gold)' })}>
        <div className="sect-head rv"><div><div className="kicker">Three pillars of growth</div><h2>Work. Learn. Lead.</h2></div></div>
        <div className="pillars">
          <Link className="pillar rv" style={cssVars({ '--ph': '#C68642', '--d': 0 })} href="/bounties"><span className="idx">01</span><span className="pic"><Target s={20} /></span><h3>Work</h3><div className="tag">Bounties</div><p>Fulfill your Aspiration. Complete real tasks for ToroNet projects and earn Toro$.</p><span className="go">Explore bounties <Arrow s={13} /></span></Link>
          <Link className="pillar rv" style={cssVars({ '--ph': '#D4A573', '--d': 1 })} href="/opportunities"><span className="idx">02</span><span className="pic"><Book s={20} /></span><h3>Learn</h3><div className="tag">Opportunities</div><p>Close the gap. Find incubators, mentorships, hackathons, and training through ToroTribe.</p><span className="go">Grow yourself <Arrow s={13} /></span></Link>
          <Link className="pillar rv" style={cssVars({ '--ph': '#CC955A', '--d': 2 })} href="/ambassadors"><span className="idx">03</span><span className="pic"><Flag s={20} /></span><h3>Lead</h3><div className="tag">Ambassadors</div><p>Grow the network. Become an Ambassador, guide your community, and earn Toro$ for verified impact.</p><span className="go">Be the local node <Arrow s={13} /></span></Link>
        </div>
      </section>

      <section className="sect" style={cssVars({ '--acc': 'var(--gold)' })}>
        <div className="sect-head rv"><div><div className="kicker">Live feed</div><h2>Latest bounties</h2></div><Link className="more" href="/bounties">View the task board <Arrow s={13} /></Link></div>
        <div className="bgrid">{open.slice(0, 4).map((b, i) => <BountyCard key={b.id} b={b} i={i} />)}</div>
      </section>

      <section className="sect" style={cssVars({ '--acc': 'var(--vio)' })}>
        <div className="sect-head rv"><div><div className="kicker" style={cssVars({ '--acc': 'var(--vio)' })}>Learn · close the gap</div><h2>Latest courses &amp; programs</h2></div><Link className="more" href="/opportunities" style={cssVars({ '--acc': 'var(--vio)' })}>All opportunities <Arrow s={13} /></Link></div>
        <div className="learn-grid">
          <div>
            {COURSES.slice(0, 3).map((c, i) => {
              const st = S.courses[c.id]; const done = !!st && st.done >= c.lessons.length;
              return (
                <div key={c.id} className="card crow rv" style={cssVars({ '--d': i })}>
                  <span className="ic" style={{ color: c.hue, background: `color-mix(in srgb,${c.hue} 12%,transparent)` }}><Book s={18} /></span>
                  <div className="t"><b>{c.title}</b><small>{c.lessons.length} lessons · {c.mins} min · {c.level}{done ? ' · ✓ completed' : ''}</small></div>
                  <span className="tcoin"><Coin s={13} /> +{c.reward}</span>
                  <Link className="btn btn-ghost btn-sm" href="/opportunities?tab=academy">{done ? 'Review' : st ? 'Continue' : 'Enroll'}</Link>
                </div>
              );
            })}
          </div>
          <div className="card spotlight rv" style={cssVars({ '--d': 2 })}>
            <div className="kicker" style={cssVars({ '--acc': 'var(--vio)' })}>Incubator · Cohort 2</div>
            <h3 className="disp" style={{ fontSize: 19, margin: '10px 0 8px' }}>Your Ambition is the Next Big Asset.</h3>
            <p className="mut" style={{ fontSize: 13 }}>Milestone-based grant funding in Toro$ to build your project. Eight weeks, twelve teams, one demo day.</p>
            <div className="alumni"><span className="alum">M1 · 500 T$</span><span className="alum">M2 · 750 T$</span><span className="alum">M3 · 1,250 T$</span></div>
            <p className="dim" style={{ fontSize: 11.5, marginTop: 12 }}><Cal s={11} /> Closes Dec 20, 2026 · Cohort 1 alumni: SusuPay, FarmLedger, RecycleRadar</p>
            <Link className="btn btn-net btn-sm" href="/opportunities?tab=incubator" style={{ marginTop: 14 }}><Rocket s={13} /> {inc === 'accepted' ? 'Open your milestones' : inc === 'pending' ? 'Application in review' : 'Apply to Cohort 2'}</Link>
          </div>
        </div>
      </section>

      <section className="sect" style={cssVars({ '--acc': 'var(--mag)' })}>
        <div className="lead-band card rv">
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="kicker" style={cssVars({ '--acc': 'var(--mag)' })}>Lead · verified impact</div>
            <h2 style={{ marginTop: 10 }}>Be the local node.</h2>
            <p>Ambassadors represent ToroNet in their communities, onboard Fulfillers to ConnectWorld, and recruit Aspirers — earning Toro$ per verified attendee, merchant and recruit.</p>
          </div>
          <Link className="btn btn-lg" style={{ background: 'var(--gMag)', color: '#1E140A' }} href="/ambassadors"><Flag s={15} /> {S.ambassador.status === 'approved' ? 'Open your dashboard' : 'Become an Ambassador'}</Link>
        </div>
      </section>

      <section className="sect" style={cssVars({ '--acc': 'var(--mint)' })}>
        <div className="sect-head rv"><div><div className="kicker" style={cssVars({ '--acc': 'var(--mint)' })}>Integrity is earned</div><h2>Leaderboard preview</h2></div><Link className="more" href="/integrity" style={cssVars({ '--acc': 'var(--mint)' })}>Full Integrity Board <Arrow s={13} /></Link></div>
        <div className="board-grid">
          <div className="card mini-lb rv">
            {top.map((m, i) => (
              <div key={m.id} className="mini-row"><span className="rk">#{i + 1}</span><Avatar name={m.name} hue={P[m.project].hue} size={30} /><span className="nm">{m.name}{m.you && <> <span className="dim">(you)</span></>}</span><PTag project={m.project} /><span className="er">{fmt(m.earned)} T$</span><IBadge n={m.integrity} /></div>
            ))}
          </div>
          <div className="card panel rv" style={{ ...cssVars({ '--d': 1 }), borderColor: 'rgba(187,124,57,.35)' }}>
            <h3 style={{ color: 'var(--mint)' }}><Shield s={16} /> What is the Integrity Score?</h3>
            <p className="mut" style={{ fontSize: 13 }}>Your Integrity Score rises when you complete bounties on time, get positive reviews from Builders, and verify your identity in the ToroNet Wallet. A high Integrity Score unlocks higher-paying bounties and Ambassador status.</p>
            <div className="lb-inputs"><span className="m"><Clock s={11} /> On-time delivery</span><span className="m"><Star s={11} /> Builder reviews</span><span className="m"><WalletIcon s={11} /> Verified identity</span></div>
            {w.connected ? (
              <div className="reqmeter" style={{ marginTop: 14 }}><div className="row"><span>Your score</span><span className="mono" style={{ color: 'var(--mint)' }}>{w.integrity} / 100 · rank #{myRank()}</span></div><div className="prog"><i style={{ width: `${w.integrity}%` }} /></div></div>
            ) : <Link className="btn btn-grow btn-sm" style={{ marginTop: 14 }} href="/bounties">Start building yours <Arrow s={12} /></Link>}
          </div>
        </div>
      </section>

      <section className="sect" style={cssVars({ '--acc': 'var(--blue)' })}>
        <div className="sect-head rv"><div><div className="kicker" style={cssVars({ '--acc': 'var(--blue)' })}>Ecosystem news</div><h2>What&apos;s new in ToroNet</h2></div><Link className="more" href="/news" style={cssVars({ '--acc': 'var(--blue)' })}>All updates <Arrow s={13} /></Link></div>
        {NEWS.slice(0, 3).map((n, i) => (
          <Link key={n.id} className="card nrow rv" style={cssVars({ '--ph': P[n.project].hue, '--d': i })} href={`/news/${n.id}`}>
            <div className="body"><div className="nmeta"><PTag project={n.project} /><span>{n.date}</span><span>{n.mins} min read</span>{!S.newsRead[n.id] && <span className="readdot" title="Unread" />}</div><h4>{n.title}</h4><p>{n.dek}</p></div>
            <span className="arr"><Arrow s={16} /></span>
          </Link>
        ))}
      </section>

      <section className="cta-band">
        <div className="kicker rv" style={{ justifyContent: 'center', ...cssVars({ '--acc': 'var(--gold)' }) }}>Your move</div>
        <h2 className="rv" style={{ ...cssVars({ '--d': 1 }), marginTop: 14 }}>Your aspiration is <span className="grad-gold">waiting.</span></h2>
        <div className="hctas rv" style={cssVars({ '--d': 2 })}><Link className="btn btn-gold btn-lg" href="/bounties">Start Earning <Arrow s={15} /></Link><Link className="btn btn-ghost btn-lg" href="/post"><Plus s={14} /> Post a Bounty</Link></div>
        <p className="fine rv" style={cssVars({ '--d': 3 })}>ToroNet doesn&apos;t lend, grant or guarantee. It enables everyone of them to come together around your aspiration.</p>
      </section>
    </div>
  </>);
}
