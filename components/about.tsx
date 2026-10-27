"use client";

import Link from "next/link";
import { waLink } from "@/lib/data";
import { PageHero, ResponsiveCarousel, Reveal, SectionLabel, Slot, h2Style } from "./ui";

const CHAPTERS = [
  { big: "+10", bigLabel: "שנות ניסיון באיפור קבוע ואסתטיקה", title: "עשור של דיוק", slot: "about-ch-1", ph: "שיר בעבודה", dir: "row" as const, text: "כבר יותר מעשר שנים אני מתמחה באיפור קבוע לגבות ובטיפולי אסתטיקה מתקדמים. כל שנה הוסיפה עוד שכבה של הבנה: איך עור מגיב, איך פנים משתנות, ואיך לבנות תוצאה שנראית טבעית גם שנים אחרי." },
  { big: "+7", bigLabel: "שנות הוראה והכשרת נשים למקצוע", title: "להעביר את זה הלאה", slot: "about-ch-2", ph: "שיר מלמדת", dir: "row-reverse" as const, text: "מעל שבע שנים אני מלמדת ומכשירה נשים לעולם האיפור הקבוע. הקמתי אקדמיה מקצועית שבה כל תלמידה לומדת ממני ישירות, עם תרגול מעשי וליווי אישי. כל תלמידה שנכנסת לפה מבינה שאין קיצורי דרך והיא מקבלת מעטפת ליווי מלאה גם לאחר הקורס וללא הגבלת זמן." },
  { big: "1:1", bigLabel: "כל טיפול מבוצע על ידי באופן אישי", title: "קליניקת בוטיק לנשים", slot: "about-ch-3", ph: "הקליניקה", dir: "row" as const, text: "הקליניקה מיועדת לנשים בלבד, ונבנתה כמקום שקט, פרטי ונעים. אני מבצעת בעצמי כל טיפול, מהייעוץ הראשון ועד הביקורת, כי אני מאמינה שתוצאה מדויקת מתחילה ביחס אישי." },
];

const VALUES = [
  ["דיוק ויופי טבעי", "תוצאה שמתאימה לפנים שלך, ולא לטרנד של העונה."],
  ["מקצועיות וניסיון", "שנים של עבודה ולמידה מתמדת, בכל טיפול מחדש."],
  ["יחס אישי", "הקשבה אמיתית, זמן ותשומת לב לכל לקוחה."],
  ["אמון ובטיחות", "סטנדרטים גבוהים של היגיינה, שקיפות וכנות."],
  ["העצמה דרך לימוד", "לתת לנשים מקצוע, ביטחון ועתיד עצמאי."],
];

export function AboutPage() {
  return (
    <div>
      <PageHero kicker="נעים להכיר" title={<>נעים להכיר,<br />אני שיר לביא 🤍</>} text="מעל לעשור של עבודה עם נשים, מקרוב. במהלכו הבנתי שהיופי המדויק ביותר הוא זה שמרגיש כאילו תמיד היה שם." />
      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(16px,2vw,24px)" }}>
          {CHAPTERS.map((c) => (
            <article key={c.title} style={{ borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: "clamp(24px,3vw,40px)", display: "flex", flexWrap: "wrap", flexDirection: c.dir, gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
              <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#F2EBE4", color: "#999", flex: "1 1 320px", minWidth: 0, aspectRatio: "4/3" }}>
                <Slot id={c.slot} placeholder={c.ph} />
              </div>
              <div style={{ flex: "1.2 1 360px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16, padding: "clamp(4px,2vw,24px)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={{ fontSize: "clamp(40px,4vw,56px)", fontWeight: 300, letterSpacing: "-.03em", lineHeight: 1 }}>{c.big}</span>
                  <span style={{ fontSize: 14, color: "#5A5A5A" }}>{c.bigLabel}</span>
                </div>
                <h2 style={{ ...h2Style("clamp(26px,2.8vw,38px)") }}>{c.title}</h2>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "#5A5A5A", maxWidth: 520 }}>{c.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <img src="/assets/monogram-gold.png" alt="" style={{ width: 40, height: 40 }} />
          <blockquote style={{ margin: 0, fontSize: "clamp(28px,3.8vw,52px)", lineHeight: 1.3, letterSpacing: "-.025em", textWrap: "balance", fontWeight: 300 }}>&quot;אסתטיקה טובה היא לא לשנות אותך. היא לדעת לדייק את מה שכבר יפה בך.&quot;</blockquote>
          <span style={{ fontSize: 14, color: "#8A8A8A" }}>שיר לביא</span>
        </div>
      </section>
      <section style={{ background: "#F5EEE7", padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "clamp(28px,4vw,48px)" }}>
            <SectionLabel>מה מנחה אותי</SectionLabel>
            <h2 style={h2Style()}>הערכים שלי</h2>
          </div>
          <ResponsiveCarousel
            ariaLabel="הערכים של שיר"
            slideWidth="min(84vw, 300px)"
            desktopStyle={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 12 }}
          >
            {VALUES.map(([t, d]) => (
              <div key={t} style={{ borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#A47B58" }} /></span>
                <h3 style={{ margin: "14px 0 0", fontWeight: 300, fontSize: "clamp(21px,1.9vw,26px)", lineHeight: 1.3 }}>{t}</h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#5A5A5A" }}>{d}</p>
              </div>
            ))}
          </ResponsiveCarousel>
        </div>
      </section>
      <Cta title="אשמח להכיר גם אותך.">
        <a href={waLink("היי שיר, אשמח לתאם שיחת ייעוץ ללא עלות.")} target="_blank" rel="noopener noreferrer" className="pill white-pill">לתיאום ייעוץ ללא עלות <span aria-hidden>←</span></a>
        <Link href="/academy" className="pill ghost-light" style={{ background: "#fff", color: "#1C1C1C" }}>לאקדמיה</Link>
      </Cta>
    </div>
  );
}

export function Cta({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px) clamp(40px,5vw,64px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", overflow: "hidden", background: "#8F6A4B", color: "#fff", borderRadius: "clamp(24px,3vw,40px)", padding: "clamp(64px,9vw,128px) clamp(24px,5vw,64px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20 }}>
        <img src="/assets/monogram-gold.png" alt="" aria-hidden style={{ position: "absolute", width: "clamp(300px,36vw,520px)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.1, pointerEvents: "none" }} />
        <h2 style={{ ...h2Style(), color: "#fff", position: "relative" }}>{title}</h2>
        {text ? <p style={{ margin: 0, fontSize: "clamp(16px,1.3vw,18px)", lineHeight: 1.75, color: "#fff", maxWidth: 460, position: "relative" }}>{text}</p> : null}
        <Reveal delay={120} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, position: "relative" }}>{children}</Reveal>
      </div>
    </section>
  );
}
