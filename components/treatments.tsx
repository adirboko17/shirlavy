"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { waLink } from "@/lib/data";
import { TREATMENT_DISCLAIMER } from "@/lib/content";
import { Faq, PageHero, ResponsiveCarousel, ResultPhotoCard, SectionLabel, Slot, h2Style } from "./ui";
import { Cta } from "./about";

const WA = waLink("היי שיר, אשמח לבדיקת התאמה להסרת איפור קבוע בלייזר.");

export function RemovalPage() {
  return (
    <div>
      <PageHero kicker="הסרת איפור קבוע" title="הסרת איפור קבוע בלייזר" text="איפור קבוע שלא צלח — לא בהכרח משהו שצריך לחיות איתו. בטכנולוגיית לייזר מתקדמת ניתן לפרק פיגמנטים, במטרה להבהיר או להסיר איפור ישן, כושל או כזה שכבר אינו מתאים.">
        <a href={WA} target="_blank" rel="noopener noreferrer" className="pill gold" style={{ marginTop: 6 }}>לבדיקת התאמה ללא עלות <span aria-hidden>←</span></a>
      </PageHero>
      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, alignItems: "center", textAlign: "center" }}>
          <SectionLabel>על הטיפול</SectionLabel>
          <p style={{ margin: 0, fontWeight: 300, fontSize: "clamp(24px,2.8vw,38px)", lineHeight: 1.4, letterSpacing: "-.02em" }}>הטיפול מתבצע באמצעות מכשור מתקדם, תוך הקפדה על פרוטוקולי עבודה, אמצעי מיגון ובטיחות.</p>
          <p style={{ margin: 0, fontSize: "clamp(16px,1.3vw,18px)", lineHeight: 1.75, color: "#5A5A5A", maxWidth: 640 }}>משך הטיפול קצר ולעיתים ניתן להבחין בשינוי כבר לאחר המפגש הראשון. מספר הטיפולים הנדרש משתנה בהתאם לסוג הפיגמנט, צבעו, עומק החדרתו, סוג העור ותגובתו לטיפול. {TREATMENT_DISCLAIMER}</p>
          <p style={{ margin: 0, fontSize: "clamp(15px,1.2vw,17px)", lineHeight: 1.75, color: "#5A5A5A", maxWidth: 640 }}><strong>חשוב לדעת:</strong> לייזר הוא לא משחק. מדובר במכשור עוצמתי המחייב ידע מקצועי, הכשרה מתאימה וניסיון מעשי.</p>
        </div>
      </section>
      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: "clamp(28px,4vw,48px)", display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionLabel>למה נשים פונות</SectionLabel>
            <h2 style={h2Style()}>סיבות נפוצות להסרה</h2>
          </div>
          <ResponsiveCarousel
            ariaLabel="סיבות נפוצות להסרה"
            slideWidth="min(84vw, 280px)"
            desktopStyle={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 12 }}
          >
            {[
              ["גוון שהשתנה", "פיגמנט שהפך עם השנים לאפרפר, אדמדם או כחלחל."],
              ["צורה שלא מתאימה", "גבה שעוצבה בעבר בקו שאינו תואם את מבנה הפנים."],
              ["טיפול שלא הצליח", "תוצאה לא אחידה, כהה מדי או לא סימטרית."],
              ["רצון בהתחלה חדשה", "הבהרה כהכנה לטיפול גבות חדש ומדויק יותר."],
            ].map(([t, d]) => (
              <div key={t} style={{ borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: 22 }}>
                <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#A47B58" }} /></span>
                <h3 style={{ margin: "14px 0 10px", fontWeight: 300, fontSize: "clamp(21px,1.9vw,26px)" }}>{t}</h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#5A5A5A" }}>{d}</p>
              </div>
            ))}
          </ResponsiveCarousel>
        </div>
      </section>
      <section style={{ background: "#F5EEE7", padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))", gap: "clamp(28px,5vw,64px)" }}>
          <div style={{ position: "sticky", top: 110 }}>
            <SectionLabel>התהליך</SectionLabel>
            <h2 style={{ ...h2Style(), marginTop: 16 }}>צעד אחר צעד, בקצב של העור</h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "#5A5A5A", maxWidth: 400 }}>הסבר כללי בלבד. התוכנית המדויקת נבנית לאחר בדיקת התאמה.</p>
          </div>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {[
              ["בדיקה וייעוץ", "הערכת הפיגמנט, העור והציפיות, ותיאום מה ניתן להשיג."],
              ["טיפול לייזר", "מפגש קצר יחסית, בהתאמה אישית של הפרמטרים לאזור."],
              ["החלמה בין מפגשים", "מרווח זמן שמאפשר לעור להתאושש ולגוף לפנות פיגמנט."],
              ["הערכה מחודשת", "בכל מפגש בוחנים יחד את ההתקדמות ומחליטים על ההמשך."],
            ].map(([t, d], i) => (
              <li key={t} style={{ display: "flex", gap: 16, padding: "20px 0", borderTop: "1px solid rgba(28,28,28,.14)" }}>
                <span style={{ flex: "none", width: 32, height: 32, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{String(i + 1).padStart(2, "0")}</span>
                <div><span style={{ fontSize: 16, fontWeight: 500 }}>{t}</span><div style={{ fontSize: 14, lineHeight: 1.6, color: "#5A5A5A" }}>{d}</div></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", borderRadius: 28, background: "#EFEBE5", padding: "clamp(28px,4vw,56px)", display: "flex", flexWrap: "wrap", gap: "16px 48px", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={h2Style("clamp(28px,3.2vw,44px)")}>לפני כל טיפול, שיחה כנה.</h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "#3A3A3A", maxWidth: 520 }}>שיר בוחנת את האזור, שומעת על הטיפולים הקודמים ומסבירה מה ניתן לצפות. אם הטיפול אינו מתאים, היא תאמר זאת בפשטות.</p>
        </div>
      </section>
      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionLabel>מהקליניקה</SectionLabel>
          <h2 style={{ ...h2Style(), margin: "16px 0" }}>תמונות טיפול</h2>
          <p style={{ margin: "0 0 28px", color: "#5A5A5A", maxWidth: 380 }}>תמונות אמיתיות של לקוחות, באישורן. כל תוצאה אישית.</p>
          <ResponsiveCarousel
            ariaLabel="תמונות לפני ואחרי הסרה"
            slideWidth="min(88vw, 360px)"
            desktopStyle={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 12 }}
          >
            <ResultPhotoCard slotId="rm-ba-1" caption="לפני ואחרי סדרת טיפולים" note="[מספר טיפולים]" />
            <ResultPhotoCard slotId="rm-ba-2" caption="הבהרה לקראת טיפול חדש" note="[מספר טיפולים]" />
          </ResponsiveCarousel>
        </div>
      </section>
      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ textAlign: "center" }}>
            <SectionLabel>שאלות נפוצות</SectionLabel>
            <h2 style={{ ...h2Style(), marginTop: 16 }}>שאלות ותשובות</h2>
          </div>
          <Faq items={[
            { q: "האם הלייזר מסיר את האיפור הקבוע לחלוטין?", a: "לא ניתן להבטיח הסרה מלאה. במקרים רבים מגיעים להבהרה משמעותית, אך התוצאה תלויה בגורמים אישיים רבים." },
            { q: "כמה טיפולים יידרשו?", a: "אין מספר קבוע. הערכה ראשונית תינתן בייעוץ, והתוכנית מתעדכנת לאורך הדרך לפי תגובת העור." },
            { q: "האם זה כואב?", a: "התחושה משתנה מאישה לאישה. במהלך הייעוץ שיר תסביר על התחושה ועל הדרכים להפוך את הטיפול לנוח יותר." },
            { q: "אפשר לעשות טיפול גבות חדש אחרי ההסרה?", a: "לעיתים קרובות כן, לאחר החלמה מלאה. שיר תמליץ על העיתוי המתאים לך." },
          ]} />
        </div>
      </section>
      <Cta title="נתחיל בבדיקה אישית." text="שלחי הודעה, ואם אפשר צרפי תמונה של האזור באור יום.">
        <a href={WA} target="_blank" rel="noopener noreferrer" className="pill white-pill" style={{ height: 56 }}>לייעוץ בוואטסאפ <span aria-hidden>←</span></a>
      </Cta>
    </div>
  );
}

const TREATMENTS = [
  { id: "laser", title: "הסרת שיער בלייזר", ph: "הסרת שיער בלייזר", short: "טיפולי הסרת השיער מתבצעים באמצעות מכשור לייזר מתקדם, עם התאמת פרמטרים לגוון העור, סוג השיער ומאפיינים אישיים.", blocks: [["מה זה", "מכשור לייזר הפועל באמצעות אנרגיית אור המכוונת לפיגמנט שבשערה ופוגעת בזקיק השיער במטרה להפחית את צמיחתו לאורך זמן."], ["למי זה מתאים", "הטיפול מתאים גם למטופלים צעירים, לאחר אבחון מקצועי, בחינת ההתאמה האישית והתייחסות לגיל ולשלב ההתפתחות."], ["מה לצפות", "כבר במהלך סדרת הטיפולים ניתן להבחין בהפחתה בצמיחת השיער. קצב התגובה ומספר המפגשים משתנים מאדם לאדם."]], faq: [{ q: "כמה מפגשים נדרשים?", a: "אין מספר קבוע. ההערכה נעשית בייעוץ ומתעדכנת לפי התגובה לטיפול." }, { q: "האם יש הכנה מיוחדת?", a: "כן, תקבלי הנחיות הכנה מפורטות לפני המפגש הראשון." }, { q: "אפשר לטפל בכל עונה?", a: "ניתן לטפל לאורך השנה, תוך הקפדה על הנחיות חשיפה לשמש." }] },
  { id: "firming", title: "מיצוק והידוק העור", ph: "טיפול מיצוק", short: "טיפולי מיצוק והידוק העור לשיפור מראה העור, מרקמו ותחושת המוצקות — בטכנולוגיה מתקדמת המותאמת לאזור המטופל.", blocks: [["מה זה", "אנרגיה מבוקרת מועברת לרקמות העור במטרה לעודד תהליכים טבעיים של התחדשות וייצור קולגן."], ["למי זה מתאים", "למי שניכר בה ירידה בגמישות העור — לאחר הריונות, ירידה במשקל או שינויים הורמונליים — באזורים כמו הבטן, הזרועות והירכיים."], ["מה לצפות", "תוכנית הטיפול נבנית בהתאמה אישית. השיפור מתפתח בהדרגה ותלוי במצב העור, במידת הרפיון ובתגובה האישית."]], faq: [{ q: "מתי רואים שינוי?", a: "השינוי הדרגתי ותלוי בעור ובתגובה לטיפול. שיר תתאם איתך ציפיות מראש." }, { q: "האם יש זמן החלמה?", a: "ברוב המקרים ניתן לחזור לשגרה מיד. פרטים מדויקים יינתנו בייעוץ." }] },
  { id: "tightening", title: "מתיחת העור וטכנולוגיות מתקדמות", ph: "טכנולוגיות אסתטיות", short: "טכנולוגיות אסתטיות לשיפור מראה המרקם והקווים, בגישה זהירה ומותאמת אישית.", blocks: [["מה זה", "מגוון טכנולוגיות לשיפור מראה העור. הבחירה בטכנולוגיה נעשית לפי מטרת הטיפול ומאפייני העור."], ["למי זה מתאים", "לנשים המחפשות שיפור במראה המרקם או הקווים, בלי הליך פולשני. ההתאמה נבדקת באופן אישי."], ["מה לצפות", "תוכנית אישית עם תיאום ציפיות כן. התוצאות משתנות ואינן מובטחות מראש."]], faq: [{ q: "איך בוחרים את הטיפול הנכון?", a: "בשיחת הייעוץ בוחנים את העור והמטרות, ושיר ממליצה על הכיוון המתאים." }, { q: "אפשר לשלב עם טיפולים אחרים?", a: "לעיתים כן. ההמלצה ניתנת באופן אישי." }] },
];

export function AestheticsPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;
  const cur = TREATMENTS.find((t) => t.id === id);
  if (!cur) {
    return (
      <div>
        <PageHero kicker="טיפולי אסתטיקה" title="אסתטיקה מתקדמת, בדיוק אישי." text="טכנולוגיות מתקדמות לטיפוח העור והגוף, עם אותה הקפדה ואותו יחס אישי." />
        <section style={{ padding: "0 clamp(16px,4vw,48px) clamp(56px,8vw,112px)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
            <ResponsiveCarousel
              ariaLabel="טיפולי אסתטיקה"
              slideWidth="min(92vw, 420px)"
              desktopStyle={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {TREATMENTS.map((t, i) => (
                <article key={t.id} style={{ borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: "clamp(24px,3vw,40px)", display: "flex", flexWrap: "wrap", flexDirection: i % 2 ? "row-reverse" : "row", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
                  <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#F2EBE4", color: "#999", flex: "1.2 1 380px", minWidth: 0, aspectRatio: "16/11" }}>
                    <Slot id={t.id === "laser" ? "aes-clinic" : `aes-${t.id}`} placeholder={t.ph} />
                  </div>
                  <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                    <h2 style={h2Style("clamp(28px,3vw,42px)")}>{t.title}</h2>
                    <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "#5A5A5A", maxWidth: 440 }}>{t.short}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <Link href={`/aesthetics/${t.id}`} className="pill gold">למידע נוסף <span aria-hidden>←</span></Link>
                      <a href={waLink(`היי שיר, אשמח לייעוץ ללא עלות לגבי ${t.title}.`)} target="_blank" rel="noopener noreferrer" className="pill ghost">ייעוץ ללא עלות</a>
                    </div>
                  </div>
                </article>
              ))}
            </ResponsiveCarousel>
          </div>
        </section>
      </div>
    );
  }
  return (
    <div>
      <section style={{ padding: "clamp(100px,12vh,120px) clamp(16px,4vw,48px) clamp(40px,6vw,72px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Link href="/aesthetics" className="chip" style={{ background: "#F7F5F2", marginBottom: 28 }}>→ כל טיפולי האסתטיקה</Link>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <h1 style={h2Style("clamp(40px,5.4vw,76px)")}>{cur.title}</h1>
              <p style={{ margin: 0, fontSize: "clamp(16px,1.3vw,18px)", lineHeight: 1.75, color: "#5A5A5A", maxWidth: 460 }}>{cur.short}</p>
              <a href={waLink(`היי שיר, אשמח לייעוץ ללא עלות לגבי ${cur.title}.`)} target="_blank" rel="noopener noreferrer" className="pill gold" style={{ alignSelf: "flex-start" }}>לתיאום ייעוץ ללא עלות <span aria-hidden>←</span></a>
            </div>
            <div style={{ position: "relative", overflow: "hidden", background: "#F2EBE4", color: "#999", borderRadius: "220px 220px 28px 28px", aspectRatio: "4/5", maxHeight: "70vh" }}>
              <Slot id={`aes-${cur.id}-detail`} placeholder={cur.ph} />
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <ResponsiveCarousel
          ariaLabel={`פרטים על ${cur.title}`}
          slideWidth="min(84vw, 300px)"
          desktopStyle={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 12 }}
        >
          {cur.blocks.map(([t, d], i) => (
            <div key={t} style={{ borderTop: "1px solid rgba(28,28,28,.14)", paddingTop: 22 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#8F6A4B" }}>{String(i + 1).padStart(2, "0")}</span>
              <h2 style={{ margin: "14px 0 10px", fontWeight: 300, fontSize: "clamp(21px,1.9vw,26px)" }}>{t}</h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#5A5A5A" }}>{d}</p>
            </div>
          ))}
        </ResponsiveCarousel>
      </section>
      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          <h2 style={{ ...h2Style(), textAlign: "center" }}>שאלות ותשובות</h2>
          <Faq items={cur.faq} />
        </div>
      </section>
      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px) clamp(40px,5vw,64px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <span style={{ fontSize: 14, color: "#8A8A8A" }}>טיפולים נוספים</span>
          <ResponsiveCarousel
            ariaLabel="טיפולים נוספים"
            slideWidth="min(84vw, 320px)"
            desktopStyle={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 12, marginTop: 16 }}
          >
            {TREATMENTS.filter((t) => t.id !== cur.id).map((o) => (
              <Link key={o.id} href={`/aesthetics/${o.id}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 88, padding: "20px 0", borderTop: "1px solid rgba(28,28,28,.14)", color: "#1C1C1C", fontSize: 18 }}>
                {o.title}<span style={{ fontSize: 13, fontWeight: 500, color: "#8F6A4B" }}>←</span>
              </Link>
            ))}
          </ResponsiveCarousel>
        </div>
      </section>
    </div>
  );
}
