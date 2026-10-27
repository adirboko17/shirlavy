"use client";

import { waLink } from "@/lib/data";
import { MEDICAL_AESTHETICS_COPY } from "@/lib/content";
import { PageHero, SectionLabel, Slot, h2Style } from "./ui";
import { Cta } from "./about";

const WA = waLink("היי, אשמח לפרטים על טיפולי אסתטיקה רפואית ותיאום תור.");

export function MedicalAestheticsPage() {
  const { title, paragraphs } = MEDICAL_AESTHETICS_COPY;

  return (
    <div>
      <PageHero kicker="טיפולים" title={title} text={paragraphs[0]} />

      <section style={{ padding: "clamp(56px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(28px,5vw,64px)", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionLabel>אסתטיקה רפואית</SectionLabel>
            {paragraphs.slice(1).map((p) => (
              <p key={p.slice(0, 24)} style={{ margin: 0, fontSize: "clamp(16px,1.3vw,18px)", lineHeight: 1.85, color: "#5A5A5A" }}>
                {p}
              </p>
            ))}
            <a href={WA} target="_blank" rel="noopener noreferrer" className="pill gold" style={{ alignSelf: "flex-start", marginTop: 8 }}>
              ייעוץ ותיאום בווטסאפ <span aria-hidden>←</span>
            </a>
          </div>
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#F2EBE4", color: "#999", aspectRatio: "4/5", minHeight: 280 }}>
            {/* TODO: before/after gallery for medical aesthetics — images pending from Shir */}
            <Slot id="medical-aesthetics-ba" placeholder="לפני ואחרי — יתווסף בהמשך" />
          </div>
        </div>
      </section>

      <Cta title="ייעוץ רפואי מקצועי, בקצב שלך.">
        <a href={WA} target="_blank" rel="noopener noreferrer" className="pill white-pill" style={{ height: 56 }}>
          צרו קשר בווטסאפ <span aria-hidden>←</span>
        </a>
      </Cta>
    </div>
  );
}
