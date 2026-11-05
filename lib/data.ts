export const PHONE = "972502444994";

export const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/shir_aesthetics/";
export const INSTAGRAM_HANDLE = "@shir_aesthetics";

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
  /** Teaser for cards and search */
  short: string;
  /** Full marketing copy from the price list */
  details: string;
  /** ILS; omit for catalog items not yet on the price list */
  price?: number;
  /** Unit suffix, e.g. ל-10 יח׳ */
  priceUnit?: string;
};

const MICRO_NEEDLE_DETAILS =
  "הסוד ליצירת שערות עדינות, מדויקות וטבעיות! מחטים מקצועיות ואיכותיות למיקרובליידינג, במגוון גדלים להתאמה מדויקת לסוג העור, למבנה הגבה ולטכניקת העבודה.\n\n✨ מיועדות לאמניות איפור קבוע השואפות לרמת דיוק גבוהה, שליטה מרבית ותוצאות מקצועיות בכל טיפול.\n\n* רוצה לעשות מיקס בין הגדלים? דברי איתנו בוואטסאפ.";

const CARTRIDGE_NEEDLE_DETAILS =
  "הבחירה המקצועית לעבודה מדויקת ולתוצאות מרשימות! מחטים איכותיות למכשור חשמלי לאיפור קבוע, במגוון גדלים ותצורות להתאמה מדויקת לטכניקת העבודה ולאזור המטופל.\n\n✨ מיועדות לאמניות איפור קבוע המחפשות שליטה, דיוק ונוחות בעבודה, ליצירת תוצאות עדינות, אחידות ומקצועיות.\n\n* רוצה לעשות מיקס בין הגדלים? דברי איתנו בוואטסאפ.";

const LIQUID_PIGMENT_DETAILS =
  "הבחירה המקצועית לגבות מדויקות, אחידות ובמראה טבעי! פיגמנט אורגני ע\"ב נוזלי איכותי המותאם במיוחד לעבודה עם מכשור חשמלי לאיפור קבוע. בעל מרקם נוזלי ומדויק, המאפשר זרימת פיגמנט נוחה, עבודה חלקה ושליטה מרבית במהלך הטיפול.\n\nהפורמולה מיועדת לקליטת צבע מהירה ויעילה, לפיזור אחיד של הגוון וליצירת תוצאות יפות וטבעיות לאחר ההחלמה.\n\n✨ הבחירה המושלמת לאמניות איפור קבוע שמחפשות איכות, נוחות עבודה, דיוק ותוצאות מקצועיות לאורך זמן.";

const CREAM_PIGMENT_DETAILS =
  "הסוד לעבודה נקייה, מדויקת ולגבות במראה מושלם! קרם פיגמנט אורגני מקצועי המותאם במיוחד לשיטת המיקרובליידינג. בעל מרקם סמיך ועשיר, המאפשר שליטה מרבית, עבודה נוחה ונקייה ללא נזילות ולכלוך מיותר.\n\nהפורמולה מיועדת להחדרת פיגמנט מדויקת, לקליטת צבע יעילה וליצירת תוצאות אחידות, טבעיות והחלמה יפה, תוך שמירה על גוון יציב לאורך זמן.\n\n✨ הבחירה המושלמת לאמניות מיקרובליידינג שלא מתפשרות על איכות, דיוק ותוצאות מקצועיות.";

export const PRODUCTS: Product[] = [
  {
    id: "needle-cartridge-1",
    name: "מחטים למכשור חשמלי",
    cat: "needles",
    best: true,
    isNew: false,
    rank: 1,
    short: "מחטים איכותיות למכשור חשמלי לאיפור קבוע, במגוון גדלים ותצורות.",
    details: CARTRIDGE_NEEDLE_DETAILS,
    price: 150,
    priceUnit: "ל-10 יח׳",
  },
  {
    id: "needle-cartridge-2",
    name: "מחטים למכשור חשמלי",
    cat: "needles",
    isNew: false,
    best: false,
    rank: 2,
    short: "מחטים איכותיות למכשור חשמלי לאיפור קבוע, במגוון גדלים ותצורות.",
    details: CARTRIDGE_NEEDLE_DETAILS,
    price: 150,
    priceUnit: "ל-10 יח׳",
  },
  {
    id: "needle-micro-1",
    name: "מחטים למיקרובליידינג",
    cat: "needles",
    isNew: false,
    best: false,
    rank: 3,
    short: "מחטים מקצועיות למיקרובליידינג, במגוון גדלים להתאמה לסוג העור ולטכניקה.",
    details: MICRO_NEEDLE_DETAILS,
    price: 99,
    priceUnit: "ל-10 יח׳",
  },
  {
    id: "needle-micro-2",
    name: "מחטים למיקרובליידינג",
    cat: "needles",
    isNew: false,
    best: false,
    rank: 4,
    short: "מחטים מקצועיות למיקרובליידינג, במגוון גדלים להתאמה לסוג העור ולטכניקה.",
    details: MICRO_NEEDLE_DETAILS,
    price: 99,
    priceUnit: "ל-10 יח׳",
  },
  {
    id: "pigment-bottles-stone",
    name: "פיגמנט נוזלי לגבות",
    cat: "pigments",
    best: true,
    isNew: false,
    rank: 5,
    short: "פיגמנט נוזלי איכותי למכשור חשמלי — זרימה נוחה ושליטה מרבית בטיפול.",
    details: LIQUID_PIGMENT_DETAILS,
    price: 199,
  },
  {
    id: "pigment-bottles-marble",
    name: "פיגמנט נוזלי לגבות",
    cat: "pigments",
    isNew: false,
    best: false,
    rank: 6,
    short: "פיגמנט נוזלי איכותי למכשור חשמלי — זרימה נוחה ושליטה מרבית בטיפול.",
    details: LIQUID_PIGMENT_DETAILS,
    price: 199,
  },
  {
    id: "pigment-bottles-desk",
    name: "בקבוקי פיגמנט (שלושה)",
    cat: "pigments",
    isNew: false,
    best: false,
    rank: 7,
    short: "שלושה בקבוקי פיגמנט על שולחן העבודה, כפי שמוצג בתמונה.",
    details: "שלושה בקבוקי פיגמנט על שולחן העבודה, כפי שמוצג בתמונה.",
  },
  {
    id: "pigment-jars-open",
    name: "קרם פיגמנט למיקרובליידינג",
    cat: "pigments",
    isNew: false,
    best: false,
    rank: 8,
    short: "קרם פיגמנט אורגני לשיטת המיקרובליידינג — מרקם סמיך לעבודה נקייה ומדויקת.",
    details: CREAM_PIGMENT_DETAILS,
    price: 199,
  },
  {
    id: "pigment-jars-row",
    name: "קרם פיגמנט למיקרובליידינג",
    cat: "pigments",
    isNew: false,
    best: false,
    rank: 9,
    short: "קרם פיגמנט אורגני לשיטת המיקרובליידינג — מרקם סמיף לעבודה נקייה ומדויקת.",
    details: CREAM_PIGMENT_DETAILS,
    price: 199,
  },
  {
    id: "tool-applicators",
    name: "אפליקטורים",
    cat: "tools",
    best: true,
    isNew: false,
    rank: 10,
    short: "שקית מקלות למריחה חד-פעמיים, כפי שמוצג באריזה ובתמונה.",
    details: "שקית מקלות למריחה חד-פעמיים, כפי שמוצג באריזה ובתמונה.",
  },
  {
    id: "tool-marker",
    name: "טוש לסימון סקיצה",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 11,
    short: "טוש מקצועי לסימון ושרטוט סקיצות — עמידות גבוהה בפני מחיקה במהלך העבודה.",
    details:
      "כי סקיצה מדויקת היא הבסיס לתוצאה מושלמת! טוש מקצועי לסימון ושרטוט סקיצות באיפור קבוע ומיקרובליידינג. בעל עמידות גבוהה בפני מחיקה במהלך העבודה, מסייע בשמירה על קווי המתאר והסימטריה לאורך כל הטיפול.\n\n✨ פריט חובה לכל אמנית איפור קבוע שרוצה לעבוד בביטחון, בדיוק ובשליטה מלאה, מבלי לאבד את הסקיצה במהלך הטיפול.",
    price: 49,
  },
  {
    id: "tool-cups",
    name: "כוסיות לפיגמנט",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 12,
    short: "כוסיות חד־פעמיות למילוי והחזקת פיגמנטים — עבודה היגיינית ומסודרת.",
    details:
      "הפרט הקטן שעושה הבדל גדול בעבודה המקצועית! כוסיות חד־פעמיות איכותיות למילוי והחזקת פיגמנטים במהלך טיפולי איפור קבוע ומיקרובליידינג. מאפשרות עבודה נוחה, מסודרת והיגיינית, תוך גישה קלה לפיגמנט לאורך הטיפול.\n\n✨ פריט חובה לכל אמנית איפור קבוע שמקפידה על סביבת עבודה מקצועית, נקייה ומאורגנת.",
    price: 49,
    priceUnit: "חבילה של 100 יח׳",
  },
  {
    id: "tool-stencils",
    name: "שבלונות לעיצוב גבות",
    cat: "tools",
    isNew: false,
    best: true,
    rank: 13,
    short: "שבלונות מקצועיות להדמיית צורת הגבות לפני טיפול ולעיצוב מדויק.",
    details:
      "הדרך הקלה והמהירה לעיצוב גבות מדויקות וסימטריות! שבלונות מקצועיות להדמיית צורת הגבות לפני טיפול, לתכנון ועיצוב גבות ולאיפור יומיומי. מאפשרות ליצור מסגרת אחידה ומחמיאה בקלות, לחסוך זמן ולהגיע לתוצאה מדויקת ומקצועית.\n\n✨ מתאימות למאפרות, למקצועיות בתחום הגבות ולשימוש ביתי.",
    price: 119,
    priceUnit: "חבילה, 5 צורות · 25 מדבקות",
  },
  {
    id: "tool-pmu-pen",
    name: "מכשיר איפור קבוע אלחוטי",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 14,
    short: "מכשיר חשמלי מקצועי עם 3 מצבי עבודה, עיצוב אלחוטי וסוללה לעד 6 שעות.",
    details:
      "הדור הבא של הנוחות והדיוק בעולם האיפור הקבוע! מכשיר איפור קבוע חשמלי מקצועי, בעל 3 מצבי עבודה להתאמה לטכניקות טיפול שונות ולשליטה מרבית בכל תנועה. בעל מנגנון עבודה עדין ומדויק, המאפשר שליטה בעומק ובתנועת המחט, במטרה לצמצם טראומה מיותרת לעור ולסייע ביצירת תוצאות אחידות, מדויקות והחלמה יפה.\n\nעיצוב אלחוטי וארגונומי המעניק חופש תנועה מלא, עם סוללה עוצמתית המספקת עד 6 שעות עבודה רציפה ללא טעינה.\n\n✨ הבחירה המושלמת לאמניות איפור קבוע שלא מתפשרות על איכות, דיוק, עבודה עדינה ותוצאות מקצועיות.",
    price: 999,
    priceUnit: "כולל 10 מחטים במתנה",
  },
  {
    id: "tool-tweezers-kit",
    name: "קיט פינצטות מקצועי",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 15,
    short: "4 סוגי פינצטות ומספריים מנירוסטה בנרתיק עור — לעיצוב גבות מדויק.",
    details:
      "כל מה שאת צריכה לגבות מושלמות, בערכה אחת! קיט יוקרתי הכולל 4 סוגי פינצטות ומספריים מנירוסטה אל־חלד, לעיצוב, סידור והסרת שיער מהשורש בקלות ובדיוק מרבי. הערכה מגיעה בנרתיק עור איכותי ואלגנטי, השומר על הכלים מסודרים ומוגנים לאורך זמן.\n\n✨ קומפקטי, נוח ומושלם לתיק האישי, לנסיעות ולשימוש מקצועי או ביתי. כי גבות מטופחות מתחילות בכלים הנכונים!",
    price: 119,
  },
  {
    id: "tool-spoolies",
    name: "מברשות ספולי",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 16,
    short: "שקית מברשות ספולי חד-פעמיות, כפי שמוצג בתמונה.",
    details: "שקית מברשות ספולי חד-פעמיות, כפי שמוצג בתמונה.",
  },
  {
    id: "tool-cotton-swabs",
    name: "אפליקטור עץ לסקיצות",
    cat: "tools",
    isNew: false,
    best: false,
    rank: 17,
    short: "אפליקטור עץ לחידוד, תיקון ודיוק קווי הסקיצה לפני הטיפול.",
    details:
      "הכלי הקטן שעושה את ההבדל הגדול בדיוק הסקיצה! אפליקטור עץ מקצועי המיועד לחידוד, תיקון ודיוק קווי הסקיצה בטיפולי איפור קבוע ומיקרובליידינג. מאפשר עבודה נקייה ומדויקת, יצירת קווי מתאר חדים ושמירה על סימטריה מושלמת לפני תחילת הטיפול.\n\n✨ פריט חובה לכל אמנית איפור קבוע שמקפידה על דיוק, אסתטיקה ותוצאה מקצועית.",
    price: 39,
    priceUnit: "חבילה של 100 יח׳",
  },
  {
    id: "aftercare-remover",
    name: "רימובר מקצועי",
    cat: "aftercare",
    tag: "SHIR LAVY",
    best: true,
    isNew: false,
    rank: 18,
    short: "רימובר לתיקון טעויות במהלך טיפול — ללא חומצות, ללא מחטים נוספות.",
    details:
      "מחק הקסמים של האיפור הקבוע! טעית? מתקנים בזמן אמת, בקלות ובדיוק! רימובר ייחודי לתיקון טעויות במהלך טיפולי איפור קבוע ומיקרובליידינג. מיועד לסייע בצמצום קליטת הפיגמנט באזורים שבהם בוצעה טעות, ולאפשר תיקון נקודתי ומדויק של העבודה.\n\n✨ ללא חומצות ומלחים!\n✨ ללא צורך במחטים או במכשור חשמלי נוסף!\n✨ מאפשר תיקון ממוקד ללא פעולת פציעה נוספת של העור.\n\nהפתרון המקצועי שמעניק לך יותר שליטה וביטחון במהלך הטיפול. כי גם למקצועניות מגיע מחק קסמים!",
    price: 149,
  },
];

export function fmt(n: number) {
  return n.toLocaleString("he-IL") + " ₪";
}

export function productPriceLabel(product: Product): string | null {
  if (product.price == null) return null;
  return product.priceUnit ? `${fmt(product.price)} · ${product.priceUnit}` : fmt(product.price);
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
