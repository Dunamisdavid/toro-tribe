import type { AppState, Bounty, Category, Course, Hack, Member, Mentor, NewsItem, Project, ProjectId, TierId } from './types';
import { clamp, mulberry32, now } from './utils';

/* Mock data — mirrors the Qwen prototype exactly. This is what the backend will serve later. */

export const P: Record<ProjectId, Project> = {
  torobuild:{name:'ToroBuild',tag:'Tech',hue:'#CA9052'},
  toroforge:{name:'ToroForge',tag:'Dev tools',hue:'#D4A573'},
  connectworld:{name:'ConnectWorld',tag:'Payments',hue:'#C78A48'},
  agrifi:{name:'AgriFi',tag:'Agri',hue:'#BF7F3B'},
  plastoken:{name:'Plastoken',tag:'Climate',hue:'#BB7C39'},
  community:{name:'ToroNet Community',tag:'Creative',hue:'#CC955A'},
};
export const CATS: Category[] = ['Tech','Creative','Content','Language','Field','Community'];
export const TIERS: Record<TierId, { name: string; cls: string; hue: string }> = {champion:{name:'Champion',cls:'Champion',hue:'#C68642'},lead:{name:'Country Lead',cls:'cl',hue:'#C78A48'},regional:{name:'Regional Ambassador',cls:'ra',hue:'#CC955A'}};
export const REGIONS = ['West Africa','East Africa','Southern Africa','South Asia','Latin America','Europe & Diaspora'];
export const REVIEW_QUOTES = ['Clean, on time, exactly the terms. More bounties coming your way.','Verified against every term. This is what Integrity looks like.','Excellent delivery — shared it with the whole core team. Thank you.','Fast, thorough, and the proof was airtight. Paid instantly.'];
export const COURSES: Course[] = [
 {id:'c1',title:'ToroNet 101: The Aspirations Economy',level:'Beginner',mins:40,reward:30,ig:4,hue:'#C68642',lessons:['What is the Aspirations Economy?','Your wallet, your identity','Reading a bounty like a pro','Escrow & Rule 1: terms always clear','Your first Integrity points']},
 {id:'c2',title:'Solidity for ToroBuild',level:'Advanced',mins:180,reward:60,ig:6,hue:'#CA9052',lessons:['ToroNet L1 architecture','Gasless paymasters','Escrow contract patterns','Integrity-weighted access','Testing with ToroForge','Audit fundamentals','Severity-ranked reporting','Ship: audit a live contract']},
 {id:'c3',title:'Community Growth Playbook',level:'Intermediate',mins:90,reward:45,ig:5,hue:'#CC955A',lessons:['Map your local ecosystem','Meetups that convert','Onboarding merchants with consent','Recruiting Aspirers','Ambassador toolkits','Measuring verified impact']},
 {id:'c4',title:'Launch a Kickstarter-style Raise on ToroNet',level:'Intermediate',mins:120,reward:50,ig:5,hue:'#D4A573',lessons:['Anatomy of a ToroNet raise','Story & video craft','Milestone design','Backer psychology','Escrowed funding tranches','Launch week playbook','Post-raise delivery']},
 {id:'c5',title:'Field Ops: Merchant Onboarding that Sticks',level:'Beginner',mins:35,reward:25,ig:3,hue:'#C78A48',lessons:['The merchant conversation','Wallet setup walkthrough','Proof & consent photos','Thirty-day stickiness']},
 {id:'c6',title:'Design for Trust: Brand & Campaign Craft',level:'Intermediate',mins:80,reward:40,ig:4,hue:'#BB7C39',lessons:['Brand warmth on a budget','The Happiness with Toro system','Social graphics that convert','Export & handoff discipline','Feedback loops with Builders','Portfolio for bounties']},
];
export const MENTORS: Mentor[] = [
 {id:'m1',name:'Amara Nwosu',role:'Smart-contract auditor',project:'torobuild',region:'Lagos, NG',expertise:['Audits','Escrow design','Gasless paymasters'],slots:3,date:'Tue, Nov 24 · 16:00 UTC'},
 {id:'m2',name:'Kofi Mensah',role:'Growth lead',project:'connectworld',region:'Accra, GH',expertise:['Merchant onboarding','Field ops','Local meetups'],slots:2,date:'Wed, Nov 25 · 14:00 UTC'},
 {id:'m3',name:'Zainab Bello',role:'Country Lead, Nigeria',project:'agrifi',region:'Kano, NG',expertise:['Farmer co-ops','Translation ops','Ambassador tiers'],slots:4,date:'Thu, Nov 26 · 10:00 UTC'},
 {id:'m4',name:'Diego Ramírez',role:'Raise strategist',project:'toroforge',region:'Mexico City, MX',expertise:['Kickstarter-style raises','Backer storytelling','Milestones'],slots:2,date:'Fri, Nov 27 · 18:00 UTC'},
];
export const HACKS: Hack[] = [
 {id:'h1',title:'Lagos Build Weekend',dates:'Dec 12–14, 2026',place:'Lagos + remote',prize:5000,teams:'2–4',desc:'Forty-eight hours to ship a working prototype on ToroNet primitives. Mentors from ToroBuild and ConnectWorld on site; Backers judge the finals.',hue:'#C68642'},
 {id:'h2',title:'Global Aspirations Hack',dates:'Jan 22–25, 2027',place:'Fully online',prize:12000,teams:'2–5',desc:'The big one. Teams across six continents solve real briefs posted by ecosystem projects. Winning squads pitch straight to the Backer circle.',hue:'#C78A48'},
 {id:'h3',title:'AgriFi Data Sprint',dates:'Nov 28–30, 2026',place:'Ibadan, NG',prize:2500,teams:'2–3',desc:'Map plots, verify storage, and build the open dataset Oyo State farmers will borrow against. Field boots required; laptops provided.',hue:'#BF7F3B'},
];
export const NEWS: NewsItem[] = [
 {id:'n1',project:'torobuild',title:'ToroNet Layer 1 hits 1 million gasless transactions',dek:'Nobody paid a gas fee. Nobody waited. The Aspirer simply saw the balance change.',author:'ToroBuild Core',date:'Nov 17, 2026',mins:4,quote:'A fee is a wall. We removed the wall, and a million people walked through.',body:[
 'At 09:41 UTC on Monday, the ToroNet Layer 1 processed its one-millionth gasless transaction — a 50 Toro$ bounty payout from a ConnectWorld merchant onboarding in Lagos. Nobody paid a gas fee. Nobody waited for a confirmation screen. The Aspirer simply saw the balance change.',
 'Gasless is not a perk on ToroNet; it is the point. When a first-time Aspirer in Ibadan completes a 50 Toro$ task, a two-dollar fee is not an inconvenience — it is a wall. Sponsored transactions remove that wall entirely, and the numbers now show what that means in practice.',
 'Of the million transactions, 61% were bounty payouts, 22% were merchant payments through ConnectWorld, and 11% were escrow locks from Builders posting new work. The remaining 6% were incubator milestone releases — the newest and fastest-growing category.',
 'Median finality held at 1.8 seconds across the milestone window, with the slowest hour — a Friday evening spike driven by the Happiness with Toro campaign — still under four seconds.',
 'Next up: the ToroBuild team is opening the gasless paymaster to every ToroForge app, so any Builder can sponsor their community’s transactions with one escrow deposit. The integration bounty is live on the board now.']},
 {id:'n2',project:'community',title:'ToroTeams Incubator Cohort 2: applications are open',dek:'Eight weeks, milestone-based grants in Toro$, and a demo day in front of Backers who actually fund things.',author:'ToroTeams Programs',date:'Nov 15, 2026',mins:3,quote:'We don’t pick ideas. We pick people who deliver — the Integrity Board tells us who.',body:[
 'Applications for the ToroTeams Incubator Cohort 2 opened this morning. Eight weeks, milestone-based grants in Toro$, and a demo day in front of Backers who actually fund things — this is the same program that took SusuPay from a spreadsheet to 400 weekly users.',
 'Cohort 2 is looking for twelve teams building on ToroNet primitives: escrow, gasless payments, Integrity-weighted trust. You do not need a finished product. You need a real problem, a first prototype, and the appetite to ship weekly.',
 'Grants are released against three milestones — Prototype (500 Toro$), Beta (750 Toro$), and Launch (1,250 Toro$). No equity, no repayment. Rule 4 still applies: ToroNet doesn’t lend, grant or guarantee in the traditional sense; the incubator enables the community to come together around your aspiration.',
 'Selection weighs your Integrity Score alongside your pitch. Applicants who have completed bounties on time start with a visible advantage, because delivery history is the best predictor of delivery.',
 'Applications close December 20, 2026. Apply through the Opportunities tab, and bring your wallet — your history is your application.']},
 {id:'n3',project:'connectworld',title:'ConnectWorld needs 5 merchant scouts in Lagos',dek:'Balogun and Mile 12 markets. Find, verify, onboard — 50 Toro$ per bundle, no code required.',author:'ConnectWorld Field',date:'Nov 12, 2026',mins:2,quote:'The market doesn’t need a pitch deck. It needs a neighbour who shows up.',body:[
 'ConnectWorld’s Lagos expansion moves to Balogun and Mile 12 markets this month, and the team is posting five scout bounties to the board: find, verify and onboard five market vendors each.',
 'Scouts earn 50 Toro$ per completed onboarding bundle, plus a field bonus for vendors still transacting after thirty days. It is deliberately entry-level work — no code, no capital, just trust and legwork.',
 'Every onboarded vendor gets a gasless wallet, a QR stand, and a fifteen-minute walkthrough in their language. The scout’s Integrity Score rises with each verified storefront, which unlocks higher-paying field bounties across the ecosystem.',
 'Champions and Country Leads: this is your home turf. Ambassador-verified onboardings count double toward your tier progression.',
 'The bounties are live now under ConnectWorld on the task board. Bring photos, bring consent forms, bring patience — and claim fast; the last Lagos batch filled in under a day.']},
 {id:'n4',project:'plastoken',title:'Plastoken launches its first recycling bounty',dek:'Collect, weigh, verify, earn. Plastic in, Toro$ out — the receipt is the revolution.',author:'Plastoken Labs',date:'Nov 10, 2026',mins:3,quote:'Plastic in, Toro$ out. The receipt is the revolution.',body:[
 'Plastoken’s recycling loop goes live this week: collect, weigh, verify, earn. The first bounty batch pays Aspirers in Toro$ for verified kilogram drop-offs at partner collection points in Accra and Lagos.',
 'The flow is simple. A collector registers a drop-off with a photo and scale reading; a local verifier countersigns; the smart contract releases Toro$ from escrow. The entire loop is gasless, and every step is visible on-chain.',
 'To keep quality high, Plastoken’s core contract is undergoing a community audit right now — a 500 Toro$ bounty on the board, open to Aspirers with Integrity 70+. Findings are public, patches are rewarded, and the audit report ships with the launch.',
 'Five collection points are live at launch, with scout bounties open for ten more across West Africa. Ambassadors who host a collection point earn per verified kilogram.',
 'If you have ever wanted proof that doing good and earning well can be the same transaction, this is the pilot to watch.']},
 {id:'n5',project:'agrifi',title:'How Aspirers are funding the harvest: AgriFi’s field report',dek:'Sixty-two farmers, thirty-one bounties, one seasonal bonus loop. The closest thing to collateral is a neighbour’s Integrity Score.',author:'AgriFi Field Desk',date:'Nov 6, 2026',mins:5,quote:'The closest thing to collateral is a neighbour’s Integrity Score.',body:[
 'Sixty-two farmers in Oyo State received their first milestone funding this quarter — not from a bank, but from Aspirers who translated, mapped, and verified their way into the AgriFi pipeline.',
 'The work was unglamorous and essential: translating the onboarding guide into Yoruba and Hausa, GPS-mapping plot boundaries, photographing storage conditions, and interviewing co-op leaders. Every task was a bounty; every bounty paid Toro$ on verification.',
 'AgriFi’s model routes a share of harvest proceeds back to the Aspirers who did the groundwork — a seasonal bonus that turns one-off tasks into recurring relationships. The top field contributor this quarter earned 1,840 Toro$ across 31 bounties.',
 'Repayment is not enforced by courts but by community: co-ops vouch for members, and Integrity Scores carry the history. Default rates in the pilot sit at 2.1%, against a regional smallholder average above twelve percent.',
 'The Yoruba guide translation bounty is still open, and the Hausa voiceover just posted. If you speak the language of the harvest, AgriFi is hiring the whole community.']},
 {id:'n6',project:'toroforge',title:'ToroForge ships the Toro$ tipping widget SDK',dek:'Three lines of code, gasless sponsorship, Integrity badges. Tipping is the smallest bounty — it still runs on trust.',author:'ToroForge DevRel',date:'Nov 3, 2026',mins:4,quote:'Tipping is the smallest bounty. It still runs on trust.',body:[
 'Any ToroForge app can now accept Toro$ tips with three lines of code. The tipping widget SDK shipped Tuesday, complete with gasless sponsorship, Integrity badges, and a drop-in dark theme.',
 'The widget reads the recipient’s Integrity Score straight from the chain and renders it beside their handle — so supporters can see, at a glance, that the person they’re tipping actually delivers.',
 'Early integrations include a community radio player in Abeokuta where listeners tip storytellers, a Yoruba poetry board, and the ToroTeams Academy itself, where learners tip mentors after sessions.',
 'The SDK is MIT-licensed, and the integration bounty — 400 Toro$, Integrity 65+ — is live for developers who want to build the reference widget for ConnectWorld storefronts.',
 'Docs, samples and the Figma kit are in the ToroForge repo. Ship something warm.']},
];
export const FAQ: { q: string; a: string }[] = [
 {q:'What is ToroTeams?',a:'A Work & Funding Engine for the ToroNet community. It is where Aspirers earn Toro$ by doing real work for Builders and Fulfillers, and where Ambassadors grow the network.'},
 {q:'Do I need to be a developer to join?',a:'Not at all. The ToroNet community is versatile. You can earn by translating documents for AgriFi, onboarding merchants for ConnectWorld, designing graphics for ToroForge, or organizing recycling drives for Plastoken.'},
 {q:'What is the Integrity Score?',a:'It is a trust metric for every member of the community. The higher your score, the more trusted you are. Builders can set a minimum Integrity Score for their bounties to ensure quality — and a high score unlocks higher-paying bounties and Ambassador status.'},
 {q:'How do I become an Ambassador?',a:'Build your Integrity Score, complete bounties, and apply through the Ambassadors page. We look for community leaders who are already actively building the Aspirations Economy.'},
 {q:'Is Toro$ a loan or a grant?',a:'Neither. Rule 4: ToroNet doesn’t lend, grant or guarantee. It enables everyone of them to come together around your aspiration. Bounties are work-for-reward agreements, and Rule 1 keeps every term clear and locked in escrow before work begins.'},
];

/** Fresh demo state (used on first visit or after a reset). */
export function seed(): AppState {
  const t=now();
  const B=(id: string,title: string,desc: string,project: ProjectId,cat: Category,reward: number,minInt: number,builder: string,bInt: number,term: string,dAgo: number): Bounty=>({id,title,desc,project,cat,reward,minInt,builder:{name:builder,integrity:bInt},status:'open',claimer:null,delivery:null,dueAt:null,mine:false,createdAt:t-dAgo*3600e3,review:null,terms:[term,'Submit a proof link plus a short delivery note.','Builder reviews within 48h — payment releases automatically on approval.'],simClaimAt:null,simDeliverAt:null});
  const bounties=[
    B('b1','Audit the new Plastoken smart contract','Audit the Plastoken recycling-rewards escrow contract. Deliver a severity-ranked findings report with patch suggestions and a re-test summary.','torobuild','Tech',500,70,'ToroBuild Core',94,'Report covers all external functions and the paymaster hook.',5),
    B('b2','Onboard 5 local market vendors to ConnectWorld','Find and onboard five market vendors in Lagos (Balogun or Mile 12). Submit wallet IDs plus a consented photo of each storefront.','connectworld','Field',50,0,'ConnectWorld Field',88,'Vendors complete one live QR payment during onboarding.',9),
    B('b3','Translate AgriFi farmer onboarding guide into Yoruba','Translate the 12-page AgriFi farmer onboarding guide into Yoruba. Keep the tone friendly and idiomatic; the glossary is provided.','agrifi','Language',100,30,'AgriFi Field Desk',91,'Glossary terms match the approved AgriFi lexicon.',14),
    B('b4','Design 3 social graphics for “Happiness with Toro”','Design three 1080×1080 social graphics for the Happiness with Toro campaign. Bold, warm, community-first. Deliver source files plus exports.','community','Creative',150,40,'ToroNet Community',86,'Source files (Figma or PSD) included with exports.',20),
    B('b5','Host a ConnectWorld merchant meetup in Ibadan','Host a 20-person merchant meetup in Ibadan. Cover wallets, QR stands and first payments. Submit attendee list and photos with consent.','connectworld','Field',120,45,'Femi Balogun',79,'At least 15 verified attendees with wallet IDs.',26),
    B('b6','Write the Plastoken recycling bounty launch post','Write the launch announcement for Plastoken’s first recycling bounty (600–800 words). Interview one collection-point verifier for a quote.','plastoken','Content',90,25,'Plastoken Labs',84,'One verified verifier quote included.',30),
    B('b7','Build a Toro$ tipping widget for ToroForge apps','Implement the reference tipping widget from the ToroForge SDK spec: gasless sponsorship, Integrity badge, dark theme. Ship a demo page.','toroforge','Tech',400,65,'ToroForge DevRel',92,'Passes the SDK conformance checklist.',38),
    B('b8','Scout 5 recycling points in Accra for Plastoken','Identify and verify five candidate collection points in Accra. Submit GPS pins, photos, opening hours and a contact for each site.','plastoken','Field',60,15,'Abena Boateng',76,'Each site has a named local contact.',44),
    B('b9','Record AgriFi explainer voiceover in Hausa','Record the 4-minute AgriFi explainer script in Hausa. Clear, warm, broadcast-ready audio. Deliver WAV plus a transcript.','agrifi','Language',80,20,'AgriFi Field Desk',91,'Audio peaks under -3dB with no clipping.',50),
    B('b10','QA the ToroNet Wallet onboarding flow on Android','Run the 22-step wallet onboarding test plan on two Android devices. File issues with screen recordings and severity labels.','torobuild','Tech',180,50,'ToroBuild Core',94,'Both devices tested on the current release build.',58),
    B('b11','Mentor a first-time Aspirer through their first bounty','Guide a new Aspirer from wallet setup to their first verified delivery. Submit a short reflection plus their completed bounty link.','community','Community',70,60,'Ngozi Abara',82,'Mentee’s first bounty reaches verified status.',64),
    B('b12','Localize ConnectWorld receipt UI to Swahili','Translate and fit-test the receipt and payment-confirmation screens into Swahili. Flag any string that overflows the layout.','connectworld','Language',110,35,'ConnectWorld Field',88,'All 46 strings fit without truncation.',70),
    B('b13','Shoot 10 photos of vendors using ConnectWorld','Capture ten natural, consented photos of market vendors accepting ConnectWorld payments. Warm light, real moments, no stock feel.','connectworld','Creative',130,30,'Kwame Osei',77,'Model releases attached for every frame.',78),
    B('b14','Draft the ToroTeams Cohort 2 community FAQ','Draft a 15-question FAQ for Incubator Cohort 2 applicants, grounded in the program docs. Friendly, precise, zero jargon.','community','Content',85,20,'ToroTeams Programs',89,'Answers cite the canonical program docs.',86),
  ];
  const rng=mulberry32(7);
  const FIRST=['Adéọlá','Tunde','Amara','Kofi','Zainab','Chidi','Aisha','Emeka','Ngozi','Femi','Yemi','Kwame','Abena','Kojo','Wanjiru','Otieno','Amina','Musa','Ibrahim','Fatima','Diego','Lucía','Mateo','Sofia','Linh','Thao','Arjun','Priya','Ravi','Meera','Santiago','Valentina','Tomás','Camila','Nia','Zola','Thabo','Lerato','Sipho','Naledi','Hana','Yusuf','Layla','Omar','Sara','Elena','Marco','Ines','Kai','Mira'];
  const LAST=['Oyelaran','Adeyemi','Nwosu','Mensah','Bello','Okafor','Mohammed','Eze','Abara','Balogun','Osei','Boateng','Kamau','Odhiambo','Sani','Abubakar','Ramírez','Torres','Nguyen','Tran','Sharma','Patel','Silva','Santos','Dlamini','Mokoena','Kim','Haddad','Rossi','Costa'];
  const REG=['Lagos, NG','Accra, GH','Nairobi, KE','Ibadan, NG','Kano, NG','Johannesburg, ZA','São Paulo, BR','Mexico City, MX','Mumbai, IN','Hanoi, VN','Cairo, EG','Abidjan, CI','Dar es Salaam, TZ','Kigali, RW','London, UK','Berlin, DE'];
  const pids=Object.keys(P) as ProjectId[];
  const members: Member[]=FIRST.map((f,i)=>{
    const integrity=clamp(Math.round(98-i*1.05+(rng()-.5)*6),42,99);
    const earned=Math.round(integrity*62+rng()*2200);
    const tier: TierId|null=integrity>=85&&earned>5200?'regional':integrity>=72?'lead':integrity>=60?'champion':null;
    return {id:'u'+i,name:f+' '+LAST[i%LAST.length],handle:'@'+f.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')+'_'+(10+i),project:pids[Math.floor(rng()*pids.length)],earned,integrity,tier,region:REG[Math.floor(rng()*REG.length)]};
  }).sort((a,b)=>b.integrity-a.integrity||b.earned-a.earned);
  return {
    v:1,fresh:true,muted:false,seenGuide:false,subscribed:false,
    wallet:{connected:false,name:'Adéwálé Oyelaran',handle:'@ade_aspires',address:'0x7A4f…9c2E',region:'Lagos, NG',balance:320,earned:0,integrity:58,verified:true},
    bounties,members,watch:[],
    savedViews:[{id:'v1',name:'Field work',project:'all',cat:'Field',q:'',sort:'reward',elig:false},{id:'v2',name:'No-code friendly',project:'all',cat:'all',q:'',sort:'minint',elig:false}],
    courses:{},apps:{incubator:{status:'none',dueAt:null,name:'',pitch:'',focus:'',milestones:[{label:'Prototype',amount:500,state:'todo',dueAt:null},{label:'Beta',amount:750,state:'todo',dueAt:null},{label:'Launch',amount:1250,state:'todo',dueAt:null}]},mentors:{},hacks:{}},
    ambassador:{status:'none',tier:null,dueAt:null,region:'',city:'',why:'',earned:0,onboarded:0,verified:0,activities:[]},
    newsRead:{},
  };
}
