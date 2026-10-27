"use client";

import { useRef, useState } from "react";
import { waLink } from "@/lib/data";
import { GRADUATE_TESTIMONIALS } from "@/lib/content";
import { useSite } from "@/lib/site";
import { PageHero, SectionLabel, Slot, h2Style } from "./ui";

const GAL: [string, string, number][] = [
  ["training", "תלמידות בהכשרה", 2], ["work", "תקריב עבודה", 1], ["space", "סביבת הלמידה", 1], ["work", "תקריב עבודה", 2],
  ["achieve", "הישגי תלמידות", 1], ["training", "תרגול על מודל", 1], ["graduation", "רגע סיום ההכשרה", 2], ["space", "עמדת עבודה", 1], ["achieve", "עבודת בוגרת", 1],
];
const INT = [["track-personal", "מסלול אישי"], ["track-group", "מסלול קבוצתי"], ["zero", "אני מתחילה מאפס"], ["advanced", "השתלמות למקצועניות"]] as const;
const FILTERS = [["all", "הכל"], ["training", "בהכשרה"], ["work", "עבודות"], ["space", "הסטודיו"], ["achieve", "הישגים"], ["graduation", "סיום"]] as const;

export function AcademyPage() {
  const tracksRef = useRef<HTMLElement>(null);
  const { mobile } = useSite();
  const [gf, setGf] = useState("all");
  const [interest, setInterest] = useState("track-personal");
  const gallery = GAL.map((g, i) => ({ cat: g[0], cap: g[1], rows: g[2], i })).filter((g) => gf === "all" || g.cat === gf);
  const intLabel = INT.find((x) => x[0] === interest)?.[1] ?? "";

  return (
    <div>
      <PageHero kicker="האקדמיה של שיר לביא" title={<>המקצוע שלך.<br />העתיד שלך.</>} text="גם אם את מתחילה מאפס, כאן מתחיל המסע שלך לעולם האיפור הקבוע.">
        <button type="button" className="pill gold" style={{ marginTop: 6 }} onClick={() => tracksRef.current && window.scrollTo({ top: tracksRef.current.getBoundingClientRect().top + window.scrollY - 60, behavior: "smooth" })}>
          לפרטים על מסלולי הלימוד <span aria-hidden>↓</span>
        </button>
      </PageHero>

      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, alignItems: "center", textAlign: "center" }}>
          <SectionLabel>על האקדמיה</SectionLabel>
          <p style={{ margin: 0, fontSize: "clamp(24px,2.8vw,38px)", lineHeight: 1.4, letterSpacing: "-.02em", fontWeight: 300, textWrap: "balance" }}>האקדמיה נולדה מתוך הקליניקה. מה שנלמד כאן נבחן קודם על לקוחות אמיתיות, ומועבר הלאה בסבלנות ובדיוק.</p>
          <p style={{ margin: 0, fontSize: "clamp(16px,1.3vw,18px)", lineHeight: 1.75, color: "#5A5A5A", maxWidth: 640 }}>כבר יותר משבע שנים שיר מכשירה נשים לאיפור קבוע, בקבוצות קטנות או באופן פרטני, עם דגש על עבודה מעשית.</p>
        </div>
      </section>

      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "clamp(28px,4vw,48px)" }}>
            <SectionLabel>למי זה מתאים</SectionLabel>
            <h2 style={h2Style()}>לכל אישה שרוצה מקצוע בידיים</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 12 }}>
            {[
              ["מתחילות מאפס", "נשים שחולמות על מקצוע חדש ורוצות ללמוד אותו נכון, מהבסיס."],
              ["הסבה מקצועית", "נשים שמחפשות עצמאות, גמישות ומקצוע יצירתי עם ביקוש."],
              ["נשות מקצוע", "מאפרות וקוסמטיקאיות שרוצות להעמיק טכניקה ולדייק את העבודה."],
            ].map(([t, d]) => (
              <div key={t} style={{ borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: 22 }}>
                <h3 style={{ margin: "14px 0 10px", fontWeight: 300, fontSize: "clamp(21px,1.9vw,26px)" }}>{t}</h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#5A5A5A" }}>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, borderRadius: 24, background: "#EFEBE5", padding: "clamp(24px,3.4vw,44px)", display: "flex", flexWrap: "wrap", gap: "16px 40px", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "clamp(22px,2.4vw,32px)", fontWeight: 300, letterSpacing: "-.02em" }}>מתחילה מאפס? זו בדיוק נקודת ההתחלה.</span>
            <span style={{ fontSize: 15, lineHeight: 1.7, color: "#3A3A3A", maxWidth: 420 }}>אין צורך בניסיון קודם. ההכשרה בנויה שלב אחר שלב, עם ליווי אישי של שיר.</span>
          </div>
        </div>
      </section>

      <section id="tracks" ref={tracksRef} style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "clamp(28px,4vw,48px)" }}>
            <SectionLabel>מסלולי לימוד</SectionLabel>
            <h2 style={h2Style()}>שתי דרכים ללמוד</h2>
            <p style={{ margin: 0, fontSize: "clamp(16px,1.3vw,18px)", lineHeight: 1.75, color: "#5A5A5A", maxWidth: 380 }}>פרטי המסלולים, משכם ומועדי הפתיחה יעודכנו כאן.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))", gap: 12 }}>
            {[
              ["מסלול אישי", "למידה פרטנית מול שיר, בקצב שלך ובהתאמה מלאה לנקודת הפתיחה שלך.", [["מבנה", "אחת על אחת"], ["משך", "[יעודכן]"], ["מועדים", "בתיאום אישי"]], "היי שיר, אשמח לשמוע פרטים על המסלול האישי באקדמיה."],
              ["מסלול קבוצתי", "קבוצה קטנה ואינטימית, עם תרגול משותף, למידה הדדית וליווי צמוד.", [["מבנה", "קבוצה קטנה"], ["משך", "[יעודכן]"], ["מחזור קרוב", "[יעודכן]"]], "היי שיר, אשמח לשמוע פרטים על המסלול הקבוצתי באקדמיה."],
            ].map(([title, desc, rows, msg]) => (
              <article key={title as string} style={{ borderRadius: 28, background: "#fff", border: "1px solid rgba(41,37,34,.08)", padding: "clamp(24px,3vw,40px)", display: "flex", flexDirection: "column", gap: 20 }}>
                <h3 style={{ ...h2Style("clamp(28px,3vw,40px)") }}>{title as string}</h3>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#5A5A5A" }}>{desc as string}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(rows as string[][]).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 16px", borderRadius: 14, background: "#fff", fontSize: 14 }}>
                      <span style={{ color: "#5A5A5A" }}>{k}</span><span>{v}</span>
                    </div>
                  ))}
                </div>
                <a href={waLink(msg as string)} target="_blank" rel="noopener noreferrer" className="pill gold" style={{ marginTop: "auto", alignSelf: "flex-start" }}>לפרטים בוואטסאפ <span aria-hidden>←</span></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#F5EEE7", padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(24px,4vw,40px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionLabel>הכשרה מעשית</SectionLabel>
            <h2 style={h2Style()}>מה תלמדי</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "minmax(0,1fr) minmax(280px,420px)",
              gap: "clamp(24px,4vw,48px)",
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8, order: mobile ? 2 : 1 }}>
              {[
                ["מבנה הפנים ותכנון הגבה", "מדידה, סימטריה והתאמת צורה לכל פנים."],
                ["עור ופיגמנט", "היכרות עם סוגי עור והתאמת גוון."],
                ["מיקרובליידינג", "בניית קווים בכיוון הצמיחה הטבעי."],
                ["הצללת פודרה ושיטה משולבת", "יצירת עומק ורכות בהדרגה."],
                ["היגיינה ובטיחות", "סטנדרטים מחמירים לעבודה נקייה ובטוחה."],
                ["עבודה על מודלים", "תרגול מעשי בליווי צמוד של שיר."],
                ["ליווי לקוחה", "ייעוץ, תיאום ציפיות והנחיות אחרי טיפול."],
              ].map(([t, d], i) => (
                <div key={t} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "18px 0", borderTop: "1px solid rgba(28,28,28,.14)" }}>
                  <span style={{ flex: "none", width: 28, height: 28, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#5A5A5A" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div><span style={{ fontSize: 16, fontWeight: 500 }}>{t}</span><div style={{ fontSize: 14, lineHeight: 1.6, color: "#5A5A5A" }}>{d}</div></div>
                </div>
              ))}
              <span style={{ fontSize: 13, color: "#8A8A8A", padding: "8px 4px" }}>תוכנית הלימודים המפורטת תעודכן כאן.</span>
            </div>
            <div style={{ position: "relative", order: mobile ? 1 : 2, width: "100%", maxWidth: mobile ? "100%" : 420, justifySelf: mobile ? "stretch" : "end" }}>
              <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#F2EBE4", color: "#999", aspectRatio: "4/3", width: "100%" }}>
                <Slot id="ac-skills" placeholder="עבודה מעשית בכיתה" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#F2EBE4", color: "#999", aspectRatio: "1/1" }}>
            <Slot id="ac-shir" placeholder="שיר מלמדת" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionLabel>ללמוד משיר</SectionLabel>
            <blockquote style={{ margin: 0, fontSize: "clamp(24px,2.8vw,38px)", lineHeight: 1.35, letterSpacing: "-.02em", fontWeight: 300 }}>&quot;אני מלמדת כל תלמידה כמו שהייתי רוצה שילמדו אותי: מקרוב, בסבלנות, ובלי קיצורי דרך.&quot;</blockquote>
            <span style={{ fontSize: 14, color: "#5A5A5A" }}>שיר לביא, מייסדת האקדמיה</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionLabel>הבוגרות שלנו</SectionLabel>
          <h2 style={h2Style()}>מצפון ועד דרום</h2>
          <p style={{ margin: 0, fontSize: "clamp(16px,1.3vw,18px)", lineHeight: 1.75, color: "#5A5A5A" }}>מאות תלמידות שהוכשרו מכל רחבי הארץ — מהצפון ועד הדרום, בדרך אחת שנבנתה מתוך ניסיון אמיתי.</p>
        </div>
      </section>

      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: "clamp(28px,4vw,48px)" }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
              <SectionLabel>מהאקדמיה</SectionLabel>
              <h2 style={h2Style()}>גלריה</h2>
            </div>
            <div role="tablist" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {FILTERS.map(([k, label]) => (
                <button key={k} type="button" role="tab" aria-selected={gf === k} className="chip" onClick={() => setGf(k)} style={{ background: gf === k ? "#1C1C1C" : "#F7F5F2", color: gf === k ? "#fff" : "#1C1C1C" }}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,260px),1fr))", gridAutoFlow: "dense", gap: 12 }}>
            {gallery.map((g) => (
              <figure key={g.i} style={{ margin: 0, gridRow: `span ${g.rows}`, position: "relative", borderRadius: 24, overflow: "hidden", background: "#F2EBE4", color: "#999", minHeight: g.rows === 2 ? 480 : 234 }}>
                <Slot id={`ac-gal-${g.i}`} placeholder={g.cap} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: "clamp(28px,4vw,48px)", display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionLabel>הבוגרות שלנו ממליצות</SectionLabel>
            <h2 style={h2Style()}>מה אומרות הבוגרות</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: 12 }}>
            {GRADUATE_TESTIMONIALS.map((item) => (
              <figure key={item.name + item.q.slice(0, 12)} style={{ margin: 0, borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <blockquote style={{ margin: 0, fontSize: "clamp(19px,1.8vw,24px)", lineHeight: 1.5, fontWeight: 300 }}>&quot;{item.q}&quot;</blockquote>
                <figcaption>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{item.name}</span>
                  <br />
                  <span style={{ fontSize: 13, color: "#8A8A8A" }}>{item.meta}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px) clamp(40px,5vw,64px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", background: "#8F6A4B", color: "#fff", borderRadius: 32, padding: "clamp(44px,7vw,96px) clamp(24px,5vw,64px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 22 }}>
          <h2 style={{ ...h2Style(), color: "#fff" }}>מוכנה להתחיל?</h2>
          <p style={{ margin: 0, fontSize: "clamp(16px,1.3vw,18px)", lineHeight: 1.75, color: "rgba(251,250,247,.72)", maxWidth: 440 }}>בחרי מה מעניין אותך, ונשלח לשיר הודעה מוכנה בוואטסאפ.</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
            {INT.map(([k, label]) => {
              const on = interest === k;
              return <button key={k} type="button" aria-pressed={on} className="chip" onClick={() => setInterest(k)} style={{ height: 44, border: `1px solid ${on ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.14)"}`, background: on ? "rgba(255,255,255,.12)" : "transparent", color: "#fff" }}>{label}</button>;
            })}
          </div>
          <a href={waLink(`היי שיר, אשמח לפרטים על האקדמיה. מה שמעניין אותי: ${intLabel}.`)} target="_blank" rel="noopener noreferrer" className="pill white-pill" style={{ height: 56 }}>שליחת פנייה בוואטסאפ <span aria-hidden>←</span></a>
        </div>
      </section>
    </div>
  );
}
