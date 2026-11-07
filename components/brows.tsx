"use client";
import { useState } from "react";
import { waLink } from "@/lib/data";
import { BROW_TECHNIQUES, TREATMENT_DISCLAIMER } from "@/lib/content";
import { useSite } from "@/lib/site";
import { Slot } from "./ui";
import { TreatmentHero, TreatmentLabel, TreatmentCta, TreatmentProcess, TreatmentFaq, TreatmentClosing } from "./treatment-ui";

const TECH = [
  {
    title: BROW_TECHNIQUES.microblading.title,
    look: BROW_TECHNIQUES.microblading.look,
    fit: BROW_TECHNIQUES.microblading.fit,
    text: BROW_TECHNIQUES.microblading.paragraphs.slice(1).join(" "),
  },
  {
    title: BROW_TECHNIQUES.powder.title,
    look: BROW_TECHNIQUES.powder.look,
    fit: BROW_TECHNIQUES.powder.fit,
    text: BROW_TECHNIQUES.powder.paragraphs.join(" "),
  },
  {
    title: BROW_TECHNIQUES.combined.title,
    look: BROW_TECHNIQUES.combined.look,
    fit: BROW_TECHNIQUES.combined.fit,
    text: BROW_TECHNIQUES.combined.paragraphs.join(" "),
  },
];

const GAL = [
  ...Array.from({ length: 8 }, () => ["micro", "מיקרובליידינג"] as const),
  ...Array.from({ length: 8 }, () => ["combo", "שיטה משולבת"] as const),
];
const FILTERS = (
  [
    ["all", "הכל"],
    ["micro", "מיקרובליידינג"],
    ["powder", "פודרה"],
    ["combo", "משולבת"],
  ] as const
).filter(([k]) => k === "all" || GAL.some((g) => g[0] === k));
const WA = waLink("היי שיר, אשמח לתאם ייעוץ ללא עלות לטיפול גבות.");

export function BrowsPage() {
  const [tech, setTech] = useState(0);
  const [filter, setFilter] = useState("all");
  const selected = TECH[tech];
  const items = GAL.map((g, i) => ({ cat: g[0], label: g[1], i })).filter((g) => filter === "all" || g.cat === filter);
  return <div className="treatment-page treatment-brows">
    <TreatmentHero label="איפור קבוע לגבות" title={<>גבות שמרגישות{" "}<em>כמו שלך.</em></>} text="איפור קבוע לגבות והדמיית שיער, בהתאמה אישית למבנה הפנים, לגבה הטבעית, לסוג העור ולהעדפות שלך." image="home-tr-1" caption="מיקרובליידינג · עבודה מהקליניקה">
      <TreatmentCta href={WA} /><a className="treatment-link" href="#brow-results">לעבודות מהקליניקה <span aria-hidden="true">↓</span></a>
    </TreatmentHero>
    <section className="treatment-section">
      <div className="treatment-container">
        <div className="treatment-heading"><div><TreatmentLabel>הטכניקה המתאימה לך</TreatmentLabel><h2>שלוש דרכים.<br />המראה שאת אוהבת.</h2></div><p>{TREATMENT_DISCLAIMER}</p></div>
        <div className="treatment-selector" role="group" aria-label="בחירת טכניקת גבות">
          {TECH.map((item, index) => <button key={item.title} type="button" aria-pressed={tech === index} aria-controls="brow-technique" onClick={() => setTech(index)}>{item.title}</button>)}
        </div>
        <div className="treatment-technique" id="brow-technique">
          <div className="treatment-technique__photo"><Slot id={`brows-tech-${tech}`} /></div>
          <div className="treatment-technique__copy" key={tech}>
            <h3>{selected.title}</h3><p>{selected.text}</p>
            <dl><div><dt>המראה</dt><dd>{selected.look}</dd></div><div><dt>לרוב מתאים ל</dt><dd>{selected.fit}</dd></div></dl>
            <p className="treatment-note">ההתאמה הסופית נקבעת בייעוץ אישי.</p>
          </div>
        </div>
      </div>
    </section>
    <TreatmentProcess title="מתכננות יחד, עד לפרט הקטן." intro="שיר מתאימה כל טיפול למבנה הפנים, לגבה הטבעית, לסוג העור ולהעדפות שלך." items={[
      ["ייעוץ ראשוני", "שיחה ללא עלות על הציפיות, ההיסטוריה של הגבות והמראה הרצוי."],
      ["מדידה ותכנון", "מיפוי מבנה הפנים ושרטוט מוקדם של הגבה, לאישורך."],
      ["התאמת גוון", "בחירת פיגמנט בהתאם לגוון העור, השיער והטעם האישי."],
      ["טיפול וביקורת", "הטיפול עצמו, ולאחריו מפגש ביקורת לדיוק ולהשלמה במידת הצורך."],
    ]} />
    <section className="treatment-section treatment-gallery" id="brow-results">
      <div className="treatment-container">
        <div className="treatment-heading"><div><TreatmentLabel>לפני ואחרי</TreatmentLabel><h2>העבודות, מקרוב.</h2></div>
          <div className="treatment-selector" role="group" aria-label="סינון גלריית עבודות">{FILTERS.map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}</div>
        </div>
        <BrowGallery key={filter} items={items} />
        <p className="treatment-note">התוצאות משתנות מאישה לאישה.</p>
      </div>
    </section>
    <TreatmentFaq items={[
            { q: "כמה זמן נמשך הטיפול?", a: "משך הטיפול משתנה לפי הטכניקה והתכנון. בייעוץ האישי תקבלי הערכה מדויקת יותר." },
            { q: "האם הטיפול כואב?", a: "התחושה משתנה מאישה לאישה. במהלך הטיפול שיר מקפידה על נוחות מרבית ועוצרת בכל שלב לפי הצורך." },
            { q: "כמה זמן התוצאה מחזיקה?", a: "משך ההחזקה תלוי בסוג העור, באורח החיים ובטכניקה. איפור קבוע נוטה להתבהר עם הזמן, ולכן מומלץ לשקול רענון לאורך השנים." },
            { q: "איך יודעים איזו טכניקה מתאימה לי?", a: "בשיחת הייעוץ שיר בוחנת את מבנה הפנים, הגבה הטבעית וסוג העור, ויחד תבחרו את הכיוון המתאים." },
            { q: "יש לי איפור קבוע ישן. אפשר לתקן?", a: "לעיתים ניתן לתקן ולעיתים נדרשת הבהרה תחילה. ההחלטה מתקבלת רק לאחר בדיקה אישית." },
          ]} />
    <TreatmentClosing href={WA} />
  </div>;
}

function BrowGallery({ items }: { items: { i: number; label: string }[] }) {
  const { mobile } = useSite();
  const pageSize = mobile ? 1 : 4;
  const [start, setStart] = useState(0);
  if (!items.length) return null;

  const visible = items.slice(start, start + pageSize);
  const end = start + visible.length;
  const step = (dir: number) => {
    setStart((current) => {
      const next = current + dir * pageSize;
      if (next >= items.length) return 0;
      if (next < 0) return Math.max(0, items.length - (items.length % pageSize || pageSize));
      return next;
    });
  };

  return (
    <div className="brow-gallery">
      <div className="brow-gallery__grid" role="region" aria-label="גלריית לפני ואחרי">
        {visible.map((item) => (
          <figure key={item.i} className="brow-gallery__card">
            <div className="brow-gallery__photo">
              <Slot id={`brows-g${item.i}`} placeholder={item.label} />
            </div>
            <figcaption>{item.label}</figcaption>
          </figure>
        ))}
      </div>
      {items.length > pageSize ? (
        <div className="brow-gallery__bar">
          <button type="button" className="round ghost" aria-label="הקודם" onClick={() => step(-1)}>
            <span aria-hidden>→</span>
          </button>
          <span className="brow-gallery__count">{start + 1}–{end} / {items.length}</span>
          <button type="button" className="round ghost" aria-label="הבא" onClick={() => step(1)}>
            <span aria-hidden>←</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
