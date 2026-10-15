/**
 * Rich product-page content for the core Camus apps (/apps/[slug]).
 * Apps without an entry here still get a complete page built from apps.ts.
 *
 * Keep claims honest: integrations are marked Live or Planned, and nothing here
 * promises numbers we cannot show (no invented "% faster" stats).
 */
import type { ScreenId } from "@/components/product/ProductScreens";

export interface AppDetail {
  /** Outcome-first headline for the hero. */
  headline: string;
  sub: string;
  screen: ScreenId;
  /** "How it helps you" — outcomes, not features. */
  helps: { title: string; body: string }[];
  /** Tabbed feature explorer. */
  explore: { tab: string; title: string; body: string; points: string[]; screen: ScreenId }[];
  /** "A day with Camus X" timeline. */
  day: { time: string; title: string; body: string }[];
  /** Paired rows: life before → life with Camus. */
  compare: [string, string][];
  /** Complete feature list, grouped. */
  groups: { name: string; items: string[] }[];
  forWho: { name: string; line: string; hub?: string }[];
  works: { name: string; status: "Live" | "Planned" }[];
  faq: { q: string; a: string }[];
}

const setupFaq = [
  { q: "Who sets it up?", a: "Our team does. We study how your business runs, configure the app, enter your items or records, and train your staff before go-live." },
  { q: "Can you move my data from Excel or my old software?", a: "Yes. Items, customers, opening stock and balances are migrated from Excel, Tally exports or your current system as part of setup." },
  { q: "What does it cost?", a: "Plans start at ₹5,999/month. A 60-minute guided demo on your own business is ₹3,999. Final scope and price are agreed in writing before work starts." },
];

export const appDetails: Record<string, AppDetail> = {
  pos: {
    headline: "Bill faster at the counter. Know every rupee by closing time.",
    sub: "Camus POS gives your cashiers quick barcode billing and gives you live sales, stock and cash across every counter and branch — on one connected platform.",
    screen: "pos",
    helps: [
      { title: "Shorter queues", body: "Scan, search or tap quick keys. UPI, cash, card and split payments close a bill in seconds." },
      { title: "No more stock surprises", body: "Every sale reduces stock instantly, so low-stock alerts reach you before the shelf is empty." },
      { title: "Customers come back", body: "Every bill builds a customer profile you can reward and reach on WhatsApp." },
      { title: "Clean day-end", body: "Cash, UPI and card totals per counter, matched to bills — no manual tallying at night." },
    ],
    explore: [
      { tab: "Billing", title: "Checkout that keeps the line moving", body: "Built for busy counters: barcode scanning, item search, quick categories and GST calculated automatically on every bill.", points: ["Barcode, search and quick-key billing", "GST-ready bills with HSN codes", "Discounts and offers with manager control", "Print on thermal printer or send on WhatsApp"], screen: "pos" },
      { tab: "Payments", title: "Every way your customers want to pay", body: "Accept UPI, cash and cards, split a bill across modes and record credit sales against the customer.", points: ["UPI QR on the bill", "Split payments across modes", "Credit sales with due tracking", "Refunds and exchanges with reason"], screen: "invoice" },
      { tab: "Inventory", title: "Know what you have, what you need and where", body: "Stock updates with every sale across stores and the warehouse. Reorder suggestions turn into purchase orders in one click.", points: ["Stock by store and warehouse", "Low-stock and reorder alerts", "Batch and expiry tracking", "Transfers between branches"], screen: "inventory" },
      { tab: "Branches", title: "Many counters, one view", body: "Add counters and branches as you grow. Each location keeps its own cash and reports while you see the whole business together.", points: ["Counter-wise cash register", "Branch-wise price lists", "Role-based access for cashiers and managers", "Central item master"], screen: "dashboard" },
      { tab: "Insights", title: "Understand your store inside out", body: "Live sales on the owner's phone, best sellers, slow movers, hourly rush and staff-wise billing — without exporting a single sheet.", points: ["Owner dashboard on mobile", "Item, category and staff reports", "Daily sales summary on WhatsApp", "GST sales register"], screen: "dashboard" },
    ],
    day: [
      { time: "9:00 AM", title: "Open the counter", body: "The cashier logs in, opening cash is recorded, and today's prices and offers are already on every counter." },
      { time: "11:30 AM", title: "Rush hour", body: "Scan, pay by UPI, bill sent on WhatsApp. Stock reduces with every sale across all branches." },
      { time: "3:00 PM", title: "Stock alert", body: "Toor Dal is running low at T. Nagar. The manager moves stock from the warehouse in two taps." },
      { time: "9:30 PM", title: "Close the day", body: "Cash, UPI and card totals match the bills. The owner gets the day's sales summary on WhatsApp." },
    ],
    compare: [
      ["Hand-written or slow billing software", "Barcode billing with GST in seconds"],
      ["Stock checked by walking the shelves", "Live stock per store with reorder alerts"],
      ["Day-end tallying takes an hour", "Counter-wise totals ready at closing"],
      ["Customer details lost after the bill", "Every bill builds a customer profile"],
      ["Owner calls each branch for sales", "All branches live on one dashboard"],
    ],
    groups: [
      { name: "Billing", items: ["Barcode and item search", "Quick keys and categories", "GST, HSN and tax-inclusive pricing", "Discounts, offers and coupons", "Hold and recall bills", "Returns and exchanges"] },
      { name: "Payments", items: ["UPI QR, cash and card", "Split payments", "Credit sales and dues", "Payment reminders on WhatsApp"] },
      { name: "Stock", items: ["Store and warehouse stock", "Reorder points and alerts", "Batch, expiry and variants", "Stock transfers and adjustments"] },
      { name: "Customers", items: ["Customer profiles from every bill", "Purchase history", "Bills on WhatsApp and SMS", "Loyalty points (with Loyalty app)"] },
      { name: "Control", items: ["Roles for cashier, manager, owner", "Counter-wise cash register", "Price lists per branch", "Complete activity log"] },
      { name: "Reports", items: ["Daily sales and GST register", "Item and category performance", "Staff-wise billing", "Branch comparison"] },
    ],
    forWho: [
      { name: "Supermarkets and kirana", line: "High-volume billing, weighing items and fast replenishment.", hub: "retail" },
      { name: "Fashion and apparel", line: "Size and colour variants, exchanges and seasonal offers.", hub: "retail" },
      { name: "Electronics and mobiles", line: "Serial and IMEI tracking with warranty on the bill.", hub: "retail" },
      { name: "Pharmacies", line: "Batch, expiry and schedule-wise billing.", hub: "healthcare" },
      { name: "Bakeries and sweet shops", line: "Weight-based items and quick counter sales." },
      { name: "Hardware and paints", line: "Large catalogues, credit customers and dues." },
    ],
    works: [{ name: "Thermal receipt printers", status: "Live" }, { name: "Barcode scanners", status: "Live" }, { name: "UPI payments", status: "Live" }, { name: "WhatsApp bills and reminders", status: "Live" }, { name: "Weighing scales", status: "Planned" }, { name: "Tally export", status: "Planned" }],
    faq: [
      { q: "What is the difference between POS and billing software?", a: "Billing software creates invoices. A POS runs the counter: fast checkout, payments, cash drawer, stock reduction and day-end close. Camus POS and Camus Billing share the same data, so you can use both." },
      { q: "Does it work for multiple branches?", a: "Yes. Start with one counter and add counters, branches and a warehouse on the same platform, with separate cash and reports for each." },
      { q: "Which hardware do I need?", a: "Any laptop, desktop or Android tablet with a browser, a thermal printer and a barcode scanner. We suggest models during setup." },
      ...setupFaq,
    ],
  },

  "restaurant-pos": {
    headline: "From order to kitchen to bill — without the chaos.",
    sub: "Camus Restaurant POS connects your tables, KOTs, kitchen display, menu and stock, so service stays fast on the busiest night.",
    screen: "restaurant",
    helps: [
      { title: "Faster table turns", body: "See every table's status at a glance and move from order to bill without walking to the counter." },
      { title: "No missed orders", body: "KOTs go straight to the kitchen display with notes, so nothing is lost on paper." },
      { title: "Control food cost", body: "Recipes reduce ingredient stock with every dish, so you know where wastage happens." },
      { title: "Every outlet in one view", body: "Sales, best sellers and expenses for each outlet on your phone." },
    ],
    explore: [
      { tab: "Tables", title: "Your floor, live", body: "Dine-in, takeaway and delivery from one screen. Table colours show free, ordering, KOT sent and bill printed.", points: ["Floor and section layouts", "Merge, split and move tables", "Takeaway and delivery orders", "Waiter assignment"], screen: "restaurant" },
      { tab: "Kitchen", title: "KOTs that reach the kitchen instantly", body: "Orders appear on the kitchen display with notes like 'less spicy'. The kitchen marks dishes ready and the floor knows.", points: ["Kitchen display queue", "Order notes and modifiers", "Station-wise KOT printing", "Ready alerts for waiters"], screen: "restaurant" },
      { tab: "Billing", title: "Bills in a tap, payments any way", body: "Generate the bill from the table, apply offers, split between guests and collect by UPI, card or cash.", points: ["GST bills with service charge", "Split bill between guests", "UPI QR on the bill", "Bill on WhatsApp"], screen: "pos" },
      { tab: "Stock", title: "Ingredients that track themselves", body: "Link dishes to recipes. Every sale reduces ingredient stock and low items reach your purchase list.", points: ["Recipe and ingredient mapping", "Daily stock and wastage entry", "Purchase from vendors", "Expense tracking"], screen: "inventory" },
      { tab: "Insights", title: "Know what sells and when", body: "Best and slow dishes, hourly rush, outlet comparison and day-end summary on WhatsApp.", points: ["Dish and category reports", "Hourly sales", "Outlet comparison", "Daily summary on WhatsApp"], screen: "dashboard" },
    ],
    day: [
      { time: "11:00 AM", title: "Menu ready", body: "Today's specials are added and sold-out dishes hidden across all billing screens." },
      { time: "1:15 PM", title: "Lunch rush", body: "Waiters punch orders at the table, KOTs reach the kitchen display, bills print in a tap." },
      { time: "4:00 PM", title: "Stock check", body: "Paneer and cream are low after lunch. The purchase list is ready for the evening supplier." },
      { time: "11:30 PM", title: "Close the outlet", body: "Sales, expenses and payment modes are matched. The owner sees every outlet's day on WhatsApp." },
    ],
    compare: [
      ["Paper KOTs lost or misread", "KOTs on the kitchen display with notes"],
      ["Bills written at the counter", "Bills generated from the table"],
      ["Ingredient stock guessed", "Recipe-based stock with wastage"],
      ["Sales known only next morning", "Live sales for every outlet"],
    ],
    groups: [
      { name: "Orders", items: ["Dine-in, takeaway, delivery", "Table layouts and status", "Order notes and modifiers", "Merge, split and move tables"] },
      { name: "Kitchen", items: ["Kitchen display", "Station-wise KOT", "Ready alerts"] },
      { name: "Billing", items: ["GST and service charge", "Split bills", "UPI, card and cash", "Bills on WhatsApp"] },
      { name: "Menu", items: ["Categories and variants", "Specials and sold-out", "Outlet-wise prices"] },
      { name: "Stock and costs", items: ["Recipes and ingredients", "Wastage entry", "Purchases and expenses"] },
      { name: "Reports", items: ["Dish performance", "Hourly sales", "Outlet comparison", "Day-end summary"] },
    ],
    forWho: [
      { name: "Restaurants", line: "Tables, KOT and kitchen display for full-service dining.", hub: "hospitality" },
      { name: "Cafés and bakeries", line: "Quick counter billing with takeaway.", hub: "hospitality" },
      { name: "Cloud kitchens", line: "Delivery orders with ingredient stock.", hub: "hospitality" },
      { name: "Food courts and QSR", line: "Fast counter service across stalls." },
    ],
    works: [{ name: "Thermal and KOT printers", status: "Live" }, { name: "UPI payments", status: "Live" }, { name: "WhatsApp bills", status: "Live" }, { name: "Swiggy and Zomato orders", status: "Planned" }, { name: "QR table ordering", status: "Planned" }],
    faq: [
      { q: "Can waiters take orders on a phone or tablet?", a: "Yes. Orders can be punched from any Android phone, tablet or laptop with a browser, and the KOT goes to the kitchen instantly." },
      { q: "Does it support multiple outlets?", a: "Yes. Each outlet has its own menu prices, stock and reports, and the owner sees all outlets together." },
      ...setupFaq,
    ],
  },

  billing: {
    headline: "GST invoices in minutes. Payments collected on time.",
    sub: "Camus Billing creates professional GST invoices, sends them with a UPI payment link on WhatsApp, and follows up until you are paid.",
    screen: "invoice",
    helps: [
      { title: "Get paid faster", body: "Every invoice carries a UPI QR and payment link, with automatic reminders before and after the due date." },
      { title: "Stay GST-ready", body: "CGST, SGST and IGST calculated by place of supply, with HSN codes and a ready sales register." },
      { title: "Know who owes you", body: "Receivables and ageing show exactly which customer is overdue and by how much." },
      { title: "Look professional", body: "Branded invoices, quotes and credit notes on your letterhead, in English or Tamil." },
    ],
    explore: [
      { tab: "Invoices", title: "Professional GST invoices", body: "Create tax invoices, bills of supply and credit notes with your logo. Taxes are calculated automatically from the customer's state.", points: ["CGST, SGST and IGST by place of supply", "HSN and SAC codes", "Credit and debit notes", "Invoice on your letterhead"], screen: "invoice" },
      { tab: "Collections", title: "Payments that chase themselves", body: "Send invoices with a UPI payment link on WhatsApp and let reminders follow up. Record part payments and bank receipts against each invoice.", points: ["UPI QR and payment links", "Automatic WhatsApp reminders", "Part and bulk payments", "Receipts on WhatsApp"], screen: "invoice" },
      { tab: "Quotes", title: "Quote to invoice in one click", body: "Send quotations that customers can accept, then convert them to invoices without retyping anything.", points: ["Quotations and proforma invoices", "Convert to invoice", "Validity and terms"], screen: "crm" },
      { tab: "Reports", title: "Your money, clearly", body: "Sales, receivables, ageing and GST registers in real time — and an Excel export your accountant can use.", points: ["Receivables and ageing", "GST sales register", "Customer statements", "Excel export"], screen: "dashboard" },
    ],
    day: [
      { time: "10:00 AM", title: "Raise invoices", body: "Yesterday's dispatches become GST invoices and go to customers on WhatsApp with a payment link." },
      { time: "1:00 PM", title: "Payment received", body: "A customer pays by UPI. The invoice is marked paid and a receipt goes back automatically." },
      { time: "4:00 PM", title: "Follow up", body: "Reminders go to overdue customers. You call only the two who haven't responded." },
      { time: "Month end", title: "GST time", body: "Your accountant gets the sales register and invoice list in one export." },
    ],
    compare: [
      ["Invoices typed in Word or Excel", "GST invoices generated with taxes auto-calculated"],
      ["Calling customers for payment", "Payment links and reminders on WhatsApp"],
      ["No clear view of dues", "Receivables and ageing in real time"],
      ["Month-end scramble for GST", "GST register ready any day"],
    ],
    groups: [
      { name: "Invoicing", items: ["Tax invoices and bills of supply", "Credit and debit notes", "Recurring invoices", "Multiple GSTINs and branches"] },
      { name: "Collections", items: ["UPI QR and payment links", "Automatic reminders", "Part and bulk payments", "Receipts"] },
      { name: "Sales documents", items: ["Quotations", "Proforma invoices", "Delivery challans"] },
      { name: "Reports", items: ["Receivables and ageing", "GST sales register", "Customer statements", "Excel export"] },
    ],
    forWho: [
      { name: "Distributors and wholesalers", line: "Bulk invoices, credit customers and dues.", hub: "retail" },
      { name: "Service businesses", line: "Agencies, consultants and contractors.", hub: "msme" },
      { name: "Manufacturers", line: "Dispatch invoices and challans.", hub: "manufacturing" },
      { name: "Clinics and institutes", line: "Fee and service receipts.", hub: "healthcare" },
    ],
    works: [{ name: "UPI payments", status: "Live" }, { name: "WhatsApp invoices and reminders", status: "Live" }, { name: "Excel export", status: "Live" }, { name: "Tally export", status: "Planned" }, { name: "GST e-invoicing (IRP)", status: "Planned" }],
    faq: [
      { q: "Is it GST compliant?", a: "Invoices follow GST rules for tax invoices, place of supply, HSN codes and CGST/SGST/IGST. E-invoicing through the IRP is planned." },
      { q: "Can my accountant use the data?", a: "Yes. Sales registers, invoice lists and receivables export to Excel. A direct Tally export is planned." },
      ...setupFaq,
    ],
  },

  inventory: {
    headline: "Never run out. Never over-order.",
    sub: "Camus Inventory tracks stock across stores and warehouses, warns you before items run out, and turns reorder suggestions into purchase orders.",
    screen: "inventory",
    helps: [
      { title: "Fewer stock-outs", body: "Reorder points and alerts based on your sales mean popular items stay on the shelf." },
      { title: "Less cash stuck in stock", body: "Spot slow movers and overstock, and stop buying what doesn't sell." },
      { title: "Less expiry loss", body: "Batch and expiry tracking tells you what to sell first." },
      { title: "Every location, one truth", body: "Stores, warehouse and transfers in transit, always up to date." },
    ],
    explore: [
      { tab: "Stock", title: "Stock by location, live", body: "Every sale, purchase and transfer updates stock instantly for each store and warehouse.", points: ["Store and warehouse stock", "Variants, units and conversions", "Stock adjustments with reason", "Stock value by location"], screen: "inventory" },
      { tab: "Reorder", title: "Reorder before the shelf is empty", body: "Set reorder levels or let Camus suggest them from recent sales, then raise purchase orders to your vendors in one click.", points: ["Reorder points and alerts", "Suggestions from sales history", "Purchase orders to vendors", "Goods received against PO"], screen: "inventory" },
      { tab: "Batches", title: "Batch, expiry and serial tracking", body: "Track batches and expiry dates for food and pharma, or serial numbers for electronics.", points: ["Batch and expiry dates", "First-expiry-first-out", "Serial and IMEI numbers", "Expiry alerts"], screen: "inventory" },
      { tab: "Transfers", title: "Move stock between locations", body: "Send stock from the warehouse to stores and see it in transit until it is received.", points: ["Transfer requests", "In-transit tracking", "Receive and confirm", "Transfer history"], screen: "dashboard" },
    ],
    day: [
      { time: "Morning", title: "Check alerts", body: "Seven items are below reorder level. The suggested quantities are based on the last 30 days." },
      { time: "Midday", title: "Raise purchase orders", body: "One click turns suggestions into purchase orders for each vendor." },
      { time: "Afternoon", title: "Receive goods", body: "The store receives stock against the PO and quantities update everywhere." },
      { time: "Evening", title: "Expiry check", body: "Batches expiring this month are flagged so staff can move them to the front." },
    ],
    compare: [
      ["Stock counted by hand", "Live stock across every location"],
      ["Items run out without warning", "Reorder alerts before they do"],
      ["Expired goods found too late", "Expiry alerts by batch"],
      ["Transfers on WhatsApp messages", "Tracked transfers with confirmation"],
    ],
    groups: [
      { name: "Items", items: ["Variants and units", "Barcodes and SKUs", "Categories and brands", "Price lists"] },
      { name: "Stock", items: ["Multi-location stock", "Adjustments with reason", "Stock valuation", "Physical stock audit"] },
      { name: "Purchase", items: ["Reorder suggestions", "Purchase orders", "Goods received", "Vendor records"] },
      { name: "Tracking", items: ["Batch and expiry", "Serial and IMEI", "Transfers in transit"] },
      { name: "Reports", items: ["Stock summary", "Slow and fast movers", "Expiry report", "Valuation by location"] },
    ],
    forWho: [
      { name: "Retail chains", line: "Stock across stores and a central warehouse.", hub: "retail" },
      { name: "Distributors", line: "Large catalogues and vendor purchase.", hub: "retail" },
      { name: "Pharmacies", line: "Batch and expiry-first selling.", hub: "healthcare" },
      { name: "Manufacturers", line: "Raw material and finished goods.", hub: "manufacturing" },
    ],
    works: [{ name: "Camus POS and Billing", status: "Live" }, { name: "Barcode scanners", status: "Live" }, { name: "Excel import and export", status: "Live" }, { name: "Online store stock sync", status: "Planned" }],
    faq: [
      { q: "Can I import my existing items?", a: "Yes. We import your item list, barcodes and opening stock from Excel or your current software during setup." },
      { q: "Does it work with Camus POS?", a: "Yes. POS, Billing and Inventory share the same items and stock, so every sale updates stock automatically." },
      ...setupFaq,
    ],
  },

  crm: {
    headline: "Every enquiry followed up. Every deal visible.",
    sub: "Camus CRM brings leads from your website, WhatsApp and calls into one pipeline, reminds your team to follow up, and shows you what will close this month.",
    screen: "crm",
    helps: [
      { title: "No lead forgotten", body: "Enquiries from every channel land in one list with an owner and a next step." },
      { title: "Follow-ups on time", body: "Reminders tell each salesperson who to call today." },
      { title: "A pipeline you can trust", body: "See every deal by stage and value, and what is likely to close." },
      { title: "Customer history in one place", body: "Calls, quotes, invoices and notes on one profile." },
    ],
    explore: [
      { tab: "Pipeline", title: "See every deal by stage", body: "Drag deals from enquiry to won. Value, source and next step are visible on every card.", points: ["Custom stages", "Deal value and source", "Next-step reminders", "Won and lost reasons"], screen: "crm" },
      { tab: "Leads", title: "One list for every enquiry", body: "Website forms, WhatsApp messages and phone calls become leads automatically and are assigned to your team.", points: ["Website and WhatsApp leads", "Auto-assignment rules", "Duplicate detection", "Lead source tracking"], screen: "crm" },
      { tab: "Follow-ups", title: "Reminders that close deals", body: "Every lead has a next step. Your team sees today's calls and meetings the moment they log in.", points: ["Daily follow-up list", "Call and meeting logs", "WhatsApp templates", "Overdue alerts"], screen: "crm" },
      { tab: "Reports", title: "Know what's working", body: "Conversion by source and salesperson, pipeline value and month-end forecast.", points: ["Conversion by source", "Salesperson performance", "Pipeline value", "Lost-deal analysis"], screen: "dashboard" },
    ],
    day: [
      { time: "9:30 AM", title: "Today's calls", body: "Each salesperson opens their follow-up list — no spreadsheets, no sticky notes." },
      { time: "12:00 PM", title: "New enquiry", body: "A website enquiry is assigned to the right person, who replies on WhatsApp within minutes." },
      { time: "3:00 PM", title: "Quote sent", body: "The deal moves to 'Proposal sent' with a reminder to follow up in two days." },
      { time: "6:00 PM", title: "Owner's view", body: "The owner checks pipeline value and who closed what today." },
    ],
    compare: [
      ["Leads scattered across phones", "Every enquiry in one pipeline"],
      ["Follow-ups depend on memory", "Daily reminders for each salesperson"],
      ["No idea what will close", "Pipeline value and forecast"],
      ["Customer history leaves with staff", "History stays with the business"],
    ],
    groups: [
      { name: "Leads", items: ["Web, WhatsApp and call capture", "Auto-assignment", "Lead scoring", "Duplicate detection"] },
      { name: "Deals", items: ["Custom pipeline stages", "Deal value and products", "Quotes from deals", "Won and lost reasons"] },
      { name: "Activities", items: ["Follow-up reminders", "Call and meeting logs", "WhatsApp templates", "Notes and files"] },
      { name: "Reports", items: ["Source conversion", "Team performance", "Pipeline forecast"] },
    ],
    forWho: [
      { name: "Real estate", line: "Leads, site visits and bookings.", hub: "real-estate" },
      { name: "Clinics and hospitals", line: "Patient enquiries and follow-ups.", hub: "healthcare" },
      { name: "Education", line: "Admission enquiries and counselling.", hub: "education" },
      { name: "B2B and services", line: "Quotes, proposals and long sales cycles.", hub: "msme" },
    ],
    works: [{ name: "Website enquiry forms", status: "Live" }, { name: "WhatsApp Business", status: "Live" }, { name: "Camus Billing quotes", status: "Live" }, { name: "Facebook and Google lead ads", status: "Planned" }, { name: "IndiaMART leads", status: "Planned" }],
    faq: [
      { q: "Can my team use it on mobile?", a: "Yes. The CRM works in any mobile browser, so salespeople can log calls and update deals on the move." },
      ...setupFaq,
    ],
  },

  erp: {
    headline: "Purchase, stock, production and accounts — finally connected.",
    sub: "Camus ERP replaces disconnected software and spreadsheets with one system for operations, set up around how your business already works.",
    screen: "dashboard",
    helps: [
      { title: "One version of the truth", body: "Sales, purchase, stock and accounts share the same data — no re-entry between departments." },
      { title: "Approvals with control", body: "Purchase, discount and payment approvals follow your rules." },
      { title: "Visibility for management", body: "Department and branch dashboards updated in real time." },
      { title: "Grows with you", body: "Add branches, warehouses, plants and custom modules on the same platform." },
    ],
    explore: [
      { tab: "Overview", title: "The whole business on one dashboard", body: "Sales, receivables, stock value and production status across every branch and plant.", points: ["Management dashboard", "Branch and department views", "Daily reports on WhatsApp"], screen: "dashboard" },
      { tab: "Purchase", title: "Purchase with control", body: "Requisitions, approvals, purchase orders, goods received and vendor bills in one flow.", points: ["Purchase requisitions", "Approval rules", "PO, GRN and vendor bills", "Vendor performance"], screen: "inventory" },
      { tab: "Sales", title: "Order to invoice to payment", body: "Sales orders, dispatch, GST invoices and collections connected end to end.", points: ["Sales orders and dispatch", "GST invoices", "Receivables", "Customer statements"], screen: "invoice" },
      { tab: "People", title: "Your team on the same system", body: "Attendance, leave and payroll connected to departments and branches.", points: ["Attendance and shifts", "Leave approvals", "Payroll"], screen: "people" },
    ],
    day: [
      { time: "Morning", title: "Management review", body: "Yesterday's sales, dispatches and collections are on the dashboard before the meeting starts." },
      { time: "Midday", title: "Purchase approval", body: "A purchase request above the limit reaches the manager's phone for approval." },
      { time: "Afternoon", title: "Dispatch", body: "Goods dispatched, invoice generated and stock reduced — in one step." },
      { time: "Month end", title: "Close books faster", body: "Purchase, sales and payroll data is already in place for accounts." },
    ],
    compare: [
      ["Each department has its own software", "One connected platform"],
      ["Data re-entered between teams", "Enter once, used everywhere"],
      ["Approvals over phone calls", "Rule-based approvals on mobile"],
      ["Reports compiled at month end", "Live dashboards every day"],
    ],
    groups: [
      { name: "Sales", items: ["Orders and dispatch", "GST invoicing", "Receivables"] },
      { name: "Purchase", items: ["Requisitions", "Purchase orders and GRN", "Vendor bills"] },
      { name: "Inventory", items: ["Multi-warehouse stock", "Batches and serials", "Transfers"] },
      { name: "Production", items: ["Bills of material", "Production orders", "Costing"] },
      { name: "People", items: ["Attendance", "Leave", "Payroll"] },
      { name: "Control", items: ["Roles and approvals", "Audit log", "Data hosted in India"] },
    ],
    forWho: [
      { name: "Manufacturers", line: "Raw material to finished goods.", hub: "manufacturing" },
      { name: "Distributors", line: "Multi-warehouse sales and purchase.", hub: "retail" },
      { name: "Multi-branch businesses", line: "Central control across locations.", hub: "enterprise" },
      { name: "Growing MSMEs", line: "Move off spreadsheets and Tally-only setups.", hub: "msme" },
    ],
    works: [{ name: "Camus apps (POS, Billing, Inventory, People)", status: "Live" }, { name: "Excel import and export", status: "Live" }, { name: "Tally export", status: "Planned" }, { name: "API for existing systems", status: "Planned" }],
    faq: [
      { q: "Is the ERP customised for my business?", a: "Yes. Our team maps your current process and configures modules, approvals and reports around it. Scope and price are agreed in writing." },
      { q: "How long does implementation take?", a: "It depends on modules and data. We share a timeline in the proposal after studying your business." },
      ...setupFaq,
    ],
  },

  clinic: {
    headline: "A calmer front desk. Organised patient flow.",
    sub: "Camus Clinic handles registration, appointments, token queues, prescriptions and billing — so doctors spend time with patients, not paperwork.",
    screen: "clinic",
    helps: [
      { title: "Shorter waiting", body: "Appointments and tokens keep the waiting room organised and patients informed." },
      { title: "Fewer no-shows", body: "WhatsApp reminders before every appointment." },
      { title: "Records in seconds", body: "Patient history, prescriptions and bills found instantly on return visits." },
      { title: "Clear daily numbers", body: "Visits, collections and workload per doctor, every day." },
    ],
    explore: [
      { tab: "Appointments", title: "Every doctor's day at a glance", body: "Book, reschedule and block slots for multiple doctors. Walk-ins get a token and an estimated wait.", points: ["Multi-doctor calendar", "Walk-in tokens", "Waiting-room queue", "WhatsApp reminders"], screen: "clinic" },
      { tab: "Patients", title: "Register once, find forever", body: "Patient profiles with visit history, prescriptions and bills, searchable by name or phone.", points: ["Patient registration", "Visit history", "Documents and reports", "Family linking"], screen: "clinic" },
      { tab: "Billing", title: "Consultation and procedure billing", body: "Bills for consultations, procedures and pharmacy with UPI collection and receipts.", points: ["Consultation and procedure fees", "UPI, card and cash", "Receipts on WhatsApp", "Daily collection report"], screen: "invoice" },
      { tab: "Reports", title: "Run the clinic by the numbers", body: "Visits, new vs returning patients, collections and doctor workload.", points: ["Daily visits", "Collections by mode", "Doctor-wise workload"], screen: "dashboard" },
    ],
    day: [
      { time: "8:30 AM", title: "Reminders sent", body: "Today's patients receive a WhatsApp reminder with their time and token." },
      { time: "10:00 AM", title: "Front desk", body: "Walk-ins are registered in seconds and added to the queue with an estimated wait." },
      { time: "12:30 PM", title: "Consultation", body: "The doctor sees past visits and writes the prescription on the clinic's letterhead." },
      { time: "8:00 PM", title: "Close the day", body: "Visits and collections per doctor are ready for the owner." },
    ],
    compare: [
      ["Paper registers and files", "Digital patient records"],
      ["Crowded waiting room", "Tokens and estimated wait"],
      ["Patients forget appointments", "WhatsApp reminders"],
      ["Collections counted by hand", "Daily collection report"],
    ],
    groups: [
      { name: "Front desk", items: ["Registration", "Appointments and tokens", "Waiting-room queue", "Reminders"] },
      { name: "Clinical", items: ["Visit history", "Prescriptions on letterhead", "Documents and reports"] },
      { name: "Billing", items: ["Consultation and procedures", "UPI and cash", "Receipts"] },
      { name: "Reports", items: ["Daily visits", "Collections", "Doctor workload"] },
    ],
    forWho: [
      { name: "Clinics and polyclinics", line: "Multiple doctors, one front desk.", hub: "healthcare" },
      { name: "Dental and skin clinics", line: "Procedures and follow-ups.", hub: "healthcare" },
      { name: "Paediatric clinics", line: "Vaccination schedules and reminders.", hub: "healthcare" },
      { name: "Diagnostic centres", line: "Bookings and report delivery.", hub: "healthcare" },
    ],
    works: [{ name: "WhatsApp reminders", status: "Live" }, { name: "UPI payments", status: "Live" }, { name: "ABDM / ABHA health ID", status: "Planned" }, { name: "Lab systems (API)", status: "Planned" }],
    faq: [
      { q: "Is patient data secure?", a: "Access is role-based, every change is logged, and data is hosted in India." },
      ...setupFaq,
    ],
  },

  people: {
    headline: "Your team, organised — from joining day to payslip.",
    sub: "Camus People keeps employee records, attendance, leave and payroll in one place, with self-service for your staff.",
    screen: "people",
    helps: [
      { title: "Attendance you can trust", body: "Check-ins by branch and shift, with late and absent marked automatically." },
      { title: "Leave without paperwork", body: "Staff request leave on their phone and managers approve in a tap." },
      { title: "Payroll without errors", body: "Salary, PF, ESI and advances calculated from attendance." },
      { title: "Records always ready", body: "Documents, contracts and history for every employee." },
    ],
    explore: [
      { tab: "Attendance", title: "Who is in, who is late", body: "Daily attendance by branch and shift with late, absent and on-leave status.", points: ["Shift and branch rosters", "Late and early marking", "Monthly attendance register"], screen: "people" },
      { tab: "Leave", title: "Leave approved in a tap", body: "Leave balances, requests and approvals on mobile, with your policies applied.", points: ["Leave types and balances", "Mobile requests", "Manager approvals", "Holiday calendar"], screen: "people" },
      { tab: "Payroll", title: "Salary that calculates itself", body: "Salaries from attendance, with PF, ESI, advances and payslips.", points: ["Salary structures", "PF and ESI", "Advances and deductions", "Payslips"], screen: "people" },
      { tab: "Employees", title: "Every employee record in one place", body: "Profiles, documents, contracts and history, with self-service for staff.", points: ["Employee profiles", "Document storage", "Self-service portal"], screen: "dashboard" },
    ],
    day: [
      { time: "9:15 AM", title: "Attendance", body: "The owner sees who is in at each branch and who is late." },
      { time: "11:00 AM", title: "Leave request", body: "A cashier requests two days' leave; the manager approves from their phone." },
      { time: "Month end", title: "Payroll", body: "Salaries are calculated from attendance with PF, ESI and advances." },
      { time: "1st of month", title: "Payslips", body: "Staff receive payslips without anyone preparing them by hand." },
    ],
    compare: [
      ["Attendance in a register", "Branch-wise attendance on one screen"],
      ["Leave asked over phone", "Leave requests and approvals on mobile"],
      ["Salary calculated in Excel", "Payroll from attendance"],
      ["Documents in files and folders", "Digital employee records"],
    ],
    groups: [
      { name: "Employees", items: ["Profiles and documents", "Departments and branches", "Self-service"] },
      { name: "Time", items: ["Attendance", "Shifts and rosters", "Holiday calendar"] },
      { name: "Leave", items: ["Leave policies", "Requests and approvals", "Balances"] },
      { name: "Payroll", items: ["Salary structures", "PF and ESI", "Advances", "Payslips"] },
    ],
    forWho: [
      { name: "Retail and restaurants", line: "Shift staff across branches.", hub: "retail" },
      { name: "Clinics and hospitals", line: "Doctors, nurses and front office.", hub: "healthcare" },
      { name: "Factories", line: "Shifts and contract workers.", hub: "manufacturing" },
      { name: "Offices and MSMEs", line: "Leave, documents and payroll.", hub: "msme" },
    ],
    works: [{ name: "WhatsApp payslips", status: "Live" }, { name: "Excel export", status: "Live" }, { name: "Biometric devices", status: "Planned" }, { name: "Face and GPS attendance", status: "Planned" }],
    faq: setupFaq,
  },

  bookings: {
    headline: "Let customers book. Let reminders bring them in.",
    sub: "Camus Bookings gives customers a simple way to book slots and reminds them before every visit — for clinics, salons, studios and service businesses.",
    screen: "clinic",
    helps: [
      { title: "Bookings around the clock", body: "Customers book from your website or WhatsApp link, any time." },
      { title: "Fewer no-shows", body: "Automatic reminders before every appointment." },
      { title: "No double bookings", body: "Every staff member's calendar in one place." },
      { title: "A fuller schedule", body: "See gaps and fill them with follow-ups." },
    ],
    explore: [
      { tab: "Calendar", title: "Everyone's schedule in one view", body: "Slots by staff, room or service, with breaks and blocked time.", points: ["Staff and resource calendars", "Service durations", "Blocked time"], screen: "clinic" },
      { tab: "Online booking", title: "A booking link for your customers", body: "Share a link on your website, Google profile or WhatsApp.", points: ["Booking page", "Service selection", "Instant confirmation"], screen: "clinic" },
      { tab: "Reminders", title: "Reminders that reduce no-shows", body: "WhatsApp reminders before the visit, with easy rescheduling.", points: ["WhatsApp reminders", "Reschedule and cancel", "Follow-up bookings"], screen: "clinic" },
    ],
    day: [
      { time: "Night before", title: "Booking", body: "A customer books tomorrow's 11 AM slot from your website." },
      { time: "9:00 AM", title: "Reminder", body: "They receive a WhatsApp reminder with the time and location." },
      { time: "11:00 AM", title: "Visit", body: "Staff see the booking and customer history on arrival." },
      { time: "After", title: "Follow-up", body: "The next visit is booked before they leave." },
    ],
    compare: [["Bookings over phone calls", "Online booking link"], ["Missed appointments", "WhatsApp reminders"], ["Diary clashes", "Shared calendars"]],
    groups: [
      { name: "Scheduling", items: ["Staff calendars", "Services and durations", "Breaks and blocked time"] },
      { name: "Customers", items: ["Booking page", "Reminders", "Rescheduling", "Visit history"] },
    ],
    forWho: [
      { name: "Clinics", line: "Doctor-wise appointments.", hub: "healthcare" },
      { name: "Salons and spas", line: "Stylist schedules and services." },
      { name: "Coaching and studios", line: "Classes and trial sessions.", hub: "education" },
      { name: "Service centres", line: "Service slots and pickups." },
    ],
    works: [{ name: "WhatsApp reminders", status: "Live" }, { name: "Camus Sites booking page", status: "Live" }, { name: "Google Calendar", status: "Planned" }],
    faq: setupFaq,
  },

  stay: {
    headline: "Every bed, rent and complaint — in one place.",
    sub: "Camus Stay runs PGs, hostels and co-living: rooms and beds, resident onboarding, rent and dues, and complaints tracked to closure.",
    screen: "stay",
    helps: [
      { title: "Occupancy at a glance", body: "See which beds are occupied, vacant or due, room by room." },
      { title: "Rent collected on time", body: "Dues tracked per resident with WhatsApp reminders." },
      { title: "Happier residents", body: "Complaints logged, assigned and resolved with a clear status." },
      { title: "Quick onboarding", body: "Residents, documents and deposits recorded in minutes." },
    ],
    explore: [
      { tab: "Rooms & beds", title: "Your property, bed by bed", body: "Rooms, sharing types and bed status with vacancy at a glance.", points: ["Rooms and sharing types", "Bed allocation", "Vacancy view", "Room transfers"], screen: "stay" },
      { tab: "Rent & dues", title: "Know who has paid and who hasn't", body: "Monthly rent, deposits and dues per resident, with reminders on WhatsApp.", points: ["Monthly rent cycles", "Deposits and refunds", "Dues and reminders", "Receipts"], screen: "stay" },
      { tab: "Complaints", title: "Complaints closed, not forgotten", body: "Residents raise issues; staff are assigned; you see what's pending.", points: ["Complaint logging", "Staff assignment", "Status trail"], screen: "stay" },
    ],
    day: [
      { time: "1st of month", title: "Rent cycle", body: "Rent is due for every resident and reminders go out automatically." },
      { time: "Morning", title: "Complaint", body: "Room 103's geyser stops working. The complaint is assigned to maintenance." },
      { time: "Afternoon", title: "New resident", body: "A new resident is onboarded to bed 203-A with documents and deposit." },
      { time: "Evening", title: "Owner's check", body: "Occupancy, collections and pending dues — all on one screen." },
    ],
    compare: [["Rent tracked in a notebook", "Dues per resident with reminders"], ["Vacancy known by walking floors", "Bed-wise vacancy view"], ["Complaints forgotten", "Complaints tracked to closure"]],
    groups: [
      { name: "Property", items: ["Rooms and beds", "Sharing types", "Multiple properties"] },
      { name: "Residents", items: ["Onboarding and documents", "Deposits", "Room transfers", "Move-out"] },
      { name: "Money", items: ["Rent cycles", "Dues and reminders", "Receipts", "Expenses"] },
      { name: "Service", items: ["Complaints", "Staff assignment", "Status trail"] },
    ],
    forWho: [
      { name: "PGs and hostels", line: "Beds, rent and residents.", hub: "hospitality" },
      { name: "Co-living", line: "Community operations and complaints.", hub: "hospitality" },
      { name: "Student housing", line: "Semester rents and parents' contacts." },
    ],
    works: [{ name: "WhatsApp rent reminders", status: "Live" }, { name: "UPI payments", status: "Live" }, { name: "Resident mobile app", status: "Planned" }],
    faq: setupFaq,
  },

  "gold-loan": {
    headline: "Pledges, interest and receipts — accurate every time.",
    sub: "Camus Gold Loan manages customer KYC, pledges by weight and purity, interest, renewals, receipts and overdue follow-up for pawn brokers and gold-loan lenders.",
    screen: "loan",
    helps: [
      { title: "Interest calculated right", body: "Interest computed consistently on every pledge — no manual errors." },
      { title: "Overdues under control", body: "See overdue pledges and follow up before they become a problem." },
      { title: "Receipts customers trust", body: "Printed receipts in Tamil and English with every detail." },
      { title: "A complete audit trail", body: "Every pledge, payment and change recorded." },
    ],
    explore: [
      { tab: "Pledges", title: "Every pledge, fully recorded", body: "Items, weight, purity, loan amount and interest rate captured at the counter.", points: ["Items by weight and purity", "Loan-to-value from today's rate", "Pledge photos", "Customer KYC"], screen: "loan" },
      { tab: "Interest & renewals", title: "Interest and renewals without mistakes", body: "Interest due calculated for any date; renew or part-pay in a few clicks.", points: ["Interest by scheme", "Part payments", "Renewals", "Closures and release"], screen: "loan" },
      { tab: "Overdues", title: "Follow up before it's late", body: "Overdue lists by age with customer contacts and reminders.", points: ["Overdue ageing", "Reminders", "Auction tracking"], screen: "loan" },
      { tab: "Reports", title: "Your book, every day", body: "Outstanding, collections and day book for the owner.", points: ["Outstanding loans", "Daily collections", "Day book"], screen: "dashboard" },
    ],
    day: [
      { time: "9:30 AM", title: "Set today's rate", body: "The day's gold rate is entered once and used for every new pledge." },
      { time: "11:00 AM", title: "New pledge", body: "Items are weighed, KYC checked, loan approved and a receipt printed." },
      { time: "3:00 PM", title: "Interest collected", body: "A customer pays interest; the receipt prints and the pledge is updated." },
      { time: "7:00 PM", title: "Close the day", body: "Collections and new loans match the day book." },
    ],
    compare: [["Ledger books and manual interest", "Automatic interest on every pledge"], ["Overdues noticed late", "Overdue ageing list"], ["Hand-written receipts", "Printed bilingual receipts"]],
    groups: [
      { name: "Customers", items: ["KYC records", "Pledge history", "Search by phone or ID"] },
      { name: "Pledges", items: ["Weight and purity", "Daily gold rate", "Interest schemes", "Photos"] },
      { name: "Collections", items: ["Interest and part payments", "Renewals", "Closures", "Receipts"] },
      { name: "Control", items: ["Overdue ageing", "Audit log", "Day book"] },
    ],
    forWho: [
      { name: "Pawn brokers", line: "Licensed pledge lending.", hub: "finance" },
      { name: "Gold-loan companies", line: "Multi-branch lending.", hub: "finance" },
      { name: "Jewellers with lending", line: "Pledges alongside jewellery sales.", hub: "finance" },
    ],
    works: [{ name: "Receipt printers", status: "Live" }, { name: "WhatsApp reminders", status: "Live" }, { name: "Weighing scales", status: "Planned" }],
    faq: setupFaq,
  },

  jewel: {
    headline: "Stock by weight and purity. Sales with GST.",
    sub: "Camus Jewel tracks every piece by weight and purity, prices sales from the day's gold rate, and handles making charges, old-gold exchange and schemes.",
    screen: "inventory",
    helps: [
      { title: "Every gram accounted for", body: "Stock tracked piece by piece with weight, purity and status." },
      { title: "Consistent pricing", body: "Set the day's rate once and every sale is priced the same way." },
      { title: "GST-ready sales", body: "Making charges, stones and GST on every bill." },
      { title: "Stock value, always current", body: "Valuation updates with the gold rate." },
    ],
    explore: [
      { tab: "Stock", title: "Every piece, tracked", body: "Weight, purity, stones and tag for every item in the showroom and locker.", points: ["Tag-wise stock", "Gross and net weight", "Purity and hallmark", "Stones and making charges"], screen: "inventory" },
      { tab: "Sales", title: "Bills that price themselves", body: "Today's rate, making charges, stones and GST calculated on every bill.", points: ["Daily gold and silver rates", "Making charges", "Old-gold exchange", "GST bills"], screen: "pos" },
      { tab: "Reports", title: "Know your stock value", body: "Stock by weight and value, sales and old-gold received.", points: ["Valuation by rate", "Sales by category", "Old-gold register"], screen: "dashboard" },
    ],
    day: [
      { time: "10:00 AM", title: "Set rates", body: "Today's gold and silver rates are set once for the showroom." },
      { time: "1:00 PM", title: "Sale with exchange", body: "A customer buys a chain and exchanges old gold; the bill calculates both." },
      { time: "5:00 PM", title: "Stock check", body: "Tags sold today are marked and stock weight updates." },
      { time: "8:00 PM", title: "Close", body: "Sales, old gold received and stock value for the day." },
    ],
    compare: [["Stock in ledgers", "Tag-wise digital stock"], ["Rates applied by hand", "Rates applied automatically"], ["Valuation once a year", "Valuation every day"]],
    groups: [
      { name: "Stock", items: ["Tags and categories", "Weight and purity", "Stones"] },
      { name: "Sales", items: ["Daily rates", "Making charges", "Old-gold exchange", "GST bills"] },
      { name: "Reports", items: ["Stock valuation", "Sales", "Old-gold register"] },
    ],
    forWho: [
      { name: "Jewellery showrooms", line: "Tag-wise stock and billing.", hub: "retail" },
      { name: "Gold and silver merchants", line: "Weight-based trading." },
    ],
    works: [{ name: "Tag and barcode printers", status: "Live" }, { name: "Weighing scales", status: "Planned" }, { name: "Savings schemes (Chit & Savings app)", status: "Live" }],
    faq: setupFaq,
  },
};

/** Generic FAQ for apps without a rich entry. */
export const genericFaq = setupFaq;
