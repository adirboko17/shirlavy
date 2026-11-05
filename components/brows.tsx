"use client";

import { useRef, useState } from "react";
import { waLink } from "@/lib/data";
import { BROW_TECHNIQUES, TREATMENT_DISCLAIMER } from "@/lib/content";
import { useSite } from "@/lib/site";
import { Faq, PageHero, ResponsiveCarousel, SectionLabel, Slot, h2Style } from "./ui";

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
  const galRef = useRef<HTMLElement>(null);
  const [tech, setTech] = useState(0);
  const [f, setF] = useState("all");
  const t = TECH[tech];
  const items = GAL.map((g, i) => ({ cat: g[0], label: g[1], i })).filter((g) => f === "all" || g.cat === f);

  return (
    <div>
      <PageHero kicker="טיפולי גבות" title="גבות שמרגישות כמו שלך." text="איפור קבוע לגבות והדמיית שיער, בהתאמה אישית למבנה הפנים, לגבה הטבעית, לסוג העור ולהעדפות שלך.">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 6 }}>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="pill gold">לתיאום ייעוץ ללא עלות <span aria-hidden>←</span></a>
          <button type="button" className="text-link" onClick={() => galRef.current && window.scrollTo({ top: galRef.current.getBoundingClientRect().top + scrollY - 60, behavior: "smooth" })}>לפני ואחרי</button>
        </div>
      </PageHero>

      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: "clamp(28px,4vw,48px)", display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionLabel>טכניקות</SectionLabel>
            <h2 style={h2Style()}>שלוש טכניקות, התאמה אחת</h2>
            <p style={{ margin: 0, fontSize: 14, color: "#8A8A8A" }}>{TREATMENT_DISCLAIMER}</p>
          </div>
          <div role="tablist" style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 6, borderRadius: 999, background: "#F7F5F2", width: "fit-content", maxWidth: "100%", marginBottom: 20 }}>
            {TECH.map((x, i) => (
              <button key={x.title} type="button" role="tab" aria-selected={i === tech} className="chip" onClick={() => setTech(i)} style={{ height: 42, padding: "0 18px", background: i === tech ? "#fff" : "transparent", color: i === tech ? "#1C1C1C" : "#5A5A5A" }}>{x.title}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#F2EBE4", color: "#999", aspectRatio: "5/4" }}>
              <Slot id={`brows-tech-${tech}`} placeholder={`תמונה: ${t.title}`} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <h3 style={h2Style("clamp(28px,3vw,42px)")}>{t.title}</h3>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "#5A5A5A", maxWidth: 480 }}>{t.text}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span style={meta}><span style={{ color: "#8A8A8A", fontSize: 12 }}>המראה</span>{t.look}</span>
                <span style={meta}><span style={{ color: "#8A8A8A", fontSize: 12 }}>לרוב מתאים ל</span>{t.fit}</span>
              </div>
              <span style={{ fontSize: 13, color: "#8A8A8A" }}>ההתאמה הסופית נקבעת בייעוץ אישי.</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#F5EEE7", padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: "clamp(28px,4vw,48px)", display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionLabel>תכנון אישי</SectionLabel>
            <h2 style={h2Style()}>מה מצפה לך</h2>
            <p style={{ margin: 0, color: "#5A5A5A", lineHeight: 1.75, maxWidth: 380 }}>שיר מתאימה כל טיפול למבנה הפנים, לגבה הטבעית, לסוג העור ולהעדפות שלך.</p>
          </div>
          <ResponsiveCarousel
            ariaLabel="מה מצפה לך בטיפול"
            slideWidth="min(84vw, 300px)"
            desktopStyle={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 12 }}
          >
            {[
              ["ייעוץ ראשוני", "שיחה ללא עלות על הציפיות, ההיסטוריה של הגבות והמראה הרצוי."],
              ["מדידה ותכנון", "מיפוי מבנה הפנים ושרטוט מוקדם של הגבה, לאישורך."],
              ["התאמת גוון", "בחירת פיגמנט בהתאם לגוון העור, השיער והטעם האישי."],
              ["טיפול וביקורת", "הטיפול עצמו, ולאחריו מפגש ביקורת לדיוק ולהשלמה במידת הצורך."],
            ].map(([t2, d], i) => (
              <article key={t2} style={{ borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: 22 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#8F6A4B" }}>{i + 1}</span>
                <h3 style={{ margin: "14px 0 10px", fontWeight: 300, fontSize: "clamp(21px,1.9vw,26px)" }}>{t2}</h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#5A5A5A" }}>{d}</p>
              </article>
            ))}
          </ResponsiveCarousel>
        </div>
      </section>

      <section ref={galRef} style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: "clamp(20px,3vw,32px)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <SectionLabel>לפני ואחרי</SectionLabel>
              <h2 style={h2Style()}>גלריית עבודות</h2>
            </div>
            <div role="tablist" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {FILTERS.map(([k, label]) => (
                <button key={k} type="button" role="tab" aria-selected={f === k} className="chip" onClick={() => setF(k)} style={{ background: f === k ? "#1C1C1C" : "#F7F5F2", color: f === k ? "#fff" : "#1C1C1C" }}>{label}</button>
              ))}
            </div>
          </div>
          <BrowGallery key={f} items={items} />
          <p style={{ margin: "20px 0 0", fontSize: 13, color: "#8A8A8A", textAlign: "center" }}>יוצגו תמונות אמיתיות של לקוחות בלבד, באישורן. התוצאות משתנות מאישה לאישה.</p>
        </div>
      </section>

      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionLabel>שאלות נפוצות</SectionLabel>
            <h2 style={h2Style()}>שאלות ותשובות</h2>
          </div>
          <Faq items={[
            { q: "כמה זמן נמשך הטיפול?", a: "משך הטיפול משתנה לפי הטכניקה והתכנון. בייעוץ האישי תקבלי הערכה מדויקת יותר." },
            { q: "האם הטיפול כואב?", a: "התחושה משתנה מאישה לאישה. במהלך הטיפול שיר מקפידה על נוחות מרבית ועוצרת בכל שלב לפי הצורך." },
            { q: "כמה זמן התוצאה מחזיקה?", a: "משך ההחזקה תלוי בסוג העור, באורח החיים ובטכניקה. איפור קבוע נוטה להתבהר עם הזמן, ולכן מומלץ לשקול רענון לאורך השנים." },
            { q: "איך יודעים איזו טכניקה מתאימה לי?", a: "בשיחת הייעוץ שיר בוחנת את מבנה הפנים, הגבה הטבעית וסוג העור, ויחד תבחרו את הכיוון המתאים." },
            { q: "יש לי איפור קבוע ישן. אפשר לתקן?", a: "לעיתים ניתן לתקן ולעיתים נדרשת הבהרה תחילה. ההחלטה מתקבלת רק לאחר בדיקה אישית." },
          ]} />
        </div>
      </section>

    </div>
  );
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

const meta = { display: "flex", flexDirection: "column" as const, gap: 2, padding: "12px 0 0", borderTop: "1px solid rgba(28,28,28,.14)", fontSize: 14, minWidth: 170 };
