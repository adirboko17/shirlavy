"use client";

import { useRef, useState } from "react";
import { waLink } from "@/lib/data";
import { Compare, Faq, PageHero, SectionLabel, Slot, h2Style } from "./ui";
import { Cta } from "./about";

const TECH = [
  { title: "מיקרובליידינג", look: "שערות דקות ומוגדרות", fit: "גבות דלילות, מראה טבעי", text: "יצירת קווים דקים בעבודת יד, המדמים שערות טבעיות. מתאים למי שרוצה למלא ולעצב את הגבה במראה עדין ואוורירי." },
  { title: "הדמיית שיער", look: "קווים עדינים בכיוון הצמיחה", fit: "מי שרוצה גבה מלאה וטבעית", text: "בניית קווים עדינים בכיוון צמיחת השערה הטבעית, כך שהגבה נראית מלאה יותר ושומרת על אופייה. כל קו מתוכנן ביחס למבנה הפנים." },
  { title: "הצללת פודרה", look: "רך, מוצלל ומוגדר", fit: "מי שאוהבת מראה מאופר עדין", text: "הצללה הדרגתית היוצרת מראה רך של גבה מאופרת בעדינות. ניתן לבנות עוצמה מתונה או מודגשת יותר, לפי הטעם האישי." },
  { title: "שיטה משולבת", look: "שערות בחזית, הצללה בגוף הגבה", fit: "מי שרוצה עומק עם טבעיות", text: "שילוב של הדמיית שיער בתחילת הגבה עם הצללה עדינה לאורכה. התוצאה מלאה ומוגדרת, ועדיין נראית טבעית." },
];
const GAL = [["hair", "הדמיית שיער"], ["powder", "הצללת פודרה"], ["combo", "שיטה משולבת"], ["hair", "הדמיית שיער"], ["combo", "שיטה משולבת"], ["powder", "הצללת פודרה"]] as const;
const FILTERS = [["all", "הכל"], ["hair", "הדמיית שיער"], ["powder", "פודרה"], ["combo", "משולבת"]] as const;
const WA = waLink("היי שיר, אשמח לתאם ייעוץ ללא עלות לטיפול גבות.");

export function BrowsPage() {
  const galRef = useRef<HTMLElement>(null);
  const [tech, setTech] = useState(1);
  const [f, setF] = useState("all");
  const [lb, setLb] = useState(-1);
  const t = TECH[tech];
  const items = GAL.map((g, i) => ({ cat: g[0], label: g[1], i })).filter((g) => f === "all" || g.cat === f);
  const cur = items.findIndex((g) => g.i === lb);
  const lbItem = cur >= 0 ? items[cur] : null;

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
            <h2 style={h2Style()}>ארבע טכניקות, התאמה אחת</h2>
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
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 12 }}>
            {[
              ["ייעוץ ראשוני", "שיחה ללא עלות על הציפיות, ההיסטוריה של הגבות והמראה הרצוי."],
              ["מדידה ותכנון", "מיפוי מבנה הפנים ושרטוט מוקדם של הגבה, לאישורך."],
              ["התאמת גוון", "בחירת פיגמנט בהתאם לגוון העור, השיער והטעם האישי."],
              ["טיפול וביקורת", "הטיפול עצמו, ולאחריו מפגש ביקורת לדיוק ולהשלמה במידת הצורך."],
            ].map(([t2, d], i) => (
              <li key={t2} style={{ borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: 22 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#8F6A4B" }}>{i + 1}</span>
                <h3 style={{ margin: "14px 0 10px", fontWeight: 300, fontSize: "clamp(21px,1.9vw,26px)" }}>{t2}</h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#5A5A5A" }}>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: "clamp(24px,4vw,56px)" }}>
          <div>
            <SectionLabel>אחרי הטיפול</SectionLabel>
            <h2 style={{ ...h2Style(), marginTop: 16 }}>הימים שאחרי</h2>
            <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.75, color: "#5A5A5A", maxWidth: 400 }}>הנחיות כלליות בלבד. בסיום הטיפול תקבלי הנחיות אישיות ומפורטות.</p>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {[
              "להימנע מהרטבה ממושכת של אזור הגבה בימים הראשונים.",
              "לא לגרד, לקלף או לשפשף את האזור בזמן ההחלמה.",
              "להימנע מחשיפה ישירה לשמש, בריכה וסאונה בתקופת ההחלמה.",
              "להשתמש רק במוצרים שהומלצו בקליניקה.",
              "לפנות לשיר בכל שאלה, בכל שלב.",
            ].map((item) => (
              <li key={item} style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 0", borderTop: "1px solid rgba(28,28,28,.14)", fontSize: 15, lineHeight: 1.55 }}>
                <span style={{ flex: "none", width: 8, height: 8, borderRadius: "50%", background: "#A47B58" }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section ref={galRef} style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 20, marginBottom: "clamp(28px,4vw,48px)" }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
              <SectionLabel>לפני ואחרי</SectionLabel>
              <h2 style={h2Style()}>גלריית עבודות</h2>
            </div>
            <div role="tablist" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {FILTERS.map(([k, label]) => (
                <button key={k} type="button" role="tab" aria-selected={f === k} className="chip" onClick={() => setF(k)} style={{ background: f === k ? "#1C1C1C" : "#F7F5F2", color: f === k ? "#fff" : "#1C1C1C" }}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 12 }}>
            {items.map((g) => (
              <figure key={g.i} style={{ margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, aspectRatio: "2/1.2" }}>
                  <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#F2EBE4" }}><Slot id={`brows-g${g.i}-before`} placeholder="לפני" /></div>
                  <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#F2EBE4" }}><Slot id={`brows-g${g.i}-after`} placeholder="אחרי" /></div>
                </div>
                <figcaption style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 6px 4px" }}>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{g.label}</span>
                  <button type="button" className="chip" style={{ height: 36, background: "#F5EEE7" }} onClick={() => setLb(g.i)}>הגדלה</button>
                </figcaption>
              </figure>
            ))}
          </div>
          <p style={{ margin: "20px 0 0", fontSize: 13, color: "#8A8A8A" }}>יוצגו תמונות אמיתיות של לקוחות בלבד, באישורן. התוצאות משתנות מאישה לאישה.</p>
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

      <Cta title="הגבה המדויקת שלך מתחילה בשיחה.">
        <a href={WA} target="_blank" rel="noopener noreferrer" className="pill white-pill" style={{ height: 56 }}>לתיאום ייעוץ ללא עלות <span aria-hidden>←</span></a>
      </Cta>

      {lbItem ? (
        <div role="dialog" aria-modal="true" aria-label="השוואת לפני ואחרי" style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(41,37,34,.55)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ width: "min(100%,560px)", background: "#fff", borderRadius: 28, padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 6px 0" }}>
              <span style={{ fontSize: 14, color: "#8A8A8A" }}>{cur + 1} / {items.length}</span>
              <button type="button" aria-label="סגירה" className="round" style={{ width: 40, height: 40, background: "#F7F5F2" }} onClick={() => setLb(-1)}>✕</button>
            </div>
            <Compare sid={`brows-g${lbItem.i}`} caption={lbItem.label} note="[פרטי הטיפול]" ratio="1/1" />
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <button type="button" className="pill ghost" onClick={() => setLb(items[(cur - 1 + items.length) % items.length].i)}>→ הקודם</button>
              <button type="button" className="pill ghost" onClick={() => setLb(items[(cur + 1) % items.length].i)}>הבא ←</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const meta = { display: "flex", flexDirection: "column" as const, gap: 2, padding: "12px 0 0", borderTop: "1px solid rgba(28,28,28,.14)", fontSize: 14, minWidth: 170 };
