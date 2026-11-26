'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BountyCard } from '@/components/BountyCard';
import { Grip, Plus, Search, Star, WalletIcon, X } from '@/components/icons';
import { CATS, P } from '@/lib/data';
import { sfx } from '@/lib/fx';
import { useStore } from '@/lib/store';
import type { Category, ProjectId, SavedView } from '@/lib/types';
import { fmt, uid } from '@/lib/utils';

type Sort = SavedView['sort'];
interface BoardUI { q: string; project: ProjectId | 'all'; cat: Category | 'all'; sort: Sort; elig: boolean; view: string | null; watchOnly: boolean }
/* Filters survive leaving and coming back to the board, like the prototype. */
let remembered: BoardUI = { q: '', project: 'all', cat: 'all', sort: 'new', elig: false, view: null, watchOnly: false };

export default function BountiesPage() {
  const { S, update, toast, connectModal, openModal } = useStore();
  const params = useSearchParams();
  const [ui, setUi] = useState<BoardUI>(() => {
    const p = params.get('project') as ProjectId | null;
    return p && P[p] ? { ...remembered, project: p, view: null, watchOnly: false } : remembered;
  });
  const set = (patch: Partial<BoardUI>) => setUi((u) => (remembered = { ...u, ...patch }));
  const [selMode, setSelMode] = useState(false);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const dragView = useRef<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const search = useRef<HTMLInputElement>(null);
  const w = S.wallet;

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !t.matches('input,textarea,select')) { e.preventDefault(); search.current?.focus(); }
      if (e.key === 'Escape' && selMode && !document.querySelector('.drawer.open,.modal-wrap.open')) { setSelMode(false); setSel(new Set()); }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [selMode]);

  const list = useMemo(() => {
    let l = S.bounties.filter((b) => b.status !== 'cancelled' || b.mine);
    if (ui.watchOnly) l = l.filter((b) => S.watch.includes(b.id));
    if (ui.project !== 'all') l = l.filter((b) => b.project === ui.project);
    if (ui.cat !== 'all') l = l.filter((b) => b.cat === ui.cat);
    if (ui.elig && w.connected) l = l.filter((b) => b.status === 'open' && b.minInt <= w.integrity);
    const q = ui.q.toLowerCase().trim();
    if (q) l = l.filter((b) => `${b.title} ${b.desc} ${b.builder.name} ${P[b.project].name} ${b.cat}`.toLowerCase().includes(q));
    const sorts = { new: (a: typeof l[0], b: typeof l[0]) => b.createdAt - a.createdAt, reward: (a: typeof l[0], b: typeof l[0]) => b.reward - a.reward, minint: (a: typeof l[0], b: typeof l[0]) => a.minInt - b.minInt };
    return [...l].sort(sorts[ui.sort] || sorts.new);
  }, [S.bounties, S.watch, ui, w.connected, w.integrity]);

  const openTotal = list.filter((b) => b.status === 'open').reduce((a, b) => a + b.reward, 0);
  const toggleSel = (id: string) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const applyView = (v: SavedView) => set({ view: v.id, q: v.q, project: v.project, cat: v.cat, sort: v.sort, elig: v.elig, watchOnly: false });
  const delView = (v: SavedView) => {
    update((s) => { s.savedViews = s.savedViews.filter((x) => x.id !== v.id); });
    if (ui.view === v.id) set({ view: null });
    toast({ msg: `View “${v.name}” deleted`, type: 'danger', action: { label: 'Undo', fn: () => update((s) => { s.savedViews.push(v); }) } });
  };
  const saveView = () => openModal({
    title: 'Save this view',
    sub: 'Captures your search, project, category, sort and eligibility filter.',
    body: <div className="field"><label htmlFor="mvName">View name</label><input className="input" id="mvName" maxLength={24} placeholder="e.g. Yoruba language work" defaultValue={ui.q || (ui.project !== 'all' ? P[ui.project].name : '') || 'My view'} /></div>,
    okLabel: 'Save view',
    onOk: (box) => {
      const n = (box.querySelector('#mvName') as HTMLInputElement).value.trim();
      if (!n) { sfx('err'); return false; }
      const v: SavedView = { id: uid(), name: n, q: ui.q, project: ui.project, cat: ui.cat, sort: ui.sort, elig: ui.elig };
      update((s) => { s.savedViews.push(v); });
      set({ view: v.id });
      toast({ msg: `View “${n}” saved — drag chips to reorder`, type: 'success' });
    },
  });
  const dropView = (targetId: string) => {
    const from = S.savedViews.findIndex((v) => v.id === dragView.current), to = S.savedViews.findIndex((v) => v.id === targetId);
    dragView.current = null; setDragOver(null);
    if (from < 0 || to < 0 || from === to) return;
    update((s) => { const [v] = s.savedViews.splice(from, 1); s.savedViews.splice(to, 0, v); });
    sfx('tick');
  };

  const bulkWatch = () => { const ids = [...sel]; update((s) => { ids.forEach((x) => { if (!s.watch.includes(x)) s.watch.push(x); }); }); setSel(new Set()); sfx('tick'); toast({ msg: <>Watching <b>{ids.length}</b> bounties</>, type: 'success', icon: <Star s={14} f /> }); };
  const bulkUnwatch = () => { const ids = [...sel], snap = [...S.watch]; update((s) => { s.watch = s.watch.filter((x) => !ids.includes(x)); }); setSel(new Set()); toast({ msg: `Unwatched ${ids.length}`, type: 'danger', action: { label: 'Undo', fn: () => update((s) => { s.watch = snap; }) } }); };
  const clearAll = () => set({ q: '', project: 'all', cat: 'all', elig: false, watchOnly: false, view: null });

  const showBulk = selMode && sel.size > 0;
  useEffect(() => { document.body.classList.toggle('has-bulk', showBulk); return () => document.body.classList.remove('has-bulk'); }, [showBulk]);

  return (
    <div className="wrap">
      <div className="page-head">
        <div className="kicker">Explore Bounties · the task board</div>
        <h1>Find your <span className="grad-gold">next task.</span></h1>
        <p className="sub">Every task you complete brings you closer to your aspiration. Rewards are locked in ToroTeams escrow before work begins — Rule 1: the terms are always clear.</p>
      </div>

      {!w.connected && (
        <div className="wallet-banner rv">
          <span style={{ color: 'var(--gold)' }}><WalletIcon s={26} /></span>
          <div className="t"><b>Sign in with ToroNet Wallet to Claim.</b><p>Your wallet carries your Identity, your Toro$ balance and your Integrity Score — the badge of trust Builders look for.</p></div>
          <button className="btn btn-gold" onClick={() => connectModal()}><WalletIcon s={14} /> Sign in with ToroNet Wallet</button>
        </div>
      )}

      <div className="card toolbar rv">
        <div className="tb-row">
          <div className="searchwrap"><Search s={16} /><input ref={search} className="input" id="bq" type="text" placeholder="Search bounties, builders, projects…" value={ui.q} autoComplete="off" aria-label="Search bounties" onChange={(e) => set({ q: e.target.value, view: null })} /></div>
          <select className="input select-sm" id="bCat" aria-label="Category" value={ui.cat} onChange={(e) => set({ cat: e.target.value as Category | 'all', view: null })}>
            <option value="all">All categories</option>{CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="input select-sm" id="bSort" aria-label="Sort" value={ui.sort} onChange={(e) => set({ sort: e.target.value as Sort, view: null })}>
            <option value="new">Newest</option><option value="reward">Reward ↓</option><option value="minint">Easiest entry</option>
          </select>
          <label className="elig" title="Only bounties your Integrity unlocks">
            <span className="switch"><input type="checkbox" id="bElig" checked={ui.elig} disabled={!w.connected} onChange={(e) => set({ elig: e.target.checked, view: null })} /><span className="knob" /></span>I can claim
          </label>
          <button className={`chip ${selMode ? 'on' : ''}`} onClick={() => { setSelMode(!selMode); if (selMode) setSel(new Set()); }}>{selMode ? 'Done' : 'Select'}</button>
        </div>
        <div className="tb-row">
          <button className={`chip ${ui.project === 'all' && !ui.watchOnly ? 'on' : ''}`} onClick={() => set({ project: 'all', view: null, watchOnly: false })}>All projects</button>
          {(Object.entries(P) as [ProjectId, typeof P[ProjectId]][]).map(([k, p]) => (
            <button key={k} className={`chip ${ui.project === k && !ui.watchOnly ? 'on' : ''}`} onClick={() => set({ project: k, view: null, watchOnly: false })}
              style={ui.project === k ? { borderColor: p.hue, color: p.hue, background: `color-mix(in srgb,${p.hue} 12%,transparent)` } : undefined}>
              <i style={{ width: 6, height: 6, borderRadius: '50%', background: p.hue, display: 'inline-block' }} />{p.name}
            </button>
          ))}
          <button className={`chip ${ui.watchOnly ? 'on' : ''}`} onClick={() => set({ watchOnly: !ui.watchOnly, view: null })}><Star s={12} f={ui.watchOnly} /> Watched ({S.watch.length})</button>
        </div>
        <div className="tb-row">
          <span className="views-lbl">VIEWS</span>
          {S.savedViews.map((v) => (
            <span key={v.id} className={`chip viewchip ${ui.view === v.id ? 'on' : ''} ${dragOver === v.id ? 'dragover' : ''}`} draggable role="button" tabIndex={0} title="Drag to reorder"
              onClick={() => applyView(v)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); applyView(v); } }}
              onDragStart={(e) => { dragView.current = v.id; e.dataTransfer.setData('text/plain', v.id); e.dataTransfer.effectAllowed = 'move'; }}
              onDragOver={(e) => { if (!dragView.current) return; e.preventDefault(); setDragOver(v.id); }}
              onDrop={(e) => { e.preventDefault(); dropView(v.id); }}
              onDragEnd={() => { dragView.current = null; setDragOver(null); }}>
              <span className="grip"><Grip s={10} /></span>{v.name}
              <button className="x" title="Delete view" onClick={(e) => { e.stopPropagation(); delView(v); }}><X s={9} /></button>
            </span>
          ))}
          <button className="chip" onClick={saveView}><Plus s={10} /> Save view</button>
          <span className="bcount mono" id="bCount">{list.length} bounties · {fmt(openTotal)} T$ open</span>
        </div>
      </div>

      <div className="bgrid" id="bGrid">
        {list.length ? list.map((b, i) => <BountyCard key={b.id} b={b} i={i} selMode={selMode} selected={sel.has(b.id)} onToggleSel={toggleSel} />) : (
          <div className="empty">
            <div className="big">🔍</div>
            <div>No bounties match{ui.q && <> “<b>{ui.q}</b>”</>}.</div>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={clearAll}>Clear filters</button>
          </div>
        )}
      </div>
      <div style={{ height: 30 }} />

      <div className={`bulkbar ${showBulk ? 'show' : ''}`} id="bulkbar" role="toolbar" aria-label="Bulk actions">
        {showBulk && (<>
          <span className="n">{sel.size} selected</span>
          <button className="btn btn-gold btn-sm" onClick={bulkWatch}><Star s={12} /> Watch</button>
          <button className="btn btn-ghost btn-sm" onClick={bulkUnwatch}>Unwatch</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setSel(new Set(list.map((b) => b.id)))}>Select visible ({list.length})</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setSel(new Set())}>Clear</button>
        </>)}
      </div>
    </div>
  );
}
