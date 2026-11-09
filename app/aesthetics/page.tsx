import type { Metadata } from "next";
import Link from "next/link";
import { AestheticsPage } from "@/components/treatments";
import "./coming-soon.css";

// Switch to false at launch. The original page and its content remain intact.
const AESTHETICS_COMING_SOON = true;

export const metadata: Metadata = { title: "טיפולי אסתטיקה" };

export default function Page() {
  if (AESTHETICS_COMING_SOON) {
    return <section className="aesthetics-coming-soon" aria-labelledby="aesthetics-coming-soon-title">
      <div className="aesthetics-coming-soon__content">
        <div className="aesthetics-coming-soon__brand">
          <img src="/assets/logo-gold.png" alt="SHIR LAVY — Aesthetics & Academy" width={796} height={628} />
        </div>
        <span className="aesthetics-coming-soon__label">טיפולי אסתטיקה</span>
        <h1 id="aesthetics-coming-soon-title">בקרוב.</h1>
        <p>משהו יפה בדרך.<br />כל הפרטים על טיפולי האסתטיקה יעלו כאן בקרוב.</p>
        <Link className="aesthetics-coming-soon__back" href="/">בחזרה לעמוד הבית <span aria-hidden="true">←</span></Link>
      </div>
    </section>;
  }
  return <AestheticsPage />;
}
