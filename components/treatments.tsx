import { waLink } from "@/lib/data";
import { TREATMENT_DISCLAIMER, LASER_HAIR_COPY, SKIN_FIRMING_COPY, PMU_REMOVAL_COPY, MEDICAL_AESTHETICS_COPY } from "@/lib/content";
import { ResultPhotoCard } from "./ui";
import { TreatmentHero, TreatmentLabel, TreatmentCta, TreatmentProcess, TreatmentFaq, TreatmentClosing } from "./treatment-ui";
const WA = waLink("היי שיר, אשמח לבדיקת התאמה להסרת איפור קבוע בלייזר.");

export function RemovalPage() {
  return <div className="treatment-page treatment-removal">
    <TreatmentHero label="הסרת איפור קבוע בלייזר" title={<>מקום להתחלה<em>מדויקת יותר.</em></>} text="איפור קבוע שכבר לא מתאים לך? מתחילות בבדיקת העור והפיגמנט, מתאמות ציפיות ובונות יחד את הדרך להבהרה או להסרה." image="removal-hero-portrait" fullBleed caption="שיר לביא · ייעוץ והתאמה אישית">
      <TreatmentCta href={WA}>לבדיקת התאמה ללא עלות</TreatmentCta>
      <a className="treatment-link" href="#removal-results">לפני ואחרי <span aria-hidden="true">↓</span></a>
    </TreatmentHero>
    <nav className="treatment-page-nav" aria-label="בעמוד הסרת איפור קבוע"><a href="#removal-results">לפני ואחרי</a><a href="#removal-about">על הטיפול</a><a href="#removal-process">התהליך</a><a href="#removal-safety">בטיחות והתאמה</a></nav>
    <section className="treatment-section treatment-gallery" id="removal-results"><div className="treatment-container">
      <div className="treatment-heading"><div><TreatmentLabel>מהקליניקה</TreatmentLabel><h2>לפני ואחרי</h2></div><p>תמונות מתהליכי הבהרה והסרה בקליניקה.<br />כל תוצאה אישית. לא ניתן להבטיח הסרה מלאה.</p></div>
      <div className="treatment-results treatment-results--carousel" role="region" aria-label="תמונות לפני ואחרי הסרת איפור קבוע — ניתן לגלול לצדדים" tabIndex={0}><ResultPhotoCard slotId="rm-ba-1" /><ResultPhotoCard slotId="rm-ba-2" /></div>
    </div></section>
    <section className="treatment-section" id="removal-about"><div className="treatment-container removal-overview">
      <div className="treatment-section-intro"><TreatmentLabel>לפני שמתחילים מחדש</TreatmentLabel><h2>קודם מבינות<br />מה נכון לעור שלך.</h2><p>{PMU_REMOVAL_COPY[0]}</p><a className="treatment-link removal-overview__link" href="#removal-process">איך נראה התהליך? <span aria-hidden="true">↓</span></a></div>
      <div className="removal-overview__detail"><h3>מתי שוקלים הסרה או הבהרה?</h3>
      <div className="treatment-reasons">{[
          ["גוון שהשתנה", "פיגמנט שהפך עם השנים לאפרפר, אדמדם או כחלחל."],
          ["צורה שלא מתאימה", "גבה שעוצבה בעבר בקו שאינו תואם את מבנה הפנים."],
          ["טיפול שלא הצליח", "תוצאה לא אחידה, כהה מדי או לא סימטרית."],
          ["רצון בהתחלה חדשה", "הבהרה כהכנה לטיפול גבות חדש ומדויק יותר."],
        ].map(([title, text], index) => <div key={title}><span className="treatment-reason-number" aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p></div>)}</div>
      <p className="removal-overview__note">{TREATMENT_DISCLAIMER}</p>
      </div>
    </div></section>
    <div id="removal-process" className="treatment-anchor">
    <TreatmentProcess title="צעד אחר צעד, בקצב של העור." intro="התוכנית המדויקת נבנית לאחר בדיקת התאמה, ומתעדכנת לפי ההתקדמות." items={[
      ["בדיקה וייעוץ", "הערכת הפיגמנט, העור והציפיות, ותיאום מה ניתן להשיג."],
      ["טיפול לייזר", "מפגש קצר יחסית, בהתאמה אישית של הפרמטרים לאזור."],
      ["החלמה בין מפגשים", "מרווח זמן שמאפשר לעור להתאושש ולגוף לפנות פיגמנט."],
      ["הערכה מחודשת", "בכל מפגש בוחנים יחד את ההתקדמות ומחליטים על ההמשך."],
    ]} />
    </div>
    <section className="treatment-section treatment-safety-section" id="removal-safety"><div className="treatment-container treatment-split">
      <div className="treatment-section-intro"><TreatmentLabel>בטיחות ותיאום ציפיות</TreatmentLabel><h2>לפני כל טיפול,<br />שיחה כנה.</h2><p>שיר בוחנת את האזור, שומעת על הטיפולים הקודמים ומסבירה מה ניתן לצפות. אם הטיפול אינו מתאים, היא תאמר זאת בפשטות.</p></div>
      <div className="treatment-detail-blocks"><article><h3>קצב ההתקדמות אישי</h3><p>{PMU_REMOVAL_COPY[2]}</p></article><article><h3>התאמה לפני הכול</h3><p>{PMU_REMOVAL_COPY[1]}</p></article><article><h3>ידע מקצועי ובטיחות</h3><p>{PMU_REMOVAL_COPY[3]}</p><p>{PMU_REMOVAL_COPY[4]}</p></article></div>
    </div></section>
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
    id: "laser", title: "הסרת שיער בלייזר", overview: "הפחתת צמיחת שיער, בהתאמה לעור ולסוג השיער שלך.",
    short: "הפחתת צמיחת השיער לאורך זמן, באמצעות מכשור לייזר מתקדם ובהתאמה אישית לגוון העור ולסוג השיער.",
    blocks: [
      ["איך הטיפול עובד?", LASER_HAIR_COPY[0]],
      ["התאמה אישית לכל מטופלת", LASER_HAIR_COPY[1]],
      ["מה אפשר לצפות לאורך הדרך?", LASER_HAIR_COPY[2]],
      ["התאמה גם למטופלות צעירות", LASER_HAIR_COPY[3]],
    ], faq: [{ q: "כמה מפגשים נדרשים?", a: "אין מספר קבוע. ההערכה נעשית בייעוץ ומתעדכנת לפי התגובה לטיפול." }, { q: "האם יש הכנה מיוחדת?", a: "כן, תקבלי הנחיות הכנה מפורטות לפני המפגש הראשון." }, { q: "אפשר לטפל בכל עונה?", a: "ניתן לטפל לאורך השנה, תוך הקפדה על הנחיות חשיפה לשמש." }, { q: "האם זה כואב?", a: "לא. באמצעות ידית קרח וטכנולוגיה מתקדמת הטיפול אינו כואב." }] },
  {
    id: "firming", title: "מיצוק והידוק העור", overview: "מיצוק, מרקם העור, צלוליטיס וסימני מתיחה.",
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
    id: "medical", title: "אסתטיקה רפואית", overview: "טיפולים בידי רופא מוסמך, לאחר ייעוץ והתאמה אישית.",
    short: MEDICAL_AESTHETICS_COPY.paragraphs[0],
    blocks: [["הטיפולים בקליניקה", MEDICAL_AESTHETICS_COPY.paragraphs[1]], ["ייעוץ רפואי והתאמה אישית", MEDICAL_AESTHETICS_COPY.paragraphs[2]], ["לתיאום ופרטים נוספים", MEDICAL_AESTHETICS_COPY.paragraphs[3]]], faq: [],
  },
];

export function AestheticsPage() {
  return <div className="treatment-page treatment-aesthetics">
    <TreatmentHero label="טיפולי אסתטיקה" title={<>להרגיש טוב.<em>להישאר את.</em></>} text="טיפולים לעור ולגוף, עם אותה הקפדה ואותו יחס אישי. את הדרך מתחילות באבחון ובבחירת הטיפול המתאים לך." image="aesthetics-hero-portrait" fullBleed caption="שיר לביא · אסתטיקה בהתאמה אישית">
      <a href="#aesthetic-treatments" className="treatment-cta">להכיר את הטיפולים <span aria-hidden="true">↓</span></a>
      <TreatmentCta href={waLink("היי שיר, אשמח לייעוץ לגבי טיפולי אסתטיקה.")}>לשיחת ייעוץ</TreatmentCta>
    </TreatmentHero>
    <section className="treatment-section aesthetic-overview" id="aesthetic-treatments" aria-labelledby="aesthetic-overview-title">
      <div className="treatment-container">
        <div className="treatment-heading"><div><TreatmentLabel>הטיפולים בקליניקה</TreatmentLabel><h2 id="aesthetic-overview-title">שלושה תחומים.<br />יחס אישי אחד.</h2></div><p>כל הטיפולים והפרטים כאן, כדי שתוכלי להכיר ולבחור בנחת.</p></div>
        <nav className="aesthetic-overview__services" aria-label="בחירת טיפול אסתטיקה">{TREATMENTS.map((treatment, index) => <a key={treatment.id} href={`#${treatment.id}`}><span className="aesthetic-overview__number" aria-hidden="true">0{index + 1}</span><h3>{treatment.title}</h3><p>{treatment.overview}</p><span className="aesthetic-overview__link">להכיר את הטיפול <span aria-hidden="true">↓</span></span></a>)}</nav>
      </div>
    </section>
    <div className="aesthetic-services">
      {TREATMENTS.map((treatment, index) => {
        const consultation = waLink(treatment.id === "medical" ? "היי, אשמח לפרטים על טיפולי אסתטיקה רפואית ותיאום תור." : `היי שיר, אשמח לייעוץ ללא עלות לגבי ${treatment.title}.`);
        return <section className="treatment-section aesthetic-service" id={treatment.id} key={treatment.id} aria-labelledby={`service-${treatment.id}`}>
          <div className="treatment-container aesthetic-service__layout">
            <div className="aesthetic-service__intro">
              <TreatmentLabel>0{index + 1} · {treatment.id === "medical" ? "בידי רופא מוסמך" : "בהתאמה אישית"}</TreatmentLabel>
              <h2 id={`service-${treatment.id}`}>{treatment.title}</h2>
              <p>{treatment.short}</p>
              <TreatmentCta href={consultation}>{treatment.id === "medical" ? "ייעוץ ותיאום תור" : "לייעוץ והתאמה אישית"}</TreatmentCta>
            </div>
            <div className="aesthetic-service__body">
              <div className="aesthetic-service__lead"><h3>{treatment.blocks[0][0]}</h3><p>{treatment.blocks[0][1]}</p></div>
              <div className="aesthetic-service__topics">{treatment.blocks.slice(1).map(([title, text]) => <details key={title} className="treatment-disclosure">
                <summary>{title}<span aria-hidden="true" className="treatment-faq__icon" /></summary><p>{text}</p>
              </details>)}</div>
              {treatment.faq.length > 0 ? <div className="aesthetic-service__faq"><h3 className="aesthetic-service__eyebrow">שאלות על {treatment.title}</h3>{treatment.faq.map(item => <details key={item.q} className="treatment-disclosure"><summary>{item.q}<span aria-hidden="true" className="treatment-faq__icon" /></summary><p>{item.a}</p></details>)}</div> : null}
              <p className="aesthetic-service__note">{TREATMENT_DISCLAIMER}</p>
            </div>
          </div>
        </section>;
      })}
    </div>
    <TreatmentClosing href={waLink("היי שיר, אשמח לייעוץ ללא עלות לגבי טיפולי אסתטיקה.")} />
  </div>;
}
