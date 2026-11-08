import { Slot } from "./ui";

const CHAPTERS = [
  {
    big: "+10",
    bigLabel: "שנות ניסיון באיפור קבוע ואסתטיקה",
    title: "עשור של דיוק",
    slot: "about-ch-1",
    ph: "שיר בעבודה",
    photo: "about-photo--portrait",
    flip: false,
    text: "כבר למעלה מעשור שאני חיה ונושמת את עולם האיפור הקבוע והאסתטיקה, ומה שהתחיל מאהבה גדולה לתחום הפך עם השנים למקצוע, לאקדמיה ולמקום שהוא לגמרי שלי. בקליניקה שלי אני מתמחה באיפור קבוע לגבות בכל השיטות והטכניקות, ומתאימה כל טיפול באופן אישי למבנה הפנים, לגבה הטבעית, לסוג העור ובעיקר למה שאת אוהבת.",
  },
  {
    big: "+7",
    bigLabel: "שנות הוראה והכשרת נשים למקצוע",
    title: "להעביר את זה הלאה",
    slot: "about-ch-2",
    ph: "שיר מלמדת",
    photo: "about-photo--teach",
    flip: true,
    text: "כבר למעלה משבע שנים שאני גם מלמדת ומכשירה נשים בתחום האיפור הקבוע. הקמתי את האקדמיה שלי כדי לתת מקום גם למי שמתחילה ממש מאפס — בלי ניסיון קודם ובלי רקע. אפשר ללמוד אצלי באופן פרטני או בקבוצות, כשהלימודים מותאמים לקצב ולרמה של כל תלמידה.",
  },
  {
    big: "1:1",
    bigLabel: "כל טיפול מבוצע באופן אישי",
    title: "קליניקת בוטיק לנשים",
    slot: "about-ch-3",
    ph: "הקליניקה",
    photo: "about-photo--clinic",
    flip: false,
    text: "יצרתי קליניקת בוטיק אינטימית לנשים בלבד, שבה אני יכולה להעניק לכל אחת יחס אישי, פרטיות ותשומת לב מלאה. לצד האיפור הקבוע, תוכלי למצוא אצלי גם טיפולי הסרת שיער בלייזר, הסרת איפור קבוע מהגבות וטיפולים למיצוק והידוק מראה העור. כל מי שמגיעה אליי פוגשת אותי — מבדיקת ההתאמה ועד סיום הטיפול.",
  },
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
          אני שיר לביא 🤍
        </h1>
        <p>
          כבר למעלה מעשור שאני חיה ונושמת את עולם האיפור הקבוע והאסתטיקה, ומה שהתחיל מאהבה גדולה לתחום הפך עם השנים למקצוע, לאקדמיה ולמקום שהוא לגמרי שלי.
        </p>
        <p>
          אבל מבחינתי, הטכניקה היא רק חלק מהעניין. אין גבה אחת שמתאימה לכולן, ולכן אני מתאימה כל טיפול באופן אישי למבנה הפנים שלך, לגבה הטבעית, לסוג העור ובעיקר למה שאת אוהבת ולתוצאה שאת רוצה לראות במראה.
        </p>
        <p>
          חשוב לי שהתוצאה תהיה מדויקת, מחמיאה וטבעית — כזאת שמשתלבת בפנים שלך ולא משתלטת עליהן.
        </p>
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
