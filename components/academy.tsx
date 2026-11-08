"use client";

import { useId, useState, type ReactNode } from "react";
import { waLink } from "@/lib/data";
import { GRADUATE_TESTIMONIALS } from "@/lib/content";
import slotMap from "@/lib/slot-map.json";
import { ResponsiveCarousel } from "./ui";

const CONSULT = waLink("היי שיר, אשמח לשמוע על הלימודים באקדמיה ולבדוק איזה מסלול מתאים לי.");
const TRACKS = [
  { title: "מסלול אישי", label: "אחת על אחת", description: "למידה פרטנית מול שיר, בקצב שלך ובהתאמה מלאה לנקודת הפתיחה שלך.", detail: "מועדי הלימוד בתיאום אישי.", message: "היי שיר, אשמח לשמוע פרטים על המסלול האישי באקדמיה." },
  { title: "מסלול קבוצתי", label: "ללמוד יחד, בקבוצה קטנה", description: "קבוצה קטנה ואינטימית — תרגול משותף אך מבחן מעשי פרטני לכל אחת בסיום הלימודים, עם למידה הדדית וליווי צמוד.", detail: "לפרטי המחזור הקרוב, דברי עם שיר.", message: "היי שיר, אשמח לשמוע פרטים על המסלול הקבוצתי באקדמיה." },
];
const SUBJECTS = [
  ["מבנה הפנים ותכנון הגבה", "מדידה, סימטריה והתאמת צורה לכל פנים."],
  ["עור ופיגמנט", "היכרות עם סוגי עור והתאמת גוון."],
  ["מיקרובליידינג", "בניית שיערות בכיוון הצמיחה הטבעי."],
  ["הצללת פודרה ושיטה משולבת", "יצירת עומק ורכות בהדרגה."],
  ["היגיינה ובטיחות", "סטנדרטים מחמירים לעבודה נקייה ובטוחה."],
  ["עבודה על מודליסטית", "תרגול מעשי בליווי צמוד של שיר."],
  ["ליווי לקוחה", "ייעוץ, תיאום ציפיות והנחיות אחרי טיפול."],
] as const;
const GALLERY = [
  { slot: "ac-gal-0", category: "class", caption: "לומדות את הטכניקה" },
  { slot: "ac-gal-1", category: "practice", caption: "הדגמה מקרוב" },
  { slot: "ac-gal-2", category: "class", caption: "מהתיאוריה לקליניקה" },
  { slot: "ac-gal-3", category: "class", caption: "שואלות, מתבוננות, לומדות" },
  { slot: "ac-gal-4", category: "practice", caption: "תכנון הגבה, שלב אחר שלב" },
  { slot: "ac-gal-5", category: "practice", caption: "תרגול בליווי אישי" },
];
const FILTERS = [["all", "כל הרגעים"], ["class", "בשיעור"], ["practice", "בתרגול"]] as const;

function AcademyLabel({ children }: { children: ReactNode }) {
  return <span className="academy-label">{children}</span>;
}

function AcademyPhoto({ slot, caption, className = "", priority = false }: { slot: keyof typeof slotMap; caption: string; className?: string; priority?: boolean }) {
  return <figure className={`academy-photo ${className}`}>
    <div><img src={slotMap[slot]} alt={caption} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} /></div>
    <figcaption>{caption}</figcaption>
  </figure>;
}

function AcademyLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  const external = href.startsWith("https://");
  return <a className={`academy-button${light ? " academy-button--light" : ""}`} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{children}<span aria-hidden="true">{external ? "←" : "↓"}</span></a>;
}

export function AcademyPage() {
  const [filter, setFilter] = useState("all");
  const [subject, setSubject] = useState<number | null>(0);
  const [quote, setQuote] = useState(0);
  const id = useId();
  const gallery = GALLERY.filter(item => filter === "all" || item.category === filter);
  const testimonial = GRADUATE_TESTIMONIALS[quote];

  return <div className="academy-page">
    <section className="academy-hero">
      <div className="academy-container">
        <div className="academy-hero__intro">
          <div><AcademyLabel>האקדמיה של שיר לביא</AcademyLabel><h1>המקצוע שלך.<br /><span>העתיד שלך.</span></h1></div>
          <div className="academy-hero__aside"><p>גם אם את מתחילה מאפס, כאן מתחיל המסע שלך לעולם האיפור הקבוע. לימודים מקרוב, עם שיר, מהבסיס ועד לעבודה בידיים.</p><AcademyLink href="#tracks">בואי להכיר את המסלולים</AcademyLink></div>
        </div>
        <AcademyPhoto slot="ac-gal-0" caption="רגע מתוך שיעור באקדמיה" className="academy-hero__photo" priority />
      </div>
    </section>

    <section className="academy-section academy-story">
      <div className="academy-container academy-split">
        <div><AcademyLabel>ללמוד מתוך הניסיון</AcademyLabel><h2>האקדמיה נולדה<br />מתוך הקליניקה.</h2><p>מה שנלמד כאן נבחן קודם על לקוחות אמיתיות, ומועבר הלאה בסבלנות ובדיוק.</p><p>כבר יותר משבע שנים שיר מכשירה נשים לאיפור קבוע, בקבוצות קטנות או באופן פרטני, עם דגש על עבודה מעשית.</p></div>
        <div className="academy-audience">
          <h3>למי מתאימים הלימודים?</h3>
          {[
            ["מתחילה מאפס", "אין צורך בניסיון קודם. ההכשרה בנויה שלב אחר שלב, עם ליווי אישי של שיר."],
            ["משנה כיוון מקצועי", "לנשים שמחפשות עצמאות, גמישות ומקצוע יצירתי."],
            ["כבר עוסקת בתחום", "למאפרות וקוסמטיקאיות שרוצות להעמיק טכניקה ולדייק את העבודה."],
          ].map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}
        </div>
      </div>
    </section>

    <section className="academy-section academy-tracks" id="tracks">
      <div className="academy-container">
        <div className="academy-section-heading"><div><AcademyLabel>מסלולי הלימוד</AcademyLabel><h2>איך נוח לך ללמוד?</h2></div><p>שתי מסגרות, אותה תשומת לב.<br />לפרטים על משך ההכשרה ומועדי הפתיחה, דברי עם שיר.</p></div>
        <div className="academy-tracks__grid">
          {TRACKS.map(track => <article key={track.title}>
            <span className="academy-track-label">{track.label}</span><h3>{track.title}</h3><p>{track.description}</p><p className="academy-track-detail">{track.detail}</p><AcademyLink href={waLink(track.message)}>לפרטים על {track.title === "מסלול אישי" ? "המסלול האישי" : "המסלול הקבוצתי"}</AcademyLink>
          </article>)}
        </div>
      </div>
    </section>

    <section className="academy-section academy-syllabus">
      <div className="academy-container academy-syllabus__grid">
        <div>
          <AcademyLabel>מה תלמדי כאן</AcademyLabel><h2>מהעין לפרטים,<br />אל הביטחון בידיים.</h2>
          <div className="academy-subjects">
            {SUBJECTS.map(([title, text], index) => {
              const open = subject === index;
              return <div key={title} className="academy-subject" data-open={open}>
                <h3><button type="button" id={`${id}-subject-${index}`} aria-expanded={open} aria-controls={`${id}-content-${index}`} onClick={() => setSubject(open ? null : index)}><span>{title}</span><span className="academy-plus" aria-hidden="true" /></button></h3>
                <div className="academy-subject__answer" id={`${id}-content-${index}`} role="region" aria-labelledby={`${id}-subject-${index}`} aria-hidden={!open} inert={!open}><div><p>{text}</p></div></div>
              </div>;
            })}
          </div>
          <p className="academy-small">את תוכנית הלימודים המפורטת אפשר לקבל בשיחה עם שיר.</p>
        </div>
        <AcademyPhoto slot="ac-gal-4" caption="ליווי אישי, גם בפרטים הקטנים" className="academy-syllabus__photo" />
      </div>
    </section>

    <section className="academy-section academy-mentor">
      <div className="academy-container academy-mentor__grid">
        <AcademyPhoto slot="ac-shir" caption="שיר לביא · מייסדת האקדמיה" />
        <div><AcademyLabel>ללמוד משיר</AcademyLabel><blockquote>״אני מלמדת כל תלמידה כמו שהייתי רוצה שילמדו אותי: מקרוב, בסבלנות, ובלי קיצורי דרך.״</blockquote><a href="/about" className="academy-text-link">עוד על שיר <span aria-hidden="true">←</span></a></div>
      </div>
    </section>

    <section className="academy-section academy-gallery">
      <div className="academy-container">
        <div className="academy-section-heading"><div><AcademyLabel>מהאקדמיה</AcademyLabel><h2>ככה זה נראה, מבפנים.</h2></div><div className="academy-filters" role="group" aria-label="סינון תמונות האקדמיה">{FILTERS.map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}</div></div>
        <ResponsiveCarousel key={filter} ariaLabel="גלריית האקדמיה" slideWidth="min(80vw, 340px)" desktopStyle={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "32px 22px" }}>
          {gallery.map(item => <AcademyPhoto key={item.slot} slot={item.slot as keyof typeof slotMap} caption={item.caption} />)}
        </ResponsiveCarousel>
      </div>
    </section>

    <section className="academy-section academy-testimonials">
      <div className="academy-container academy-split">
        <div><AcademyLabel>במילים שלהן</AcademyLabel><h2>מהאקדמיה,<br />לדרך שלהן.</h2><p>מאות תלמידות שהוכשרו מכל רחבי הארץ, מהצפון ועד הדרום. אלה כמה מהמילים שהן שלחו לשיר.</p></div>
        <div className="academy-testimonials__content">
          <div className="academy-testimonials__quote" aria-live="polite" aria-atomic="true"><figure key={quote}><blockquote>״{testimonial.q}״</blockquote><figcaption><strong>{testimonial.name}</strong><span>{testimonial.meta}</span></figcaption></figure></div>
          <div className="academy-testimonials__controls"><button type="button" aria-label="ההמלצה הקודמת" onClick={() => setQuote(current => (current - 1 + GRADUATE_TESTIMONIALS.length) % GRADUATE_TESTIMONIALS.length)}>→</button><span>{quote + 1} / {GRADUATE_TESTIMONIALS.length}</span><button type="button" aria-label="ההמלצה הבאה" onClick={() => setQuote(current => (current + 1) % GRADUATE_TESTIMONIALS.length)}>←</button></div>
        </div>
      </div>
    </section>

    <section className="academy-section academy-closing"><div className="academy-container"><AcademyLabel>הצעד הראשון שלך</AcademyLabel><h2>בואי נדבר על הלימודים.</h2><p>נכיר, נשמע איפה את היום ונבדוק יחד איזה מסלול מתאים לך.</p><AcademyLink href={CONSULT}>לשיחה עם שיר</AcademyLink></div></section>
  </div>;
}
