export const PHONE = "972502444994";

export const CATS = {
  needles: "מחטים",
  pigments: "פיגמנטים",
  tools: "ציוד וכלי עבודה",
  aftercare: "טיפוח",
} as const;

export type Cat = keyof typeof CATS;

export type Product = {
  id: string;
  name: string;
  cat: Cat;
  tag?: string;
  isNew: boolean;
  best: boolean;
  rank: number;
  short: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "needle-cartridge-1",
    name: "מחט למכונה",
    cat: "needles",
    best: true,
    isNew: false,
    rank: 1,
    short: "מחט למכונת PMU, כפי שמוצג באריזה ובתמונה.",
  },
  {
    id: "needle-cartridge-2",
    name: "מחט למכונה (זוג)",
    cat: "needles",
    isNew: false,
    best: false,
    rank: 2,
    short: "שני מחטים שקופים למכונה, כפי שמוצג בתמונה.",
  },
  {
    id: "needle-micro-1",
    name: "מחט מיקרובליידינג",
    cat: "needles",
    isNew: false,
    best: false,
    rank: 3,
    short: "להב מיקרובליידינג עם סידור קווים אלכסוני, כפי שמוצג בתמונה.",
  },
  {
    id: "needle-micro-2",
    name: "מחט מיקרובליידינג (קו ישר)",
    cat: "needles",
    isNew: false,
    best: false,
    rank: 4,
    short: "להב מיקרובליידינג עם סידור קווים ישר, כפי שמוצג בתמונה.",
  },
  {
    id: "pigment-bottles-stone",
    name: "בקבוקי פיגמנט",
    cat: "pigments",
    best: true,
    isNew: false,
    rank: 5,
    short: "ארבעה בקבוקי פיגמנט של SHIR LAVY על רקע אבן, כפי שמוצג בתמונה.",
  },
  {
    id: "pigment-bottles-marble",
    name: "בקבוקי פיגמנט (גוונים חומים)",
    cat: "pigments",
    isNew: false,
    best: false,
    rank: 6,
    short: "ארבעה בקבוקי פיגמנט בגוונים חומים, כפי שמוצג בתמונה.",
  },
  {
    id: "pigment-bottles-desk",
    name: "בקבוקי פיגמנט (שלושה)",
    cat: "pigments",
    isNew: false,
    best: false,
    rank: 7,
    short: "שלושה בקבוקי פיגמנט על שולחן העבודה, כפי שמוצג בתמונה.",
  },
  {
    id: "pigment-jars-open",
    name: "צנצנות פיגמנט",
    cat: "pigments",
    isNew: false,
    best: false,
    rank: 8,
    short: "מספר צנצנות פיגמנט, אחת פתוחה, כפי שמוצג בתמונה.",
  },
  {
    id: "pigment-jars-row",
    name: "צנצנות פיגמנט (שורה)",
    cat: "pigments",
    isNew: false,
    best: false,
    rank: 9,
    short: "ארבע צנצנות פיגמנט בשורה, כפי שמוצג בתמונה.",
  },
  {
    id: "tool-applicators",
    name: "אפליקטורים",
    cat: "tools",
    best: true,
    isNew: false,
    rank: 10,
    short: "שקית מקלות למריחה חד-פעמיים, כפי שמוצג באריזה ובתמונה.",
  },
  {
    id: "tool-marker",
    name: "טוש סימון",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 11,
    short: "טוש סימון על העור באריזה, כפי שמוצג בתמונה.",
  },
  {
    id: "tool-cups",
    name: "כוסיות לפיגמנט",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 12,
    short: "כוסיות/טבעות לפיגמנט, כפי שמוצג בתמונה.",
  },
  {
    id: "tool-stencils",
    name: "שבלונות לגבות",
    cat: "tools",
    isNew: false,
    best: true,
    rank: 13,
    short: "שבלונות דביקות לעיצוב קווי גבה, כפי שמוצג בתמונה.",
  },
  {
    id: "tool-pmu-pen",
    name: "עט מכונה PMU",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 14,
    short: "עט מכונה PMU בצבע זהב, כפי שמוצג בתמונה.",
  },
  {
    id: "tool-tweezers-kit",
    name: "ערכת פינצטות",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 15,
    short: "ערכת מלקחיים ומספריים במארז עור, כפי שמוצג בתמונה.",
  },
  {
    id: "tool-spoolies",
    name: "מברשות ספולי",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 16,
    short: "שקית מברשות ספולי חד-פעמיות, כפי שמוצג בתמונה.",
  },
  {
    id: "tool-cotton-swabs",
    name: "מקלוני כותנה",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 17,
    short: "שקית מקלוני עץ/כותנה, כפי שמוצג בתמונה.",
  },
  {
    id: "aftercare-remover",
    name: "Remover",
    cat: "aftercare",
    tag: "SHIR LAVY",
    best: true,
    isNew: false,
    rank: 18,
    short: "בקבוק Remover עם dropper, מותג SHIR LAVY Beauty Solutions, כפי שמוצג בתמונה.",
  },
];

export function fmt(n: number) {
  return n.toLocaleString("he-IL") + " ₪";
}

export function waLink(message: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

export function shopInquiryLink(productName: string) {
  return waLink(`היי, אשמח לפרטים והזמנה לגבי ${productName} מהחנות.`);
}

export type RichProduct = Product & { catName: string };

export function richProducts(): RichProduct[] {
  return PRODUCTS.map((p) => ({
    ...p,
    catName: CATS[p.cat],
  }));
}

export const NAV = [
  ["/", "ראשי"],
  ["/about", "נעים להכיר"],
  ["/academy", "האקדמיה"],
  ["/brows", "טיפולי גבות"],
  ["/removal", "הסרת איפור קבוע"],
  ["/aesthetics", "טיפולי אסתטיקה"],
  ["/medical-aesthetics", "אסתטיקה רפואית"],
  ["/shop", "חנות"],
  ["/contact", "יצירת קשר"],
] as const;

export const TOP_NAV: {
  href?: string;
  label: string;
  kids?: { href: string; label: string }[];
}[] = [
  { href: "/", label: "ראשי" },
  { href: "/about", label: "נעים להכיר" },
  {
    label: "טיפולים",
    kids: [
      { href: "/brows", label: "טיפולי גבות" },
      { href: "/removal", label: "הסרת איפור קבוע" },
      { href: "/aesthetics", label: "טיפולי אסתטיקה" },
      { href: "/medical-aesthetics", label: "אסתטיקה רפואית" },
    ],
  },
  { href: "/academy", label: "האקדמיה" },
  { href: "/shop", label: "חנות" },
  { href: "/contact", label: "יצירת קשר" },
];

/** Route segment for mobile menu / shell (e.g. `/brows` → `brows`, `/` → `home`). */
export function navHrefToKey(href: string): string {
  return href === "/" ? "home" : href.replace(/^\//, "");
}

export function navKeyToHref(key: string): string {
  return key === "home" ? "/" : `/${key}`;
}

export const TREATMENT_LINKS = TOP_NAV.find((item) => item.kids)?.kids ?? [];

export type MobileNavItem =
  | { key: string; label: string }
  | { key: string; label: string; kids: { key: string; label: string }[] };

/** Mobile drawer nav — derived from `TOP_NAV` so treatment labels stay in sync. */
export const MOBILE_NAV: MobileNavItem[] = TOP_NAV.map((item) => {
  if (item.kids) {
    return {
      key: "treatments",
      label: item.label,
      kids: item.kids.map((kid) => ({
        key: navHrefToKey(kid.href),
        label: kid.label,
      })),
    };
  }
  return { key: navHrefToKey(item.href!), label: item.label };
});

export const MENU_ROUTES: Record<string, string> = Object.fromEntries(
  MOBILE_NAV.flatMap((item) =>
    "kids" in item && item.kids
      ? item.kids.map((k) => [k.key, navKeyToHref(k.key)] as const)
      : ([[item.key, navKeyToHref(item.key)]] as const),
  ),
);

/** Contact form topic chips for treatment pages (same labels as nav). */
export const CONTACT_TREATMENT_TOPICS = TREATMENT_LINKS.map(
  (item) => [navHrefToKey(item.href), item.label] as const,
);

export const ISRAEL_PATH =
  "M230.1,20.0L227.7,29.7L225.9,35.9L225.9,43.9L228.7,48.2L232.4,57.1L234.7,65.9L230.1,73.2L230.5,81.0L231.9,87.1L235.7,94.6L228.7,108.0L221.2,120.6L219.4,127.8L212.8,128.6L196.5,135.8L194.7,137.9L191.9,142.2L191.4,145.4L189.1,179.7L180.2,178.9L169.5,171.5L167.7,164.8L164.4,162.7L156.9,161.9L142.5,158.4L126.2,169.9L119.2,188.5L117.3,197.3L111.8,215.9L114.1,227.0L115.0,241.6L116.4,253.5L115.0,260.6L111.8,264.6L112.7,267.2L115.5,268.3L124.3,265.1L134.1,268.3L143.4,274.4L143.9,278.3L137.4,280.7L122.0,290.0L111.3,300.8L108.5,310.8L101.0,332.1L102.0,336.3L105.7,339.0L130.9,336.6L153.2,328.2L170.4,319.0L176.0,319.5L172.3,342.9L169.5,357.1L170.4,359.7L174.6,372.1L167.2,394.6L159.3,413.2L156.0,421.8L148.1,441.2L140.2,463.6L136.0,479.2L136.9,484.7L134.6,513.1L136.0,521.1L126.7,545.5L124.3,557.7L120.6,574.0L114.1,608.6L105.2,620.0L100.6,607.1L90.8,570.4L83.3,545.0L73.6,513.6L56.8,475.3L55.4,466.2L51.7,452.9L40.0,417.9L30.7,392.8L20.0,360.5L33.5,347.9L33.5,337.1L56.3,312.4L55.9,310.0L49.8,303.4L50.7,302.4L75.9,256.1L92.2,210.3L107.6,146.2L118.3,113.6L127.6,91.9L131.8,74.0L146.7,72.6L157.4,74.5L170.9,75.3L181.6,68.4L186.7,48.2L192.8,45.0L195.6,49.8L198.9,44.5L212.8,35.6L219.4,29.7L226.3,22.7L230.1,20.0Z";
