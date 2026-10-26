export const PHONE = "972502444994";

export const CATS = {
  aftercare: "טיפוח לאחר טיפול",
  skin: "טיפוח העור",
  tools: "כלים ואביזרים",
  sets: "ערכות",
} as const;

export type Cat = keyof typeof CATS;

export type Variant = { id: string; label: string; add: number };

export type Product = {
  id: string;
  name: string;
  cat: Cat;
  price: number;
  tag?: string;
  isNew: boolean;
  best: boolean;
  rank: number;
  short: string;
  size?: string;
  variants?: Variant[];
};

export const PRODUCTS: Product[] = [
  {
    id: "calm-serum",
    name: "סרום הרגעה לאחר טיפול",
    cat: "aftercare",
    price: 149,
    tag: "חדש",
    isNew: true,
    best: false,
    rank: 2,
    short: "סרום קליל לשגרת הטיפוח שבימים שאחרי הטיפול.",
    size: "30 מ״ל",
  },
  {
    id: "brow-balm",
    name: "באלם החלמה לגבות",
    cat: "aftercare",
    price: 89,
    tag: "הנמכר ביותר",
    isNew: false,
    best: true,
    rank: 1,
    short: "באלם עשיר בשכבה דקה, לשמירה על אזור הטיפול.",
    size: "15 מ״ל",
  },
  {
    id: "rich-cream",
    name: "קרם לחות עשיר",
    cat: "skin",
    price: 219,
    isNew: false,
    best: true,
    rank: 3,
    short: "קרם קטיפתי לשגרת בוקר וערב.",
    variants: [
      { id: "50", label: "50 מ״ל", add: 0 },
      { id: "100", label: "100 מ״ל", add: 90 },
    ],
  },
  {
    id: "face-mist",
    name: "תרסיס פנים מרענן",
    cat: "skin",
    price: 129,
    isNew: true,
    best: false,
    tag: "חדש",
    rank: 5,
    short: "ערפל עדין לרענון העור לאורך היום.",
    size: "100 מ״ל",
  },
  {
    id: "night-mask",
    name: "מסכת לילה משקמת",
    cat: "skin",
    price: 249,
    isNew: true,
    best: false,
    rank: 6,
    short: "מסכה עשירה לשימוש פעמיים בשבוע לפני השינה.",
    size: "50 מ״ל",
  },
  {
    id: "home-ritual",
    name: "ערכת טיפוח ביתית",
    cat: "sets",
    price: 389,
    isNew: false,
    best: true,
    tag: "ערכה",
    rank: 4,
    short: "שלושה מוצרים משלימים בקופסה אחת.",
    variants: [
      { id: "classic", label: "קלאסית", add: 0 },
      { id: "gift", label: "באריזת מתנה", add: 30 },
    ],
  },
  {
    id: "brow-brush",
    name: "מברשת גבות מקצועית",
    cat: "tools",
    price: 59,
    isNew: false,
    best: false,
    rank: 7,
    short: "מברשת כפולה לסירוק ועיצוב הגבה.",
    size: "יחידה אחת",
  },
  {
    id: "student-kit",
    name: "ערכת עבודה לסטודנטית",
    cat: "tools",
    price: 690,
    isNew: false,
    best: false,
    rank: 8,
    short: "ערכה בסיסית לתרגול, בהתאמה לתוכנית הלימודים.",
    size: "ערכה",
  },
];

export function fmt(n: number) {
  return n.toLocaleString("he-IL") + " ₪";
}

export function waLink(message: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

export type RichProduct = Product & { catName: string; priceLabel: string };

export function richProducts(): RichProduct[] {
  return PRODUCTS.map((p) => ({
    ...p,
    catName: CATS[p.cat],
    priceLabel: (p.variants ? "החל מ־" : "") + fmt(p.price),
  }));
}

export const NAV = [
  ["/", "ראשי"],
  ["/about", "נעים להכיר"],
  ["/academy", "האקדמיה"],
  ["/brows", "טיפולי גבות"],
  ["/removal", "הסרת איפור קבוע"],
  ["/aesthetics", "טיפולי אסתטיקה"],
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
    ],
  },
  { href: "/academy", label: "האקדמיה" },
  { href: "/shop", label: "חנות" },
  { href: "/contact", label: "יצירת קשר" },
];

export const ISRAEL_PATH =
  "M230.1,20.0L227.7,29.7L225.9,35.9L225.9,43.9L228.7,48.2L232.4,57.1L234.7,65.9L230.1,73.2L230.5,81.0L231.9,87.1L235.7,94.6L228.7,108.0L221.2,120.6L219.4,127.8L212.8,128.6L196.5,135.8L194.7,137.9L191.9,142.2L191.4,145.4L189.1,179.7L180.2,178.9L169.5,171.5L167.7,164.8L164.4,162.7L156.9,161.9L142.5,158.4L126.2,169.9L119.2,188.5L117.3,197.3L111.8,215.9L114.1,227.0L115.0,241.6L116.4,253.5L115.0,260.6L111.8,264.6L112.7,267.2L115.5,268.3L124.3,265.1L134.1,268.3L143.4,274.4L143.9,278.3L137.4,280.7L122.0,290.0L111.3,300.8L108.5,310.8L101.0,332.1L102.0,336.3L105.7,339.0L130.9,336.6L153.2,328.2L170.4,319.0L176.0,319.5L172.3,342.9L169.5,357.1L170.4,359.7L174.6,372.1L167.2,394.6L159.3,413.2L156.0,421.8L148.1,441.2L140.2,463.6L136.0,479.2L136.9,484.7L134.6,513.1L136.0,521.1L126.7,545.5L124.3,557.7L120.6,574.0L114.1,608.6L105.2,620.0L100.6,607.1L90.8,570.4L83.3,545.0L73.6,513.6L56.8,475.3L55.4,466.2L51.7,452.9L40.0,417.9L30.7,392.8L20.0,360.5L33.5,347.9L33.5,337.1L56.3,312.4L55.9,310.0L49.8,303.4L50.7,302.4L75.9,256.1L92.2,210.3L107.6,146.2L118.3,113.6L127.6,91.9L131.8,74.0L146.7,72.6L157.4,74.5L170.9,75.3L181.6,68.4L186.7,48.2L192.8,45.0L195.6,49.8L198.9,44.5L212.8,35.6L219.4,29.7L226.3,22.7L230.1,20.0Z";
