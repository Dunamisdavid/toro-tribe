/* Icon set ported 1:1 from the Qwen prototype (the `I` object). */
type P = { s?: number };
const stroke = (s: number, w = 2) => ({ width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

export const Bull = ({ s = 18 }: P) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M2 4q3 7 7 8l3 9 3-9q4-1 7-8-4 4-8 4h-4Q6 8 2 4z" /></svg>);
export const Coin = ({ s = 15 }: P) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="9.5" fill="#C68642" /><circle cx="12" cy="12" r="9.5" stroke="#5D3F1F" strokeWidth="1" />
    <path d="M8 8.5h8M12 8.5V17" stroke="#3D2914" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
export const Shield = ({ s = 13 }: P) => (<svg {...stroke(s)}><path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8.4 7.5 10 4.3-1.6 7.5-5.4 7.5-10v-6L12 2.5z" /><path d="m8.8 12 2.2 2.2 4.2-4.4" /></svg>);
export const WalletIcon = ({ s = 16 }: P) => (<svg {...stroke(s, 1.9)}><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5V9" /><path d="M3 7.5V17a2.5 2.5 0 0 0 2.5 2.5h13A2.5 2.5 0 0 0 21 17v-5.5A2.5 2.5 0 0 0 18.5 9H5.5A2.5 2.5 0 0 1 3 7.5z" /><circle cx="16.5" cy="14.2" r="1.3" fill="currentColor" stroke="none" /></svg>);
export const Search = ({ s = 16 }: P) => (<svg {...stroke(s)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const Plus = ({ s = 14 }: P) => (<svg {...stroke(s, 2.4)}><path d="M12 5v14M5 12h14" /></svg>);
export const X = ({ s = 14 }: P) => (<svg {...stroke(s, 2.4)}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const Check = ({ s = 13 }: P) => (<svg {...stroke(s, 3)}><path d="m4.5 12.5 5 5 10-11" /></svg>);
export const Arrow = ({ s = 15 }: P) => (<svg {...stroke(s, 2.2)}><path d="M4 12h15m0 0-6-6m6 6-6 6" /></svg>);
export const Star = ({ s = 15, f = false }: P & { f?: boolean }) => (<svg width={s} height={s} viewBox="0 0 24 24" fill={f ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6-5.4-2.9L6.6 19.7l1.1-6L3.2 9.4l6.1-.8L12 3z" /></svg>);
export const Lock = ({ s = 13 }: P) => (<svg {...stroke(s)}><rect x="5" y="11" width="14" height="9.5" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" /></svg>);
export const Spark = ({ s = 14 }: P) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2 2-7z" /></svg>);
export const Menu = ({ s = 18 }: P) => (<svg {...stroke(s, 2.2)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const Vol = ({ s = 17 }: P) => (<svg {...stroke(s, 1.9)}><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4z" fill="currentColor" stroke="none" /><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /></svg>);
export const VolX = ({ s = 17 }: P) => (<svg {...stroke(s, 1.9)}><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4z" fill="currentColor" stroke="none" /><path d="m16 9.5 5 5m0-5-5 5" /></svg>);
export const Clock = ({ s = 13 }: P) => (<svg {...stroke(s)}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>);
export const Cal = ({ s = 13 }: P) => (<svg {...stroke(s)}><rect x="3.5" y="5" width="17" height="16" rx="2.5" /><path d="M3.5 10h17M8 2.8V6.5M16 2.8V6.5" /></svg>);
export const Users = ({ s = 16 }: P) => (<svg {...stroke(s, 1.9)}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.7-3.4 3.3-5.5 6.5-5.5s5.8 2.1 6.5 5.5M16 5a3.5 3.5 0 0 1 0 6.7M18.5 14.8c1.7.8 2.8 2.3 3 5.2" /></svg>);
export const Book = ({ s = 16 }: P) => (<svg {...stroke(s, 1.9)}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5zM4 18.5A2.5 2.5 0 0 1 6.5 16H20" /></svg>);
export const Rocket = ({ s = 16 }: P) => (<svg {...stroke(s, 1.9)}><path d="M12 15c5.5-4 7-8.5 7-12-3.5 0-8 1.5-12 7l-3 1 4 4 1-3z" /><path d="M9 15c-1.5.5-3 2.5-3.5 5.5 3-.5 5-2 5.5-3.5M14.5 9.5h.01" /></svg>);
export const Flag = ({ s = 16 }: P) => (<svg {...stroke(s, 1.9)}><path d="M5 21V4m0 1h13l-2.5 4L18 13H5" /></svg>);
export const Edit = ({ s = 14 }: P) => (<svg {...stroke(s, 1.9)}><path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3zM13.5 6.5l3 3" /></svg>);
export const Trash = ({ s = 14 }: P) => (<svg {...stroke(s, 1.9)}><path d="M4 7h16M9 7V4.8A.8.8 0 0 1 9.8 4h4.4a.8.8 0 0 1 .8.8V7m3 0-1 12.2a1.8 1.8 0 0 1-1.8 1.8H8.8A1.8 1.8 0 0 1 7 19.2L6 7m4 4v6m4-6v6" /></svg>);
export const Grip = ({ s = 12 }: P) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.8" /><circle cx="15" cy="6" r="1.8" /><circle cx="9" cy="12" r="1.8" /><circle cx="15" cy="12" r="1.8" /><circle cx="9" cy="18" r="1.8" /><circle cx="15" cy="18" r="1.8" /></svg>);
export const Target = ({ s = 16 }: P) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>);
export const Globe = ({ s = 16 }: P) => (<svg {...stroke(s, 1.8)}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5z" /></svg>);
export const Copy = ({ s = 14 }: P) => (<svg {...stroke(s, 1.9)}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" /></svg>);
export const Hammer = ({ s = 16 }: P) => (<svg {...stroke(s, 1.9)}><path d="m14 6 4 4M3 21l7.5-7.5M12 4l3-1.5L21.5 9 20 12l-8-8z" /></svg>);
export const SafetyShield = ({ s = 20 }: P) => (<svg {...stroke(s, 1.9)}><path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8.4 7.5 10 4.3-1.6 7.5-5.4 7.5-10v-6L12 2.5z" /><path d="M12 8.5v4m0 3h.01" /></svg>);
