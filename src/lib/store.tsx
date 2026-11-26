'use client';
/*
  App state for Toro Tribe.
  Everything here is simulated in the browser (localStorage), exactly like the Qwen prototype.
  Phase 2 replaces these actions with API calls; Phase 3 routes wallet/escrow through ToroNet.
*/
import { createContext, use, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { browser } from 'react-dom';
import { REVIEW_QUOTES, TIERS, seed } from './data';
import type { AppState, Bounty, Member } from './types';
import { burst, setMuted, sfx } from './fx';
import { clamp, clone, fmt, now } from './utils';
import { Check, Coin, Flag, Lock, Rocket, Spark, Trash, Users, WalletIcon } from '@/components/icons';

const KEY = 'toro-tribe-v1';
let welcomed = false;

/* ---------- toasts ---------- */
export type ToastType = 'default' | 'success' | 'danger' | 'info';
export interface Toast { id: number; msg: ReactNode; type: ToastType; icon?: ReactNode; action?: { label: string; fn: () => void }; dur: number }
type ToastInput = Omit<Toast, 'id' | 'type' | 'dur'> & { type?: ToastType; dur?: number };

/* ---------- overlays ---------- */
export type Drawer = { type: 'wallet' } | { type: 'bounty'; id: string } | null;
export interface ModalConfig { kind?: 'connect'; title: ReactNode; sub?: ReactNode; body?: ReactNode; okLabel?: string; danger?: boolean; onOk?: (box: HTMLElement) => boolean | void; onCancel?: () => void }

interface Store {
  S: AppState;
  update: (fn: (s: AppState) => void) => void;
  toasts: Toast[];
  toast: (t: ToastInput) => void;
  dismissToast: (id: number) => void;
  drawer: Drawer;
  openDrawer: (d: Drawer) => void;
  closeDrawer: () => void;
  modal: ModalConfig | null;
  openModal: (m: ModalConfig) => void;
  closeModal: () => void;
  connectModal: (after?: () => void) => void;
  requireWallet: (fn: () => void) => boolean;
  credit: (amount: number, ig: number, label: ReactNode, origin?: Element | null) => void;
  bounty: (id: string) => Bounty | undefined;
  boardRows: () => Member[];
  myRank: () => number;
  doClaim: (id: string) => void;
  cancelBounty: (id: string) => void;
}

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside <StoreProvider>');
  return s;
};

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.v === 1 && s.wallet && Array.isArray(s.bounties)) return s;
    }
  } catch { /* ignore */ }
  return seed();
}

export function StoreProvider({ children }: { children: ReactNode }) {
  // The whole store lives in localStorage, so it renders in the browser only.
  use(browser('Toro Tribe keeps its demo state in localStorage.'));

  const [S, setS] = useState<AppState>(load);
  // `ref` always holds the latest state; every write goes through update() or the engine below.
  const ref = useRef(S);

  const update = useCallback((fn: (s: AppState) => void) => {
    const next = clone(ref.current);
    fn(next);
    ref.current = next;
    setS(next);
  }, []);

  useEffect(() => {
    setMuted(S.muted);
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* ignore */ }
  }, [S]);

  /* toasts */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const tid = useRef(0);
  const toast = useCallback((t: ToastInput) => {
    const item: Toast = { type: 'default', dur: 5200, ...t, id: ++tid.current };
    setToasts((list) => [...list.slice(-2), item]); // max 3 on screen
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((l) => l.filter((x) => x.id !== id)), []);

  /* overlays */
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [modal, setModal] = useState<ModalConfig | null>(null);
  const afterConnect = useRef<null | (() => void)>(null);
  const openDrawer = useCallback((d: Drawer) => setDrawer(d), []);
  const closeDrawer = useCallback(() => setDrawer(null), []);
  const openModal = useCallback((m: ModalConfig) => setModal(m), []);
  const closeModal = useCallback(() => setModal(null), []);

  const bounty = useCallback((id: string) => ref.current.bounties.find((b) => b.id === id), []);

  const boardRows = useCallback(() => {
    const s = ref.current;
    const rows: Member[] = s.members.map((m) => ({ ...m }));
    if (s.wallet.connected)
      rows.push({ id: 'you', name: s.wallet.name, handle: s.wallet.handle, project: 'community', earned: s.wallet.earned, integrity: s.wallet.integrity, tier: s.ambassador.status === 'approved' ? s.ambassador.tier : null, region: s.wallet.region, you: true });
    return rows.sort((a, b) => b.integrity - a.integrity || b.earned - a.earned);
  }, []);
  const myRank = useCallback(() => boardRows().findIndex((r) => r.you) + 1, [boardRows]);

  const credit = useCallback((amount: number, ig: number, label: ReactNode, origin?: Element | null) => {
    update((s) => {
      s.wallet.balance += amount;
      s.wallet.earned += amount;
      s.wallet.integrity = clamp(s.wallet.integrity + ig, 0, 100);
    });
    sfx('coin');
    burst(origin || document.getElementById('walletSlot'));
    const chip = document.querySelector('#walletSlot .wchip');
    if (chip) { chip.classList.remove('pulse'); void (chip as HTMLElement).offsetWidth; chip.classList.add('pulse'); }
    toast({ msg: <><b>+{fmt(amount)} Toro$</b> · {label} · Integrity +{ig}</>, type: 'success', icon: <Coin s={16} />, dur: 6000 });
  }, [update, toast]);

  const connectModal = useCallback((after?: () => void) => {
    afterConnect.current = after || null;
    const w = ref.current.wallet;
    setModal({
      title: 'Sign in with ToroNet Wallet',
      sub: 'One identity across the whole ecosystem — your Toro$, your Integrity, your history.',
      kind: 'connect', // the modal renders the wallet summary for this kind
      okLabel: 'Approve connection',
      onCancel: () => { afterConnect.current = null; },
      onOk: () => {
        update((s) => { s.wallet.connected = true; });
        sfx('connect');
        toast({ msg: <>Wallet connected · Integrity <b>{w.integrity}</b> · {fmt(w.balance)} Toro$</>, type: 'success', icon: <WalletIcon s={16} /> });
        const fn = afterConnect.current;
        afterConnect.current = null;
        if (fn) setTimeout(fn, 0);
      },
    });
  }, [update, toast]);

  const requireWallet = useCallback((fn: () => void) => {
    if (ref.current.wallet.connected) { fn(); return true; }
    connectModal(fn);
    return false;
  }, [connectModal]);

  const doClaim = useCallback((id: string) => {
    const b0 = ref.current.bounties.find((x) => x.id === id);
    if (!b0 || b0.status !== 'open') return;
    requireWallet(() => {
      const s = ref.current;
      const b = s.bounties.find((x) => x.id === id)!;
      if (b.minInt > s.wallet.integrity) {
        sfx('err');
        toast({ msg: <>Needs Integrity <b>{b.minInt}+</b> — you&apos;re at {s.wallet.integrity}. <a href="/opportunities?tab=academy" style={{ color: 'var(--cyan)', fontWeight: 800 }}>Raise it →</a></>, type: 'info', icon: <Lock s={14} /> });
        setDrawer({ type: 'bounty', id });
        return;
      }
      update((st) => { const x = st.bounties.find((y) => y.id === id)!; x.status = 'claimed'; x.claimer = 'you'; x.simClaimAt = null; });
      sfx('tick');
      toast({ msg: <>Claimed <b>{b.title.slice(0, 36)}…</b> — deliver to earn {fmt(b.reward)} Toro$</>, type: 'success', icon: <Check s={15} />, action: { label: 'Deliver', fn: () => setDrawer({ type: 'bounty', id }) } });
      setDrawer({ type: 'bounty', id });
    });
  }, [requireWallet, toast, update]);

  const cancelBounty = useCallback((id: string) => {
    const b = ref.current.bounties.find((x) => x.id === id);
    if (!b || !b.mine || b.status !== 'open') return;
    const snap = clone(b), refund = b.reward;
    update((s) => { const x = s.bounties.find((y) => y.id === id)!; x.status = 'cancelled'; x.simClaimAt = null; s.wallet.balance += refund; });
    sfx('tick');
    setDrawer((d) => (d && d.type === 'bounty' && d.id === id ? null : d));
    toast({ msg: <>Bounty cancelled · <b>{fmt(refund)} Toro$</b> refunded from escrow</>, type: 'danger', icon: <Trash s={15} />, dur: 6500,
      action: { label: 'Undo', fn: () => { update((s) => { const i = s.bounties.findIndex((y) => y.id === id); s.bounties[i] = snap; s.wallet.balance -= refund; }); toast({ msg: 'Bounty restored — escrow re-locked', type: 'info', dur: 2500 }); } } });
  }, [toast, update]);

  /* ---------- async engine: simulated reviews, claims and approvals ---------- */
  useEffect(() => {
    const iv = setInterval(() => {
      const t = now();
      const s = ref.current;
      const credits: [number, number, ReactNode][] = [];
      const toastsOut: ToastInput[] = [];
      let sound: null | 'tick' | 'chord' = null;
      let doBurst = false;
      let changed = false;
      const next = clone(s);

      next.bounties.forEach((b) => {
        if (b.status === 'review' && b.claimer === 'you' && b.dueAt && t >= b.dueAt) {
          b.status = 'done'; b.dueAt = null; b.review = REVIEW_QUOTES[Math.floor(Math.random() * REVIEW_QUOTES.length)]; changed = true;
          credits.push([b.reward, 4, <>“{b.title.slice(0, 34)}{b.title.length > 34 ? '…' : ''}” verified</>]);
        }
        if (b.mine && b.status === 'open' && b.simClaimAt && t >= b.simClaimAt) {
          b.simClaimAt = null;
          const cand = next.members.filter((m) => m.integrity >= b.minInt);
          const m = cand[Math.floor(Math.random() * cand.length)] || next.members[0];
          b.status = 'claimed'; b.claimer = m.name; b.simDeliverAt = t + 8000; changed = true;
          toastsOut.push({ msg: <><b>{m.name}</b> claimed your bounty “{b.title.slice(0, 30)}…”</>, type: 'info', icon: <Users s={15} /> });
          sound = 'tick';
        }
        if (b.mine && b.status === 'claimed' && b.claimer !== 'you' && b.simDeliverAt && t >= b.simDeliverAt) {
          b.simDeliverAt = null; b.status = 'review';
          b.delivery = { note: 'Delivered per the terms — proof link and notes attached. Happy to iterate on feedback.', link: 'https://proof.toro.net/' + b.id, at: t };
          changed = true;
          const id = b.id;
          toastsOut.push({ msg: <>Delivery ready for review · <b>{b.title.slice(0, 32)}…</b></>, type: 'info', icon: <Flag s={15} />, action: { label: 'Review', fn: () => setDrawer({ type: 'bounty', id }) } });
          sound = 'tick';
        }
      });

      const inc = next.apps.incubator;
      if (inc.status === 'pending' && inc.dueAt && t >= inc.dueAt) {
        inc.status = 'accepted'; inc.dueAt = null; changed = true; sound = 'chord';
        toastsOut.push({ msg: <>🎉 <b>{inc.name}</b> accepted into Incubator Cohort 2! Submit your Prototype milestone.</>, type: 'success', icon: <Rocket s={16} />, dur: 7000 });
      }
      inc.milestones.forEach((m, i) => {
        if (m.state === 'pending' && m.dueAt && t >= m.dueAt) { m.state = 'paid'; m.dueAt = null; changed = true; credits.push([m.amount, 4, `Incubator milestone ${i + 1} verified`]); }
      });

      const amb = next.ambassador;
      if (amb.status === 'pending' && amb.dueAt && t >= amb.dueAt) {
        amb.status = 'approved'; amb.tier = 'champion'; amb.dueAt = null; changed = true; sound = 'chord'; doBurst = true;
        toastsOut.push({ msg: <>🐂 You are now a <b>Champion</b> — the first Ambassador tier. Your dashboard is live.</>, type: 'success', icon: <Flag s={16} />, dur: 7000 });
      }
      amb.activities.forEach((a) => {
        if (a.status === 'pending' && a.dueAt && t >= a.dueAt) {
          a.status = 'verified'; a.dueAt = null; amb.verified++; amb.earned += a.reward;
          if (a.type !== 'meetup') amb.onboarded += a.count;
          changed = true;
          credits.push([a.reward, 2, `${a.count}× ${a.type === 'meetup' ? 'attendees' : a.type === 'merchant' ? 'merchants' : 'Aspirers'} verified`]);
        }
      });
      if (amb.status === 'approved') {
        const nt = amb.verified >= 25 && next.wallet.integrity >= 80 ? 'regional' : amb.verified >= 10 && next.wallet.integrity >= 65 ? 'lead' : amb.tier;
        if (nt && nt !== amb.tier) {
          amb.tier = nt; changed = true; sound = 'chord'; doBurst = true;
          toastsOut.push({ msg: <>Promoted to <b>{TIERS[nt].name}</b> 🎉</>, type: 'success', icon: <Flag s={16} />, dur: 7000 });
        }
      }

      if (changed) { ref.current = next; setS(next); }
      if (sound) sfx(sound);
      if (doBurst) burst();
      toastsOut.forEach(toast);
      credits.forEach(([a, ig, l]) => credit(a, ig, l));
      // live countdowns
      document.querySelectorAll<HTMLElement>('[data-due]').forEach((el) => { const d = +el.dataset.due! - t; el.textContent = d > 0 ? Math.ceil(d / 1000) + 's' : '…'; });
    }, 500);
    return () => clearInterval(iv);
  }, [credit, toast]);

  /* first-visit welcome */
  useEffect(() => {
    if (!ref.current.fresh || welcomed) return;
    welcomed = true;
    update((s) => { s.fresh = false; });
    setTimeout(() => toast({
      msg: <>Karibu to the tribe 🐂 Connect your ToroNet Wallet to start earning — Integrity <b>{ref.current.wallet.integrity}</b> is waiting.</>,
      type: 'info', icon: <Spark s={14} />, dur: 7000, action: { label: 'Connect', fn: () => connectModal() },
    }), 900);
  }, [update, toast, connectModal]);

  const value = useMemo<Store>(() => ({
    S, update, toasts, toast, dismissToast, drawer, openDrawer, closeDrawer, modal, openModal, closeModal,
    connectModal, requireWallet, credit, bounty, boardRows, myRank, doClaim, cancelBounty,
  }), [S, update, toasts, toast, dismissToast, drawer, openDrawer, closeDrawer, modal, openModal, closeModal, connectModal, requireWallet, credit, bounty, boardRows, myRank, doClaim, cancelBounty]);

  return <Ctx value={value}>{children}</Ctx>;
}
