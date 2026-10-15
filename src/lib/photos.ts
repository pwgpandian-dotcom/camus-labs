/**
 * Business photography from Unsplash (free under the Unsplash License, hotlinked
 * from Unsplash's CDN as Unsplash recommends). Keys describe the scene.
 */
export const photos = {
  restaurant: { id: "photo-1582228096960-7f5d2ec4aa8e", alt: "Restaurant dining room with wooden tables" },
  diner: { id: "photo-1763626080059-523898c7ffef", alt: "Guest reading the menu at a restaurant table" },
  kitchen: { id: "photo-1721637713270-5470ea1d6389", alt: "Chefs preparing orders in a busy kitchen" },
  cafe: { id: "photo-1516197227520-4d1c419f6ec6", alt: "Café counter with coffee machine" },
  kirana: { id: "photo-1739066598279-1297113f5c6a", alt: "Neighbourhood grocery store counter" },
  aisle: { id: "photo-1584771145729-0bd9fda6529b", alt: "Shoppers in a supermarket aisle" },
  cardpay: { id: "photo-1774978613949-c29cbfe9f862", alt: "Card payment at a supermarket checkout" },
  apparel: { id: "photo-1768758533474-5cd148638a98", alt: "Clothing store with racks of apparel" },
  pharmacy: { id: "photo-1642055514517-7b52288890ec", alt: "Pharmacy shelves stocked with medicines" },
  counter: { id: "photo-1778791910832-df59a1b5be3d", alt: "Customers being billed at a shop counter" },
  tabletpos: { id: "photo-1556740738-b6a63e27c4df", alt: "Customer paying at a tablet point of sale" },
  barista: { id: "photo-1556742393-d75f468bfcb0", alt: "Shop owner using a tablet at the counter" },
  warehouse: { id: "photo-1627309366653-2dedc084cdf1", alt: "Warehouse with stocked shelves" },
  warehouse2: { id: "photo-1553413077-190dd305871c", alt: "Warehouse aisle with boxes on racks" },
  clinic: { id: "photo-1606318313647-137d1f3b4d3c", alt: "Doctors at a clinic front desk" },
  doctor: { id: "photo-1758691461935-202e2ef6b69f", alt: "Doctor consulting a patient" },
  dentist: { id: "photo-1758205307912-5896ff0c65ae", alt: "Dentist treating a patient" },
  hostel: { id: "photo-1709805619372-40de3f158e83", alt: "Hostel room with bunk beds" },
  jewel: { id: "photo-1660860547079-fd4845880af9", alt: "Necklaces on display in a jewellery showroom" },
  jewel2: { id: "photo-1622704776938-bed6cd156e04", alt: "Jewellery showroom counters" },
  office: { id: "photo-1572021335469-31706a17aaef", alt: "Team working together around a laptop" },
  factory: { id: "photo-1589793463357-5fb813435467", alt: "Workers on a factory production floor" },
  owner: { id: "photo-1543269664-56d93c1b41a6", alt: "Business owner checking her tablet" },
  exec: { id: "photo-1771244688590-1e481dba1b5a", alt: "Business owner working at his desk" },
} as const;

export type PhotoKey = keyof typeof photos;

export function photoUrl(key: PhotoKey, w = 1200, h?: number) {
  return `https://images.unsplash.com/${photos[key].id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=75`;
}

/** Best-fit photo for a business type described in plain words. */
export function photoForBusiness(name: string): PhotoKey {
  const n = name.toLowerCase();
  const rules: [RegExp, PhotoKey][] = [
    [/supermarket|retail chain/, "aisle"], [/kirana|grocery/, "kirana"], [/fashion|apparel|cloth/, "apparel"],
    [/electronic|mobile/, "tabletpos"], [/pharmac/, "pharmacy"], [/baker|sweet|café|cafe/, "cafe"],
    [/hardware|paint|distribut|wholesal/, "warehouse2"], [/cloud kitchen/, "kitchen"], [/food court|qsr/, "counter"],
    [/restaurant/, "restaurant"], [/manufactur|factor/, "factory"], [/dental|dentist/, "dentist"],
    [/clinic|hospital|paediatric|diagnostic|health/, "clinic"], [/pg|hostel|co-living|student/, "hostel"],
    [/pawn|gold-loan|gold loan|lending/, "jewel2"], [/jewel|gold and silver/, "jewel"],
    [/salon|spa|service centre/, "barista"], [/real estate|b2b|multi-branch|enterprise/, "exec"],
    [/education|coaching|office|service business|agenc/, "office"], [/msme|growing/, "owner"],
  ];
  return rules.find(([r]) => r.test(n))?.[1] ?? "owner";
}

/** Default hero photo per app category, for apps without their own. */
export const categoryPhoto: Record<string, PhotoKey> = {
  Sales: "exec", Marketing: "owner", "Commerce & POS": "tabletpos", "Customer service": "barista", Finance: "owner",
  "Operations & ERP": "warehouse2", "HR & People": "office", Collaboration: "office", Analytics: "exec",
  "Industry apps": "kirana", AI: "office", Platform: "exec",
};
