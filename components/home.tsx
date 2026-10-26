"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSite } from "@/lib/site";
import { ProductCard } from "./product-card";
import { Compare, SectionLabel, Slot } from "./ui";

const QUOTES = [
  { q: "כאן יופיע ציטוט אמיתי של לקוחה, במילים שלה ובאישורה, על החוויה בקליניקה.", name: "[שם הלקוחה]", meta: "[סוג הטיפול]" },
  { q: "מקום לציטוט שני: מה הרגישה לפני הטיפול, איך היה היחס האישי, ואיך היא מרגישה היום.", name: "[שם הלקוחה]", meta: "[סוג הטיפול]" },
  { q: "מקום לציטוט של בוגרת האקדמיה, על הדרך מהשיעור הראשון ועד הלקוחה הראשונה.", name: "[שם הבוגרת]", meta: "בוגרת האקדמיה" },
];

const TREATMENTS = [
  ["01", "הדמיית שיער בגבות", "HAIR STROKE BROWS", "קווים עדינים בכיוון צמיחת השערה, למראה טבעי ומלא.", "/brows"],
  ["02", "הצללת פודרה ושיטה משולבת", "POWDER & COMBINATION", "מראה רך ומוגדר, בהתאמה למבנה הפנים ולסוג העור.", "/brows"],
  ["03", "הסרת איפור קבוע בלייזר", "LASER REMOVAL", "טיפול מותאם אישית להבהרת איפור קבוע ישן או לא רצוי.", "/removal"],
  ["04", "טיפולי אסתטיקה מתקדמים", "ADVANCED AESTHETICS", "הסרת שיער בלייזר, מיצוק ומתיחת העור בטכנולוגיות מתקדמות.", "/aesthetics"],
] as const;

const VALUES = ["דיוק", "טבעיות", "יחס אישי", "מקצועיות", "ביטחון", "אסתטיקה", "למידה", "יופי"];

const ACADEMY = [
  ["שנות הוראה", "ניסיון מצטבר בהכשרת נשים למקצוע האיפור הקבוע."],
  ["יחס אישי", "ליווי צמוד, קבוצות קטנות ואפשרות ללמידה פרטנית."],
  ["הכשרה מעשית", "עבודה בידיים כבר מהשלבים הראשונים, לצד שיר."],
  ["מכל הארץ", "סטודנטיות שמגיעות מצפון הארץ ועד הדרום."],
];

export function HomePage() {
  const { products, width } = useSite();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [vOk, setVOk] = useState<boolean | null>(null);
  const [t, setT] = useState(0);
  const [q, setQ] = useState(0);
  const narrow = (width || 1200) < 760;
  const desk = (width || 1200) >= 900;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      video.pause();
      return;
    }
    video.play().catch(() => setPlaying(false));
  }, []);

  useEffect(() => {
    const root = wallRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anims: Animation[] = [];
    const timer = setTimeout(() => {
      root.querySelectorAll<HTMLElement>("[data-col]").forEach((c, i) => {
        const d = c.scrollHeight - root.clientHeight;
        if (d <= 0) return;
        anims.push(
          c.animate([{ transform: "translateY(0)" }, { transform: `translateY(-${d}px)` }], {
            duration: d * 45,
            iterations: Infinity,
            direction: i % 2 ? "alternate-reverse" : "alternate",
            easing: "ease-in-out",
          }),
        );
      });
    }, 600);
    return () => {
      clearTimeout(timer);
      anims.forEach((a) => a.cancel());
    };
  }, [width]);

  const featured = [...products].sort((a, b) => a.rank - b.rank).slice(0, 4);
  const quote = QUOTES[q];
  const shade = narrow
    ? "linear-gradient(to top,rgba(28,20,14,.88) 0%,rgba(28,20,14,.7) 40%,rgba(28,20,14,.25) 70%,rgba(28,20,14,.4) 100%)"
    : "linear-gradient(to top,rgba(28,20,14,.72) 0%,rgba(28,20,14,.28) 45%,rgba(28,20,14,.18) 70%,rgba(28,20,14,.42) 100%)";

  const setQuote = (i: number) => setQ((i + QUOTES.length) % QUOTES.length);

  return (
    <div>
      <section style={{ padding: 0 }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#8F6A4B",
            borderRadius: "0 0 clamp(24px,3vw,40px) clamp(24px,3vw,40px)",
            height: narrow ? "min(72svh,620px)" : "clamp(560px,78svh,760px)",
            color: "#fff",
            isolation: "isolate",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            onLoadedData={() => setVOk(true)}
            onError={() => setVOk(false)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: vOk === false ? 0 : 1, transition: "opacity 1.2s ease" }}
          >
            <source src="/assets/hero-video.mp4" media="(max-width: 759px)" />
            <source src="/assets/hero-video-desktop.mp4" media="(min-width: 760px)" />
          </video>
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: shade }} />
          {vOk === false ? (
            <div style={{ position: "absolute", zIndex: 2, top: "clamp(140px,22vh,220px)", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "20px 28px", border: "1px dashed rgba(255,255,255,.5)", borderRadius: 20, fontSize: 14, textAlign: "center" }}>
              <span style={{ fontWeight: 500 }}>מקום לסרטון הפתיחה</span>
              <span dir="ltr" style={{ fontSize: 12, color: "#F5EEE7" }}>assets/hero-video.mp4</span>
            </div>
          ) : null}
          <div style={{ position: "absolute", inset: "auto 0 0 0", zIndex: 2, padding: "0 clamp(20px,4.5vw,64px) clamp(32px,6vh,64px)", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 24 }}>
            <h1 style={{ margin: 0, fontWeight: 200, fontSize: "clamp(42px,6.4vw,100px)", lineHeight: 0.94, letterSpacing: "-.045em", textWrap: "balance", color: "#fff" }}>
              היופי שלך.
              <br />
              <span style={{ fontWeight: 500 }}>בדיוק שלך.</span>
            </h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start", maxWidth: 460 }}>
              <p style={{ margin: 0, fontSize: "clamp(15px,1.2vw,17px)", lineHeight: 1.75, color: "#fff", textWrap: "pretty" }}>
                קליניקת בוטיק לאיפור קבוע ואסתטיקה מתקדמת, לצד אקדמיה מקצועית להכשרת הדור הבא של נשות המקצוע.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 22 }}>
                <Link href="/brows" className="pill white-pill">
                  גלי את הטיפולים <span aria-hidden>←</span>
                </Link>
                <Link href="/academy" className="text-link light">
                  הכירי את האקדמיה
                </Link>
              </div>
            </div>
          </div>
          {vOk !== false ? (
            <button
              type="button"
              aria-label={playing ? "עצירת הסרטון" : "הפעלת הסרטון"}
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                if (v.paused) {
                  v.play();
                  setPlaying(true);
                } else {
                  v.pause();
                  setPlaying(false);
                }
              }}
              className="play"
              style={{ zIndex: 2 }}
            >
              {playing ? "❚❚" : "▶"}
            </button>
          ) : null}
        </div>
      </section>

      <section aria-label="דיוק, טבעיות, יחס אישי, מקצועיות, ביטחון, אסתטיקה, למידה, יופי" className="marquee-wrap">
        <div className="marquee-track" aria-hidden>
          {[0, 1].map((copy) => (
            <div key={copy} className="marquee-row">
              {VALUES.map((v) => (
                <span key={copy + v} style={{ display: "contents" }}>
                  <span>{v}</span>
                  <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "clamp(72px,10vw,140px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "clamp(36px,6vw,96px)", alignItems: "end" }}>
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#F2EBE4", color: "#999", aspectRatio: "4/5", maxWidth: 460, width: "100%" }}>
            <Slot id="home-shir-portrait" placeholder="פורטרט של שיר לביא" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(28px,3vw,40px)" }}>
            <SectionLabel>המייסדת</SectionLabel>
            <h2 style={{ margin: 0, fontSize: "clamp(18px,1.5vw,20px)", fontWeight: 500, letterSpacing: "-.01em" }}>נעים להכיר, אני שיר לביא</h2>
            <p style={{ margin: 0, fontWeight: 300, fontSize: "clamp(24px,2.7vw,38px)", lineHeight: 1.4, letterSpacing: "-.02em", textWrap: "pretty" }}>
              כבר יותר מעשור אני עוסקת באיפור קבוע ובאסתטיקה, ומעל שבע שנים מלמדת ומכשירה נשים למקצוע. בקליניקה שלי, המיועדת לנשים בלבד, כל טיפול נעשה על ידי באופן אישי.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px", fontSize: 14, color: "#5A5A5A" }}>
              <span><strong style={{ fontWeight: 500, color: "#1C1C1C" }}>10+</strong> שנות ניסיון</span>
              <span><strong style={{ fontWeight: 500, color: "#1C1C1C" }}>7+</strong> שנות הוראה</span>
              <span>קליניקה פרטית לנשים בלבד</span>
            </div>
            <Link href="/about" className="text-link">
              לסיפור המלא <span aria-hidden>←</span>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 clamp(16px,4vw,48px) clamp(72px,10vw,140px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,4vw,48px)" }}>
          <SectionLabel>טיפולים</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
            <h2 style={{ margin: 0, fontWeight: 200, fontSize: "clamp(36px,4.6vw,68px)", lineHeight: 1.02, letterSpacing: "-.035em", textWrap: "balance" }}>טיפולים בהתאמה אישית</h2>
            <p style={{ margin: 0, fontSize: "clamp(15px,1.2vw,17px)", lineHeight: 1.75, color: "#5A5A5A", maxWidth: 340, textWrap: "pretty" }}>כל טיפול נבנה סביב מבנה הפנים, סוג העור והמראה שאת אוהבת.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "clamp(32px,5vw,80px)", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", borderBottom: "1px solid rgba(28,28,28,.14)" }}>
              {TREATMENTS.map((item, i) => {
                const active = t === i;
                return (
                  <Link
                    key={item[0]}
                    href={item[4]}
                    onMouseEnter={() => setT(i)}
                    onFocus={() => setT(i)}
                    style={{ display: "grid", gridTemplateColumns: "36px minmax(0,1fr) 24px", gap: "clamp(12px,2vw,24px)", alignItems: "baseline", width: "100%", padding: "clamp(22px,2.4vw,32px) 0", borderTop: "1px solid rgba(28,28,28,.14)", textAlign: "right", color: "#1C1C1C", textDecoration: "none" }}
                  >
                    <span style={{ fontSize: 13, color: active ? "#8F6A4B" : "#8A8A8A", transition: "color .4s" }}>{item[0]}</span>
                    <span style={{ display: "flex", flexDirection: "column", gap: 8, transform: active ? "translateX(-10px)" : "none", transition: "transform .5s cubic-bezier(.16,.8,.2,1)" }}>
                      <span style={{ fontWeight: 300, fontSize: "clamp(22px,2.4vw,34px)", lineHeight: 1.2, letterSpacing: "-.02em" }}>{item[1]}</span>
                      <span style={{ fontSize: 14, lineHeight: 1.6, color: "#5A5A5A" }}>{item[3]}</span>
                    </span>
                    <span aria-hidden style={{ fontSize: 16, color: "#8F6A4B", transform: active ? "translateX(-6px)" : "none", transition: "transform .5s" }}>←</span>
                  </Link>
                );
              })}
            </div>
            <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#F2EBE4", color: "#999", aspectRatio: "4/5" }}>
                {TREATMENTS.map((item, i) => (
                  <div key={item[0]} style={{ position: "absolute", inset: 0, opacity: t === i ? 1 : 0, pointerEvents: t === i ? "auto" : "none", transform: t === i ? "scale(1)" : "scale(1.06)", transition: "opacity .6s, transform 1s cubic-bezier(.16,.8,.2,1)" }}>
                    <Slot id={`home-tr-${i + 1}`} placeholder={`תמונה: ${item[1]}`} />
                  </div>
                ))}
              </div>
              <span dir="ltr" style={{ alignSelf: "flex-start", fontSize: 12, letterSpacing: ".24em", color: "#7A573C" }}>{TREATMENTS[t][2]}</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#F5EEE7", padding: "clamp(72px,10vw,140px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: "clamp(32px,5vw,96px)", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(24px,3vw,32px)" }}>
            <SectionLabel tone="warm">האקדמיה</SectionLabel>
            <h2 style={{ margin: 0, fontWeight: 200, fontSize: "clamp(42px,5.6vw,84px)", lineHeight: 1.02, letterSpacing: "-.035em", textWrap: "balance" }}>
              המקצוע שלך.
              <br />
              העתיד שלך.
            </h2>
            <p style={{ margin: 0, fontSize: "clamp(15px,1.2vw,17px)", lineHeight: 1.75, color: "#5A5A5A", maxWidth: 440, textWrap: "pretty" }}>
              אקדמיה לאיפור קבוע שבה כל סטודנטית לומדת ישירות משיר, עם יחס אישי ותרגול מעשי.
            </p>
            <div style={{ display: "flex", flexDirection: "column", borderBottom: "1px solid rgba(122,87,60,.28)" }}>
              {ACADEMY.map(([title, text]) => (
                <div key={title} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.8fr)", gap: 20, padding: "16px 0", borderTop: "1px solid rgba(122,87,60,.28)", alignItems: "baseline" }}>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{title}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.6, color: "#5A5A5A" }}>{text}</span>
                </div>
              ))}
            </div>
            <Link href="/academy" className="pill gold" style={{ alignSelf: "flex-start" }}>
              גלי את האקדמיה <span aria-hidden>←</span>
            </Link>
          </div>
          <div style={{ position: "relative", width: "100%", aspectRatio: "4/5", maxHeight: "70vh", borderRadius: 24, overflow: "hidden", background: "#E9DED3", color: "#7A573C" }}>
            <Slot id="home-academy-1" placeholder="סטודנטיות בהכשרה" />
          </div>
        </div>
      </section>

      <section style={{ padding: "clamp(72px,10vw,140px) clamp(16px,4vw,48px) 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,4vw,48px)" }}>
          <SectionLabel>סיפורי הצלחה</SectionLabel>
          <div>
            <h2 style={{ margin: 0, fontWeight: 200, fontSize: "clamp(36px,4.6vw,68px)", lineHeight: 1.02, letterSpacing: "-.035em" }}>
              הבוגרות של <span style={{ fontWeight: 500 }}>האקדמיה</span>
            </h2>
            <p style={{ margin: "16px 0 0", fontSize: "clamp(15px,1.2vw,17px)", lineHeight: 1.75, color: "#5A5A5A", maxWidth: 340 }}>נשים שהתחילו כאן את הדרך המקצועית שלהן.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: "clamp(24px,3vw,40px)", alignItems: "start" }}>
            {[0, 1, 2].map((i) => (
              <Link key={i} href="/academy" className="story" style={{ marginTop: desk ? ["0", "72px", "28px"][i] : 0 }}>
                <div style={{ position: "relative", width: "100%", borderRadius: 24, overflow: "hidden", background: "#F2EBE4", color: "#999", aspectRatio: "4/5" }}>
                  <Slot id={`home-story-${i + 1}`} placeholder="פורטרט בוגרת" />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: 14 }}>
                  <span style={{ fontSize: "clamp(20px,1.8vw,26px)", fontWeight: 300, letterSpacing: "-.02em" }}>[שם הבוגרת]</span>
                  <span style={{ fontSize: 13, color: "#5A5A5A" }}>[עיר · שנת סיום]</span>
                </div>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#5A5A5A" }}>[משפט קצר של הבוגרת על הדרך שלה מההכשרה ועד העבודה עם לקוחות משלה]</p>
                <span style={{ fontSize: 14, color: "#8F6A4B" }}>לסיפור המלא ←</span>
              </Link>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "#6A6A6A" }}>תוכן לדוגמה — יוחלף בסיפורים אמיתיים של בוגרות</span>
        </div>
      </section>

      <section style={{ padding: "clamp(72px,10vw,140px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,4vw,48px)" }}>
          <SectionLabel>לפני ואחרי</SectionLabel>
          <div>
            <h2 style={{ margin: 0, fontWeight: 200, fontSize: "clamp(36px,4.6vw,68px)", lineHeight: 1.02, letterSpacing: "-.035em" }}>תוצאות מהקליניקה</h2>
            <p style={{ margin: "16px 0 0", fontSize: "clamp(15px,1.2vw,17px)", lineHeight: 1.75, color: "#5A5A5A", maxWidth: 340 }}>גררי כדי להשוות. יוצגו תמונות אמיתיות של לקוחות בלבד, באישורן.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "clamp(12px,1.6vw,20px)" }}>
            <Compare sid="home-ba-1" caption="הדמיית שיער" note="[פרטי טיפול]" />
            <Compare sid="home-ba-2" caption="שיטה משולבת" note="[פרטי טיפול]" />
            <Compare sid="home-ba-3" caption="הסרה בלייזר" note="[פרטי טיפול]" />
          </div>
        </div>
      </section>

      <section style={{ padding: "0 clamp(16px,4vw,48px) clamp(72px,10vw,140px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,4vw,48px)" }}>
          <SectionLabel>החנות</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
            <h2 style={{ margin: 0, fontWeight: 200, fontSize: "clamp(36px,4.6vw,68px)", lineHeight: 1.02, letterSpacing: "-.035em" }}>טיפוח שממשיך בבית</h2>
            <Link href="/shop" className="text-link">לכל המוצרים <span aria-hidden>←</span></Link>
          </div>
          <div className="hscroll">
            {featured.map((p) => (
              <div key={p.id} style={{ scrollSnapAlign: "start", minWidth: 0 }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 clamp(16px,4vw,48px) clamp(72px,10vw,140px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,3.5vw,44px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#7A573C" }}>מילים של לקוחות</span>
            <span style={{ fontSize: 13, color: "#5A5A5A" }} dir="ltr">{q + 1} / {QUOTES.length}</span>
          </div>
          <blockquote style={{ margin: 0, fontWeight: 200, fontSize: "clamp(28px,3.6vw,50px)", lineHeight: 1.3, letterSpacing: "-.03em", textWrap: "pretty", minHeight: "3.9em" }}>{quote.q}</blockquote>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>{quote.name}</span>
              <span style={{ fontSize: 13, color: "#5A5A5A" }}>{quote.meta}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" aria-label="הקודם" className="round ghost" onClick={() => setQuote(q - 1)}>→</button>
              <button type="button" aria-label="הבא" className="round ghost" onClick={() => setQuote(q + 1)}>←</button>
            </div>
          </div>
          <span style={{ fontSize: 12, color: "#6A6A6A" }}>תוכן לדוגמה — יוחלף בהמלצות אמיתיות באישור הלקוחות</span>
        </div>
      </section>

      <section style={{ padding: "0 clamp(16px,4vw,48px) clamp(72px,10vw,140px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,4vw,48px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#7A573C" }}>הקהילה</span>
            <span dir="ltr" style={{ fontSize: 13, color: "#5A5A5A" }}>@[שם המשתמש]</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
            <h2 style={{ margin: 0, fontWeight: 200, fontSize: "clamp(36px,4.6vw,68px)", lineHeight: 1.02, letterSpacing: "-.035em" }}>עקבי אחרינו</h2>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="pill gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
              </svg>
              עקבי באינסטגרם
            </a>
          </div>
          <div
            ref={wallRef}
            onMouseEnter={() => wallRef.current?.querySelectorAll<HTMLElement>("[data-col]").forEach((c) => c.getAnimations().forEach((a) => a.pause()))}
            onMouseLeave={() => wallRef.current?.querySelectorAll<HTMLElement>("[data-col]").forEach((c) => c.getAnimations().forEach((a) => a.play()))}
            style={{ position: "relative", height: "clamp(520px,72vh,780px)", overflow: "hidden", WebkitMaskImage: "linear-gradient(to bottom,transparent,#000 10%,#000 90%,transparent)", maskImage: "linear-gradient(to bottom,transparent,#000 10%,#000 90%,transparent)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(45%,200px),1fr))", gap: "clamp(8px,1vw,14px)", alignItems: "start" }}
          >
            {[0, 1, 2, 3].map((c) => (
              <div key={c} data-col="1" style={{ display: "flex", flexDirection: "column", gap: "clamp(8px,1vw,14px)" }}>
                {[0, 1, 2, 3, 4].map((r) => {
                  const n = c * 5 + r + 1;
                  const ar = ["4/5", "1/1", "3/4", "4/5", "1/1"][(r + c) % 5];
                  return (
                    <a key={r} href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="פוסט באינסטגרם" style={{ position: "relative", display: "block", borderRadius: 16, overflow: "hidden", background: "#F2EBE4", color: "#999", aspectRatio: ar }}>
                      <Slot id={n <= 6 ? `home-ig-${n}` : `home-wall-${n}`} placeholder="פוסט" />
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
