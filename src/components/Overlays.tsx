'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { P, TIERS } from '@/lib/data';
import { sfx } from '@/lib/fx';
import { useStore } from '@/lib/store';
import { ago, clamp, clone, fmt, now } from '@/lib/utils';
import { Arrow, Book, Check, Clock, Coin, Copy, Edit, Flag, Lock, Shield, Target, Trash, WalletIcon, X } from './icons';
import { Avatar, IBadge, PTag, cssVars } from './ui';

/* delivery drafts survive closing and reopening the drawer */
const drafts: Record<string, { note: string; link: string }> = {};

function focusables(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>('button,input,select,textarea,a[href],[tabindex="0"]')].filter((el) => !(el as HTMLButtonElement).disabled && el.offsetParent !== null);
}
function useTrap(open: boolean, ref: React.RefObject<HTMLElement | null>, onEsc: () => void) {
  const esc = useRef(onEsc);
  useEffect(() => { esc.current = onEsc; });
  useEffect(() => {
    if (!open) return;
    const last = document.activeElement as HTMLElement | null;
    const tm = setTimeout(() => { const box = ref.current; if (box) (box.querySelector<HTMLElement>('input,textarea,select') || focusables(box)[0])?.focus(); }, 120);
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { esc.current(); return; }
      if (e.key !== 'Tab' || !ref.current) return;
      const f = focusables(ref.current); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { clearTimeout(tm); document.removeEventListener('keydown', key); last?.focus?.(); };
  }, [open, ref]);
}

export function Overlays() {
  const { drawer, modal, closeDrawer, closeModal } = useStore();
  const anyOpen = !!drawer || !!modal;
  useEffect(() => { document.body.style.overflow = anyOpen ? 'hidden' : ''; }, [anyOpen]);
  return (
    <>
      <div className={`scrim ${anyOpen ? 'open' : ''}`} id="scrim" onClick={() => { if (modal) { modal.onCancel?.(); closeModal(); } else closeDrawer(); }} />
      <DrawerPanel />
      <ModalPanel />
    </>
  );
}

/* ================= DRAWER ================= */
function DrawerPanel() {
  const { drawer, closeDrawer, modal } = useStore();
  const ref = useRef<HTMLElement>(null);
  useTrap(!!drawer && !modal, ref, closeDrawer);
  return (
    <aside className={`drawer ${drawer ? 'open' : ''}`} id="drawer" role="dialog" aria-modal="true" aria-label="Details" ref={ref}>
      {drawer?.type === 'wallet' && <WalletDrawer />}
      {drawer?.type === 'bounty' && <BountyDrawer id={drawer.id} />}
    </aside>
  );
}

function WalletDrawer() {
  const { S, update, closeDrawer, connectModal, toast, myRank, openDrawer } = useStore();
  const w = S.wallet;
  if (!w.connected)
    return (<>
      <div className="dw-head"><div className="band" /><div className="dw-title">ToroNet Wallet</div><button className="ibtn dw-close" onClick={closeDrawer}><X s={15} /></button></div>
      <div className="dw-body"><p className="mut">Connect to carry your Identity, Toro$ and Integrity across the tribe.</p>
        <button className="btn btn-gold" style={{ marginTop: 16, width: '100%' }} onClick={() => connectModal()}><WalletIcon s={14} /> Sign in with ToroNet Wallet</button></div>
    </>);
  const claims = S.bounties.filter((b) => b.claimer === 'you' && b.status !== 'cancelled').slice().reverse();
  const amb = S.ambassador;
  const copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(w.address).then(() => toast({ msg: 'Address copied', type: 'success', dur: 2200 })).catch(() => toast({ msg: w.address, type: 'info' }));
    else toast({ msg: w.address, type: 'info' });
  };
  return (<>
    <div className="dw-head"><div className="band" />
      <div style={{ display: 'flex', gap: 13, alignItems: 'center', paddingRight: 36 }}>
        <Avatar name={w.name} hue="#C68642" size={48} />
        <div><div className="dw-title" style={{ marginTop: 0 }}>{w.name}</div><div className="dim mono" style={{ fontSize: 11.5 }}>{w.handle} · {w.region}</div></div>
      </div>
      <button className="ibtn dw-close" onClick={closeDrawer}><X s={15} /></button>
    </div>
    <div className="dw-body">
      <div className="dw-reward">
        <div><div className="dim" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.14em' }}>BALANCE</div><div className="big">{fmt(w.balance)}<small> Toro$</small></div></div>
        <div style={{ textAlign: 'right' }}><div className="dim" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.14em' }}>LIFETIME EARNED</div><div className="mono" style={{ color: 'var(--grn)', fontSize: 17 }}>{fmt(w.earned)} T$</div></div>
      </div>
      <div className="reqmeter" style={{ marginTop: 0 }}>
        <div className="row"><span><Shield s={12} /> Integrity Score {w.verified && <span className="ib" style={{ marginLeft: 6 }}>✓ verified</span>}</span><span className="mono" style={{ color: 'var(--mint)' }}>{w.integrity}/100 · #{myRank()}</span></div>
        <div className="prog"><i style={{ width: `${w.integrity}%` }} /></div>
        <div className="dim" style={{ fontSize: 11, marginTop: 8 }}>40 → Ambassador · 50 → trusted bounties · 65 → veteran work · 80 → Regional tier</div>
      </div>
      <div className="dw-sec">Wallet address</div>
      <div className="buildercard"><span className="mono" style={{ flex: 1, fontSize: 13 }}>{w.address}</span><button className="ibtn" onClick={copy} title="Copy"><Copy s={14} /></button></div>
      <div className="dw-sec">My claims ({claims.length})</div>
      {claims.length ? claims.map((b) => (
        <div key={b.id} className="act-row" style={{ cursor: 'pointer' }} onClick={() => openDrawer({ type: 'bounty', id: b.id })}>
          <span className="ic" style={{ color: P[b.project].hue }}><Target s={15} /></span>
          <div className="t">{b.title.slice(0, 44)}{b.title.length > 44 ? '…' : ''}<small>{P[b.project].name} · {fmt(b.reward)} T$</small></div>
          <span className={`status st-${b.status}`}>{b.status === 'review' ? 'reviewing' : b.status}</span>
        </div>
      )) : <p className="dim" style={{ fontSize: 12.5 }}>No claims yet — the board is waiting.</p>}
      <div className="dw-sec">Ambassador</div>
      <div className="act-row">
        <span className="ic" style={{ color: 'var(--mag)' }}><Flag s={15} /></span>
        <div className="t">{amb.status === 'approved' && amb.tier ? `${TIERS[amb.tier].name} · ${amb.verified} verified activities` : amb.status === 'pending' ? 'Application in review' : 'Not yet an Ambassador'}
          <small>{amb.status === 'approved' ? `${fmt(amb.earned)} T$ earned · ${amb.onboarded} onboarded` : 'Be the local node'}</small></div>
        <Link className="btn btn-ghost btn-sm" href="/ambassadors" onClick={closeDrawer}>Open</Link>
      </div>
    </div>
    <div className="dw-foot">
      <Link className="btn btn-gold btn-sm" href="/bounties" onClick={closeDrawer}>Earn more <Arrow s={12} /></Link><span className="sp" />
      <button className="btn btn-danger btn-sm" onClick={() => { update((s) => { s.wallet.connected = false; }); closeDrawer(); toast({ msg: 'Wallet disconnected — your history stays safe.', type: 'info', icon: <WalletIcon s={14} /> }); }}>Disconnect</button>
    </div>
  </>);
}

function BountyDrawer({ id }: { id: string }) {
  const { S, update, closeDrawer, doClaim, cancelBounty, toast } = useStore();
  const router = useRouter();
  const b = S.bounties.find((x) => x.id === id);
  const [draft, setDraft] = useState(drafts[id] || { note: '', link: '' });
  const setD = (d: { note: string; link: string }) => { drafts[id] = d; setDraft(d); };

  if (!b) return <div className="dw-body"><p className="mut">This bounty is gone.</p></div>;
  const p = P[b.project], w = S.wallet;
  const locked = w.connected && b.minInt > w.integrity;

  const deliver = (e: FormEvent) => {
    e.preventDefault();
    if (draft.note.trim().length < 10) { sfx('err'); toast({ msg: 'Describe your delivery against the terms (10+ characters).', type: 'info' }); return; }
    if (draft.link && !/^https?:\/\//.test(draft.link)) { sfx('err'); toast({ msg: 'Proof link should start with http(s):// — or leave it empty.', type: 'info' }); return; }
    update((s) => { const x = s.bounties.find((y) => y.id === id)!; x.status = 'review'; x.delivery = { note: draft.note.trim(), link: draft.link, at: now() }; x.dueAt = now() + 6000; });
    delete drafts[id];
    sfx('tick');
    toast({ msg: `Delivery submitted · ${b.builder.name} is reviewing`, type: 'success', icon: <Flag s={15} /> });
  };
  const cancelClaim = () => {
    const snap = clone(b);
    update((s) => { const x = s.bounties.find((y) => y.id === id)!; x.status = 'open'; x.claimer = null; x.delivery = null; });
    toast({ msg: 'Claim released back to the board', type: 'danger', action: { label: 'Undo', fn: () => update((s) => { const i = s.bounties.findIndex((y) => y.id === id); s.bounties[i] = snap; }) } });
  };
  const approve = () => {
    update((s) => { const x = s.bounties.find((y) => y.id === id)!; x.status = 'done'; x.review = 'Paid on approval — terms met in full.'; s.wallet.integrity = clamp(s.wallet.integrity + 2, 0, 100); });
    sfx('chord');
    toast({ msg: <>Paid <b>{fmt(b.reward)} Toro$</b> to {b.claimer} from escrow · Builder Integrity +2</>, type: 'success', icon: <Check s={15} />, dur: 6000 });
  };
  const changes = () => {
    update((s) => { const x = s.bounties.find((y) => y.id === id)!; x.status = 'claimed'; x.simDeliverAt = now() + 7000; x.delivery = null; });
    sfx('tick');
    toast({ msg: `Changes requested — ${b.claimer} is iterating`, type: 'info' });
  };

  const cyanNote = { background: 'rgba(199,138,72,.06)', borderColor: 'rgba(199,138,72,.3)', color: 'var(--cyan)' };
  let action;
  if (b.status === 'open') {
    if (b.mine) action = (<>
      <div className="reviewing" style={cyanNote}><Clock s={15} /> Escrow locked · waiting for a trusted Aspirer to claim…</div>
      <div style={{ display: 'flex', gap: 9, marginTop: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => { closeDrawer(); router.push('/post?edit=' + id); }}><Edit s={13} /> Edit terms</button>
        <button className="btn btn-danger btn-sm" onClick={() => cancelBounty(id)}><Trash s={13} /> Cancel &amp; refund</button>
      </div>
    </>);
    else if (!w.connected) action = (
      <div className="wallet-banner" style={{ margin: 0 }}><div className="t"><b>Sign in with ToroNet Wallet to Claim.</b><p>Your Integrity Score travels with you.</p></div>
        <button className="btn btn-gold" onClick={() => doClaim(id)}><WalletIcon s={14} /> Sign in to claim</button></div>);
    else if (locked) action = (
      <div className="reqmeter" style={{ marginTop: 0 }}>
        <div className="row"><span style={{ color: 'var(--warn)' }}><Lock s={12} /> Requires Integrity {b.minInt}+</span><span className="mono">{w.integrity}/{b.minInt}</span></div>
        <div className="prog gold"><i style={{ width: `${clamp((w.integrity / b.minInt) * 100, 0, 100)}%` }} /></div>
        <p className="dim" style={{ fontSize: 11.5, marginTop: 8 }}>Complete bounties on time and finish Academy courses to raise your score.</p>
        <Link className="btn btn-grow btn-sm" style={{ marginTop: 10 }} href="/opportunities?tab=academy" onClick={closeDrawer}><Book s={13} /> Raise my Integrity</Link>
      </div>);
    else action = <button className="btn btn-gold btn-lg" style={{ width: '100%' }} onClick={() => doClaim(id)}><Check s={14} /> Claim this bounty · earn {fmt(b.reward)} Toro$</button>;
  } else if (b.claimer === 'you' && b.status === 'claimed') {
    action = (<>
      <div className="dw-sec" style={{ marginTop: 0 }}>Submit your delivery</div>
      <form onSubmit={deliver}>
        <div className="field"><label htmlFor="dlNote">Delivery note *</label><textarea className="input" id="dlNote" rows={3} placeholder="What you did, against which terms…" value={draft.note} onChange={(e) => setD({ ...draft, note: e.target.value })} /></div>
        <div className="field"><label htmlFor="dlLink">Proof link</label><input className="input" id="dlLink" type="url" placeholder="https://… (doc, repo, photos)" value={draft.link} onChange={(e) => setD({ ...draft, link: e.target.value })} /></div>
        <button className="btn btn-net" type="submit" style={{ width: '100%' }}><Flag s={13} /> Submit delivery for review</button>
      </form>
      <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={cancelClaim}>Cancel my claim</button>
    </>);
  } else if (b.claimer === 'you' && b.status === 'review') {
    action = (<>
      <div className="reviewing"><Clock s={15} /> {b.builder.name} is reviewing your delivery · <span className="mono" data-due={b.dueAt ?? ''} /><span className="dots"><i /><i /><i /></span></div>
      <p className="dim" style={{ fontSize: 12, marginTop: 10 }}>Payment releases automatically from escrow on approval. You&apos;ll feel it.</p>
    </>);
  } else if (b.status === 'done') {
    action = (<>
      <div className="enote good" style={{ margin: '0 0 10px' }}><Check s={13} /> {b.claimer === 'you' ? <>Verified &amp; paid — <b>+{fmt(b.reward)} Toro$</b> landed in your wallet.</> : <>Paid {fmt(b.reward)} Toro$ to {b.claimer}.</>}</div>
      {b.review && <div className="reviewquote">“{b.review}”<div className="dim" style={{ fontSize: 11, marginTop: 6, fontStyle: 'normal' }}>— {b.builder.name} <IBadge n={b.builder.integrity} /></div></div>}
    </>);
  } else if (b.mine && b.status === 'claimed') {
    action = <div className="reviewing" style={cyanNote}><Clock s={15} /> <b>{b.claimer}</b> is working on it · delivery expected in <span className="mono" data-due={b.simDeliverAt ?? ''} /></div>;
  } else if (b.mine && b.status === 'review') {
    action = (<>
      <div className="dw-sec" style={{ marginTop: 0 }}>Delivery from {b.claimer}</div>
      <div className="reviewquote" style={{ borderColor: 'var(--cyan)', background: 'rgba(199,138,72,.05)', fontStyle: 'normal' }}>{b.delivery?.note}<div className="mono" style={{ fontSize: 11, marginTop: 8, color: 'var(--cyan)' }}>{b.delivery?.link}</div></div>
      <div style={{ display: 'flex', gap: 9, marginTop: 14, flexWrap: 'wrap' }}>
        <button className="btn btn-grow" style={{ flex: 1 }} onClick={approve}><Check s={13} /> Approve &amp; pay {fmt(b.reward)} T$</button>
        <button className="btn btn-ghost" onClick={changes}>Request changes</button>
      </div>
    </>);
  } else if (b.status === 'cancelled') action = <div className="enote" style={{ margin: 0 }}>Cancelled — {fmt(b.reward)} Toro$ refunded to the Builder&apos;s wallet.</div>;
  else if (b.status === 'review') action = <div className="enote" style={{ margin: 0 }}>{b.claimer}&apos;s delivery is under review by the Builder.</div>;
  else action = <div className="enote" style={{ margin: 0 }}>Claimed by {b.claimer} — follow the board for the next one.</div>;

  return (<>
    <div className="dw-head" style={cssVars({ '--ph': p.hue })}><div className="band" />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingRight: 36, flexWrap: 'wrap' }}><PTag project={b.project} /><span className={`status st-${b.status}`}>{b.status}</span></div>
      <div className="dw-title">{b.title}</div>
      <button className="ibtn dw-close" onClick={closeDrawer}><X s={15} /></button>
    </div>
    <div className="dw-body">
      <div className="dw-reward">
        <div><div className="dim" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.14em' }}>REWARD · IN ESCROW</div><div className="big">{fmt(b.reward)}<small> Toro$</small></div></div>
        <div style={{ textAlign: 'right' }}><div className="dim" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.14em' }}>MIN INTEGRITY</div>
          <div className="mono" style={{ fontSize: 19, color: b.minInt === 0 ? 'var(--grn)' : 'var(--mint)' }}>{b.minInt === 0 ? 'Open to all' : b.minInt + '+'}</div></div>
      </div>
      <div className="dw-sec">The terms · Rule 1</div>
      <p className="dw-desc">{b.desc}</p>
      <ul className="terms" style={{ marginTop: 10 }}>{b.terms.map((t, i) => <li key={i}><Check s={12} /> {t}</li>)}</ul>
      <div className="dw-sec">The Builder</div>
      <div className="buildercard"><Avatar name={b.builder.name} hue={p.hue} size={38} /><div className="t"><b>{b.builder.name}</b><small>{p.name} · posted {ago(b.createdAt)}</small></div><IBadge n={b.builder.integrity} /></div>
      <div className="dw-sec">{b.status === 'done' ? 'Outcome' : 'Your move'}</div>
      {action}
      <p className="dim" style={{ fontSize: 11, marginTop: 16, textAlign: 'center' }}><Shield s={11} /> Escrow protects both sides. ToroNet doesn&apos;t lend, grant or guarantee.</p>
    </div>
  </>);
}

/* ================= MODAL ================= */
function ModalPanel() {
  const { modal, closeModal, S } = useStore();
  const box = useRef<HTMLDivElement>(null);
  const cancel = () => { modal?.onCancel?.(); closeModal(); };
  useTrap(!!modal, box, cancel);
  const ok = () => { if (!modal) return; const res = modal.onOk?.(box.current!); if (res !== false) closeModal(); };
  const w = S.wallet;
  return (
    <div className={`modal-wrap ${modal ? 'open' : ''}`} id="modalWrap" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) cancel(); }}>
      <div className="modal" id="modalBox" ref={box} onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') { e.preventDefault(); ok(); } }}>
        {modal && (<>
          <h3>{modal.title}</h3>
          {modal.sub && <p className="msub">{modal.sub}</p>}
          {modal.kind === 'connect' && (<>
            <div className="wcard"><Avatar name={w.name} hue="#C68642" size={46} /><div className="t"><b>{w.name}</b><small>{w.address} · {w.region}</small></div><span className="ib"><Shield s={11} /> {w.integrity}</span></div>
            <div className="wcard" style={{ justifyContent: 'space-between' }}><span className="mut" style={{ fontSize: 13 }}>Balance</span><span className="tcoin" style={{ fontSize: 16 }}><Coin s={16} /> {fmt(w.balance)} Toro$</span></div>
            <ul className="perms"><li><Check s={12} /> View your profile &amp; Integrity Score</li><li><Check s={12} /> Sign Toro$ transfers &amp; escrow locks</li><li><Check s={12} /> Verify bounties and ambassador activity</li></ul>
          </>)}
          {modal.body}
          <div className="modal-btns">
            <button className="btn btn-ghost btn-sm" onClick={cancel}>Cancel</button>
            <button className={`btn ${modal.danger ? 'btn-danger' : 'btn-gold'} btn-sm`} onClick={ok}>{modal.okLabel || 'Confirm'}</button>
          </div>
        </>)}
      </div>
    </div>
  );
}
