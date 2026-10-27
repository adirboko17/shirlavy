"use client";

import Link from "next/link";
import { waLink } from "@/lib/data";
import { h2Style } from "./ui";

const SHOP_WA = waLink("היי, אשמח לפרטים והזמנה מוצרים מהחנות.");

export function CheckoutPage() {
  return (
    <section style={{ padding: "clamp(120px,14vh,140px) clamp(16px,4vw,48px) clamp(64px,8vw,96px)" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20 }}>
        <h1 style={h2Style("clamp(28px,3.2vw,40px)")}>הזמנה מהחנות</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "#5A5A5A" }}>
          הזמנות, מחירים וזמינות — בפנייה ישירה לשיר בוואטסאפ. בחרי מוצר בחנות ולחצי «פנייה בוואטסאפ» בדף המוצר.
        </p>
        <a href={SHOP_WA} target="_blank" rel="noopener noreferrer" className="pill gold" style={{ height: 54 }}>
          פנייה בוואטסאפ <span aria-hidden>←</span>
        </a>
        <Link href="/shop" className="text-link">חזרה לחנות</Link>
      </div>
    </section>
  );
}
