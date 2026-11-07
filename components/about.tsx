import { Slot } from "./ui";

const CHAPTERS = [
  { big: "+10", bigLabel: "שנות ניסיון באיפור קבוע ואסתטיקה", title: "עשור של דיוק", slot: "about-ch-1", ph: "שיר בעבודה", photo: "about-photo--portrait", flip: false, text: "כבר יותר מעשר שנים אני מתמחה באיפור קבוע לגבות ובטיפולי אסתטיקה מתקדמים. כל שנה הוסיפה עוד שכבה של הבנה: איך עור מגיב, איך פנים משתנות, ואיך לבנות תוצאה שנראית טבעית גם שנים אחרי." },
  { big: "+7", bigLabel: "שנות הוראה והכשרת נשים למקצוע", title: "להעביר את זה הלאה", slot: "about-ch-2", ph: "שיר מלמדת", photo: "about-photo--teach", flip: true, text: "מעל שבע שנים אני מלמדת ומכשירה נשים לעולם האיפור הקבוע. הקמתי אקדמיה מקצועית שבה כל תלמידה לומדת ממני ישירות, עם תרגול מעשי וליווי אישי. כל תלמידה שנכנסת לפה מבינה שאין קיצורי דרך והיא מקבלת מעטפת ליווי מלאה גם לאחר הקורס וללא הגבלת זמן." },
  { big: "1:1", bigLabel: "כל טיפול מבוצע על ידי באופן אישי", title: "קליניקת בוטיק לנשים", slot: "about-ch-3", ph: "הקליניקה", photo: "about-photo--clinic", flip: false, text: "הקליניקה מיועדת לנשים בלבד, ונבנתה כמקום שקט, פרטי ונעים. אני מבצעת בעצמי כל טיפול, מהייעוץ הראשון ועד הביקורת, כי אני מאמינה שתוצאה מדויקת מתחילה ביחס אישי." },
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
    <div className="about-page">
      <section className="about-intro">
        <p className="about-kicker">נעים להכיר</p>
        <h1>
          נעים להכיר,
          <br />
          אני שיר לביא
        </h1>
        <p>מעל לעשור של עבודה עם נשים, מקרוב. במהלכו הבנתי שהיופי המדויק ביותר הוא זה שמרגיש כאילו תמיד היה שם.</p>
      </section>

      <div className="about-story">
        {CHAPTERS.map((chapter) => (
          <section key={chapter.title} className={chapter.flip ? "about-chapter about-chapter--blush" : "about-chapter"}>
            <div className={chapter.flip ? "about-split about-split--flip" : "about-split"}>
              <figure className={`about-photo ${chapter.photo}`}>
                <Slot id={chapter.slot} placeholder={chapter.ph} />
              </figure>
              <div className="about-copy">
                <p className="about-stat">
                  <strong>{chapter.big}</strong>
                  <span>{chapter.bigLabel}</span>
                </p>
                <h2>{chapter.title}</h2>
                <p>{chapter.text}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="about-quote">
        <img src="/assets/monogram-gold.png" alt="" />
        <blockquote>
          <p>אסתטיקה טובה היא לא לשנות אותך. היא לדעת לדייק את מה שכבר יפה בך.</p>
          <footer>שיר לביא</footer>
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
