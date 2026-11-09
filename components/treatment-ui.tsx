"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import slotMap from "@/lib/slot-map.json";

export function TreatmentLabel({ children }: { children: ReactNode }) {
  return <span className="treatment-label">{children}</span>;
}

export function TreatmentHero({ label, title, text, image, caption, children, back, tone = "cream", titleAbove = false, cutout = false, fullBleed = false }: {
  label: string; title: ReactNode; text: string; image: keyof typeof slotMap | "brand"; caption: string;
  children?: ReactNode; back?: boolean; tone?: "cream" | "clay"; titleAbove?: boolean; cutout?: boolean; fullBleed?: boolean;
}) {
  const heading = (
    <>
      <TreatmentLabel>{label}</TreatmentLabel>
      <h1>{title}</h1>
    </>
  );
  return (
    <section className={`treatment-hero treatment-hero--${tone}${titleAbove ? " treatment-hero--title-above" : ""}${cutout ? " treatment-hero--cutout" : ""}${fullBleed ? " treatment-hero--full-bleed" : ""}`}>
        <div className="treatment-hero__grid">
          <div className="treatment-hero__copy">
            {back ? <Link className="treatment-back" href="/aesthetics">→ כל טיפולי האסתטיקה</Link> : null}
            {heading}
            <p>{text}</p>
            <div className="treatment-actions">{children}</div>
          </div>
          <figure className={`treatment-hero__figure${image === "brand" ? " treatment-hero__figure--brand" : ""}${cutout ? " treatment-hero__figure--cutout" : ""}`}>
            <div className="treatment-hero__photo"><img src={image === "brand" ? "/assets/monogram-gold.png" : slotMap[image]} alt="" loading="eager" fetchPriority="high" /></div>
            {fullBleed ? null : <figcaption>{caption}</figcaption>}
          </figure>
        </div>
    </section>
  );
}

export function TreatmentCta({ href, children = "לתיאום ייעוץ ללא עלות" }: { href: string; children?: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="treatment-cta">{children}<span aria-hidden="true">←</span></a>;
}

export function TreatmentProcess({ title, intro, items }: { title: string; intro: string; items: readonly (readonly [string, string])[] }) {
  return (
    <section className="treatment-section treatment-process">
      <div className="treatment-container treatment-split">
        <div className="treatment-section-intro">
          <TreatmentLabel>התהליך בקליניקה</TreatmentLabel>
          <h2>{title}</h2><p>{intro}</p>
        </div>
        <ol className="treatment-process__list">
          {items.map(([heading, text], i) => <li key={heading}><span className="treatment-process__number" aria-hidden="true">{i + 1}</span><div><h3>{heading}</h3><p>{text}</p></div></li>)}
        </ol>
      </div>
    </section>
  );
}

export function TreatmentFaq({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();
  return (
    <section className="treatment-section treatment-questions">
      <div className="treatment-container treatment-split">
        <div className="treatment-section-intro"><TreatmentLabel>לפני שמתחילות</TreatmentLabel><h2>עוד משהו<br />שרצית לדעת?</h2><p>כמה תשובות לשאלות שעולות לפני הטיפול.</p></div>
        <div className="treatment-faq">
          {items.map((item, index) => {
            const expanded = open === index;
            return <div className="treatment-faq__item" key={item.q} data-open={expanded}>
              <h3><button type="button" id={`${id}-q-${index}`} aria-expanded={expanded} aria-controls={`${id}-a-${index}`} onClick={() => setOpen(expanded ? null : index)}><span>{item.q}</span><span className="treatment-faq__icon" aria-hidden="true" /></button></h3>
              <div id={`${id}-a-${index}`} role="region" aria-labelledby={`${id}-q-${index}`} className="treatment-faq__answer" inert={!expanded} aria-hidden={!expanded}><div><p>{item.a}</p></div></div>
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}

export function TreatmentClosing({ href, title = "נתחיל בשיחה אישית." }: { href: string; title?: string }) {
  return <section className="treatment-closing"><div className="treatment-container"><div><TreatmentLabel>שיר לביא · הקליניקה</TreatmentLabel><h2>{title}</h2></div><TreatmentCta href={href}>בואי נדבר על הטיפול</TreatmentCta></div></section>;
}
