import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { EventSignup } from "@/components/event-signup";
import { formatMoney } from "@/lib/shop-model";
import { loadShop } from "@/lib/storely";

export const metadata: Metadata = { title: "אירוע" };

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shop = await loadShop((await headers()).get("host"));
  const event = shop.events.find((item) => item.slug === slug);
  if (!event) notFound();
  return (
    <article style={{ padding: "clamp(120px,14vh,150px) clamp(16px,4vw,48px) 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
        <Link href="/events" className="text-link">לכל האירועים</Link>
        {event.image ? <img src={event.image} alt="" style={{ width: "100%", borderRadius: 28, maxHeight: 420, objectFit: "cover" }} /> : null}
        <h1 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(32px,4vw,52px)" }}>{event.title}</h1>
        <p style={{ margin: 0, color: "#7A573C" }}>{event.date} · {event.from}–{event.to} · {event.online ? "אונליין" : event.address}</p>
        <p style={{ margin: 0, fontSize: 18 }}>{event.price === 0 ? "חינם" : formatMoney(event.price, shop.currency)}</p>
        {event.short ? <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7 }}>{event.short}</p> : null}
        {event.body.map((paragraph, index) => <p key={`${event.slug}-${index}`} style={{ margin: 0, lineHeight: 1.75, color: "#3A3A3A" }}>{paragraph}</p>)}
        <EventSignup slug={event.slug} price={event.price} currency={shop.currency} open={event.status === "open"} />
      </div>
    </article>
  );
}
