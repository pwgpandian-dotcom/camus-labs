/**
 * Product UI mockups (designed in Figma: "Camus — Brand & Website" → Screen / *).
 * Each screen is laid out at a fixed 1280×800 design size; <ScreenFrame> scales it
 * to fit its container. Sample data is illustrative only.
 */
import { AppIcon } from "@/components/brand/AppIcon";
import { Logo } from "@/components/brand/Logo";
import { getApp } from "@/lib/apps";
import { cn } from "@/lib/cn";

export type ScreenId = "dashboard" | "pos" | "crm" | "clinic";

const navs: Record<ScreenId, [string, string][]> = {
  dashboard: [["Dashboard", "analytics"], ["POS", "pos"], ["Billing", "billing"], ["Inventory", "inventory"], ["CRM", "crm"], ["Bookings", "bookings"], ["People", "people"], ["Reports", "reports"]],
  pos: [["Dashboard", "analytics"], ["POS", "pos"], ["Billing", "billing"], ["Inventory", "inventory"], ["CRM", "crm"], ["Bookings", "bookings"], ["People", "people"], ["Reports", "reports"]],
  crm: [["Dashboard", "analytics"], ["CRM", "crm"], ["Leads", "leads"], ["Campaigns", "campaigns"], ["Quotes", "quotes"], ["Inbox", "inbox"], ["Reports", "reports"]],
  clinic: [["Dashboard", "analytics"], ["Appointments", "bookings"], ["Patients", "clinic"], ["Billing", "billing"], ["Pharmacy", "pharmacy"], ["Staff", "people"], ["Reports", "reports"]],
};
const active: Record<ScreenId, string> = { dashboard: "Dashboard", pos: "POS", crm: "CRM", clinic: "Appointments" };

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
  const items: [string, string, string][] = [["Basmati Rice 5kg", "₹645", "#E9D8B8"], ["Toor Dal 1kg", "₹168", "#F2D46B"], ["Fresh Milk 1L", "₹62", "#DCEBF7"], ["Sunflower Oil 1L", "₹155", "#F5E3A1"], ["Filter Coffee 500g", "₹290", "#B78E6B"], ["Wheat Atta 5kg", "₹265", "#E8DCC7"], ["Biscuits Pack", "₹40", "#F0C9A5"], ["Green Tea 100g", "₹199", "#BFE0C4"]];
  return (
    <Shell id="pos" title="New bill" sub="Cashier: Ravi · Bill #INV-2042" actions={<><Btn>Counter 1 · Anna Nagar ▾</Btn><span className="h-9 w-9 rounded-full bg-[#3D85B8]" /></>}>
      <div className="flex flex-1 gap-5 px-7 py-6">
        <div className="flex flex-1 flex-col gap-4">
          <span className="rounded-xl border-[1.5px] border-[#3D85B8] bg-white px-4 py-3 text-[15px] text-[#868B94]">Scan barcode or search item…</span>
          <div className="flex gap-2">{["All", "Groceries", "Dairy", "Snacks", "Beverages", "Personal care"].map((c, i) => <span key={c} className={cn("rounded-full px-3.5 py-1.5 text-[13px] font-semibold", i === 0 ? "bg-[#2C6E9E] text-white" : "border border-[#E5E9EF] bg-white text-[#4F5662]")}>{c}</span>)}</div>
          <div className="grid grid-cols-4 gap-3">
            {items.map(([n, p, c]) => (
              <div key={n} className="flex flex-col gap-2 rounded-xl border border-[#E5E9EF] bg-white p-3"><div className="h-16 rounded-lg" style={{ background: c }} /><span className="text-[13px] font-semibold">{n}</span><span className="text-[14px] font-semibold text-[#2C6E9E]">{p}</span></div>
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

export const screens: Record<ScreenId, { label: string; app: string; url: string; Component: () => React.ReactElement }> = {
  dashboard: { label: "Owner dashboard", app: "analytics", url: "app.camuslabs.com/dashboard", Component: Dashboard },
  pos: { label: "POS billing", app: "pos", url: "app.camuslabs.com/pos", Component: POS },
  crm: { label: "CRM pipeline", app: "crm", url: "app.camuslabs.com/crm", Component: CRM },
  clinic: { label: "Clinic appointments", app: "clinic", url: "app.camuslabs.com/clinic", Component: Clinic },
};
