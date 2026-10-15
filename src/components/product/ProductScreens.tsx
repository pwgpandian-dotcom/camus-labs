/**
 * Product UI mockups (designed in Figma: "Camus — Brand & Website" → Screen / *).
 * Each screen is laid out at a fixed 1280×800 design size; <ScreenFrame> scales it
 * to fit its container. Sample data is illustrative only.
 */
import { AppIcon } from "@/components/brand/AppIcon";
import { Logo } from "@/components/brand/Logo";
import { getApp } from "@/lib/apps";
import { cn } from "@/lib/cn";

export type ScreenId = "dashboard" | "pos" | "crm" | "clinic" | "inventory" | "invoice" | "restaurant" | "people" | "stay" | "loan";

const bizNav: [string, string][] = [["Dashboard", "analytics"], ["POS", "pos"], ["Billing", "billing"], ["Inventory", "inventory"], ["CRM", "crm"], ["Bookings", "bookings"], ["People", "people"], ["Reports", "reports"]];
const navs: Record<ScreenId, [string, string][]> = {
  dashboard: bizNav,
  pos: bizNav,
  inventory: [["Dashboard", "analytics"], ["Inventory", "inventory"], ["Purchase", "purchase"], ["POS", "pos"], ["Billing", "billing"], ["Reports", "reports"]],
  invoice: [["Dashboard", "analytics"], ["Invoices", "billing"], ["Collections", "pay"], ["Quotes", "quotes"], ["Expenses", "expense"], ["Reports", "reports"]],
  crm: [["Dashboard", "analytics"], ["CRM", "crm"], ["Leads", "leads"], ["Campaigns", "campaigns"], ["Quotes", "quotes"], ["Inbox", "inbox"], ["Reports", "reports"]],
  clinic: [["Dashboard", "analytics"], ["Appointments", "bookings"], ["Patients", "clinic"], ["Billing", "billing"], ["Pharmacy", "pharmacy"], ["Staff", "people"], ["Reports", "reports"]],
  restaurant: [["Dashboard", "analytics"], ["Tables", "restaurant-pos"], ["Kitchen", "desk"], ["Menu", "commerce"], ["Stock", "inventory"], ["Staff", "people"], ["Reports", "reports"]],
  people: [["Dashboard", "analytics"], ["Employees", "people"], ["Attendance", "attendance"], ["Leave", "approvals"], ["Payroll", "payroll"], ["Reports", "reports"]],
  stay: [["Dashboard", "analytics"], ["Rooms & beds", "stay"], ["Residents", "people"], ["Rent & dues", "pay"], ["Complaints", "desk"], ["Reports", "reports"]],
  loan: [["Dashboard", "analytics"], ["Pledges", "gold-loan"], ["Customers", "crm"], ["Receipts", "billing"], ["Overdues", "pay"], ["Reports", "reports"]],
};
const active: Record<ScreenId, string> = { dashboard: "Dashboard", pos: "POS", crm: "CRM", clinic: "Appointments", inventory: "Inventory", invoice: "Invoices", restaurant: "Tables", people: "Attendance", stay: "Rooms & beds", loan: "Pledges" };

function Shell({ id, title, sub, actions, children }: { id: ScreenId; title: string; sub: string; actions: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex h-[800px] w-[1280px] bg-[#F5F8FB] text-left text-[#1B2733]" style={{ fontFamily: "var(--font-body)" }}>
      <aside className="flex w-[232px] shrink-0 flex-col gap-1 border-r border-[#E5E9EF] bg-white px-4 py-[22px]">
        <span className="mb-5 text-[19px]"><Logo /></span>
        {navs[id].map(([label, app]) => {
          const on = label === active[id];
          return (
            <span key={label} className={cn("flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[14px]", on ? "bg-[#EAF2F8] font-semibold text-[#2C6E9E]" : "font-medium text-[#4F5662]")}>
              <AppIcon app={getApp(app)!} className="h-[26px] w-[26px]" />{label}
            </span>
          );
        })}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[#E5E9EF] bg-white px-7 py-4">
          <div className="flex-1"><p className="text-[20px] font-semibold">{title}</p><p className="text-[13px] font-medium text-[#868B94]">{sub}</p></div>
          {actions}
        </header>
        {children}
      </div>
    </div>
  );
}

const Btn = ({ children, primary }: { children: React.ReactNode; primary?: boolean }) => (
  <span className={cn("rounded-[10px] px-4 py-2.5 text-[14px]", primary ? "bg-[#2C6E9E] font-semibold text-white" : "border border-[#E5E9EF] font-medium")}>{children}</span>
);
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("rounded-[14px] border border-[#E5E9EF] bg-white p-5", className)}>{children}</div>
);
const Pill = ({ tone, children }: { tone: "green" | "amber" | "blue" | "grey"; children: React.ReactNode }) => {
  const t = { green: "bg-[#E6F4EE] text-[#1F9D6C]", amber: "bg-[#FDF3E2] text-[#B87308]", blue: "bg-[#EAF2F8] text-[#2C6E9E]", grey: "bg-[#F1F3F6] text-[#4F5662]" }[tone];
  return <span className={cn("whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold", t)}>{children}</span>;
};

function Dashboard() {
  const bars: [string, number][] = [["Fri", 150], ["Sat", 210], ["Sun", 230], ["Mon", 120], ["Tue", 140], ["Wed", 170], ["Thu", 190]];
  return (
    <Shell id="dashboard" title="Good morning, Owner" sub="Thursday, 15 October · 3 branches" actions={<><span className="w-[220px] rounded-[10px] border border-[#E5E9EF] px-3.5 py-2.5 text-[14px] text-[#868B94]">Search…</span><Btn>All branches ▾</Btn><span className="h-9 w-9 rounded-full bg-[#3D85B8]" /></>}>
      <div className="flex flex-1 flex-col gap-5 px-7 py-6">
        <div className="grid grid-cols-4 gap-4">
          {[["Today's sales", "₹48,250", "+12% vs last Thursday", "text-[#1F9D6C]"], ["Bills today", "186", "+9 vs yesterday", "text-[#1F9D6C]"], ["Dues pending", "₹1,12,400", "23 customers", "text-[#C2412D]"], ["Low stock", "7 items", "Reorder suggested", "text-[#B87308]"]].map(([l, v, d, c]) => (
            <Card key={l} className="flex flex-col gap-2"><span className="text-[14px] font-medium text-[#4F5662]">{l}</span><span className="text-[28px] font-semibold leading-tight">{v}</span><span className={cn("text-[13px] font-semibold", c)}>{d}</span></Card>
          ))}
        </div>
        <div className="flex gap-4">
          <Card className="flex flex-1 flex-col gap-4">
            <div className="flex items-center"><span className="flex-1 text-[16px] font-semibold">Sales — last 7 days</span><Pill tone="blue">₹2.9L this week</Pill></div>
            <div className="flex h-[250px] items-end gap-[22px]">
              {bars.map(([d, h]) => (
                <div key={d} className="flex flex-1 flex-col items-center gap-2"><div className={cn("w-full rounded-t-lg", d === "Thu" ? "bg-[#2C6E9E]" : "bg-[#BFD6E8]")} style={{ height: h }} /><span className="text-[12px] font-medium text-[#868B94]">{d}</span></div>
              ))}
            </div>
          </Card>
          <Card className="flex w-[340px] flex-col gap-4">
            <span className="text-[16px] font-semibold">Branches today</span>
            {[["Anna Nagar", "₹21,400", 90], ["T. Nagar", "₹16,850", 70], ["Velachery", "₹9,999", 42]].map(([n, v, p]) => (
              <div key={n} className="flex flex-col gap-1.5"><div className="flex text-[14px]"><span className="flex-1 font-medium">{n}</span><span className="font-semibold">{v}</span></div><div className="h-2 rounded bg-[#EAF2F8]"><div className="h-2 rounded bg-[#3D85B8]" style={{ width: `${p}%` }} /></div></div>
            ))}
          </Card>
        </div>
        <Card className="pb-2 pt-4">
          <div className="flex pb-2.5"><span className="flex-1 text-[16px] font-semibold">Recent bills</span><span className="text-[14px] font-semibold text-[#2C6E9E]">View all →</span></div>
          {[["#INV-2041", "Walk-in customer", "Anna Nagar", "₹1,240", "Paid · UPI"], ["#INV-2040", "Priya Stores", "T. Nagar", "₹8,560", "Due 3 days"], ["#INV-2039", "Walk-in customer", "Velachery", "₹640", "Paid · Cash"]].map(([no, c, b, a, s]) => (
            <div key={no} className="flex items-center gap-3 border-t border-[#E5E9EF] py-[11px] text-[14px]">
              <span className="w-[110px] font-semibold">{no}</span><span className="flex-1 font-medium">{c}</span><span className="w-[130px] text-[#4F5662]">{b}</span><span className="w-[90px] text-right font-semibold">{a}</span>
              <Pill tone={s.startsWith("Paid") ? "green" : "amber"}>{s}</Pill>
            </div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}

function POS() {
  const items: [string, string, string, string][] = [["Basmati Rice 5kg", "₹645", "#F4ECDD", "🍚"], ["Toor Dal 1kg", "₹168", "#FBF1CF", "🫘"], ["Fresh Milk 1L", "₹62", "#E7F1FA", "🥛"], ["Sunflower Oil 1L", "₹155", "#FBF3D6", "🫙"], ["Filter Coffee 500g", "₹290", "#F1E4D8", "☕"], ["Wheat Atta 5kg", "₹265", "#F3ECE1", "🌾"], ["Biscuits Pack", "₹40", "#FBEADB", "🍪"], ["Green Tea 100g", "₹199", "#E3F2E5", "🍵"]];
  return (
    <Shell id="pos" title="New bill" sub="Cashier: Ravi · Bill #INV-2042" actions={<><Btn>Counter 1 · Anna Nagar ▾</Btn><span className="h-9 w-9 rounded-full bg-[#3D85B8]" /></>}>
      <div className="flex flex-1 gap-5 px-7 py-6">
        <div className="flex flex-1 flex-col gap-4">
          <span className="rounded-xl border-[1.5px] border-[#3D85B8] bg-white px-4 py-3 text-[15px] text-[#868B94]">Scan barcode or search item…</span>
          <div className="flex gap-2">{["All", "Groceries", "Dairy", "Snacks", "Beverages", "Personal care"].map((c, i) => <span key={c} className={cn("rounded-full px-3.5 py-1.5 text-[13px] font-semibold", i === 0 ? "bg-[#2C6E9E] text-white" : "border border-[#E5E9EF] bg-white text-[#4F5662]")}>{c}</span>)}</div>
          <div className="grid grid-cols-4 gap-3">
            {items.map(([n, p, c, e]) => (
              <div key={n} className="flex flex-col gap-2 rounded-xl border border-[#E5E9EF] bg-white p-3"><div className="grid h-16 place-items-center rounded-lg text-[34px]" style={{ background: c }}>{e}</div><span className="text-[13px] font-semibold">{n}</span><span className="text-[14px] font-semibold text-[#2C6E9E]">{p}</span></div>
            ))}
          </div>
        </div>
        <div className="flex w-[340px] flex-col rounded-[14px] border border-[#E5E9EF] bg-white p-5">
          <div className="flex pb-3"><span className="flex-1 text-[17px] font-semibold">Current bill</span><span className="text-[13px] font-medium text-[#868B94]">4 items</span></div>
          <span className="rounded-[10px] bg-[#EAF2F8] px-3 py-2.5 text-[13px] font-medium text-[#2C6E9E]">Customer: Lakshmi · 98••• ••210</span>
          {[["Basmati Rice 5kg", "1 × ₹645", "₹645"], ["Fresh Milk 1L", "3 × ₹62", "₹186"], ["Filter Coffee 500g", "1 × ₹290", "₹290"], ["Biscuits Pack", "2 × ₹40", "₹80"]].map(([n, q, a]) => (
            <div key={n} className="flex items-center border-b border-[#E5E9EF] py-3"><div className="flex-1"><p className="text-[14px] font-semibold">{n}</p><p className="text-[13px] text-[#4F5662]">{q}</p></div><span className="text-[14px] font-semibold">{a}</span></div>
          ))}
          <div className="flex-1" />
          {[["Subtotal", "₹1,201"], ["GST (5%)", "₹60"], ["Discount", "– ₹11"]].map(([l, v]) => <div key={l} className="flex py-1 text-[14px] font-medium"><span className="flex-1 text-[#4F5662]">{l}</span><span>{v}</span></div>)}
          <div className="flex items-center pb-3.5 pt-3"><span className="flex-1 text-[18px] font-semibold">Total</span><span className="text-[24px] font-bold">₹1,250</span></div>
          <div className="flex gap-2">{["UPI", "Cash", "Card"].map((l, i) => <span key={l} className={cn("flex-1 rounded-[10px] py-3 text-center text-[15px] font-semibold", i === 0 ? "bg-[#2C6E9E] text-white" : "border border-[#E5E9EF]")}>{l}</span>)}</div>
          <span className="pt-2.5 text-center text-[13px] font-semibold text-[#2C6E9E]">Print bill · Send on WhatsApp</span>
        </div>
      </div>
    </Shell>
  );
}

function CRM() {
  const cols: [string, string, [string, string, string, string, string][]][] = [
    ["New enquiry", "#868B94", [["Sri Murugan Textiles", "POS + Inventory", "₹1.2L", "WhatsApp", "2h"], ["Green Leaf Cafe", "Restaurant POS", "₹65K", "Website", "5h"], ["Arun Clinic", "Clinic app", "₹90K", "Referral", "1d"]]],
    ["Contacted", "#3D85B8", [["KVR Jewellers", "Jewel + Billing", "₹2.4L", "Call", "1d"], ["Bright Kids School", "School app", "₹1.8L", "Website", "2d"]]],
    ["Demo booked", "#2C6E9E", [["Velan Supermarket", "POS · 3 branches", "₹3.6L", "Walk-in", "Tomorrow 11:00"], ["Coastal Stay PG", "Stay app", "₹85K", "WhatsApp", "Fri 4:00"]]],
    ["Proposal sent", "#B87308", [["Sun Hardware", "ERP + Purchase", "₹4.2L", "Referral", "Follow up today"]]],
    ["Won", "#1F9D6C", [["Lotus Pharmacy", "Pharmacy + Billing", "₹1.5L", "Website", "Setup starts Mon"]]],
  ];
  return (
    <Shell id="crm" title="Sales pipeline" sub="42 open deals · ₹18.6L in pipeline" actions={<><Btn>This month ▾</Btn><Btn primary>+ New deal</Btn></>}>
      <div className="flex flex-1 gap-3.5 p-6">
        {cols.map(([name, color, deals]) => (
          <div key={name} className="flex flex-1 flex-col gap-2.5 rounded-[14px] bg-[#EEF2F6] p-2.5">
            <div className="flex items-center gap-2 px-1 pb-1"><span className="h-2 w-2 rounded-full" style={{ background: color }} /><span className="flex-1 text-[14px] font-semibold">{name}</span><span className="text-[13px] font-semibold text-[#868B94]">{deals.length}</span></div>
            {deals.map(([co, need, val, src, next]) => (
              <div key={co} className="flex flex-col gap-2 rounded-xl border border-[#E5E9EF] bg-white p-3.5">
                <span className="text-[14px] font-semibold">{co}</span><span className="text-[13px] font-medium text-[#4F5662]">{need}</span>
                <div className="flex items-center"><span className="flex-1 text-[14px] font-semibold text-[#2C6E9E]">{val}</span><Pill tone="grey">{src}</Pill></div>
                <span className={cn("text-[12px] font-medium", name === "Won" ? "text-[#1F9D6C]" : next.includes("today") ? "text-[#B87308]" : "text-[#868B94]")}>⏱ {next}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Clinic() {
  const hours = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"];
  const appts: [number, number, number, string, string, "done" | "now" | "next" | "block"][] = [[0, 0, 1, "Ramesh K.", "Fever · Follow-up", "done"], [0, 1, 1, "Divya P.", "Consultation · Now", "now"], [0, 2.25, 1, "Selvam A.", "BP review", "next"], [0, 4, 1.5, "Health camp", "Blocked", "block"], [1, 0.5, 1, "Baby Aadhya", "Vaccination", "done"], [1, 2, 1, "Kavin (8 yrs)", "Cough & cold", "next"], [1, 3.5, 1, "Nila (4 yrs)", "Check-up", "next"], [2, 0, 1.25, "Sneha R.", "Skin consultation", "done"], [2, 2.25, 1, "Imran M.", "Follow-up", "next"], [2, 5, 1, "Priya V.", "Consultation", "next"]];
  const sty = { done: "bg-[#EEF1F5] text-[#4F5662]", now: "bg-[#2C6E9E] text-white", next: "bg-[#EAF2F8] text-[#235A82]", block: "bg-[#FDF3E2] text-[#8A5606]" };
  const rowH = 77;
  return (
    <Shell id="clinic" title="Appointments" sub="28 booked · 6 waiting · 3 doctors" actions={<><Btn>‹ Thu, 15 Oct ›</Btn><Btn primary>+ New appointment</Btn></>}>
      <div className="flex flex-1 gap-4 p-6">
        <div className="flex flex-1 flex-col overflow-hidden rounded-[14px] border border-[#E5E9EF] bg-white">
          <div className="flex border-b border-[#E5E9EF]">
            <span className="w-16 shrink-0" />
            {[["Dr. Meena R.", "General physician"], ["Dr. Arjun K.", "Paediatrics"], ["Dr. Fathima S.", "Dermatology"]].map(([n, s]) => <div key={n} className="flex-1 border-l border-[#E5E9EF] px-3.5 py-3"><p className="text-[14px] font-semibold">{n}</p><p className="text-[12px] font-medium text-[#868B94]">{s}</p></div>)}
          </div>
          <div className="relative flex-1">
            {hours.map((h, i) => <div key={h} className="absolute inset-x-0 border-t border-[#EEF1F5]" style={{ top: i * rowH }}><span className="ml-3 mt-1.5 inline-block text-[12px] font-medium text-[#868B94]">{h}</span></div>)}
            {[0, 1, 2].map((k) => <div key={k} className="absolute bottom-0 top-0 w-px bg-[#E5E9EF]" style={{ left: `calc(64px + ${k} * (100% - 64px) / 3)` }} />)}
            {appts.map(([c, st, dur, n, why, kind]) => (
              <div key={n} className={cn("absolute flex flex-col gap-0.5 rounded-lg px-3 py-2.5", sty[kind])} style={{ left: `calc(64px + ${c} * (100% - 64px) / 3 + 6px)`, width: "calc((100% - 64px) / 3 - 12px)", top: st * rowH + 3, height: dur * rowH - 6 }}>
                <span className="text-[14px] font-semibold">{n}</span><span className="text-[12px] font-medium">{why}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-[280px] flex-col gap-3 rounded-[14px] border border-[#E5E9EF] bg-white p-5">
          <span className="text-[17px] font-semibold">Waiting room</span>
          <div className="flex flex-col gap-1 rounded-xl bg-[#2C6E9E] p-3.5 text-white"><span className="text-[11px] font-semibold text-[#BFD9EC]">NOW SERVING · TOKEN 14</span><span className="text-[18px] font-semibold">Divya P.</span><span className="text-[13px] font-medium text-[#DCEAF4]">Dr. Meena R. · Room 2</span></div>
          {[["15", "Selvam A.", "~10 min"], ["16", "Kavin (8 yrs)", "~15 min"], ["17", "Imran M.", "~25 min"], ["18", "Walk-in", "~35 min"]].map(([t, n, w]) => (
            <div key={t} className="flex items-center gap-2.5 border-b border-[#E5E9EF] py-2"><span className="rounded-md bg-[#EAF2F8] px-2 py-1 text-[13px] font-bold text-[#2C6E9E]">{t}</span><span className="flex-1 text-[14px] font-semibold">{n}</span><span className="text-[12px] font-medium text-[#868B94]">{w}</span></div>
          ))}
          <span className="rounded-[10px] bg-[#E6F4EE] px-3 py-2.5 text-[13px] font-semibold text-[#146C4B]">✓ 24 WhatsApp reminders sent today</span>
        </div>
      </div>
    </Shell>
  );
}

const Th = ({ children, className }: { children: React.ReactNode; className?: string }) => <span className={cn("text-[12px] font-semibold uppercase tracking-wide text-[#868B94]", className)}>{children}</span>;

function Stat({ l, v, d, tone }: { l: string; v: string; d: string; tone: string }) {
  return <Card className="flex flex-col gap-1.5 py-4"><span className="text-[13px] font-medium text-[#4F5662]">{l}</span><span className="text-[24px] font-semibold leading-tight">{v}</span><span className={cn("text-[12px] font-semibold", tone)}>{d}</span></Card>;
}

function Inventory() {
  const rows: [string, string, string, string, string, string, "green" | "amber" | "grey"][] = [
    ["Basmati Rice 5kg", "RIC-005", "64", "38", "220", "Healthy", "green"],
    ["Toor Dal 1kg", "DAL-001", "12", "6", "40", "Low · reorder", "amber"],
    ["Sunflower Oil 1L", "OIL-101", "88", "52", "310", "Healthy", "green"],
    ["Fresh Milk 1L", "MLK-001", "18", "9", "—", "Batch exp. 17 Oct", "amber"],
    ["Filter Coffee 500g", "COF-500", "26", "14", "75", "Healthy", "green"],
    ["Green Tea 100g", "TEA-100", "4", "0", "0", "Out at T. Nagar", "amber"],
    ["Wheat Atta 5kg", "ATT-005", "41", "29", "160", "Transfer in transit", "grey"],
  ];
  return (
    <Shell id="inventory" title="Inventory" sub="1,248 items · 2 stores · 1 warehouse" actions={<><Btn>All locations ▾</Btn><Btn primary>+ Stock transfer</Btn></>}>
      <div className="flex flex-1 gap-5 px-7 py-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-4 gap-3.5">
            <Stat l="Stock value" v="₹18.4L" d="Across 3 locations" tone="text-[#4F5662]" />
            <Stat l="Low stock" v="7 items" d="Reorder suggested" tone="text-[#B87308]" />
            <Stat l="Expiring ≤ 30 days" v="12 batches" d="Sell first (FEFO)" tone="text-[#C2412D]" />
            <Stat l="In transit" v="2 transfers" d="Warehouse → T. Nagar" tone="text-[#2C6E9E]" />
          </div>
          <Card className="flex-1 px-5 pb-1 pt-4">
            <div className="flex gap-3 pb-3"><Th className="flex-1">Item</Th><Th className="w-[90px]">SKU</Th><Th className="w-[90px] text-right">Anna Nagar</Th><Th className="w-[80px] text-right">T. Nagar</Th><Th className="w-[90px] text-right">Warehouse</Th><Th className="w-[150px] text-right">Status</Th></div>
            {rows.map(([n, sku, a, t, w, s, tone]) => (
              <div key={n} className="flex items-center gap-3 border-t border-[#E5E9EF] py-[11px] text-[14px]">
                <span className="flex-1 font-semibold">{n}</span><span className="w-[90px] text-[13px] text-[#4F5662]">{sku}</span>
                <span className="w-[90px] text-right font-medium">{a}</span><span className={cn("w-[80px] text-right font-medium", t === "0" && "text-[#C2412D]")}>{t}</span><span className="w-[90px] text-right font-medium">{w}</span>
                <span className="flex w-[150px] justify-end"><Pill tone={tone}>{s}</Pill></span>
              </div>
            ))}
          </Card>
        </div>
        <div className="flex w-[300px] flex-col gap-3 rounded-[14px] border border-[#E5E9EF] bg-white p-5">
          <span className="text-[17px] font-semibold">Reorder suggestions</span>
          <span className="text-[13px] text-[#4F5662]">Based on last 30 days of sales</span>
          {[["Toor Dal 1kg", "Sri Balaji Traders", "120 units"], ["Green Tea 100g", "Nilgiri Tea Co.", "60 units"], ["Biscuits Pack", "Sunrise Foods", "240 units"], ["Fresh Milk 1L", "Aavin dealer", "Daily · 80"]].map(([n, v, q]) => (
            <div key={n} className="flex flex-col gap-0.5 border-b border-[#E5E9EF] py-2.5"><div className="flex text-[14px]"><span className="flex-1 font-semibold">{n}</span><span className="font-semibold text-[#2C6E9E]">{q}</span></div><span className="text-[12px] font-medium text-[#868B94]">{v}</span></div>
          ))}
          <div className="flex-1" />
          <span className="rounded-[10px] bg-[#2C6E9E] py-3 text-center text-[15px] font-semibold text-white">Create purchase orders</span>
        </div>
      </div>
    </Shell>
  );
}

function Invoice() {
  const list: [string, string, string, string, "green" | "amber" | "grey" | "blue"][] = [
    ["INV-0412", "Priya Stores", "₹8,560", "Due in 3 days", "amber"],
    ["INV-0411", "KVR Jewellers", "₹42,300", "Paid · UPI", "green"],
    ["INV-0410", "Green Leaf Cafe", "₹12,980", "Overdue 6 days", "amber"],
    ["INV-0409", "Sun Hardware", "₹1,18,000", "Part paid", "blue"],
    ["INV-0408", "Lotus Pharmacy", "₹6,240", "Paid · Bank", "green"],
    ["INV-0407", "Arun Clinic", "₹9,440", "Draft", "grey"],
  ];
  return (
    <Shell id="invoice" title="Invoices" sub="October · 184 invoices" actions={<><Btn>This month ▾</Btn><Btn primary>+ New invoice</Btn></>}>
      <div className="flex flex-1 gap-5 px-7 py-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-3 gap-3.5">
            <Stat l="Billed this month" v="₹14.8L" d="184 invoices" tone="text-[#4F5662]" />
            <Stat l="Collected" v="₹11.2L" d="76% collected" tone="text-[#1F9D6C]" />
            <Stat l="Outstanding" v="₹3.6L" d="₹84K overdue > 30 days" tone="text-[#C2412D]" />
          </div>
          <Card className="flex-1 px-5 pb-1 pt-4">
            <div className="flex gap-3 pb-3"><Th className="w-[100px]">Invoice</Th><Th className="flex-1">Customer</Th><Th className="w-[110px] text-right">Amount</Th><Th className="w-[150px] text-right">Status</Th></div>
            {list.map(([no, c, a, s, tone], i) => (
              <div key={no} className={cn("flex items-center gap-3 border-t border-[#E5E9EF] py-3 text-[14px]", i === 0 && "-mx-2 rounded-lg bg-[#F3F8FC] px-2")}>
                <span className="w-[100px] font-semibold">{no}</span><span className="flex-1 font-medium">{c}</span><span className="w-[110px] text-right font-semibold">{a}</span><span className="flex w-[150px] justify-end"><Pill tone={tone}>{s}</Pill></span>
              </div>
            ))}
          </Card>
        </div>
        <div className="flex w-[400px] flex-col rounded-[14px] border border-[#E5E9EF] bg-white p-6">
          <div className="flex items-start"><div className="flex-1"><p className="text-[18px] font-bold">TAX INVOICE</p><p className="text-[12px] text-[#4F5662]">INV-0412 · 15 Oct 2026</p></div><span className="text-[15px]"><Logo /></span></div>
          <div className="mt-4 flex gap-4 text-[12px] text-[#4F5662]"><div className="flex-1"><p className="font-semibold text-[#1B2733]">Billed to</p><p>Priya Stores, Chennai</p><p>GSTIN 33ABCDE1234F1Z5</p></div><div className="flex-1"><p className="font-semibold text-[#1B2733]">Place of supply</p><p>Tamil Nadu (33)</p></div></div>
          <div className="mt-4 border-y border-[#E5E9EF] py-2">
            {[["Basmati Rice 5kg × 8", "₹5,160"], ["Sunflower Oil 1L × 12", "₹1,860"], ["Filter Coffee 500g × 4", "₹1,160"]].map(([n, a]) => <div key={n} className="flex py-1.5 text-[13px]"><span className="flex-1 font-medium">{n}</span><span className="font-semibold">{a}</span></div>)}
          </div>
          {[["Taxable value", "₹8,180"], ["CGST 2.5%", "₹190"], ["SGST 2.5%", "₹190"]].map(([l, v]) => <div key={l} className="flex py-1 text-[13px]"><span className="flex-1 text-[#4F5662]">{l}</span><span className="font-medium">{v}</span></div>)}
          <div className="flex items-center border-t border-[#E5E9EF] pt-2.5"><span className="flex-1 text-[16px] font-semibold">Total</span><span className="text-[22px] font-bold">₹8,560</span></div>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#F3F8FC] p-3">
            <div className="grid h-[58px] w-[58px] grid-cols-5 gap-[2px] rounded-md bg-white p-1.5">{Array.from({ length: 25 }).map((_, i) => <span key={i} className={cn("rounded-[1px]", [0, 1, 3, 4, 5, 7, 9, 11, 12, 15, 17, 19, 20, 21, 23, 24].includes(i) ? "bg-[#1B2733]" : "bg-white")} />)}</div>
            <div className="text-[12px]"><p className="font-semibold">Scan to pay with UPI</p><p className="text-[#4F5662]">Payment link sent on WhatsApp</p></div>
          </div>
          <div className="flex-1" />
          <span className="rounded-[10px] bg-[#E6F4EE] px-3 py-2.5 text-[13px] font-semibold text-[#146C4B]">✓ Reminder scheduled for 18 Oct</span>
        </div>
      </div>
    </Shell>
  );
}

function Restaurant() {
  const tables: [string, string, "free" | "busy" | "bill" | "kot"][] = [["T1", "Free", "free"], ["T2", "₹1,240 · 45m", "busy"], ["T3", "Free", "free"], ["T4", "Bill printed", "bill"], ["T5", "₹860 · 20m", "busy"], ["T6", "KOT sent · 4", "kot"], ["T7", "Free", "free"], ["T8", "₹2,180 · 1h", "busy"], ["T9", "Free", "free"], ["T10", "₹540 · 10m", "busy"], ["T11", "Bill printed", "bill"], ["T12", "Free", "free"]];
  const sty = { free: "border-[#E5E9EF] bg-white text-[#868B94]", busy: "border-[#BFD6E8] bg-[#EAF2F8] text-[#235A82]", bill: "border-[#F3D9A6] bg-[#FDF3E2] text-[#8A5606]", kot: "border-[#2C6E9E] bg-[#2C6E9E] text-white" };
  return (
    <Shell id="restaurant" title="Tables" sub="Dine-in · 6 of 12 tables occupied" actions={<><Btn>Dine-in ▾</Btn><Btn>Takeaway</Btn><Btn primary>+ New order</Btn></>}>
      <div className="flex flex-1 gap-5 px-7 py-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex gap-2">{["Ground floor", "First floor", "Outdoor"].map((c, i) => <span key={c} className={cn("rounded-full px-3.5 py-1.5 text-[13px] font-semibold", i === 0 ? "bg-[#2C6E9E] text-white" : "border border-[#E5E9EF] bg-white text-[#4F5662]")}>{c}</span>)}</div>
          <div className="grid grid-cols-4 gap-3.5">
            {tables.map(([t, s, k]) => <div key={t} className={cn("flex h-[104px] flex-col justify-between rounded-[14px] border-[1.5px] p-3.5", sty[k])}><span className="text-[20px] font-bold">{t}</span><span className="text-[13px] font-semibold">{s}</span></div>)}
          </div>
          <Card className="flex items-center gap-4 py-3.5">
            <span className="text-[14px] font-semibold">Kitchen queue</span>
            {[["T6", "Paneer Butter Masala ×2", "Cooking"], ["T2", "Filter Coffee ×3", "Ready"], ["Takeaway #18", "Veg Biryani ×2", "New"]].map(([t, n, s]) => <span key={t} className="flex items-center gap-2 rounded-lg bg-[#F5F8FB] px-3 py-1.5 text-[13px]"><b>{t}</b><span className="text-[#4F5662]">{n}</span><Pill tone={s === "Ready" ? "green" : s === "New" ? "blue" : "amber"}>{s}</Pill></span>)}
          </Card>
        </div>
        <div className="flex w-[330px] flex-col rounded-[14px] border border-[#E5E9EF] bg-white p-5">
          <div className="flex pb-3"><span className="flex-1 text-[17px] font-semibold">Table 6 · KOT #212</span><span className="text-[13px] font-medium text-[#868B94]">Waiter: Kumar</span></div>
          {[["Paneer Butter Masala", "2 × ₹240", "₹480"], ["Butter Naan", "4 × ₹45", "₹180"], ["Veg Biryani", "1 × ₹220", "₹220"], ["Fresh Lime Soda", "2 × ₹70", "₹140"]].map(([n, q, a]) => (
            <div key={n} className="flex items-center border-b border-[#E5E9EF] py-3"><div className="flex-1"><p className="text-[14px] font-semibold">{n}</p><p className="text-[13px] text-[#4F5662]">{q}</p></div><span className="text-[14px] font-semibold">{a}</span></div>
          ))}
          <span className="mt-2 rounded-lg bg-[#FDF3E2] px-3 py-2 text-[12px] font-semibold text-[#8A5606]">Note: less spicy, no onion in biryani</span>
          <div className="flex-1" />
          {[["Subtotal", "₹1,020"], ["GST (5%)", "₹51"]].map(([l, v]) => <div key={l} className="flex py-1 text-[14px] font-medium"><span className="flex-1 text-[#4F5662]">{l}</span><span>{v}</span></div>)}
          <div className="flex items-center pb-3.5 pt-2"><span className="flex-1 text-[18px] font-semibold">Total</span><span className="text-[24px] font-bold">₹1,071</span></div>
          <div className="flex gap-2"><span className="flex-1 rounded-[10px] border border-[#E5E9EF] py-3 text-center text-[14px] font-semibold">Print KOT</span><span className="flex-1 rounded-[10px] bg-[#2C6E9E] py-3 text-center text-[14px] font-semibold text-white">Generate bill</span></div>
        </div>
      </div>
    </Shell>
  );
}

function People() {
  const staff: [string, string, string, string, "green" | "amber" | "grey" | "blue"][] = [
    ["Ravi Kumar", "Cashier · Anna Nagar", "09:02", "Present", "green"],
    ["Meena S.", "Store manager · T. Nagar", "08:55", "Present", "green"],
    ["Arjun P.", "Delivery · Warehouse", "09:41", "Late 41 min", "amber"],
    ["Fathima R.", "Accounts · Head office", "—", "On leave", "blue"],
    ["Selvam A.", "Helper · Anna Nagar", "—", "Absent", "grey"],
    ["Divya K.", "Cashier · T. Nagar", "09:00", "Present", "green"],
  ];
  return (
    <Shell id="people" title="Attendance" sub="Thursday, 15 October · 42 employees" actions={<><Btn>All branches ▾</Btn><Btn primary>Run payroll</Btn></>}>
      <div className="flex flex-1 gap-5 px-7 py-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-4 gap-3.5">
            <Stat l="Present" v="36" d="86% today" tone="text-[#1F9D6C]" />
            <Stat l="Late" v="3" d="After 9:15 AM" tone="text-[#B87308]" />
            <Stat l="On leave" v="2" d="Approved" tone="text-[#2C6E9E]" />
            <Stat l="Absent" v="1" d="Not informed" tone="text-[#C2412D]" />
          </div>
          <Card className="flex-1 px-5 pb-1 pt-4">
            <div className="flex gap-3 pb-3"><Th className="flex-1">Employee</Th><Th className="w-[90px]">Check-in</Th><Th className="w-[140px] text-right">Status</Th></div>
            {staff.map(([n, r, t, s, tone]) => (
              <div key={n} className="flex items-center gap-3 border-t border-[#E5E9EF] py-2.5 text-[14px]">
                <span className="h-8 w-8 rounded-full bg-[#BFD6E8]" /><div className="flex-1"><p className="font-semibold">{n}</p><p className="text-[12px] text-[#868B94]">{r}</p></div><span className="w-[90px] font-medium">{t}</span><span className="flex w-[140px] justify-end"><Pill tone={tone}>{s}</Pill></span>
              </div>
            ))}
          </Card>
        </div>
        <div className="flex w-[310px] flex-col gap-4">
          <Card className="flex flex-col gap-3">
            <span className="text-[16px] font-semibold">Leave requests</span>
            {[["Divya K.", "18–19 Oct · Family function"], ["Arjun P.", "21 Oct · Medical"]].map(([n, d]) => (
              <div key={n} className="flex flex-col gap-2 border-t border-[#E5E9EF] pt-3"><p className="text-[14px] font-semibold">{n}</p><p className="text-[13px] text-[#4F5662]">{d}</p><div className="flex gap-2"><span className="flex-1 rounded-lg bg-[#2C6E9E] py-2 text-center text-[13px] font-semibold text-white">Approve</span><span className="flex-1 rounded-lg border border-[#E5E9EF] py-2 text-center text-[13px] font-semibold">Decline</span></div></div>
            ))}
          </Card>
          <Card className="flex flex-col gap-2">
            <span className="text-[16px] font-semibold">October payroll</span>
            {[["Gross salary", "₹7,84,000"], ["PF + ESI", "₹68,420"], ["Advances recovered", "₹22,000"]].map(([l, v]) => <div key={l} className="flex text-[14px]"><span className="flex-1 text-[#4F5662]">{l}</span><span className="font-semibold">{v}</span></div>)}
            <span className="mt-1 rounded-[10px] bg-[#EAF2F8] px-3 py-2 text-[13px] font-semibold text-[#2C6E9E]">Payslips ready on 31 Oct</span>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function Stay() {
  const rooms: [string, ("p" | "d" | "v")[]][] = [["101", ["p", "p", "d"]], ["102", ["p", "p", "p"]], ["103", ["p", "v", "v"]], ["104", ["p", "p"]], ["201", ["p", "d", "p"]], ["202", ["p", "p", "p"]], ["203", ["v", "p"]], ["204", ["p", "p", "d"]]];
  const bed = { p: "bg-[#2C6E9E]", d: "bg-[#E7A33E]", v: "bg-[#E5E9EF]" };
  return (
    <Shell id="stay" title="Rooms & beds" sub="Palm Residency · 22 beds · 18 occupied" actions={<><Btn>All floors ▾</Btn><Btn primary>+ Add resident</Btn></>}>
      <div className="flex flex-1 gap-5 px-7 py-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-4 gap-3.5">
            <Stat l="Occupancy" v="82%" d="18 of 22 beds" tone="text-[#1F9D6C]" />
            <Stat l="Rent collected" v="₹2.1L" d="October" tone="text-[#1F9D6C]" />
            <Stat l="Dues pending" v="₹38,500" d="4 residents" tone="text-[#C2412D]" />
            <Stat l="Open complaints" v="3" d="1 urgent" tone="text-[#B87308]" />
          </div>
          <div className="grid grid-cols-4 gap-3.5">
            {rooms.map(([r, beds]) => (
              <Card key={r} className="flex flex-col gap-3 p-4"><div className="flex"><span className="flex-1 text-[16px] font-bold">Room {r}</span><span className="text-[12px] font-medium text-[#868B94]">{beds.length}-sharing</span></div><div className="flex gap-1.5">{beds.map((b, i) => <span key={i} className={cn("h-7 flex-1 rounded-md", bed[b])} />)}</div></Card>
            ))}
          </div>
          <div className="flex gap-4 text-[13px] font-medium text-[#4F5662]"><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-[#2C6E9E]" />Paid</span><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-[#E7A33E]" />Rent due</span><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-[#E5E9EF]" />Vacant</span></div>
        </div>
        <div className="flex w-[310px] flex-col gap-4">
          <Card className="flex flex-col gap-2.5">
            <span className="text-[16px] font-semibold">Rent due</span>
            {[["Karthik · 101-C", "₹9,500 · 5 days"], ["Naveen · 201-B", "₹9,000 · 2 days"], ["Rahul · 204-C", "₹10,000 · today"]].map(([n, d]) => <div key={n} className="flex border-t border-[#E5E9EF] pt-2.5 text-[14px]"><span className="flex-1 font-semibold">{n}</span><span className="text-[13px] font-medium text-[#C2412D]">{d}</span></div>)}
            <span className="rounded-[10px] bg-[#E6F4EE] px-3 py-2 text-[13px] font-semibold text-[#146C4B]">✓ WhatsApp reminders sent</span>
          </Card>
          <Card className="flex flex-col gap-2.5">
            <span className="text-[16px] font-semibold">Complaints</span>
            {[["Room 103 · Geyser not working", "Urgent", "amber"], ["Room 202 · Wi-Fi slow", "Assigned", "blue"], ["Room 104 · Cleaning", "Resolved", "green"]].map(([n, s, t]) => <div key={n} className="flex items-center gap-2 border-t border-[#E5E9EF] pt-2.5 text-[13px]"><span className="flex-1 font-medium">{n}</span><Pill tone={t as "amber" | "blue" | "green"}>{s}</Pill></div>)}
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function Loan() {
  const rows: [string, string, string, string, string, "green" | "amber" | "grey" | "blue"][] = [
    ["P-1182", "Murugan S.", "24.5 g · 22K", "₹1,10,000", "₹2,640", "green"],
    ["P-1181", "Lakshmi R.", "12.0 g · 22K", "₹52,000", "₹1,248", "green"],
    ["P-1176", "Saravanan K.", "38.2 g · 22K", "₹1,75,000", "₹8,400", "amber"],
    ["P-1170", "Kavitha M.", "8.4 g · 18K", "₹30,000", "₹720", "blue"],
    ["P-1164", "Rajesh P.", "16.8 g · 22K", "₹76,000", "₹5,472", "amber"],
    ["P-1158", "Anitha V.", "20.0 g · 22K", "₹90,000", "Closed", "grey"],
  ];
  const label = { green: "Active", amber: "Overdue", blue: "Renewed", grey: "Closed" };
  return (
    <Shell id="loan" title="Pledges" sub="412 active pledges · Gold rate ₹6,850/g (22K)" actions={<><Btn>Today ▾</Btn><Btn primary>+ New pledge</Btn></>}>
      <div className="flex flex-1 gap-5 px-7 py-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-4 gap-3.5">
            <Stat l="Loan outstanding" v="₹2.84 Cr" d="412 pledges" tone="text-[#4F5662]" />
            <Stat l="Interest due" v="₹6.2L" d="This month" tone="text-[#2C6E9E]" />
            <Stat l="Overdue" v="27" d="> 12 months: 4" tone="text-[#C2412D]" />
            <Stat l="Collected today" v="₹1.36L" d="18 receipts" tone="text-[#1F9D6C]" />
          </div>
          <Card className="flex-1 px-5 pb-1 pt-4">
            <div className="flex gap-3 pb-3"><Th className="w-[80px]">Pledge</Th><Th className="flex-1">Customer</Th><Th className="w-[120px]">Gold</Th><Th className="w-[110px] text-right">Loan</Th><Th className="w-[100px] text-right">Interest</Th><Th className="w-[100px] text-right">Status</Th></div>
            {rows.map(([p, c, g, l, i, t]) => (
              <div key={p} className="flex items-center gap-3 border-t border-[#E5E9EF] py-[11px] text-[14px]">
                <span className="w-[80px] font-semibold">{p}</span><span className="flex-1 font-medium">{c}</span><span className="w-[120px] text-[13px] text-[#4F5662]">{g}</span><span className="w-[110px] text-right font-semibold">{l}</span><span className="w-[100px] text-right font-medium">{i}</span><span className="flex w-[100px] justify-end"><Pill tone={t}>{label[t]}</Pill></span>
              </div>
            ))}
          </Card>
        </div>
        <div className="flex w-[310px] flex-col rounded-[14px] border border-[#E5E9EF] bg-white p-5">
          <span className="text-[12px] font-semibold text-[#868B94]">PLEDGE P-1176</span>
          <span className="text-[18px] font-semibold">Saravanan K.</span>
          <span className="text-[13px] text-[#4F5662]">KYC verified · 3 previous pledges</span>
          <div className="mt-3 flex flex-col gap-1.5 rounded-xl bg-[#F5F8FB] p-3.5 text-[13px]">
            {[["Items", "Chain, 2 rings"], ["Net weight", "38.2 g · 22K"], ["Loan amount", "₹1,75,000"], ["Interest", "1.5% / month"], ["Pledged on", "12 Jun 2026"], ["Interest due", "₹8,400"]].map(([l, v]) => <div key={l} className="flex"><span className="flex-1 text-[#4F5662]">{l}</span><span className="font-semibold">{v}</span></div>)}
          </div>
          <div className="flex-1" />
          <div className="flex gap-2"><span className="flex-1 rounded-[10px] border border-[#E5E9EF] py-3 text-center text-[14px] font-semibold">Renew</span><span className="flex-1 rounded-[10px] bg-[#2C6E9E] py-3 text-center text-[14px] font-semibold text-white">Collect & print</span></div>
        </div>
      </div>
    </Shell>
  );
}

export const screens: Record<ScreenId, { label: string; app: string; url: string; Component: () => React.ReactElement }> = {
  dashboard: { label: "Owner dashboard", app: "analytics", url: "app.camuslabs.com/dashboard", Component: Dashboard },
  pos: { label: "POS billing", app: "pos", url: "app.camuslabs.com/pos", Component: POS },
  crm: { label: "CRM pipeline", app: "crm", url: "app.camuslabs.com/crm", Component: CRM },
  clinic: { label: "Clinic appointments", app: "clinic", url: "app.camuslabs.com/clinic", Component: Clinic },
  inventory: { label: "Inventory", app: "inventory", url: "app.camuslabs.com/inventory", Component: Inventory },
  invoice: { label: "GST invoices", app: "billing", url: "app.camuslabs.com/invoices", Component: Invoice },
  restaurant: { label: "Restaurant tables", app: "restaurant-pos", url: "app.camuslabs.com/tables", Component: Restaurant },
  people: { label: "Attendance & payroll", app: "people", url: "app.camuslabs.com/people", Component: People },
  stay: { label: "Rooms & rent", app: "stay", url: "app.camuslabs.com/stay", Component: Stay },
  loan: { label: "Gold loan pledges", app: "gold-loan", url: "app.camuslabs.com/pledges", Component: Loan },
};
