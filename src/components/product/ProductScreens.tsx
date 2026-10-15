/**
 * Product UI mockups. Each screen is laid out at a fixed 1280×800 design size;
 * <ScreenFrame> scales it to fit its container. Sample data is illustrative only.
 *
 * Shared app chrome: dark global bar (org switcher, search, quick create, alerts),
 * grouped sidebar with counts, and a page header with breadcrumbs and tabs.
 */
import { Search, Bell, HelpCircle, Plus, ChevronDown, Wifi, Printer, ScanLine, Clock, Users, Minus, Smartphone, Banknote, CreditCard, MoreHorizontal, ArrowUpRight, ArrowDownRight, Filter, Download, CalendarDays, Phone, MessageCircle, BedDouble, Wrench, Sparkles } from "lucide-react";
import { AppIcon } from "@/components/brand/AppIcon";
import { NetworkMark } from "@/components/brand/Logo";
import { getApp } from "@/lib/apps";
import { cn } from "@/lib/cn";

export type ScreenId = "dashboard" | "pos" | "crm" | "clinic" | "inventory" | "invoice" | "restaurant" | "people" | "stay" | "loan";

type NavItem = [label: string, app: string, count?: string];
type NavGroup = [title: string, items: NavItem[]];

const nav: Record<ScreenId, { org: string; groups: NavGroup[]; active: string }> = {
  dashboard: { org: "Sri Balaji Stores", active: "Overview", groups: [["Home", [["Overview", "analytics"], ["Reports", "reports"]]], ["Sell", [["POS", "pos"], ["Invoices", "billing", "12"], ["Customers", "crm"]]], ["Operate", [["Inventory", "inventory", "7"], ["Purchase", "purchase"], ["People", "people"]]]] },
  pos: { org: "Sri Balaji Stores", active: "POS", groups: [["Home", [["Overview", "analytics"]]], ["Sell", [["POS", "pos"], ["Invoices", "billing", "12"], ["Customers", "crm"], ["Loyalty", "loyalty"]]], ["Operate", [["Inventory", "inventory", "7"], ["Purchase", "purchase"], ["Reports", "reports"]]]] },
  inventory: { org: "Sri Balaji Stores", active: "Items", groups: [["Home", [["Overview", "analytics"]]], ["Stock", [["Items", "inventory"], ["Transfers", "fleet", "2"], ["Purchase orders", "purchase", "5"], ["Vendors", "crm"]]], ["Insights", [["Reports", "reports"]]]] },
  invoice: { org: "Velan Traders", active: "Invoices", groups: [["Home", [["Overview", "analytics"]]], ["Sales", [["Quotes", "quotes"], ["Invoices", "billing"], ["Payments", "pay", "4"], ["Customers", "crm"]]], ["Money", [["Expenses", "expense"], ["Reports", "reports"]]]] },
  crm: { org: "Camus Labs", active: "Deals", groups: [["Home", [["Overview", "analytics"]]], ["Sales", [["Leads", "leads", "18"], ["Deals", "crm"], ["Quotes", "quotes"], ["Campaigns", "campaigns"]]], ["Engage", [["Inbox", "inbox", "6"], ["Reports", "reports"]]]] },
  clinic: { org: "Arun Multispeciality Clinic", active: "Appointments", groups: [["Home", [["Overview", "analytics"]]], ["Front desk", [["Appointments", "bookings", "28"], ["Patients", "clinic"], ["Billing", "billing"]]], ["Clinic", [["Pharmacy", "pharmacy"], ["Staff", "people"], ["Reports", "reports"]]]] },
  restaurant: { org: "Green Leaf Kitchen", active: "Tables", groups: [["Home", [["Overview", "analytics"]]], ["Service", [["Tables", "restaurant-pos"], ["Orders", "pos", "9"], ["Kitchen", "desk", "3"]]], ["Back office", [["Menu", "commerce"], ["Stock", "inventory"], ["Reports", "reports"]]]] },
  people: { org: "Sri Balaji Stores", active: "Attendance", groups: [["Home", [["Overview", "analytics"]]], ["People", [["Employees", "people"], ["Attendance", "attendance"], ["Leave", "approvals", "2"], ["Payroll", "payroll"]]], ["Insights", [["Reports", "reports"]]]] },
  stay: { org: "Palm Residency", active: "Rooms & beds", groups: [["Home", [["Overview", "analytics"]]], ["Property", [["Rooms & beds", "stay"], ["Residents", "people"], ["Rent & dues", "pay", "4"], ["Complaints", "desk", "3"]]], ["Insights", [["Reports", "reports"]]]] },
  loan: { org: "Sri Lakshmi Gold Finance", active: "Pledges", groups: [["Home", [["Overview", "analytics"]]], ["Lending", [["Pledges", "gold-loan"], ["Customers", "crm"], ["Receipts", "billing"], ["Overdues", "pay", "27"]]], ["Insights", [["Day book", "books"], ["Reports", "reports"]]]] },
};

/* ───────────── primitives ───────────── */

const avatarTones = ["#2C6E9E", "#1F9D6C", "#B87308", "#7A5AF8", "#C2412D", "#0E7490", "#BE185D"];
function Avatar({ name, size = 30, className }: { name: string; size?: number; className?: string }) {
  const initials = name.split(/\s+/).map((w) => w[0]).filter((c) => /[A-Za-z]/.test(c ?? "")).slice(0, 2).join("").toUpperCase();
  const tone = avatarTones[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % avatarTones.length];
  return <span className={cn("grid shrink-0 place-items-center rounded-full font-semibold text-white ring-2 ring-white", className)} style={{ width: size, height: size, fontSize: size * 0.38, background: `linear-gradient(135deg, ${tone}, ${tone}CC)` }}>{initials}</span>;
}

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("rounded-[14px] border border-[#E4E9F0] bg-white shadow-[0_1px_2px_rgba(16,39,58,0.04),0_4px_14px_-6px_rgba(16,39,58,0.08)]", className)}>{children}</div>
);

type Tone = "green" | "amber" | "blue" | "grey" | "red" | "violet";
const toneCls: Record<Tone, string> = { green: "bg-[#E7F6EF] text-[#137A52]", amber: "bg-[#FDF2DF] text-[#9A5B05]", blue: "bg-[#E8F1F9] text-[#235A82]", grey: "bg-[#F0F2F5] text-[#4F5662]", red: "bg-[#FDECEA] text-[#B42318]", violet: "bg-[#F0ECFE] text-[#5B3FD1]" };
const dotCls: Record<Tone, string> = { green: "bg-[#1F9D6C]", amber: "bg-[#E59A1C]", blue: "bg-[#2C6E9E]", grey: "bg-[#98A2B3]", red: "bg-[#D92D20]", violet: "bg-[#7A5AF8]" };
function Chip({ tone, children, dot = true }: { tone: Tone; children: React.ReactNode; dot?: boolean }) {
  return <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[12px] font-semibold", toneCls[tone])}>{dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotCls[tone])} />}{children}</span>;
}

function Btn({ children, primary, icon: Icon }: { children?: React.ReactNode; primary?: boolean; icon?: React.ComponentType<{ size?: number; strokeWidth?: number }> }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-[9px] px-3.5 py-2 text-[13px] font-semibold", primary ? "bg-[#2C6E9E] text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_4px_10px_-4px_rgba(44,110,158,0.7)]" : "border border-[#DDE3EA] bg-white text-[#344054]")}>
      {Icon && <Icon size={15} strokeWidth={2.2} />}{children}
    </span>
  );
}

function Delta({ up, children }: { up: boolean; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[12px] font-semibold", up ? "bg-[#E7F6EF] text-[#137A52]" : "bg-[#FDECEA] text-[#B42318]")}>{up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{children}</span>;
}

function Spark({ data, color = "#2C6E9E", w = 96, h = 32 }: { data: number[]; color?: string; w?: number; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 6)]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const id = `sp${color.slice(1)}${data.length}${data[0]}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity="0.25" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AreaChart({ a, b, labels, w, h, max }: { a: number[]; b?: number[]; labels: string[]; w: number; h: number; max: number }) {
  const x = (i: number) => 40 + (i / (a.length - 1)) * (w - 52);
  const y = (v: number) => 10 + (1 - v / max) * (h - 34);
  const line = (s: number[]) => s.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs><linearGradient id="areaA" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2C6E9E" stopOpacity="0.28" /><stop offset="1" stopColor="#2C6E9E" stopOpacity="0" /></linearGradient></defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}><line x1="40" x2={w - 12} y1={y(max * t)} y2={y(max * t)} stroke="#EEF1F5" /><text x="0" y={y(max * t) + 4} fontSize="11" fill="#98A2B3">₹{Math.round((max * t) / 1000)}K</text></g>
      ))}
      {b && <path d={line(b)} fill="none" stroke="#B8CDE0" strokeWidth="2" strokeDasharray="5 5" />}
      <path d={`${line(a)} L${x(a.length - 1)} ${h - 24} L${x(0)} ${h - 24} Z`} fill="url(#areaA)" />
      <path d={line(a)} fill="none" stroke="#2C6E9E" strokeWidth="2.6" strokeLinejoin="round" />
      {a.map((v, i) => i === a.length - 1 && <g key={i}><circle cx={x(i)} cy={y(v)} r="6" fill="#fff" stroke="#2C6E9E" strokeWidth="2.6" /></g>)}
      {labels.map((l, i) => <text key={l} x={x(i)} y={h - 6} fontSize="11" fill="#98A2B3" textAnchor="middle">{l}</text>)}
    </svg>
  );
}

function Donut({ parts, size = 120, stroke = 16, label, sub }: { parts: [number, string][]; size?: number; stroke?: number; label: string; sub: string }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  let off = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF1F5" strokeWidth={stroke} />
        {parts.map(([v, col], i) => { const len = (v / 100) * c; const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeDasharray={`${len - 2} ${c - len + 2}`} strokeDashoffset={-off} />; off += len; return el; })}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center"><span className="text-[20px] font-bold leading-none">{label}</span><span className="mt-1 text-[11px] font-medium text-[#667085]">{sub}</span></div>
    </div>
  );
}

const Th = ({ children, className }: { children?: React.ReactNode; className?: string }) => <span className={cn("text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8A94A6]", className)}>{children}</span>;

function Kpi({ label, value, delta, up = true, spark, color }: { label: string; value: string; delta: string; up?: boolean; spark: number[]; color?: string }) {
  return (
    <Card className="flex flex-col gap-2 px-4 py-3.5">
      <span className="text-[12.5px] font-medium text-[#667085]">{label}</span>
      <div className="flex items-end justify-between gap-2"><span className="text-[23px] font-semibold leading-none tracking-tight">{value}</span><Spark data={spark} color={color} w={78} h={28} /></div>
      <span className="flex items-center gap-1.5 text-[12px] text-[#667085]"><Delta up={up}>{delta}</Delta>vs last week</span>
    </Card>
  );
}

/* ───────────── shell ───────────── */

function Shell({ id, crumbs, title, sub, actions, tabs, children }: { id: ScreenId; crumbs: string; title: string; sub?: string; actions?: React.ReactNode; tabs?: [string, string?][]; children: React.ReactNode }) {
  const n = nav[id];
  return (
    <div className="flex h-[800px] w-[1280px] flex-col bg-[#F3F6F9] text-left text-[#101828]" style={{ fontFamily: "var(--font-body)" }}>
      {/* global bar */}
      <div className="flex h-[52px] shrink-0 items-center gap-4 bg-[#10273A] px-4 text-white">
        <span className="flex items-center gap-2"><NetworkMark className="h-7 w-7" /><span className="text-[15px] font-bold tracking-wide">Camus</span></span>
        <span className="h-5 w-px bg-white/15" />
        <span className="flex items-center gap-2 rounded-lg px-2 py-1 text-[13px] font-semibold text-[#DCE7F1]"><span className="grid h-6 w-6 place-items-center rounded-md bg-[#F0B44C] text-[11px] font-bold text-[#10273A]">{n.org[0]}</span>{n.org}<ChevronDown size={14} className="opacity-70" /></span>
        <span className="ml-6 flex w-[400px] items-center gap-2 rounded-[9px] bg-white/[0.08] px-3 py-[7px] text-[13px] text-[#9FB3C6] ring-1 ring-white/10"><Search size={15} />Search bills, items, customers…<span className="ml-auto rounded border border-white/15 px-1.5 text-[11px] font-semibold">Ctrl K</span></span>
        <span className="ml-auto flex items-center gap-1.5 rounded-[9px] bg-[#3D85B8] px-3 py-[7px] text-[13px] font-semibold"><Plus size={15} strokeWidth={2.5} />Create</span>
        <span className="relative grid h-8 w-8 place-items-center rounded-lg text-[#C8D6E3]"><Bell size={18} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#F04438] ring-2 ring-[#10273A]" /></span>
        <span className="grid h-8 w-8 place-items-center rounded-lg text-[#C8D6E3]"><HelpCircle size={18} /></span>
        <Avatar name="Pandian Owner" size={30} className="ring-[#10273A]" />
      </div>
      <div className="flex min-h-0 flex-1">
        {/* sidebar */}
        <aside className="flex w-[214px] shrink-0 flex-col border-r border-[#E4E9F0] bg-white px-3 py-4">
          {n.groups.map(([g, items]) => (
            <div key={g} className="mb-3">
              <p className="px-2.5 pb-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">{g}</p>
              {items.map(([label, app, count]) => {
                const on = label === n.active;
                return (
                  <span key={label} className={cn("relative flex items-center gap-2.5 rounded-[9px] px-2.5 py-[7px] text-[13.5px]", on ? "bg-[#EAF2F8] font-semibold text-[#1C4A6E]" : "font-medium text-[#475467]")}>
                    {on && <span className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[#2C6E9E]" />}
                    <AppIcon app={getApp(app)!} inverted={on} className="h-[22px] w-[22px]" />{label}
                    {count && <span className={cn("ml-auto rounded-full px-1.5 text-[11px] font-bold", on ? "bg-[#2C6E9E] text-white" : "bg-[#F0F2F5] text-[#475467]")}>{count}</span>}
                  </span>
                );
              })}
            </div>
          ))}
          <div className="mt-auto rounded-xl bg-gradient-to-br from-[#EAF2F8] to-[#F6F9FC] p-3 ring-1 ring-[#DCE7F1]">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1C4A6E]"><Sparkles size={13} />Camus AI</p>
            <p className="mt-1 text-[11.5px] leading-snug text-[#475467]">Ask &ldquo;What sold most this week?&rdquo;</p>
          </div>
          <p className="mt-3 flex items-center gap-1.5 px-1 text-[11.5px] font-medium text-[#667085]"><span className="h-1.5 w-1.5 rounded-full bg-[#1F9D6C]" />All changes synced</p>
        </aside>
        {/* main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="shrink-0 border-b border-[#E4E9F0] bg-white px-6 pt-3.5">
            <p className="text-[12px] font-medium text-[#8A94A6]">{crumbs}</p>
            <div className="flex items-center gap-3 pb-3 pt-0.5">
              <div className="min-w-0 flex-1"><p className="text-[20px] font-semibold tracking-tight">{title}</p>{sub && <p className="text-[12.5px] font-medium text-[#667085]">{sub}</p>}</div>
              {actions}
            </div>
            {tabs && (
              <div className="-mb-px flex gap-5">
                {tabs.map(([t, c], i) => <span key={t} className={cn("flex items-center gap-1.5 border-b-2 pb-2.5 text-[13px] font-semibold", i === 0 ? "border-[#2C6E9E] text-[#1C4A6E]" : "border-transparent text-[#667085]")}>{t}{c && <span className={cn("rounded-full px-1.5 text-[11px]", i === 0 ? "bg-[#EAF2F8] text-[#2C6E9E]" : "bg-[#F0F2F5]")}>{c}</span>}</span>)}
              </div>
            )}
          </header>
          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── screens ───────────── */

function Dashboard() {
  return (
    <Shell id="dashboard" crumbs="Home / Overview" title="Good morning, Pandian 👋" sub="Thursday, 15 October · 3 branches · live" actions={<><Btn icon={CalendarDays}>This week</Btn><Btn icon={ChevronDown}>All branches</Btn><Btn primary icon={Download}>Export</Btn></>}>
      <div className="flex h-full flex-col gap-4 p-5">
        <div className="grid grid-cols-4 gap-3.5">
          <Kpi label="Sales today" value="₹48,250" delta="12.4%" spark={[22, 28, 25, 31, 29, 36, 41]} />
          <Kpi label="Bills" value="186" delta="5.1%" spark={[140, 152, 149, 160, 171, 168, 186]} color="#1F9D6C" />
          <Kpi label="Dues pending" value="₹1.12L" delta="3.2%" up={false} spark={[90, 96, 101, 99, 104, 108, 112]} color="#D92D20" />
          <Kpi label="Avg. bill value" value="₹259" delta="7.8%" spark={[221, 230, 228, 236, 244, 251, 259]} color="#7A5AF8" />
        </div>
        <div className="flex min-h-0 flex-1 gap-3.5">
          <Card className="flex flex-1 flex-col p-4">
            <div className="flex items-center gap-3"><span className="flex-1 text-[15px] font-semibold">Sales trend</span><span className="flex items-center gap-1.5 text-[12px] text-[#667085]"><span className="h-2 w-2 rounded-full bg-[#2C6E9E]" />This week</span><span className="flex items-center gap-1.5 text-[12px] text-[#667085]"><span className="h-0.5 w-3 bg-[#B8CDE0]" />Last week</span></div>
            <p className="mt-1 text-[24px] font-semibold tracking-tight">₹2,91,400 <span className="align-middle"><Delta up>14.2%</Delta></span></p>
            <div className="mt-2"><AreaChart w={680} h={196} max={60000} a={[32000, 41000, 38000, 45000, 43000, 52000, 48250]} b={[30000, 34000, 36000, 33000, 39000, 42000, 41000]} labels={["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"]} /></div>
          </Card>
          <Card className="flex w-[300px] flex-col p-4">
            <span className="text-[15px] font-semibold">Payment modes</span>
            <div className="mt-3 flex items-center gap-4">
              <Donut size={104} stroke={14} parts={[[58, "#2C6E9E"], [27, "#7AA7C7"], [15, "#F0B44C"]]} label="₹48K" sub="today" />
              <div className="flex flex-col gap-2 text-[12.5px]">{[["UPI", "58%", "#2C6E9E"], ["Cash", "27%", "#7AA7C7"], ["Card", "15%", "#F0B44C"]].map(([l, v, c]) => <span key={l} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} /><span className="w-10 text-[#475467]">{l}</span><b>{v}</b></span>)}</div>
            </div>
            <span className="mt-3 text-[13px] font-semibold">Branches</span>
            {[["Anna Nagar", "₹21,400", 88], ["T. Nagar", "₹16,850", 69], ["Velachery", "₹9,999", 41]].map(([b, v, p]) => (
              <div key={b as string} className="mt-1.5"><div className="flex text-[12.5px]"><span className="flex-1 font-medium text-[#475467]">{b}</span><b>{v}</b></div><div className="mt-1 h-1.5 rounded-full bg-[#EEF1F5]"><div className="h-1.5 rounded-full bg-gradient-to-r from-[#2C6E9E] to-[#7AA7C7]" style={{ width: `${p}%` }} /></div></div>
            ))}
          </Card>
        </div>
        <Card className="px-4 pb-1 pt-3">
          <div className="flex items-center pb-2"><span className="flex-1 text-[14px] font-semibold">Recent bills</span><span className="text-[12.5px] font-semibold text-[#2C6E9E]">View all →</span></div>
          {[["Lakshmi R.", "INV-2041 · Anna Nagar", "₹1,240", "UPI", "green", "Paid"], ["Priya Stores", "INV-2040 · T. Nagar", "₹8,560", "Credit", "amber", "Due in 3 days"]].map(([n, m, a, mode, t, s]) => (
            <div key={n} className="flex items-center gap-3 border-t border-[#EEF1F5] py-2 text-[13px]"><Avatar name={n} size={28} /><div className="flex-1"><p className="font-semibold">{n}</p><p className="text-[11.5px] text-[#8A94A6]">{m}</p></div><span className="w-[70px] text-[#475467]">{mode}</span><b className="w-[80px] text-right">{a}</b><span className="flex w-[120px] justify-end"><Chip tone={t as Tone}>{s}</Chip></span></div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}

function POS() {
  const items: [string, string, string, string, string][] = [["Basmati Rice 5kg", "₹645", "#F6EEDF", "🍚", "42 left"], ["Toor Dal 1kg", "₹168", "#FBF1CF", "🫘", "6 left"], ["Fresh Milk 1L", "₹62", "#E7F1FA", "🥛", "18 left"], ["Sunflower Oil 1L", "₹155", "#FBF3D6", "🫙", "88 left"], ["Filter Coffee 500g", "₹290", "#F1E4D8", "☕", "26 left"], ["Wheat Atta 5kg", "₹265", "#F3ECE1", "🌾", "41 left"], ["Biscuits Pack", "₹40", "#FBEADB", "🍪", "120 left"], ["Green Tea 100g", "₹199", "#E3F2E5", "🍵", "4 left"]];
  return (
    <Shell id="pos" crumbs="Sell / POS / Counter 1" title="New bill · #INV-2042" sub="Cashier: Ravi · Anna Nagar" actions={<><Chip tone="green">Shift open · ₹8,400 cash</Chip><Btn icon={Clock}>Held bills (2)</Btn></>}>
      <div className="flex h-full gap-4 p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-[#3D85B8] bg-white px-3.5 py-2.5 text-[14px] text-[#8A94A6] shadow-[0_0_0_4px_rgba(61,133,184,0.12)]"><ScanLine size={18} className="text-[#2C6E9E]" />Scan barcode or search items…<span className="ml-auto rounded border border-[#DDE3EA] px-1.5 text-[11px] font-semibold">F2</span></div>
          <div className="flex gap-2">{[["All", "248"], ["Groceries", "96"], ["Dairy", "24"], ["Snacks", "41"], ["Beverages", "38"], ["Personal care", "49"]].map(([c, k], i) => <span key={c} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold", i === 0 ? "bg-[#10273A] text-white" : "border border-[#DDE3EA] bg-white text-[#475467]")}>{c}<span className={i === 0 ? "text-[#9FB3C6]" : "text-[#98A2B3]"}>{k}</span></span>)}</div>
          <div className="grid grid-cols-4 gap-3">
            {items.map(([n, p, c, e, s]) => (
              <Card key={n} className="flex flex-col gap-2 p-2.5">
                <div className="relative grid h-[70px] place-items-center rounded-[10px] text-[36px]" style={{ background: c }}>{e}<span className={cn("absolute right-1.5 top-1.5 rounded-md bg-white/90 px-1.5 text-[10.5px] font-bold", s.startsWith("4 ") || s.startsWith("6 ") ? "text-[#B42318]" : "text-[#475467]")}>{s}</span></div>
                <span className="truncate text-[12.5px] font-semibold">{n}</span>
                <div className="flex items-center"><span className="flex-1 text-[14px] font-bold text-[#1C4A6E]">{p}</span><span className="grid h-6 w-6 place-items-center rounded-md bg-[#EAF2F8] text-[#2C6E9E]"><Plus size={14} strokeWidth={2.6} /></span></div>
              </Card>
            ))}
          </div>
          <div className="mt-auto flex gap-4 text-[12px] font-medium text-[#667085]"><span className="flex items-center gap-1.5"><Printer size={14} className="text-[#1F9D6C]" />Printer ready</span><span className="flex items-center gap-1.5"><ScanLine size={14} className="text-[#1F9D6C]" />Scanner connected</span><span className="flex items-center gap-1.5"><Wifi size={14} className="text-[#1F9D6C]" />Online</span></div>
        </div>
        <Card className="flex w-[350px] flex-col p-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-[#F6F9FC] p-2.5 ring-1 ring-[#E4E9F0]"><Avatar name="Lakshmi Ramesh" size={34} /><div className="flex-1"><p className="text-[13px] font-semibold">Lakshmi Ramesh</p><p className="text-[11.5px] text-[#667085]">98••• ••210 · 14 visits</p></div><Chip tone="violet" dot={false}>★ 320 pts</Chip></div>
          {[["Basmati Rice 5kg", "₹645", 1, "🍚"], ["Fresh Milk 1L", "₹186", 3, "🥛"], ["Filter Coffee 500g", "₹290", 1, "☕"], ["Biscuits Pack", "₹80", 2, "🍪"]].map(([n, a, q, e]) => (
            <div key={n as string} className="flex items-center gap-2.5 border-b border-[#EEF1F5] py-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#F6F9FC] text-[18px]">{e}</span>
              <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold">{n}</p><p className="text-[11.5px] text-[#8A94A6]">GST 5%</p></div>
              <span className="flex items-center gap-1.5 rounded-lg border border-[#DDE3EA] px-1 py-0.5"><Minus size={12} className="text-[#667085]" /><b className="w-3 text-center text-[12px]">{q}</b><Plus size={12} className="text-[#2C6E9E]" /></span>
              <b className="w-[54px] text-right text-[13px]">{a}</b>
            </div>
          ))}
          <div className="mt-auto rounded-xl bg-[#F6F9FC] p-3">
            {[["Subtotal", "₹1,201"], ["GST", "₹60"], ["Loyalty discount", "– ₹11"]].map(([l, v]) => <div key={l} className="flex py-0.5 text-[12.5px]"><span className="flex-1 text-[#667085]">{l}</span><span className="font-medium">{v}</span></div>)}
            <div className="mt-1.5 flex items-center border-t border-dashed border-[#D0D9E3] pt-2"><span className="flex-1 text-[15px] font-semibold">Total</span><span className="text-[24px] font-bold tracking-tight">₹1,250</span></div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">{[[Smartphone, "UPI"], [Banknote, "Cash"], [CreditCard, "Card"]].map(([I, l], i) => { const Ic = I as typeof Smartphone; return <span key={l as string} className={cn("flex flex-col items-center gap-1 rounded-xl py-2.5 text-[12.5px] font-semibold", i === 0 ? "bg-[#2C6E9E] text-white shadow-[0_6px_14px_-6px_rgba(44,110,158,0.8)]" : "border border-[#DDE3EA] text-[#344054]")}><Ic size={18} />{l as string}</span>; })}</div>
          <span className="mt-2.5 rounded-xl bg-[#10273A] py-3 text-center text-[14px] font-semibold text-white">Complete sale · F9</span>
        </Card>
      </div>
    </Shell>
  );
}

function Restaurant() {
  type T = [string, number, "free" | "busy" | "bill" | "kot" | "res", string, string?];
  const tables: T[] = [["T1", 4, "free", "Free"], ["T2", 4, "busy", "₹1,240", "45 min"], ["T3", 2, "res", "Reserved 8:30"], ["T4", 6, "bill", "Bill printed", "1h 05m"], ["T5", 2, "busy", "₹860", "20 min"], ["T6", 4, "kot", "KOT sent · 4", "12 min"], ["T7", 4, "free", "Free"], ["T8", 8, "busy", "₹2,180", "1h"], ["T9", 2, "free", "Free"], ["T10", 4, "busy", "₹540", "10 min"], ["T11", 6, "bill", "Bill printed", "52 min"], ["T12", 4, "free", "Free"]];
  const sty = { free: "border-[#E4E9F0] bg-white", busy: "border-[#BFD6E8] bg-[#F2F7FC]", bill: "border-[#F3D9A6] bg-[#FFF8EC]", kot: "border-[#2C6E9E] bg-[#2C6E9E] text-white shadow-[0_10px_24px_-10px_rgba(44,110,158,0.9)]", res: "border-dashed border-[#C7B8F5] bg-[#F7F4FE]" };
  const txt = { free: "text-[#98A2B3]", busy: "text-[#235A82]", bill: "text-[#9A5B05]", kot: "text-[#DCEAF4]", res: "text-[#5B3FD1]" };
  const Veg = ({ v }: { v: boolean }) => <span className={cn("grid h-3.5 w-3.5 place-items-center rounded-[3px] border-[1.5px]", v ? "border-[#1F9D6C]" : "border-[#B42318]")}><span className={cn("h-1.5 w-1.5 rounded-full", v ? "bg-[#1F9D6C]" : "bg-[#B42318]")} /></span>;
  return (
    <Shell id="restaurant" crumbs="Service / Tables" title="Ground floor" sub="Dinner service · 6 of 12 tables occupied · 22 guests" tabs={[["Ground floor", "12"], ["First floor", "8"], ["Outdoor", "6"], ["Takeaway", "3"], ["Delivery", "5"]]} actions={<><Btn icon={Filter}>Waiter: All</Btn><Btn primary icon={Plus}>New order</Btn></>}>
      <div className="flex h-full gap-4 p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <div className="flex items-center gap-4 text-[12px] font-medium text-[#475467]">
            {[["bg-white border border-[#D0D9E3]", "Free 4"], ["bg-[#DCEAF5]", "Dining 4"], ["bg-[#2C6E9E]", "KOT sent 1"], ["bg-[#FBE3B6]", "Bill printed 2"], ["bg-[#E4DCFB]", "Reserved 1"]].map(([c, l]) => <span key={l} className="flex items-center gap-1.5"><span className={cn("h-3 w-3 rounded", c)} />{l}</span>)}
            <span className="ml-auto flex items-center gap-1.5 text-[#667085]"><Clock size={13} />Avg. table time 48 min</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {tables.map(([t, seats, k, s, time]) => (
              <div key={t} className={cn("relative flex h-[110px] flex-col rounded-[14px] border-[1.5px] p-3", sty[k])}>
                <div className="flex items-start"><span className="text-[19px] font-bold">{t}</span>{time && <span className={cn("ml-auto flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold", k === "kot" ? "bg-white/15 text-white" : "bg-white text-[#475467] ring-1 ring-[#E4E9F0]")}><Clock size={11} />{time}</span>}</div>
                <div className="mt-1 flex gap-1">{Array.from({ length: Math.min(seats, 8) }).map((_, i) => <span key={i} className={cn("h-1.5 w-3 rounded-full", k === "free" || k === "res" ? "bg-[#E4E9F0]" : k === "kot" ? "bg-white/50" : "bg-[#7AA7C7]")} />)}</div>
                <div className="mt-auto flex items-center"><span className={cn("flex-1 text-[13px] font-semibold", txt[k])}>{s}</span>{(k === "busy" || k === "kot" || k === "bill") && <Avatar name={t === "T6" ? "Kumar" : t === "T8" ? "Selvi" : "Arun"} size={22} className={k === "kot" ? "ring-[#2C6E9E]" : ""} />}</div>
              </div>
            ))}
          </div>
          <Card className="flex items-center gap-3 p-3">
            <span className="flex w-[64px] shrink-0 flex-col text-[12.5px] font-semibold leading-tight">Kitchen<span className="text-[11px] font-medium text-[#8A94A6]">3 active</span></span>
            {([["T6", "Paneer Masala ×2", "Cooking", "amber", "8m"], ["T2", "Filter Coffee ×3", "Ready", "green", "1m"], ["#18", "Veg Biryani ×2", "New", "blue", "now"]] as const).map(([t, n, s, tone, m]) => (
              <span key={t} className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-[#F6F9FC] px-2.5 py-2 ring-1 ring-[#E4E9F0]">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[11.5px] font-bold ring-1 ring-[#E4E9F0]">{t}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-semibold">{n}</span><span className="mt-0.5 flex items-center gap-1.5"><Chip tone={tone}>{s}</Chip><span className="text-[11px] text-[#8A94A6]">{m}</span></span></span>
              </span>
            ))}
          </Card>
        </div>
        <Card className="flex w-[330px] flex-col p-4">
          <div className="flex items-center"><div className="flex-1"><p className="text-[16px] font-semibold">Table 6 · KOT #212</p><p className="text-[12px] text-[#667085]">4 guests · seated 7:42 PM</p></div><Avatar name="Kumar" size={30} /></div>
          <div className="mt-3 flex flex-col">
            {[["Paneer Butter Masala", 2, "₹480", true, "🍛"], ["Butter Naan", 4, "₹180", true, "🫓"], ["Chicken 65", 1, "₹260", false, "🍗"], ["Veg Biryani", 1, "₹220", true, "🍚"], ["Fresh Lime Soda", 2, "₹140", true, "🥤"]].map(([n, q, a, v, e]) => (
              <div key={n as string} className="flex items-center gap-2.5 border-b border-[#EEF1F5] py-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#FFF6EA] text-[18px]">{e}</span>
                <div className="min-w-0 flex-1"><p className="flex items-center gap-1.5 truncate text-[13px] font-semibold"><Veg v={v as boolean} />{n}</p><p className="text-[11.5px] text-[#8A94A6]">{q} × ₹{Math.round(parseInt((a as string).replace(/\D/g, "")) / (q as number))}</p></div>
                <b className="text-[13px]">{a}</b>
              </div>
            ))}
          </div>
          <span className="mt-2.5 rounded-lg bg-[#FFF8EC] px-3 py-2 text-[12px] font-semibold text-[#9A5B05] ring-1 ring-[#F3D9A6]">✎ Less spicy · no onion in biryani</span>
          <div className="mt-auto pt-3">
            {[["Subtotal", "₹1,280"], ["CGST 2.5% + SGST 2.5%", "₹64"]].map(([l, v]) => <div key={l} className="flex py-0.5 text-[12.5px]"><span className="flex-1 text-[#667085]">{l}</span><span className="font-medium">{v}</span></div>)}
            <div className="flex items-center border-t border-dashed border-[#D0D9E3] pt-2"><span className="flex-1 text-[15px] font-semibold">Total</span><span className="text-[24px] font-bold tracking-tight">₹1,344</span></div>
            <div className="mt-3 grid grid-cols-2 gap-2"><span className="rounded-xl border border-[#DDE3EA] py-2.5 text-center text-[13px] font-semibold">Print KOT</span><span className="rounded-xl bg-[#2C6E9E] py-2.5 text-center text-[13px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(44,110,158,0.8)]">Generate bill</span></div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function CRM() {
  const cols: [string, string, string, [string, string, string, string, string, string][]][] = [
    ["New enquiry", "#98A2B3", "₹2.75L", [["Sri Murugan Textiles", "POS + Inventory", "₹1.2L", "WhatsApp", "2h ago", "Priya"], ["Green Leaf Cafe", "Restaurant POS", "₹65K", "Website", "5h ago", "Arun"], ["Arun Clinic", "Clinic app", "₹90K", "Referral", "1d ago", "Priya"]]],
    ["Contacted", "#3D85B8", "₹4.2L", [["KVR Jewellers", "Jewel + Billing", "₹2.4L", "Call", "Call back 4 PM", "Kavin"], ["Bright Kids School", "School app", "₹1.8L", "Website", "Sent brochure", "Arun"]]],
    ["Demo booked", "#2C6E9E", "₹4.45L", [["Velan Supermarket", "POS · 3 branches", "₹3.6L", "Walk-in", "Tomorrow 11:00", "Priya"], ["Coastal Stay PG", "Stay app", "₹85K", "WhatsApp", "Fri 4:00 PM", "Kavin"]]],
    ["Proposal", "#E59A1C", "₹4.2L", [["Sun Hardware", "ERP + Purchase", "₹4.2L", "Referral", "Follow up today", "Arun"]]],
    ["Won", "#1F9D6C", "₹1.5L", [["Lotus Pharmacy", "Pharmacy + Billing", "₹1.5L", "Website", "Setup starts Mon", "Priya"]]],
  ];
  return (
    <Shell id="crm" crumbs="Sales / Deals" title="Sales pipeline" sub="42 open deals · ₹18.6L in pipeline · 32% win rate" tabs={[["Board"], ["List"], ["Forecast"], ["Activities", "12"]]} actions={<><div className="flex -space-x-2">{["Priya", "Arun", "Kavin"].map((n) => <Avatar key={n} name={n} size={28} />)}</div><Btn icon={Filter}>This month</Btn><Btn primary icon={Plus}>New deal</Btn></>}>
      <div className="flex h-full gap-3 p-5">
        {cols.map(([name, color, total, deals]) => (
          <div key={name} className="flex min-w-0 flex-1 flex-col gap-2.5 rounded-[14px] bg-[#EAEFF4] p-2.5">
            <div className="px-1"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: color }} /><span className="flex-1 text-[13px] font-semibold">{name}</span><span className="rounded-full bg-white px-1.5 text-[11px] font-bold text-[#475467]">{deals.length}</span></div><p className="mt-0.5 pl-4 text-[12px] font-semibold text-[#667085]">{total}</p><div className="mt-2 h-1 rounded-full" style={{ background: color }} /></div>
            {deals.map(([co, need, val, src, next, owner]) => (
              <Card key={co} className="flex flex-col gap-2 p-3">
                <div className="flex items-start gap-2"><span className="flex-1 text-[13px] font-semibold leading-snug">{co}</span><MoreHorizontal size={15} className="text-[#98A2B3]" /></div>
                <span className="text-[12px] font-medium text-[#667085]">{need}</span>
                <div className="flex items-center gap-1.5"><span className="flex-1 text-[14px] font-bold text-[#1C4A6E]">{val}</span><Chip tone="grey" dot={false}>{src === "WhatsApp" ? <MessageCircle size={11} /> : src === "Call" ? <Phone size={11} /> : null}{src}</Chip></div>
                <div className="flex items-center border-t border-[#EEF1F5] pt-2"><span className={cn("flex flex-1 items-center gap-1 text-[11.5px] font-semibold", name === "Won" ? "text-[#137A52]" : next.includes("today") ? "text-[#B42318]" : "text-[#667085]")}><Clock size={11} />{next}</span><Avatar name={owner} size={22} /></div>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Clinic() {
  const hours = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM"];
  const appts: [number, number, number, string, string, "done" | "now" | "next" | "block"][] = [[0, 0, 1, "Ramesh K.", "Fever · Follow-up", "done"], [0, 1, 1, "Divya P.", "Consultation", "now"], [0, 2.25, 1, "Selvam A.", "BP review", "next"], [0, 4, 1.5, "Health camp", "Blocked", "block"], [1, 0.5, 1, "Baby Aadhya", "Vaccination", "done"], [1, 2, 1, "Kavin (8 yrs)", "Cough & cold", "next"], [1, 3.5, 1, "Nila (4 yrs)", "Check-up", "next"], [2, 0, 1.25, "Sneha R.", "Skin consultation", "done"], [2, 2.25, 1, "Imran M.", "Follow-up", "next"], [2, 4.5, 1, "Priya V.", "Consultation", "next"]];
  const sty = { done: "bg-[#F0F2F5] text-[#667085] border-l-[#98A2B3]", now: "bg-[#2C6E9E] text-white border-l-[#10273A] shadow-[0_8px_18px_-8px_rgba(44,110,158,0.9)]", next: "bg-[#EAF2F8] text-[#1C4A6E] border-l-[#2C6E9E]", block: "bg-[repeating-linear-gradient(135deg,#FFF6E6,#FFF6E6_6px,#FDEFD3_6px,#FDEFD3_12px)] text-[#9A5B05] border-l-[#E59A1C]" };
  const rowH = 70;
  return (
    <Shell id="clinic" crumbs="Front desk / Appointments" title="Thursday, 15 October" sub="28 booked · 6 waiting · 3 doctors on duty" tabs={[["Day"], ["Week"], ["Doctors", "3"], ["Waitlist", "6"]]} actions={<><Btn icon={CalendarDays}>Today</Btn><Btn primary icon={Plus}>New appointment</Btn></>}>
      <div className="flex h-full gap-4 p-5">
        <Card className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex border-b border-[#E4E9F0]">
            <span className="w-14 shrink-0" />
            {[["Dr. Meena R.", "General physician", "11 today"], ["Dr. Arjun K.", "Paediatrics", "9 today"], ["Dr. Fathima S.", "Dermatology", "8 today"]].map(([n, s, c]) => <div key={n} className="flex flex-1 items-center gap-2.5 border-l border-[#E4E9F0] px-3 py-2.5"><Avatar name={n.replace("Dr. ", "")} size={30} /><div className="min-w-0"><p className="truncate text-[13px] font-semibold">{n}</p><p className="text-[11px] text-[#8A94A6]">{s} · {c}</p></div></div>)}
          </div>
          <div className="relative flex-1">
            {hours.map((h, i) => <div key={h} className="absolute inset-x-0 border-t border-[#F0F2F5]" style={{ top: i * rowH }}><span className="ml-2 mt-1 inline-block text-[11px] font-medium text-[#98A2B3]">{h}</span></div>)}
            <div className="absolute inset-x-0 z-10 flex items-center" style={{ top: 1.35 * rowH }}><span className="ml-1 rounded bg-[#D92D20] px-1 text-[10px] font-bold text-white">10:21</span><span className="h-px flex-1 bg-[#D92D20]" /></div>
            {appts.map(([c, st, dur, n, why, kind]) => (
              <div key={n} className={cn("absolute flex flex-col gap-0.5 rounded-lg border-l-[3px] px-2.5 py-2", sty[kind])} style={{ left: `calc(56px + ${c} * (100% - 56px) / 3 + 5px)`, width: "calc((100% - 56px) / 3 - 10px)", top: st * rowH + 3, height: dur * rowH - 6 }}>
                <span className="flex items-center gap-1.5 text-[12.5px] font-semibold">{n}{kind === "now" && <span className="rounded bg-white/20 px-1 text-[10px]">IN ROOM</span>}</span><span className="text-[11.5px] font-medium opacity-90">{why}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex w-[270px] flex-col gap-3">
          <div className="rounded-[14px] bg-gradient-to-br from-[#2C6E9E] to-[#1C4A6E] p-4 text-white shadow-[0_12px_28px_-12px_rgba(28,74,110,0.9)]"><p className="text-[11px] font-bold tracking-[0.1em] text-[#BFD9EC]">NOW SERVING · TOKEN 14</p><div className="mt-2 flex items-center gap-2.5"><Avatar name="Divya P" size={36} className="ring-white/30" /><div><p className="text-[17px] font-semibold">Divya P.</p><p className="text-[12px] text-[#DCEAF4]">Dr. Meena R. · Room 2</p></div></div></div>
          <Card className="flex flex-col p-3.5">
            <span className="text-[13.5px] font-semibold">Waiting room</span>
            {[["15", "Selvam A.", "~10 min"], ["16", "Kavin (8 yrs)", "~15 min"], ["17", "Imran M.", "~25 min"], ["18", "Walk-in", "~35 min"]].map(([t, n, w]) => (
              <div key={t} className="flex items-center gap-2.5 border-b border-[#EEF1F5] py-2 last:border-0"><span className="grid h-7 w-8 place-items-center rounded-md bg-[#EAF2F8] text-[12px] font-bold text-[#2C6E9E]">{t}</span><span className="flex-1 text-[13px] font-semibold">{n}</span><span className="text-[11.5px] font-medium text-[#8A94A6]">{w}</span></div>
            ))}
          </Card>
          <span className="flex items-center gap-2 rounded-xl bg-[#E7F6EF] px-3 py-2.5 text-[12px] font-semibold text-[#137A52]"><MessageCircle size={14} />24 WhatsApp reminders sent</span>
        </div>
      </div>
    </Shell>
  );
}

function Inventory() {
  const rows: [string, string, string, number, number, number, number, Tone, string][] = [
    ["Basmati Rice 5kg", "RIC-005", "🍚", 64, 38, 220, 90, "green", "Healthy"],
    ["Toor Dal 1kg", "DAL-001", "🫘", 12, 6, 40, 18, "amber", "Reorder"],
    ["Sunflower Oil 1L", "OIL-101", "🫙", 88, 52, 310, 95, "green", "Healthy"],
    ["Fresh Milk 1L", "MLK-001", "🥛", 18, 9, 0, 40, "red", "Expires 17 Oct"],
    ["Filter Coffee 500g", "COF-500", "☕", 26, 14, 75, 70, "green", "Healthy"],
    ["Green Tea 100g", "TEA-100", "🍵", 4, 0, 0, 8, "red", "Out at T. Nagar"],
    ["Wheat Atta 5kg", "ATT-005", "🌾", 41, 29, 160, 65, "blue", "In transit"],
  ];
  return (
    <Shell id="inventory" crumbs="Stock / Items" title="Items" sub="1,248 items · 2 stores · 1 warehouse" tabs={[["All items", "1,248"], ["Low stock", "7"], ["Expiring", "12"], ["Inactive"]]} actions={<><Btn icon={Download}>Import</Btn><Btn primary icon={Plus}>Stock transfer</Btn></>}>
      <div className="flex h-full gap-4 p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <div className="grid grid-cols-3 gap-3.5">
            <Kpi label="Stock value" value="₹18.4L" delta="4.1%" spark={[15, 15.6, 16.2, 16.9, 17.4, 18.1, 18.4]} />
            <Kpi label="Items below reorder" value="7" delta="2" up={false} spark={[3, 4, 4, 5, 6, 6, 7]} color="#E59A1C" />
            <Kpi label="Sell-through (30d)" value="64%" delta="6%" spark={[52, 55, 57, 58, 60, 62, 64]} color="#1F9D6C" />
          </div>
          <Card className="flex-1 px-4 pb-1 pt-3">
            <div className="flex gap-3 border-b border-[#EEF1F5] pb-2.5"><Th className="flex-1">Item</Th><Th className="w-[86px] text-right">Anna Nagar</Th><Th className="w-[74px] text-right">T. Nagar</Th><Th className="w-[84px] text-right">Warehouse</Th><Th className="w-[96px]">Level</Th><Th className="w-[118px] text-right">Status</Th></div>
            {rows.map(([n, sku, e, a, t, w, lvl, tone, s]) => (
              <div key={n} className="flex items-center gap-3 border-b border-[#F3F5F8] py-[7px] text-[13px] last:border-0">
                <span className="flex flex-1 items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#F6F9FC] text-[17px] ring-1 ring-[#EEF1F5]">{e}</span><span><span className="block font-semibold">{n}</span><span className="text-[11px] text-[#98A2B3]">{sku}</span></span></span>
                <span className="w-[86px] text-right font-medium">{a}</span><span className={cn("w-[74px] text-right font-medium", t === 0 && "text-[#B42318]")}>{t}</span><span className="w-[84px] text-right font-medium">{w || "—"}</span>
                <span className="w-[96px]"><span className="block h-1.5 rounded-full bg-[#EEF1F5]"><span className={cn("block h-1.5 rounded-full", dotCls[tone])} style={{ width: `${lvl}%` }} /></span></span>
                <span className="flex w-[118px] justify-end"><Chip tone={tone}>{s}</Chip></span>
              </div>
            ))}
          </Card>
        </div>
        <Card className="flex w-[290px] flex-col p-4">
          <div className="flex items-center gap-2"><Sparkles size={16} className="text-[#7A5AF8]" /><span className="text-[14.5px] font-semibold">Reorder suggestions</span></div>
          <span className="mt-0.5 text-[12px] text-[#667085]">From last 30 days of sales</span>
          {[["Toor Dal 1kg", "Sri Balaji Traders", "120 units", "₹18,240"], ["Green Tea 100g", "Nilgiri Tea Co.", "60 units", "₹9,600"], ["Biscuits Pack", "Sunrise Foods", "240 units", "₹7,680"], ["Fresh Milk 1L", "Aavin dealer", "80 / day", "₹4,320"]].map(([n, v, q, amt]) => (
            <div key={n} className="mt-2.5 flex items-center gap-2.5 rounded-xl bg-[#F6F9FC] p-2.5 ring-1 ring-[#EEF1F5]"><Avatar name={v} size={28} /><div className="min-w-0 flex-1"><p className="truncate text-[12.5px] font-semibold">{n}</p><p className="truncate text-[11px] text-[#8A94A6]">{v}</p></div><div className="text-right"><p className="text-[12px] font-bold text-[#1C4A6E]">{q}</p><p className="text-[11px] text-[#8A94A6]">{amt}</p></div></div>
          ))}
          <span className="mt-auto rounded-xl bg-[#2C6E9E] py-2.5 text-center text-[13px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(44,110,158,0.8)]">Create 4 purchase orders</span>
        </Card>
      </div>
    </Shell>
  );
}

function Invoice() {
  const list: [string, string, string, string, Tone, string][] = [
    ["INV-0412", "Priya Stores", "₹8,560", "Due in 3 days", "amber", "15 Oct"],
    ["INV-0411", "KVR Jewellers", "₹42,300", "Paid · UPI", "green", "14 Oct"],
    ["INV-0410", "Green Leaf Cafe", "₹12,980", "Overdue 6 days", "red", "09 Oct"],
    ["INV-0409", "Sun Hardware", "₹1,18,000", "Part paid", "blue", "08 Oct"],
    ["INV-0408", "Lotus Pharmacy", "₹6,240", "Paid · Bank", "green", "07 Oct"],
    ["INV-0407", "Arun Clinic", "₹9,440", "Draft", "grey", "07 Oct"],
  ];
  return (
    <Shell id="invoice" crumbs="Sales / Invoices" title="Invoices" sub="October · 184 invoices · ₹14.8L billed" tabs={[["All", "184"], ["Unpaid", "38"], ["Overdue", "9"], ["Drafts", "3"]]} actions={<><Btn icon={Filter}>This month</Btn><Btn primary icon={Plus}>New invoice</Btn></>}>
      <div className="flex h-full gap-4 p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <Card className="p-4">
            <div className="flex items-end gap-6">
              <div><p className="text-[12.5px] font-medium text-[#667085]">Total receivables</p><p className="text-[24px] font-semibold tracking-tight">₹3,62,400</p></div>
              <div><p className="text-[12.5px] font-medium text-[#667085]">Collected this month</p><p className="text-[18px] font-semibold text-[#137A52]">₹11.2L <span className="align-middle"><Delta up>9%</Delta></span></p></div>
            </div>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full">{[[46, "#2C6E9E"], [22, "#7AA7C7"], [9, "#F0B44C"], [23, "#D92D20"]].map(([w, c], i) => <span key={i} style={{ width: `${w}%`, background: c as string }} />)}</div>
            <div className="mt-2 flex gap-5 text-[12px]">{[["Current", "₹1.66L", "#2C6E9E"], ["1–30 days", "₹80K", "#7AA7C7"], ["31–60 days", "₹32K", "#F0B44C"], ["60+ days", "₹84K", "#D92D20"]].map(([l, v, c]) => <span key={l} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: c }} /><span className="text-[#667085]">{l}</span><b>{v}</b></span>)}</div>
          </Card>
          <Card className="flex-1 px-4 pb-1 pt-3">
            <div className="flex gap-3 border-b border-[#EEF1F5] pb-2.5"><Th className="flex-1">Customer</Th><Th className="w-[60px]">Date</Th><Th className="w-[96px] text-right">Amount</Th><Th className="w-[130px] text-right">Status</Th></div>
            {list.map(([no, c, a, s, tone, d], i) => (
              <div key={no} className={cn("flex items-center gap-3 border-b border-[#F3F5F8] py-2 text-[13px] last:border-0", i === 0 && "-mx-2 rounded-lg bg-[#F2F7FC] px-2 ring-1 ring-[#DCE7F1]")}>
                <span className="flex flex-1 items-center gap-2.5"><Avatar name={c} size={28} /><span><span className="block font-semibold">{c}</span><span className="text-[11px] text-[#98A2B3]">{no}</span></span></span>
                <span className="w-[60px] text-[12px] text-[#667085]">{d}</span><b className="w-[96px] text-right">{a}</b><span className="flex w-[130px] justify-end"><Chip tone={tone}>{s}</Chip></span>
              </div>
            ))}
          </Card>
        </div>
        <Card className="flex w-[380px] flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-[#1C4A6E] to-[#2C6E9E] px-5 py-4 text-white"><div className="flex items-start"><div className="flex-1"><p className="text-[11px] font-bold tracking-[0.14em] text-[#BFD9EC]">TAX INVOICE</p><p className="text-[18px] font-semibold">Velan Traders</p><p className="text-[11.5px] text-[#DCEAF4]">GSTIN 33AAXFV2190K1Z2 · Chennai</p></div><NetworkMark className="h-9 w-9" /></div></div>
          <div className="flex flex-1 flex-col px-5 py-4">
            <div className="flex gap-4 text-[11.5px] text-[#667085]"><div className="flex-1"><p className="font-semibold text-[#101828]">Billed to</p><p>Priya Stores, Chennai</p><p>33ABCDE1234F1Z5</p></div><div className="text-right"><p className="font-semibold text-[#101828]">INV-0412</p><p>15 Oct 2026</p><p>Due 18 Oct</p></div></div>
            <div className="mt-3 rounded-lg bg-[#F6F9FC] px-3 py-1.5">
              {[["Basmati Rice 5kg", "8 × ₹645", "₹5,160"], ["Sunflower Oil 1L", "12 × ₹155", "₹1,860"], ["Filter Coffee 500g", "4 × ₹290", "₹1,160"]].map(([n, q, a]) => <div key={n} className="flex items-center border-b border-[#E9EEF3] py-1.5 text-[12px] last:border-0"><span className="flex-1"><b className="block">{n}</b><span className="text-[#8A94A6]">{q} · HSN 1006</span></span><b>{a}</b></div>)}
            </div>
            {[["Taxable value", "₹8,180"], ["CGST 2.5%", "₹190"], ["SGST 2.5%", "₹190"]].map(([l, v]) => <div key={l} className="flex pt-1.5 text-[12px]"><span className="flex-1 text-[#667085]">{l}</span><span className="font-medium">{v}</span></div>)}
            <div className="mt-1.5 flex items-center border-t border-[#E4E9F0] pt-2"><span className="flex-1 text-[14px] font-semibold">Total</span><span className="text-[22px] font-bold tracking-tight">₹8,560</span></div>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#F2F7FC] p-2.5 ring-1 ring-[#DCE7F1]">
              <div className="grid h-[54px] w-[54px] grid-cols-6 gap-[1.5px] rounded-md bg-white p-1">{Array.from({ length: 36 }).map((_, i) => <span key={i} className={cn("rounded-[1px]", (i * 7 + (i % 5)) % 3 === 0 || [0, 1, 6, 7, 4, 5, 10, 11, 24, 25, 30, 31].includes(i) ? "bg-[#10273A]" : "bg-white")} />)}</div>
              <div className="text-[12px]"><p className="font-semibold">Scan to pay with any UPI app</p><p className="text-[#667085]">Link sent on WhatsApp · 15 Oct, 10:42</p></div>
            </div>
            <span className="mt-auto flex items-center gap-2 rounded-xl bg-[#E7F6EF] px-3 py-2 text-[12px] font-semibold text-[#137A52]"><Bell size={13} />Auto-reminder scheduled for 18 Oct</span>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function People() {
  const staff: [string, string, string, string, Tone, ("p" | "l" | "a" | "o")[]][] = [
    ["Ravi Kumar", "Cashier · Anna Nagar", "09:02", "Present", "green", ["p", "p", "p", "p", "p", "o", "p"]],
    ["Meena S.", "Store manager · T. Nagar", "08:55", "Present", "green", ["p", "p", "p", "l", "p", "o", "p"]],
    ["Arjun P.", "Delivery · Warehouse", "09:41", "Late 41 min", "amber", ["p", "l", "p", "p", "p", "o", "l"]],
    ["Fathima R.", "Accounts · Head office", "—", "On leave", "blue", ["p", "p", "p", "p", "p", "o", "o"]],
    ["Selvam A.", "Helper · Anna Nagar", "—", "Absent", "red", ["p", "a", "p", "p", "a", "o", "a"]],
    ["Divya K.", "Cashier · T. Nagar", "09:00", "Present", "green", ["p", "p", "p", "p", "p", "o", "p"]],
  ];
  const cell = { p: "bg-[#5FBF94]", l: "bg-[#F0B44C]", a: "bg-[#E8726A]", o: "bg-[#E4E9F0]" };
  return (
    <Shell id="people" crumbs="People / Attendance" title="Attendance" sub="Thursday, 15 October · 42 employees · 3 branches" tabs={[["Today"], ["This week"], ["Shifts"], ["Regularise", "3"]]} actions={<><Btn icon={Filter}>All branches</Btn><Btn primary>Run payroll</Btn></>}>
      <div className="flex h-full gap-4 p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <div className="grid grid-cols-4 gap-3.5">
            {[["Present", "36", "86%", "green"], ["Late", "3", "after 9:15", "amber"], ["On leave", "2", "approved", "blue"], ["Absent", "1", "not informed", "red"]].map(([l, v, d, t]) => <Card key={l} className="px-4 py-3"><p className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#667085]"><span className={cn("h-2 w-2 rounded-full", dotCls[t as Tone])} />{l}</p><p className="mt-1 text-[24px] font-semibold leading-none">{v}</p><p className="mt-1 text-[11.5px] text-[#8A94A6]">{d}</p></Card>)}
          </div>
          <Card className="flex-1 px-4 pb-1 pt-3">
            <div className="flex gap-3 border-b border-[#EEF1F5] pb-2.5"><Th className="flex-1">Employee</Th><Th className="w-[70px]">In</Th><Th className="w-[140px]">Last 7 days</Th><Th className="w-[110px] text-right">Today</Th></div>
            {staff.map(([n, r, t, s, tone, wk]) => (
              <div key={n} className="flex items-center gap-3 border-b border-[#F3F5F8] py-2 text-[13px] last:border-0">
                <span className="flex flex-1 items-center gap-2.5"><Avatar name={n} size={30} /><span><span className="block font-semibold">{n}</span><span className="text-[11px] text-[#98A2B3]">{r}</span></span></span>
                <span className="w-[70px] font-medium">{t}</span>
                <span className="flex w-[140px] gap-1">{wk.map((c, i) => <span key={i} className={cn("h-5 w-4 rounded", cell[c])} />)}</span>
                <span className="flex w-[110px] justify-end"><Chip tone={tone}>{s}</Chip></span>
              </div>
            ))}
          </Card>
        </div>
        <div className="flex w-[290px] flex-col gap-3.5">
          <Card className="p-4">
            <span className="text-[14px] font-semibold">Leave requests</span>
            {[["Divya K.", "18–19 Oct · Family function"], ["Arjun P.", "21 Oct · Personal"]].map(([n, d]) => (
              <div key={n} className="mt-3 rounded-xl bg-[#F6F9FC] p-3 ring-1 ring-[#EEF1F5]"><div className="flex items-center gap-2"><Avatar name={n} size={26} /><div><p className="text-[12.5px] font-semibold">{n}</p><p className="text-[11px] text-[#8A94A6]">{d}</p></div></div><div className="mt-2.5 flex gap-2"><span className="flex-1 rounded-lg bg-[#2C6E9E] py-1.5 text-center text-[12px] font-semibold text-white">Approve</span><span className="flex-1 rounded-lg border border-[#DDE3EA] bg-white py-1.5 text-center text-[12px] font-semibold">Decline</span></div></div>
            ))}
          </Card>
          <Card className="flex-1 p-4">
            <div className="flex items-center"><span className="flex-1 text-[14px] font-semibold">October payroll</span><Chip tone="blue">Draft</Chip></div>
            <p className="mt-2 text-[22px] font-semibold tracking-tight">₹7,84,000</p>
            <div className="mt-2 flex h-2.5 overflow-hidden rounded-full">{[[80, "#2C6E9E"], [9, "#7AA7C7"], [3, "#F0B44C"], [8, "#E4E9F0"]].map(([w, c], i) => <span key={i} style={{ width: `${w}%`, background: c as string }} />)}</div>
            {[["Net pay", "₹6,93,580", "#2C6E9E"], ["PF + ESI", "₹68,420", "#7AA7C7"], ["Advances recovered", "₹22,000", "#F0B44C"]].map(([l, v, c]) => <div key={l} className="mt-2 flex items-center text-[12.5px]"><span className="mr-2 h-2 w-2 rounded-sm" style={{ background: c }} /><span className="flex-1 text-[#667085]">{l}</span><b>{v}</b></div>)}
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function Stay() {
  const rooms: [string, string, ("p" | "d" | "v")[]][] = [["101", "AC · 3-sharing", ["p", "p", "d"]], ["102", "AC · 3-sharing", ["p", "p", "p"]], ["103", "Non-AC · 3", ["p", "v", "v"]], ["104", "AC · 2-sharing", ["p", "p"]], ["201", "AC · 3-sharing", ["p", "d", "p"]], ["202", "AC · 3-sharing", ["p", "p", "p"]], ["203", "Non-AC · 2", ["v", "p"]], ["204", "AC · 3-sharing", ["p", "p", "d"]]];
  const bed = { p: "bg-[#E8F1F9] text-[#2C6E9E] ring-[#BFD6E8]", d: "bg-[#FFF3DE] text-[#B87308] ring-[#F3D9A6]", v: "bg-white text-[#C0C8D2] ring-[#E4E9F0] ring-dashed" };
  return (
    <Shell id="stay" crumbs="Property / Rooms & beds" title="Palm Residency" sub="22 beds · 18 occupied · HSR Layout" tabs={[["Floor 1", "11"], ["Floor 2", "11"], ["Vacancies", "4"]]} actions={<><Btn icon={Download}>Rent report</Btn><Btn primary icon={Plus}>Add resident</Btn></>}>
      <div className="flex h-full gap-4 p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <div className="grid grid-cols-3 gap-3.5">
            <Card className="flex items-center gap-4 px-4 py-3"><Donut size={74} stroke={10} parts={[[82, "#2C6E9E"]]} label="82%" sub="" /><div><p className="text-[12.5px] font-medium text-[#667085]">Occupancy</p><p className="text-[20px] font-semibold">18 / 22 beds</p></div></Card>
            <Kpi label="Rent collected · Oct" value="₹2.1L" delta="8%" spark={[1.4, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1]} color="#1F9D6C" />
            <Kpi label="Dues pending" value="₹38,500" delta="2" up={false} spark={[20, 24, 26, 30, 33, 36, 38.5]} color="#D92D20" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {rooms.map(([r, type, beds]) => (
              <Card key={r} className="flex flex-col gap-2.5 p-3">
                <div className="flex items-start"><div className="flex-1"><p className="text-[14.5px] font-bold">Room {r}</p><p className="text-[11px] text-[#8A94A6]">{type}</p></div>{beds.includes("d") && <span className="h-2 w-2 rounded-full bg-[#E59A1C]" />}</div>
                <div className="flex gap-1.5">{beds.map((b, i) => <span key={i} className={cn("grid h-9 flex-1 place-items-center rounded-lg ring-1", bed[b])}><BedDouble size={16} /></span>)}</div>
              </Card>
            ))}
          </div>
          <div className="flex gap-4 text-[12px] font-medium text-[#475467]">{[["bg-[#E8F1F9] ring-1 ring-[#BFD6E8]", "Paid"], ["bg-[#FFF3DE] ring-1 ring-[#F3D9A6]", "Rent due"], ["bg-white ring-1 ring-[#E4E9F0]", "Vacant"]].map(([c, l]) => <span key={l} className="flex items-center gap-1.5"><span className={cn("h-3 w-3 rounded", c)} />{l}</span>)}</div>
          <Card className="flex items-center gap-4 p-3.5">
            <span className="text-[13px] font-semibold">This week</span>
            {[["Ajay V.", "Check-in · Mon", "Bed 103-B", "blue"], ["Sanjay K.", "Check-in · Wed", "Bed 203-A", "blue"], ["Vignesh R.", "Move-out · Sat", "Bed 104-A", "amber"]].map(([n, e, b, t]) => <span key={n} className="flex flex-1 items-center gap-2 rounded-xl bg-[#F6F9FC] p-2 ring-1 ring-[#EEF1F5]"><Avatar name={n} size={26} /><span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-semibold">{n}</span><span className="text-[11px] text-[#8A94A6]">{b}</span></span><Chip tone={t as Tone} dot={false}>{e}</Chip></span>)}
          </Card>
        </div>
        <div className="flex w-[290px] flex-col gap-3.5">
          <Card className="p-4">
            <div className="flex items-center"><span className="flex-1 text-[14px] font-semibold">Rent due</span><span className="text-[12px] font-semibold text-[#2C6E9E]">Remind all</span></div>
            {[["Karthik S.", "101-C", "₹9,500", "5 days"], ["Naveen R.", "201-B", "₹9,000", "2 days"], ["Rahul M.", "204-C", "₹10,000", "today"]].map(([n, b, a, d]) => <div key={n} className="mt-2.5 flex items-center gap-2.5"><Avatar name={n} size={28} /><div className="flex-1"><p className="text-[12.5px] font-semibold">{n}</p><p className="text-[11px] text-[#8A94A6]">Bed {b}</p></div><div className="text-right"><p className="text-[12.5px] font-bold">{a}</p><p className="text-[11px] font-semibold text-[#B42318]">{d}</p></div></div>)}
          </Card>
          <Card className="flex-1 p-4">
            <span className="text-[14px] font-semibold">Complaints</span>
            {([["Geyser repair", "Room 103", "Urgent", "red"], ["Wi-Fi slow", "Room 202", "Assigned", "blue"], ["Room cleaning", "Room 104", "Resolved", "green"]] as const).map(([n, r, s, t]) => <div key={n} className="mt-2.5 flex items-center gap-2.5 rounded-xl bg-[#F6F9FC] p-2.5 ring-1 ring-[#EEF1F5]"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-[#667085] ring-1 ring-[#E4E9F0]"><Wrench size={14} /></span><div className="min-w-0 flex-1"><p className="truncate text-[12.5px] font-semibold">{n}</p><p className="text-[11px] text-[#8A94A6]">{r}</p></div><Chip tone={t}>{s}</Chip></div>)}
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function Loan() {
  const rows: [string, string, string, string, string, Tone, string][] = [
    ["P-1182", "Murugan S.", "24.5 g · 22K", "₹1,10,000", "₹2,640", "green", "Active"],
    ["P-1181", "Lakshmi R.", "12.0 g · 22K", "₹52,000", "₹1,248", "green", "Active"],
    ["P-1176", "Saravanan K.", "38.2 g · 22K", "₹1,75,000", "₹8,400", "red", "Overdue"],
    ["P-1170", "Kavitha M.", "8.4 g · 18K", "₹30,000", "₹720", "blue", "Renewed"],
    ["P-1164", "Rajesh P.", "16.8 g · 22K", "₹76,000", "₹5,472", "red", "Overdue"],
    ["P-1158", "Anitha V.", "20.0 g · 22K", "₹90,000", "—", "grey", "Closed"],
  ];
  return (
    <Shell id="loan" crumbs="Lending / Pledges" title="Pledges" sub="412 active · Karur branch" tabs={[["Active", "412"], ["Due this week", "38"], ["Overdue", "27"], ["Closed"]]} actions={<><span className="flex items-center gap-2 rounded-[9px] bg-[#FFF6E0] px-3 py-1.5 text-[12.5px] font-semibold text-[#8A5606] ring-1 ring-[#F3D9A6]">Gold 22K · ₹6,850/g <Delta up>0.4%</Delta></span><Btn primary icon={Plus}>New pledge</Btn></>}>
      <div className="flex h-full gap-4 p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <div className="grid grid-cols-3 gap-3.5">
            <Kpi label="Loan outstanding" value="₹2.84 Cr" delta="3.6%" spark={[2.5, 2.56, 2.6, 2.66, 2.72, 2.79, 2.84]} />
            <Kpi label="Interest due · Oct" value="₹6.2L" delta="5.2%" spark={[5.1, 5.3, 5.5, 5.7, 5.9, 6.0, 6.2]} color="#7A5AF8" />
            <Kpi label="Collected today" value="₹1.36L" delta="11%" spark={[0.8, 1.1, 0.9, 1.2, 1.0, 1.25, 1.36]} color="#1F9D6C" />
          </div>
          <Card className="flex-1 px-4 pb-1 pt-3">
            <div className="flex gap-3 border-b border-[#EEF1F5] pb-2.5"><Th className="w-[64px]">Pledge</Th><Th className="flex-1">Customer</Th><Th className="w-[100px]">Gold</Th><Th className="w-[92px] text-right">Loan</Th><Th className="w-[78px] text-right">Interest</Th><Th className="w-[92px] text-right">Status</Th></div>
            {rows.map(([p, c, g, l, i, t, s], k) => (
              <div key={p} className={cn("flex items-center gap-3 border-b border-[#F3F5F8] py-2 text-[13px] last:border-0", k === 2 && "-mx-2 rounded-lg bg-[#F2F7FC] px-2 ring-1 ring-[#DCE7F1]")}>
                <span className="w-[64px] font-semibold text-[#1C4A6E]">{p}</span><span className="flex flex-1 items-center gap-2"><Avatar name={c} size={26} /><span className="font-semibold">{c}</span></span><span className="w-[100px] text-[12px] text-[#667085]">{g}</span><b className="w-[92px] text-right">{l}</b><span className="w-[78px] text-right font-medium">{i}</span><span className="flex w-[92px] justify-end"><Chip tone={t}>{s}</Chip></span>
              </div>
            ))}
          </Card>
        </div>
        <Card className="flex w-[300px] flex-col p-4">
          <div className="flex items-center gap-2.5"><Avatar name="Saravanan K" size={40} /><div className="flex-1"><p className="text-[15px] font-semibold">Saravanan K.</p><p className="text-[11.5px] text-[#667085]">P-1176 · KYC verified ✓</p></div><Chip tone="red">Overdue</Chip></div>
          <div className="mt-3 grid grid-cols-3 gap-2">{[["📿", "Chain", "22.4 g"], ["💍", "Ring", "8.1 g"], ["💍", "Ring", "7.7 g"]].map(([e, n, w], i) => <div key={i} className="flex flex-col items-center rounded-xl bg-gradient-to-b from-[#FFF8E6] to-[#FFF1CC] py-2 ring-1 ring-[#F3D9A6]"><span className="text-[22px]">{e}</span><span className="text-[11px] font-semibold text-[#8A5606]">{n}</span><span className="text-[11px] text-[#9A6B10]">{w}</span></div>)}</div>
          <div className="mt-3 flex flex-col gap-1.5 rounded-xl bg-[#F6F9FC] p-3 text-[12.5px] ring-1 ring-[#EEF1F5]">
            {[["Net weight", "38.2 g · 22K"], ["Loan amount", "₹1,75,000"], ["Loan to value", "67%"], ["Interest", "1.5% / month"], ["Pledged on", "12 Jun 2026"]].map(([l, v]) => <div key={l} className="flex"><span className="flex-1 text-[#667085]">{l}</span><span className="font-semibold">{v}</span></div>)}
          </div>
          <div className="mt-3 flex items-center rounded-xl bg-[#FDECEA] px-3 py-2.5"><span className="flex-1 text-[12.5px] font-semibold text-[#B42318]">Interest due</span><span className="text-[18px] font-bold text-[#B42318]">₹8,400</span></div>
          <p className="mt-3 text-[12.5px] font-semibold">History</p>
          {[["12 Sep", "Interest paid", "₹2,625"], ["12 Aug", "Interest paid", "₹2,625"], ["12 Jun", "Pledged · receipt #4471", "₹1,75,000"]].map(([d, l, a]) => <div key={d} className="mt-1.5 flex items-center gap-2 text-[12px]"><span className="h-1.5 w-1.5 rounded-full bg-[#2C6E9E]" /><span className="w-[46px] text-[#8A94A6]">{d}</span><span className="flex-1 text-[#475467]">{l}</span><b>{a}</b></div>)}
          <div className="mt-auto grid grid-cols-2 gap-2 pt-3"><span className="rounded-xl border border-[#DDE3EA] py-2.5 text-center text-[13px] font-semibold">Renew</span><span className="rounded-xl bg-[#2C6E9E] py-2.5 text-center text-[13px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(44,110,158,0.8)]">Collect & print</span></div>
        </Card>
      </div>
    </Shell>
  );
}

export const screens: Record<ScreenId, { label: string; app: string; url: string; Component: () => React.ReactElement }> = {
  dashboard: { label: "Owner dashboard", app: "analytics", url: "app.camuslabs.com/overview", Component: Dashboard },
  pos: { label: "POS billing", app: "pos", url: "app.camuslabs.com/pos", Component: POS },
  restaurant: { label: "Restaurant tables", app: "restaurant-pos", url: "app.camuslabs.com/tables", Component: Restaurant },
  invoice: { label: "GST invoices", app: "billing", url: "app.camuslabs.com/invoices", Component: Invoice },
  inventory: { label: "Inventory", app: "inventory", url: "app.camuslabs.com/items", Component: Inventory },
  crm: { label: "CRM pipeline", app: "crm", url: "app.camuslabs.com/deals", Component: CRM },
  clinic: { label: "Clinic appointments", app: "clinic", url: "app.camuslabs.com/appointments", Component: Clinic },
  people: { label: "Attendance & payroll", app: "people", url: "app.camuslabs.com/attendance", Component: People },
  stay: { label: "Rooms & rent", app: "stay", url: "app.camuslabs.com/rooms", Component: Stay },
  loan: { label: "Gold loan pledges", app: "gold-loan", url: "app.camuslabs.com/pledges", Component: Loan },
};
