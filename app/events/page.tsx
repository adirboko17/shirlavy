import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { formatMoney } from "@/lib/shop-model";
import { loadShop } from "@/lib/storely";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "אירועים" };

const STATUS = { open: "הרשמה פתוחה", full: "מלא", ended: "הסתיים", cancelled: "בוטל" };

export default async function EventsPage() {
  const shop = await loadShop((await headers()).get("host"));
  return (
    <div>
      <PageHero kicker="אירועים" title="המפגשים הקרובים" text="ההרשמה והפרטים מתעדכנים מהחנות." />
      <section style={{ padding: "0 clamp(16px,4vw,48px) 80px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
          {shop.events.length === 0 ? <p style={{ color: "#5A5A5A" }}>אין אירועים לפרסום כרגע.</p> : shop.events.map((event) => (
            <Link key={event.slug} href={`/events/${event.slug}`} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, textDecoration: "none", color: "inherit", background: "#F7F5F2", borderRadius: 24, overflow: "hidden" }}>
              <div style={{ background: "#F2EBE4", minHeight: 120 }}>
                {event.image ? <img src={event.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
              </div>
              <div style={{ padding: "16px 16px 16px 0" }}>
                <div style={{ fontSize: 13, color: "#7A573C" }}>{event.date} · {event.from}–{event.to}</div>
                <h2 style={{ margin: "6px 0", fontWeight: 500, fontSize: 22 }}>{event.title}</h2>
                <p style={{ margin: 0, color: "#5A5A5A" }}>{event.short}</p>
                <div style={{ marginTop: 8, fontSize: 14 }}>{event.price === 0 ? "חינם" : formatMoney(event.price, shop.currency)} · {STATUS[event.status]}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
