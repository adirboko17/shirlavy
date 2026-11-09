"use client";
import { useRef, useState } from "react";
import { waLink } from "@/lib/data";
import { BROW_TECHNIQUES, TREATMENT_DISCLAIMER } from "@/lib/content";
import { useSite } from "@/lib/site";
import { Slot } from "./ui";
import { TreatmentHero, TreatmentLabel, TreatmentCta, TreatmentProcess, TreatmentFaq, TreatmentClosing } from "./treatment-ui";

const TECH = [
  {
    id: "brow-microblading",
    title: BROW_TECHNIQUES.microblading.title,
    subtitle: BROW_TECHNIQUES.microblading.subtitle,
    look: BROW_TECHNIQUES.microblading.look,
    fit: BROW_TECHNIQUES.microblading.fit,
    paragraphs: BROW_TECHNIQUES.microblading.paragraphs.slice(1),
  },
  {
    id: "brow-powder",
    title: BROW_TECHNIQUES.powder.title,
    subtitle: BROW_TECHNIQUES.powder.subtitle,
    look: BROW_TECHNIQUES.powder.look,
    fit: BROW_TECHNIQUES.powder.fit,
    paragraphs: BROW_TECHNIQUES.powder.paragraphs,
  },
  {
    id: "brow-combined",
    title: BROW_TECHNIQUES.combined.title,
    subtitle: BROW_TECHNIQUES.combined.subtitle,
    look: BROW_TECHNIQUES.combined.look,
    fit: BROW_TECHNIQUES.combined.fit,
    paragraphs: BROW_TECHNIQUES.combined.paragraphs,
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
  const [filter, setFilter] = useState("all");
  const items = GAL.map((g, i) => ({ cat: g[0], label: g[1], i })).filter((g) => filter === "all" || g.cat === filter);
  return <div className="treatment-page treatment-brows">
    <TreatmentHero label="איפור קבוע לגבות" title={<>גבות שמרגישות{" "}<em>כמו שלך.</em></>} text="איפור קבוע לגבות והדמיית שיער, בהתאמה אישית למבנה הפנים, לגבה הטבעית, לסוג העור ולהעדפות שלך." image="brows-hero-portrait" fullBleed caption="שיר לביא · איפור קבוע בהתאמה אישית">
      <TreatmentCta href={WA} /><a className="treatment-link" href="#brow-results">לפני ואחרי <span aria-hidden="true">↓</span></a>
    </TreatmentHero>
    <nav className="treatment-page-nav" aria-label="בעמוד טיפולי גבות"><a href="#brow-results">לפני ואחרי</a><a href="#brow-techniques">שיטות הטיפול</a></nav>
    <section className="treatment-section treatment-gallery" id="brow-results">
      <div className="treatment-container">
        <div className="treatment-heading"><div><TreatmentLabel>מהקליניקה</TreatmentLabel><h2>לפני ואחרי</h2></div>
          <div className="treatment-selector" role="group" aria-label="סינון גלריית עבודות">{FILTERS.map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}</div>
        </div>
        <BrowGallery key={filter} items={items} />
        <p className="treatment-note">התוצאות משתנות בין מטופלת למטופלת.</p>
      </div>
    </section>
    <div className="aesthetic-services" id="brow-techniques">
      {TECH.map((item, index) => <section className="treatment-section aesthetic-service" id={item.id} key={item.id} aria-labelledby={`${item.id}-title`}>
        <div className="treatment-container aesthetic-service__layout">
          <div className="aesthetic-service__intro">
            <TreatmentLabel>0{index + 1} · בהתאמה אישית</TreatmentLabel>
            <h2 id={`${item.id}-title`}>{item.title}</h2>
            <p>{item.subtitle}</p>
            <TreatmentCta href={waLink(`היי שיר, אשמח לייעוץ ללא עלות לגבי ${item.title}.`)}>לייעוץ והתאמה אישית</TreatmentCta>
            <div className="treatment-actions"><a className="treatment-link" href="#brow-results">לפני ואחרי <span aria-hidden="true">↑</span></a></div>
          </div>
          <div className="aesthetic-service__body">
            <div className="aesthetic-service__lead"><h3>על השיטה</h3><p>{item.paragraphs[0]}</p></div>
            <div className="aesthetic-service__topics">
              <details className="treatment-disclosure">
                <summary>עוד על השיטה והתאמתה אלייך<span aria-hidden="true" className="treatment-faq__icon" /></summary>
                {item.paragraphs.slice(1).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              </details>
              <details className="treatment-disclosure">
                <summary>המראה<span aria-hidden="true" className="treatment-faq__icon" /></summary><p>{item.look}</p>
              </details>
              <details className="treatment-disclosure">
                <summary>למי השיטה מתאימה בדרך כלל?<span aria-hidden="true" className="treatment-faq__icon" /></summary><p>{item.fit}</p>
              </details>
            </div>
            <p className="aesthetic-service__note">{TREATMENT_DISCLAIMER}</p>
          </div>
        </div>
      </section>)}
    </div>
    <TreatmentProcess title="מתכננות יחד, עד לפרט הקטן." intro="שיר מתאימה כל טיפול למבנה הפנים, לגבה הטבעית, לסוג העור ולהעדפות שלך." items={[
      ["ייעוץ ראשוני", "שיחה ללא עלות על הציפיות, ההיסטוריה של הגבות והמראה הרצוי."],
      ["מדידה ותכנון", "מיפוי מבנה הפנים ושרטוט מוקדם של הגבה, לאישורך."],
      ["התאמת גוון", "בחירת פיגמנט בהתאם לגוון העור, השיער והטעם האישי."],
      ["טיפול וביקורת", "הטיפול עצמו, ולאחריו מפגש ביקורת לדיוק ולהשלמה במידת הצורך."],
    ]} />
    <TreatmentFaq items={[
            { q: "כמה זמן נמשך הטיפול?", a: "בין שעה לשעה וחצי, תלוי בזמן התכנון ובטכניקה." },
            { q: "האם הטיפול כואב?", a: "התחושה משתנה בין מטופלת למטופלת. במהלך הטיפול שיר מקפידה על נוחות מרבית ועוצרת בכל שלב לפי הצורך." },
            { q: "כמה זמן התוצאה מחזיקה?", a: "בין חצי שנה לשנה וחצי, משתנה בין מטופלת למטופלת. איפור קבוע נוטה להתבהר עם הזמן, ולכן מומלץ לשקול רענון לאורך השנים." },
            { q: "איך יודעים איזו טכניקה מתאימה לי?", a: "בשיחת הייעוץ שיר בוחנת את מבנה הפנים, הגבה הטבעית וסוג העור, ויחד תבחרו את הכיוון המתאים." },
            { q: "יש לי איפור קבוע ישן. אפשר לתקן?", a: "לעיתים ניתן לתקן ולעיתים נדרשת הבהרה תחילה. ההחלטה מתקבלת רק לאחר בדיקה אישית." },
          ]} />
    <TreatmentClosing href={WA} />
  </div>;
}

function BrowGallery({ items }: { items: { i: number; label: string }[] }) {
  const { mobile } = useSite();
  return mobile ? <MobileBrowGallery items={items} /> : <DesktopBrowGallery items={items} />;
}

function MobileBrowGallery({ items }: { items: { i: number; label: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const goTo = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[(index + items.length) % items.length];
    if (!track || !(slide instanceof HTMLElement)) return;
    // Scroll the track only, without moving the page vertically.
    track.scrollTo({ left: track.scrollLeft + slide.getBoundingClientRect().right - track.getBoundingClientRect().right,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  if (!items.length) return null;
  return <div className="brow-gallery">
    <div ref={trackRef} className="brow-gallery__mobile-track" role="region" aria-label="גלריית לפני ואחרי"
      onScroll={() => {
        const track = trackRef.current;
        if (!track) return;
        const edge = track.getBoundingClientRect().right;
        let closest = 0;
        let distance = Infinity;
        Array.from(track.children).forEach((slide, index) => {
          const nextDistance = Math.abs(slide.getBoundingClientRect().right - edge);
          if (nextDistance < distance) { closest = index; distance = nextDistance; }
        });
        setActive(closest);
      }}>
      {items.map((item) => <figure key={item.i} className="brow-gallery__card">
        <div className="brow-gallery__photo"><Slot id={`brows-g${item.i}`} placeholder={item.label} /></div>
        <figcaption>{item.label}</figcaption>
      </figure>)}
    </div>
    {items.length > 1 ? <div className="brow-gallery__bar">
      <button type="button" className="round ghost" aria-label="הקודם" onClick={() => goTo(active - 1)}><span aria-hidden>→</span></button>
      <span className="brow-gallery__count" aria-live="polite">{active + 1} / {items.length}</span>
      <button type="button" className="round ghost" aria-label="הבא" onClick={() => goTo(active + 1)}><span aria-hidden>←</span></button>
    </div> : null}
  </div>;
}

function DesktopBrowGallery({ items }: { items: { i: number; label: string }[] }) {
  const pageSize = 4;
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
