export type ProjectId = 'torobuild' | 'toroforge' | 'connectworld' | 'agrifi' | 'plastoken' | 'community';
export type Category = 'Tech' | 'Creative' | 'Content' | 'Language' | 'Field' | 'Community';
export type BountyStatus = 'open' | 'claimed' | 'review' | 'done' | 'cancelled';
export type TierId = 'champion' | 'lead' | 'regional';

export interface Project { name: string; tag: string; hue: string }

export interface Bounty {
  id: string;
  title: string;
  desc: string;
  project: ProjectId;
  cat: Category;
  reward: number;
  minInt: number;
  builder: { name: string; integrity: number };
  status: BountyStatus;
  /** 'you' when the connected wallet claimed it, otherwise a member name */
  claimer: string | null;
  delivery: { note: string; link: string; at: number } | null;
  dueAt: number | null;
  mine: boolean;
  createdAt: number;
  review: string | null;
  terms: string[];
  simClaimAt: number | null;
  simDeliverAt: number | null;
}

export interface Member {
  id: string;
  name: string;
  handle: string;
  project: ProjectId;
  earned: number;
  integrity: number;
  tier: TierId | null;
  region: string;
  you?: boolean;
}

export interface Wallet {
  connected: boolean;
  name: string;
  handle: string;
  address: string;
  region: string;
  balance: number;
  earned: number;
  integrity: number;
  verified: boolean;
}

export interface SavedView {
  id: string;
  name: string;
  project: ProjectId | 'all';
  cat: Category | 'all';
  q: string;
  sort: 'new' | 'reward' | 'minint';
  elig: boolean;
}

export interface Milestone { label: string; amount: number; state: 'todo' | 'pending' | 'paid'; dueAt: number | null }

export interface AmbassadorActivity {
  id: string;
  type: 'meetup' | 'merchant' | 'recruit';
  count: number;
  city: string;
  note: string;
  status: 'pending' | 'verified';
  dueAt: number | null;
  reward: number;
}

export interface AppState {
  v: 1;
  fresh: boolean;
  muted: boolean;
  seenGuide: boolean;
  subscribed: boolean;
  wallet: Wallet;
  bounties: Bounty[];
  members: Member[];
  watch: string[];
  savedViews: SavedView[];
  courses: Record<string, { enrolled: boolean; done: number }>;
  apps: {
    incubator: { status: 'none' | 'pending' | 'accepted'; dueAt: number | null; name: string; pitch: string; focus: string; milestones: Milestone[] };
    mentors: Record<string, { booked: boolean }>;
    hacks: Record<string, { team: string; size: number }>;
  };
  ambassador: {
    status: 'none' | 'pending' | 'approved';
    tier: TierId | null;
    dueAt: number | null;
    region: string;
    city: string;
    why: string;
    earned: number;
    onboarded: number;
    verified: number;
    activities: AmbassadorActivity[];
  };
  newsRead: Record<string, boolean>;
}

export interface Course { id: string; title: string; level: string; mins: number; reward: number; ig: number; hue: string; lessons: string[] }
export interface Mentor { id: string; name: string; role: string; project: ProjectId; region: string; expertise: string[]; slots: number; date: string }
export interface Hack { id: string; title: string; dates: string; place: string; prize: number; teams: string; desc: string; hue: string }
export interface NewsItem { id: string; project: ProjectId; title: string; dek: string; author: string; date: string; mins: number; quote: string; body: string[] }
