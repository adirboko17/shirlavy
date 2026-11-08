"use client";
import { waLink } from "@/lib/data";
import Link from "next/link";
import { MEDICAL_AESTHETICS_COPY, TREATMENT_DISCLAIMER } from "@/lib/content";
import { TreatmentHero, TreatmentLabel, TreatmentCta, TreatmentClosing } from "./treatment-ui";
const WA = waLink("היי, אשמח לפרטים על טיפולי אסתטיקה רפואית ותיאום תור.");

export function MedicalAestheticsPage() {
  const { paragraphs } = MEDICAL_AESTHETICS_COPY;
  return <div className="treatment-page treatment-medical">
    <TreatmentHero back tone="clay" label="טיפולים בידי רופא מוסמך" title={<>אסתטיקה רפואית.{" "}<em>בהתאמה אלייך.</em></>} text={paragraphs[0]} image="aes-clinic" caption="הקליניקה של שיר לביא">
      <TreatmentCta href={WA}>ייעוץ ותיאום בווטסאפ</TreatmentCta>
    </TreatmentHero>
    <section className="treatment-section"><div className="treatment-container treatment-split">
      <div className="treatment-section-intro"><TreatmentLabel>על הטיפולים</TreatmentLabel><h2>הבחירה מתחילה<br />בייעוץ רפואי.</h2></div>
      <div className="treatment-prose"><p className="treatment-lead">{paragraphs[2]}</p><p>{paragraphs[1]}</p><p>{paragraphs[3]}</p><p className="treatment-eligibility">{TREATMENT_DISCLAIMER}</p></div>
    </div></section>
    <section className="treatment-section"><div className="treatment-container"><TreatmentLabel>עוד בקליניקה</TreatmentLabel><div className="treatment-related">
      <Link href="/aesthetics/laser" className="treatment-link">הסרת שיער בלייזר<span aria-hidden="true">←</span></Link>
      <Link href="/aesthetics/firming" className="treatment-link">מיצוק והידוק העור<span aria-hidden="true">←</span></Link>
    </div></div></section>
    <TreatmentClosing href={WA} title="לפרטים ולתיאום ייעוץ." />
  </div>;
}
