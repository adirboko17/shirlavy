import {
  ABOUT_HEADING,
  ABOUT_PARAGRAPHS,
  ABOUT_SECTION_SLICES,
} from "@/lib/about-narrative";
import { Slot } from "./ui";

const CHAPTER_META = [
  {
    big: "+10",
    bigLabel: "שנות ניסיון באיפור קבוע ואסתטיקה",
    title: "עשור של דיוק",
    slot: "about-ch-1",
    ph: "שיר בעבודה",
    photo: "about-photo--portrait",
    flip: false,
    paragraphs: ABOUT_SECTION_SLICES.chapters[0],
  },
  {
    big: "+7",
    bigLabel: "שנות הוראה והכשרת נשים למקצוע",
    title: "להעביר את זה הלאה",
    slot: "about-ch-2",
    ph: "שיר מלמדת",
    photo: "about-photo--teach",
    flip: true,
    paragraphs: ABOUT_SECTION_SLICES.chapters[1],
  },
  {
    big: "1:1",
    bigLabel: "כל טיפול מבוצע באופן אישי",
    title: "קליניקת בוטיק לנשים",
    slot: "about-ch-3",
    ph: "הקליניקה",
    photo: "about-photo--clinic",
    flip: false,
    paragraphs: ABOUT_SECTION_SLICES.chapters[2],
  },
] as const;

const VALUES = [
  ["דיוק ויופי טבעי", "תוצאה שמתאימה לפנים שלך, ולא לטרנד של העונה."],
  ["מקצועיות וניסיון", "שנים של עבודה ולמידה מתמדת, בכל טיפול מחדש."],
  ["יחס אישי", "הקשבה אמיתית, זמן ותשומת לב לכל לקוחה."],
  ["אמון ובטיחות", "סטנדרטים גבוהים של היגיינה, שקיפות וכנות."],
  ["העצמה דרך לימוד", "לתת לנשים מקצוע, ביטחון ועתיד עצמאי."],
];

function AboutNarrativeParagraphs({ indices }: { indices: readonly number[] }) {
  return (
    <>
      {indices.map((index) =>
        ABOUT_PARAGRAPHS[index].split("\n").map((line) => (
          <p key={`${index}-${line.slice(0, 24)}`}>{line}</p>
        )),
      )}
    </>
  );
}

export function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-intro">
        <p className="about-kicker">נעים להכיר</p>
        <h1>{ABOUT_HEADING}</h1>
        <AboutNarrativeParagraphs indices={ABOUT_SECTION_SLICES.intro} />
      </section>

      <div className="about-story">
        {CHAPTER_META.map((chapter) => (
          <section key={chapter.title} className={chapter.flip ? "about-chapter about-chapter--blush" : "about-chapter"}>
            <div className="about-split">
              <figure className={`about-photo ${chapter.photo}`}>
                <Slot id={chapter.slot} placeholder={chapter.ph} />
                <figcaption className="about-stat">
                  <strong>{chapter.big}</strong>
                  <span>{chapter.bigLabel}</span>
                </figcaption>
              </figure>
              <div className="about-copy">
                <div className="about-chapter-heading">
                  <h2>{chapter.title}</h2>
                </div>
                <div className="about-narrative"><AboutNarrativeParagraphs indices={chapter.paragraphs} /></div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="about-quote">
        <img src="/assets/monogram-gold.png" alt="" />
        <blockquote>
          <AboutNarrativeParagraphs indices={ABOUT_SECTION_SLICES.quote} />
          <footer>
            <AboutNarrativeParagraphs indices={ABOUT_SECTION_SLICES.closing} />
          </footer>
        </blockquote>
      </section>

      <section className="about-values">
        <div className="about-values__inner">
          <div className="home-section-label">מה מנחה אותי</div>
          <h2>הערכים שלי</h2>
          <div className="about-values__grid">
            {VALUES.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
