"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CommerceIcon } from "./commerce-icon";

export function PaymentReturn() {
  const started = useRef(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const query = window.location.search.startsWith("?") ? window.location.search.slice(1) : window.location.search;
    if (!query) {
      setReason("לא התקבל אישור תשלום.");
      return;
    }
    void fetch("/api/storely/payment/complete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok || !body?.ok || !body.orderNumber) {
          setReason(typeof body?.reason === "string" ? body.reason : "לא הצלחנו לאשר את התשלום.");
          return;
        }
        setOrderNumber(String(body.orderNumber));
      })
      .catch(() => setReason("לא התקבל אישור מהשרת. רענני את העמוד לפני ניסיון נוסף."));
  }, []);

  if (orderNumber) {
    return (
      <section className="checkout-page checkout-done">
        <span className="checkout-state-icon" aria-hidden="true">✓</span>
        <span className="checkout-eyebrow">תודה שבחרת ב־SHIR LAVY</span>
        <h1>ההזמנה התקבלה</h1>
        <p>מספר ההזמנה שלך: <bdi>{orderNumber}</bdi></p>
        <Link href="/shop" className="checkout-primary">בחזרה לחנות <CommerceIcon name="arrow" /></Link>
      </section>
    );
  }

  return (
    <section className="checkout-page checkout-done">
      <span className="checkout-eyebrow">התשלום</span>
      <h1>{reason ? "התשלום לא הושלם" : "מאשרים את התשלום"}</h1>
      <p>{reason || "רק עוד רגע, בודקים את האישור מול חברת הסליקה."}</p>
      {reason ? <Link href="/checkout" className="checkout-primary">חזרה להזמנה <CommerceIcon name="arrow" /></Link> : null}
    </section>
  );
}
