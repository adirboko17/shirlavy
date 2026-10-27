"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { shopInquiryLink } from "@/lib/data";
import { useSite } from "@/lib/site";
import { ResponsiveCarousel, Slot, h2Style } from "./ui";
import { ProductCard } from "./product-card";

export function ProductPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const { products, mobile } = useSite();
  const p = products.find((x) => x.id === id) || products[0];

  useEffect(() => {
    /* reset when id changes */
  }, [id]);

  if (!p) return null;
  const wa = shopInquiryLink(p.name);
  const related = products.filter((x) => x.id !== p.id).sort((a, b) => Number(b.cat === p.cat) - Number(a.cat === p.cat) || a.rank - b.rank).slice(0, 4);

  return (
    <div>
      <section style={{ padding: "clamp(96px,11vh,112px) clamp(16px,4vw,48px) clamp(56px,7vw,96px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <nav aria-label="פירורי לחם" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 13, color: "#8A8A8A", marginBottom: 20 }}>
            <Link href="/shop" className="chip" style={{ height: 32, background: "#F7F5F2" }}>→ חנות</Link>
            <span>{p.catName}</span>
          </nav>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "clamp(28px,5vw,72px)", alignItems: "start" }}>
            <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", background: "#F2EBE4", aspectRatio: "4/5", minWidth: 0 }}>
              <div style={{ position: "absolute", inset: "10%" }}>
                <Slot id={`p-${p.id}-1`} placeholder="תמונת מוצר" fit="contain" />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, position: "sticky", top: 100, minWidth: 0 }}>
              <h1 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(30px,3.4vw,46px)", lineHeight: 1.12, letterSpacing: "-.03em" }}>{p.name}</h1>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#5A5A5A", maxWidth: 480 }}>{p.short}</p>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="pill gold" style={{ alignSelf: "flex-start", height: 54 }}>
                פנייה בוואטסאפ לגבי המוצר <span aria-hidden>←</span>
              </a>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 6 }}>
                {["משלוח לכל הארץ", "ייעוץ אישי", "הזמנה בוואטסאפ"].map((t) => (
                  <span key={t} style={{ padding: "12px 8px", borderRadius: 14, background: "#F7F5F2", fontSize: 12, textAlign: "center", color: "#4A4A4A" }}>
                    {t}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: 13, color: "#8A8A8A", lineHeight: 1.65 }}>למחירים, זמינות ופרטים נוספים — שלחי הודעה בוואטסאפ ושיר תחזור אלייך.</span>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "0 clamp(16px,4vw,48px) clamp(56px,7vw,96px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <h2 style={{ ...h2Style("clamp(26px,2.8vw,36px)"), marginBottom: 24 }}>אולי תאהבי גם</h2>
          {mobile ? (
            <ResponsiveCarousel ariaLabel="מוצרים קשורים" slideWidth="min(72vw, 280px)">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </ResponsiveCarousel>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "clamp(12px,1.6vw,20px)" }}>
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
