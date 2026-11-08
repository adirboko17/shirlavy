"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { waLink } from "@/lib/data";
import { TREATMENT_DISCLAIMER, LASER_HAIR_COPY, SKIN_FIRMING_COPY, PMU_REMOVAL_COPY } from "@/lib/content";
import { ResultPhotoCard } from "./ui";
import { MedicalAestheticsPage } from "./medical-aesthetics";
import { TreatmentHero, TreatmentLabel, TreatmentCta, TreatmentProcess, TreatmentFaq, TreatmentClosing } from "./treatment-ui";
const WA = waLink("היי שיר, אשמח לבדיקת התאמה להסרת איפור קבוע בלייזר.");

export function RemovalPage() {
  return <div className="treatment-page treatment-removal">
    <TreatmentHero tone="clay" label="הסרת איפור קבוע בלייזר" title={<>כשהאיפור הקבוע{" "}<em>כבר לא מתאים לך.</em></>} text={PMU_REMOVAL_COPY[0]} image="home-tr-3" caption="מבט מקרוב · מהקליניקה">
      <TreatmentCta href={WA}>לבדיקת התאמה ללא עלות</TreatmentCta>
      <a className="treatment-link" href="#removal-results">לתמונות הטיפול <span aria-hidden="true">↓</span></a>
    </TreatmentHero>
    <section className="treatment-section"><div className="treatment-container treatment-split">
      <div className="treatment-section-intro"><TreatmentLabel>לפני שמתחילים מחדש</TreatmentLabel><h2>קודם מבינות<br />מה נכון לעור שלך.</h2></div>
      <div className="treatment-prose"><p className="treatment-lead">{PMU_REMOVAL_COPY[1]}</p>
        <p>{PMU_REMOVAL_COPY[2]}</p>
        <aside className="treatment-safety" aria-labelledby="removal-safety-title">
          <h3 id="removal-safety-title">חשוב לדעת</h3>
          <p>{PMU_REMOVAL_COPY[3]}</p>
          <p>{PMU_REMOVAL_COPY[4]}</p>
        </aside>
        <p className="treatment-eligibility">{TREATMENT_DISCLAIMER}</p>
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
  {
    id: "laser", title: "הסרת שיער בלייזר",
    short: "הפחתת צמיחת השיער לאורך זמן, באמצעות מכשור לייזר מתקדם ובהתאמה אישית לגוון העור ולסוג השיער.",
    blocks: [
      ["איך הטיפול עובד?", LASER_HAIR_COPY[0]],
      ["התאמה אישית לכל מטופלת", LASER_HAIR_COPY[1]],
      ["מה אפשר לצפות לאורך הדרך?", LASER_HAIR_COPY[2]],
      ["התאמה גם למטופלות צעירות", LASER_HAIR_COPY[3]],
    ], faq: [{ q: "כמה מפגשים נדרשים?", a: "אין מספר קבוע. ההערכה נעשית בייעוץ ומתעדכנת לפי התגובה לטיפול." }, { q: "האם יש הכנה מיוחדת?", a: "כן, תקבלי הנחיות הכנה מפורטות לפני המפגש הראשון." }, { q: "אפשר לטפל בכל עונה?", a: "ניתן לטפל לאורך השנה, תוך הקפדה על הנחיות חשיפה לשמש." }, { q: "האם זה כואב?", a: "לא. באמצעות ידית קרח וטכנולוגיה מתקדמת הטיפול אינו כואב." }] },
  {
    id: "firming", title: "מיצוק והידוק העור",
    short: SKIN_FIRMING_COPY[1],
    blocks: [
      ["כשהעור משתנה", SKIN_FIRMING_COPY[0]],
      ["איך הטיפול עובד?", SKIN_FIRMING_COPY[2]],
      ["באילו אזורים מטפלים?", SKIN_FIRMING_COPY[3]],
      ["צלוליטיס", SKIN_FIRMING_COPY[6]],
      ["שיפור מראה סימני מתיחה וקמטוטים", SKIN_FIRMING_COPY[7]],
      ["למי הטיפול עשוי להתאים?", SKIN_FIRMING_COPY[4]],
      ["תהליך הדרגתי, תוכנית אישית", SKIN_FIRMING_COPY[5]],
    ], faq: [{ q: "מתי רואים שינוי?", a: "השינוי הדרגתי ותלוי בעור ובתגובה לטיפול. שיר תתאם איתך ציפיות מראש." }, { q: "האם יש זמן החלמה?", a: "ברוב המקרים ניתן לחזור לשגרה מיד. פרטים מדויקים יינתנו בייעוץ." }, { q: "איך בוחרים את הטיפול הנכון?", a: "בשיחת הייעוץ בוחנים את העור והמטרות, ושיר ממליצה על הכיוון המתאים." }, { q: "אפשר לשלב עם טיפולים אחרים?", a: "לעיתים כן. ההמלצה ניתנת באופן אישי." }] },
  {
    id: "medical", title: "אסתטיקה רפואית",
    short: "הזרקות וטיפולים אסתטיים־רפואיים, המבוצעים על ידי רופא מוסמך ובעל ניסיון. כל טיפול מתחיל בייעוץ רפואי, אבחון והתאמה אישית.",
    blocks: [], faq: [],
  },
];

export function AestheticsPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;
  const current = TREATMENTS.find((treatment) => treatment.id === id);
  if (current?.id === "medical") return <MedicalAestheticsPage />;
  if (!current) return <div className="treatment-page treatment-aesthetics">
    <TreatmentHero label="טיפולי אסתטיקה" titleAbove title={<>טכנולוגיה מתקדמת<em>לצד שמירה על מראה טבעי.</em></>} text="טיפולים לעור ולגוף, עם אותה הקפדה ואותו יחס אישי. את הדרך מתחילות באבחון ובבחירת הטיפול המתאים לך." image="aes-clinic" caption="הקליניקה של שיר לביא">
      <a href="#aesthetic-treatments" className="treatment-cta">לכל הטיפולים <span aria-hidden="true">↓</span></a>
    </TreatmentHero>
    <section className="treatment-section treatment-gallery" id="aesthetic-treatments"><div className="treatment-container treatment-catalog">
      {TREATMENTS.map(treatment => <article key={treatment.id}>
        <h2>{treatment.title}</h2><div><p>{treatment.short}</p><p className="treatment-eligibility">{TREATMENT_DISCLAIMER}</p><div className="treatment-actions"><Link href={`/aesthetics/${treatment.id}`} className="treatment-link">להכיר את הטיפול <span aria-hidden="true">←</span></Link><a href={waLink(treatment.id === "medical" ? "היי, אשמח לפרטים על טיפולי אסתטיקה רפואית ותיאום תור." : `היי שיר, אשמח לייעוץ ללא עלות לגבי ${treatment.title}.`)} className="treatment-link" target="_blank" rel="noopener noreferrer">{treatment.id === "medical" ? "ייעוץ ותיאום תור" : "ייעוץ ללא עלות"}</a></div></div>
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
      <div className="treatment-section-intro"><TreatmentLabel>להכיר את הטיפול</TreatmentLabel><h2>מה חשוב לדעת<br />לפני שמתחילות.</h2></div>
      <div className="treatment-detail-blocks">{current.blocks.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}<p className="treatment-eligibility">{TREATMENT_DISCLAIMER}</p><div className="treatment-actions"><TreatmentCta href={consultation}>לייעוץ והתאמה אישית</TreatmentCta></div></div>
    </div></section>
    <TreatmentFaq key={current.id} items={current.faq} />
    <section className="treatment-section"><div className="treatment-container"><TreatmentLabel>עוד בקליניקה</TreatmentLabel><div className="treatment-related">{TREATMENTS.filter(treatment => treatment.id !== current.id).map(treatment => <Link key={treatment.id} href={`/aesthetics/${treatment.id}`} className="treatment-link">{treatment.title}<span aria-hidden="true">←</span></Link>)}</div></div></section>
    <TreatmentClosing href={consultation} />
  </div>;
}
