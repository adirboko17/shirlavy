"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { waLink } from "@/lib/data";
import { TREATMENT_DISCLAIMER } from "@/lib/content";
import { ResultPhotoCard } from "./ui";
import { TreatmentHero, TreatmentLabel, TreatmentCta, TreatmentProcess, TreatmentFaq, TreatmentClosing } from "./treatment-ui";
const WA = waLink("היי שיר, אשמח לבדיקת התאמה להסרת איפור קבוע בלייזר.");

export function RemovalPage() {
  return <div className="treatment-page treatment-removal">
    <TreatmentHero tone="clay" label="הסרת איפור קבוע בלייזר" title={<>כשהאיפור הקבוע{" "}<em>כבר לא מתאים לך.</em></>} text="איפור קבוע שלא צלח, גוון שהשתנה או רצון במראה אחר. בטכנולוגיית לייזר ניתן לפרק פיגמנטים במטרה להבהיר או להסיר איפור ישן, בהתאם לבדיקת התאמה." image="home-tr-3" caption="מבט מקרוב · מהקליניקה">
      <TreatmentCta href={WA}>לבדיקת התאמה ללא עלות</TreatmentCta>
      <a className="treatment-link" href="#removal-results">לתמונות הטיפול <span aria-hidden="true">↓</span></a>
    </TreatmentHero>
    <section className="treatment-section"><div className="treatment-container treatment-split">
      <div className="treatment-section-intro"><TreatmentLabel>לפני שמתחילים מחדש</TreatmentLabel><h2>קודם מבינות<br />מה נכון לעור שלך.</h2></div>
      <div className="treatment-prose"><p className="treatment-lead">הטיפול מתבצע באמצעות מכשור מתקדם, תוך הקפדה על פרוטוקולי עבודה, אמצעי מיגון ובטיחות.</p>
        <p>משך הטיפול קצר ולעיתים ניתן להבחין בשינוי כבר לאחר המפגש הראשון. מספר הטיפולים הנדרש משתנה בהתאם לסוג הפיגמנט, צבעו, עומק החדרתו, סוג העור ותגובתו לטיפול. {TREATMENT_DISCLAIMER}</p>
        <p>מדובר במכשור עוצמתי המחייב ידע מקצועי, הכשרה מתאימה וניסיון מעשי.</p>
        <div className="treatment-reasons">{[
          ["גוון שהשתנה", "פיגמנט שהפך עם השנים לאפרפר, אדמדם או כחלחל."],
          ["צורה שלא מתאימה", "גבה שעוצבה בעבר בקו שאינו תואם את מבנה הפנים."],
          ["טיפול שלא הצליח", "תוצאה לא אחידה, כהה מדי או לא סימטרית."],
          ["רצון בהתחלה חדשה", "הבהרה כהכנה לטיפול גבות חדש ומדויק יותר."],
        ].map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
      </div>
    </div></section>
    <TreatmentProcess title="צעד אחר צעד, בקצב של העור." intro="התוכנית המדויקת נבנית לאחר בדיקת התאמה, ומתעדכנת לפי ההתקדמות." items={[
      ["בדיקה וייעוץ", "הערכת הפיגמנט, העור והציפיות, ותיאום מה ניתן להשיג."],
      ["טיפול לייזר", "מפגש קצר יחסית, בהתאמה אישית של הפרמטרים לאזור."],
      ["החלמה בין מפגשים", "מרווח זמן שמאפשר לעור להתאושש ולגוף לפנות פיגמנט."],
      ["הערכה מחודשת", "בכל מפגש בוחנים יחד את ההתקדמות ומחליטים על ההמשך."],
    ]} />
    <section className="treatment-section treatment-gallery" id="removal-results"><div className="treatment-container">
      <div className="treatment-heading"><div><TreatmentLabel>מהקליניקה</TreatmentLabel><h2>תמונות טיפול.</h2></div><p>כל תוצאה אישית. לא ניתן להבטיח הסרה מלאה.</p></div>
      <div className="treatment-results"><ResultPhotoCard slotId="rm-ba-1" caption="לפני ואחרי סדרת טיפולים" /><ResultPhotoCard slotId="rm-ba-2" caption="הבהרה לקראת טיפול חדש" /></div>
    </div></section>
    <section className="treatment-section"><div className="treatment-container treatment-split"><h2>לפני כל טיפול,<br />שיחה כנה.</h2><div className="treatment-prose"><p className="treatment-lead">שיר בוחנת את האזור, שומעת על הטיפולים הקודמים ומסבירה מה ניתן לצפות.</p><p>אם הטיפול אינו מתאים, היא תאמר זאת בפשטות.</p></div></div></section>
    <TreatmentFaq items={[
            { q: "האם הלייזר מסיר את האיפור הקבוע לחלוטין?", a: "לא ניתן להבטיח הסרה מלאה. במקרים רבים מגיעים להבהרה משמעותית, אך התוצאה תלויה בגורמים אישיים רבים." },
            { q: "כמה טיפולים יידרשו?", a: "אין מספר קבוע. הערכה ראשונית תינתן בייעוץ, והתוכנית מתעדכנת לאורך הדרך לפי תגובת העור." },
            { q: "האם זה כואב?", a: "התחושה משתנה בין מטופלת למטופלת. במהלך הייעוץ שיר תסביר על התחושה ועל הדרכים להפוך את הטיפול לנוח יותר." },
            { q: "אפשר לעשות טיפול גבות חדש אחרי ההסרה?", a: "לעיתים קרובות כן, לאחר החלמה מלאה. שיר תמליץ על העיתוי המתאים לך." },
          ]} />
    <TreatmentClosing href={WA} title="נבדוק יחד את האפשרויות." />
  </div>;
}

const TREATMENTS = [
  { id: "laser", title: "הסרת שיער בלייזר", ph: "הסרת שיער בלייזר", short: "טיפולי הסרת השיער מתבצעים באמצעות מכשור לייזר מתקדם, עם התאמת פרמטרים לגוון העור, סוג השיער ומאפיינים אישיים.", blocks: [["מה זה", "מכשור לייזר הפועל באמצעות אנרגיית אור המכוונת לפיגמנט שבשערה ופוגעת בזקיק השיער במטרה להפחית את צמיחתו לאורך זמן."], ["למי זה מתאים", "הטיפול מתאים גם למטופלים צעירים, לאחר אבחון מקצועי, בחינת ההתאמה האישית והתייחסות לגיל ולשלב ההתפתחות."], ["מה לצפות", "כבר במהלך סדרת הטיפולים ניתן להבחין בהפחתה בצמיחת השיער. קצב התגובה ומספר המפגשים משתנים מאדם לאדם."]], faq: [{ q: "כמה מפגשים נדרשים?", a: "אין מספר קבוע. ההערכה נעשית בייעוץ ומתעדכנת לפי התגובה לטיפול." }, { q: "האם יש הכנה מיוחדת?", a: "כן, תקבלי הנחיות הכנה מפורטות לפני המפגש הראשון." }, { q: "אפשר לטפל בכל עונה?", a: "ניתן לטפל לאורך השנה, תוך הקפדה על הנחיות חשיפה לשמש." }] },
  { id: "firming", title: "מיצוק והידוק העור", ph: "טיפול מיצוק", short: "טיפולי מיצוק והידוק העור לשיפור מראה העור, מרקמו ותחושת המוצקות - בטכנולוגיה מתקדמת המותאמת לאזור המטופל.", blocks: [["מה זה", "אנרגיה מבוקרת מועברת לרקמות העור במטרה לעודד תהליכים טבעיים של התחדשות וייצור קולגן."], ["למי זה מתאים", "למי שניכר בה ירידה בגמישות העור - לאחר הריונות, ירידה במשקל או שינויים הורמונליים - באזורים כמו הבטן, הזרועות והירכיים."], ["מה לצפות", "תוכנית הטיפול נבנית בהתאמה אישית. השיפור מתפתח בהדרגה ותלוי במצב העור, במידת הרפיון ובתגובה האישית."]], faq: [{ q: "מתי רואים שינוי?", a: "השינוי הדרגתי ותלוי בעור ובתגובה לטיפול. שיר תתאם איתך ציפיות מראש." }, { q: "האם יש זמן החלמה?", a: "ברוב המקרים ניתן לחזור לשגרה מיד. פרטים מדויקים יינתנו בייעוץ." }] },
  { id: "tightening", title: "מתיחת העור וטכנולוגיות מתקדמות", ph: "טכנולוגיות אסתטיות", short: "טכנולוגיות אסתטיות לשיפור מראה המרקם והקווים, בגישה זהירה ומותאמת אישית.", blocks: [["מה זה", "מגוון טכנולוגיות לשיפור מראה העור. הבחירה בטכנולוגיה נעשית לפי מטרת הטיפול ומאפייני העור."], ["למי זה מתאים", "לנשים המחפשות שיפור במראה המרקם או הקווים, בלי הליך פולשני. ההתאמה נבדקת באופן אישי."], ["מה לצפות", "תוכנית אישית עם תיאום ציפיות כן. התוצאות משתנות ואינן מובטחות מראש."]], faq: [{ q: "איך בוחרים את הטיפול הנכון?", a: "בשיחת הייעוץ בוחנים את העור והמטרות, ושיר ממליצה על הכיוון המתאים." }, { q: "אפשר לשלב עם טיפולים אחרים?", a: "לעיתים כן. ההמלצה ניתנת באופן אישי." }] },
];

export function AestheticsPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;
  const current = TREATMENTS.find((treatment) => treatment.id === id);
  if (!current) return <div className="treatment-page treatment-aesthetics">
    <TreatmentHero label="טיפולי אסתטיקה" title={<>טכנולוגיה מתקדמת.{" "}<em>תשומת לב אישית.</em></>} text="טיפולים לעור ולגוף, עם אותה הקפדה ואותו יחס אישי. את הדרך מתחילות באבחון ובבחירת הטיפול המתאים לך." image="aes-clinic" caption="הקליניקה של שיר לביא">
      <a href="#aesthetic-treatments" className="treatment-cta">לכל הטיפולים <span aria-hidden="true">↓</span></a>
    </TreatmentHero>
    <section className="treatment-section treatment-gallery" id="aesthetic-treatments"><div className="treatment-container treatment-catalog">
      {TREATMENTS.map(treatment => <article key={treatment.id}>
        <h2>{treatment.title}</h2><div><p>{treatment.short}</p><div className="treatment-actions"><Link href={`/aesthetics/${treatment.id}`} className="treatment-link">להכיר את הטיפול <span aria-hidden="true">←</span></Link><a href={waLink(`היי שיר, אשמח לייעוץ ללא עלות לגבי ${treatment.title}.`)} className="treatment-link" target="_blank" rel="noopener noreferrer">ייעוץ ללא עלות</a></div></div>
      </article>)}
    </div></section>
    <TreatmentClosing href={waLink("היי שיר, אשמח לייעוץ ללא עלות לגבי טיפולי אסתטיקה.")} />
  </div>;
  const consultation = waLink(`היי שיר, אשמח לייעוץ ללא עלות לגבי ${current.title}.`);
  return <div className="treatment-page treatment-detail">
    <TreatmentHero back label="אסתטיקה · טיפול אישי" title={current.title} text={current.short} image="aes-clinic" caption="סביבת הטיפול · הקליניקה של שיר לביא">
      <TreatmentCta href={consultation} />
    </TreatmentHero>
    <section className="treatment-section"><div className="treatment-container treatment-split">
      <div className="treatment-section-intro"><TreatmentLabel>להכיר את הטיפול</TreatmentLabel><h2>מה חשוב לדעת<br />לפני שמתחילות.</h2><p className="treatment-note">{TREATMENT_DISCLAIMER}</p></div>
      <div className="treatment-detail-blocks">{current.blocks.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
    </div></section>
    <TreatmentFaq key={current.id} items={current.faq} />
    <section className="treatment-section"><div className="treatment-container"><TreatmentLabel>עוד בקליניקה</TreatmentLabel><div className="treatment-related">{TREATMENTS.filter(treatment => treatment.id !== current.id).map(treatment => <Link key={treatment.id} href={`/aesthetics/${treatment.id}`} className="treatment-link">{treatment.title}<span aria-hidden="true">←</span></Link>)}</div></div></section>
    <TreatmentClosing href={consultation} />
  </div>;
}
