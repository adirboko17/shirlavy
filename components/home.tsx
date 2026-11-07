"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useSite } from "@/lib/site";
import { ProductCard } from "./product-card";
import { StoreQuiz } from "./store-quiz";
import { GRADUATE_TESTIMONIALS } from "@/lib/content";
import type { InstagramWallData } from "@/lib/instagram";
import { INSTAGRAM_HANDLE, INSTAGRAM_PROFILE_URL } from "@/lib/data";
import { InstagramWall } from "./instagram-wall";
import { ResponsiveCarousel, ResultPhotoCard, Slot } from "./ui";

const TREATMENTS = [
  ["01", "מיקרובליידינג", "MICROBLADING", "הדמיית שיער בגבות בטכניקה טבעית - קווים בכיוון צמיחת השערה.", "/brows"],
  ["02", "הצללת פודרה ושיטה משולבת", "POWDER & COMBINATION", "מראה רך ומוגדר, בהתאמה למבנה הפנים ולסוג העור.", "/brows"],
  ["03", "הסרת איפור קבוע בלייזר", "LASER REMOVAL", "טיפול מותאם אישית להבהרת איפור קבוע ישן או לא רצוי.", "/removal"],
  ["04", "טיפולי אסתטיקה מתקדמים", "ADVANCED AESTHETICS", "הסרת שיער בלייזר, מיצוק ומתיחת העור בטכנולוגיות מתקדמות.", "/aesthetics"],
  ["05", "אסתטיקה רפואית", "MEDICAL AESTHETICS", "הזרקות וטיפולים אסתטיים-רפואיים, מבוצעים על ידי רופא מוסמך.", "/medical-aesthetics"],
] as const;

const VALUES = ["דיוק", "טבעיות", "יחס אישי", "מקצועיות", "ביטחון", "אסתטיקה", "למידה", "יופי"];
const MARQUEE_COPIES = 8;

const ACADEMY = [
  ["שנות הוראה", "ניסיון מצטבר בהכשרת נשים למקצוע האיפור הקבוע."],
  ["יחס אישי", "ליווי צמוד, קבוצות קטנות ואפשרות ללמידה פרטנית."],
  ["הכשרה מעשית", "עבודה בידיים כבר מהשלבים הראשונים, לצד שיר."],
  ["מכל הארץ", "תלמידות שמגיעות מצפון הארץ ועד הדרום."],
];

export function HomePage({ instagram }: { instagram: InstagramWallData }) {
  const { products, width } = useSite();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [vOk, setVOk] = useState<boolean | null>(null);
  const [t, setT] = useState(0);
  const narrow = (width || 1200) < 760;
  const mobile = (width || 1200) < 760;

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

  const featured = [...products].sort((a, b) => a.rank - b.rank).slice(0, 4);
  const shade = narrow
    ? "linear-gradient(to top,rgba(28,20,14,.88) 0%,rgba(28,20,14,.7) 40%,rgba(28,20,14,.25) 70%,rgba(28,20,14,.4) 100%)"
    : "linear-gradient(to top,rgba(28,20,14,.72) 0%,rgba(28,20,14,.28) 45%,rgba(28,20,14,.18) 70%,rgba(28,20,14,.42) 100%)";

  return (
    <div className="home-page">
      <section style={{ padding: 0 }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#8F6A4B",
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
            poster="/slots/home-hero-main.webp"
            aria-hidden
            onLoadedData={() => setVOk(true)}
            onError={() => setVOk(false)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: vOk === false ? 0 : 1, transition: "opacity 1.2s ease" }}
          >
            <source src="/assets/hero-video.mp4" media="(max-width: 759px)" />
            <source src="/assets/hero-video-desktop.mp4" media="(min-width: 760px)" />
          </video>
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: shade }} />
          {vOk === false ? <div className="home-hero-fallback"><Slot id="home-hero-main" /></div> : null}
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
                  void v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
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
        <div className="marquee-track" aria-hidden style={{ "--marquee-count": MARQUEE_COPIES } as CSSProperties}>
          {Array.from({ length: MARQUEE_COPIES }, (_, copy) => (
            <div key={copy} className="marquee-row">
              {VALUES.map((v) => (
                <span key={`${copy}-${v}`} style={{ display: "contents" }}>
                  <span>{v}</span>
                  <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="home-results">
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,4vw,48px)" }}>
          <HomeSectionLabel>לפני ואחרי</HomeSectionLabel>
          <div>
            <h2 style={{ margin: 0, fontWeight: 200, fontSize: "clamp(36px,4.6vw,68px)", lineHeight: 1.02, letterSpacing: "-.035em" }}>תוצאות מהקליניקה</h2>
            <p style={{ margin: "16px 0 0", fontSize: "clamp(15px,1.2vw,17px)", lineHeight: 1.75, color: "#5A5A5A", maxWidth: 340 }}>מיקרובליידינג ושיטה משולבת - מבט מקרוב על העבודה בקליניקה.</p>
          </div>
          <ResponsiveCarousel
            ariaLabel="תוצאות לפני ואחרי"
            slideWidth="min(88vw, 360px)"
            desktopStyle={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "clamp(12px,1.6vw,20px)" }}
          >
            <ResultPhotoCard slotId="home-ba-1" ratio="1/1" caption="מיקרובליידינג" />
            <ResultPhotoCard slotId="home-ba-2" ratio="1/1" caption="שיטה משולבת" />
            <ResultPhotoCard slotId="home-ba-3" ratio="1/1" caption="מיקרובליידינג" />
            <ResultPhotoCard slotId="home-ba-4" ratio="1/1" caption="שיטה משולבת" />
          </ResponsiveCarousel>
        </div>
      </section>

      <section className="home-treatments" id="home-treatments">
        <div className="home-container">
          <HomeSectionLabel>הטיפולים בקליניקה</HomeSectionLabel>
          <div className="home-section-heading">
            <h2>טיפולים בהתאמה אישית</h2>
            <p>כל טיפול נבנה סביב מבנה הפנים, סוג העור והמראה שאת אוהבת.</p>
          </div>
          <div className="home-treatments__layout">
            <div className="home-treatments__list">
              {TREATMENTS.map((item, i) => <Link
                key={item[0]} href={item[4]} className="home-treatment" data-active={t === i}
                onMouseEnter={() => setT(i)} onFocus={() => setT(i)}
              >
                <span className="home-treatment__copy"><span className="home-treatment__title">{item[1]}</span><span className="home-treatment__description">{item[3]}</span></span>
                <span className="home-treatment__arrow" aria-hidden>←</span>
              </Link>)}
            </div>
            <figure className="home-treatment-photo">
              <div className="home-treatment-photo__frame">
                {TREATMENTS.map((item, i) => <div key={item[0]} className="home-treatment-photo__slide" data-active={t === i} aria-hidden={t !== i}>
                  {i >= 3 ? (
                    <div className="home-treatment-logo">
                      <img src="/assets/logo-gold.png" alt="" />
                    </div>
                  ) : (
                    <Slot id={"home-tr-" + (i + 1)} placeholder={item[1]} />
                  )}
                </div>)}
              </div>
              <figcaption>{TREATMENTS[t][1]}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="home-academy" id="home-academy">
        <figure className="home-academy__photo">
          <div><Slot id="home-academy-1" placeholder="תלמידות בהכשרה" /></div>
        </figure>
        <div className="home-academy__copy">
          <HomeSectionLabel>האקדמיה של שיר לביא</HomeSectionLabel>
          <h2>המקצוע שלך.<br /><span>העתיד שלך.</span></h2>
          <p className="home-academy__intro">אקדמיה לאיפור קבוע שבה כל תלמידה לומדת ישירות משיר, עם יחס אישי ותרגול מעשי.</p>
              <div className="home-academy__values">
                {ACADEMY.map(([title, text]) => <div className="home-academy__value" key={title}>
                  <span className="home-academy__check" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M5.2 9.15 7.7 11.6 12.8 6.55" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </div>)}
              </div>
          <Link href="/academy" className="home-button home-button--ivory">בואי להכיר את האקדמיה <span aria-hidden>←</span></Link>
        </div>
      </section>

      <section className="home-shop">
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,4vw,48px)" }}>
          <HomeSectionLabel>החנות</HomeSectionLabel>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
            <h2 style={{ margin: 0, fontWeight: 200, fontSize: "clamp(36px,4.6vw,68px)", lineHeight: 1.02, letterSpacing: "-.035em" }}>חנות המוצרים שלי</h2>
            <Link href="/shop" className="text-link">לכל המוצרים <span aria-hidden>←</span></Link>
          </div>
          {featured.length === 0 ? (
            <p style={{ margin: 0, color: "#5A5A5A" }}>המוצרים מהחנות יופיעו כאן.</p>
          ) : mobile ? (
            <ResponsiveCarousel ariaLabel="מוצרים מומלצים" slideWidth="min(72vw, 280px)">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ResponsiveCarousel>
          ) : (
            <div className="hscroll">
              {featured.map((p) => (
                <div key={p.id} style={{ scrollSnapAlign: "start", minWidth: 0 }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-testimonials">
        <div className="home-container">
          <HomeSectionLabel>במילים שלהן</HomeSectionLabel>
          <div className="home-section-heading"><h2>מה אומרות הבוגרות</h2><Link href="/academy" className="home-text-link">עוד מהאקדמיה <span aria-hidden>←</span></Link></div>
          <ResponsiveCarousel ariaLabel="המלצות בוגרות" slideWidth="min(86vw, 340px)" desktopStyle={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "clamp(24px,4vw,56px)" }}>
            {GRADUATE_TESTIMONIALS.slice(0, 3).map((item) => <blockquote className="home-quote" key={item.name}>
              <span className="home-quote__mark" aria-hidden>“</span>
              <p>{item.q}</p>
              <footer><strong>{item.name}</strong><span>{item.meta}</span></footer>
            </blockquote>)}
          </ResponsiveCarousel>
        </div>
      </section>

      <StoreQuiz />

      <section className="home-community">
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,4vw,48px)" }}>
          <HomeSectionLabel>הקהילה</HomeSectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
              <h2 style={{ margin: 0, fontWeight: 200, fontSize: "clamp(36px,4.6vw,68px)", lineHeight: 1.02, letterSpacing: "-.035em" }}>עקבי אחרינו</h2>
              <a href={instagram.profileUrl || INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" dir="ltr" className="ig-handle">
                {instagram.handle || INSTAGRAM_HANDLE}
              </a>
            </div>
            <a href={instagram.profileUrl || INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="pill gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
              </svg>
              עקבי באינסטגרם
            </a>
          </div>
          <InstagramWall posts={instagram.posts} />
        </div>
      </section>
    </div>
  );
}

function HomeSectionLabel({ children }: { children: ReactNode }) {
  return <div className="home-section-label">{children}</div>;
}
