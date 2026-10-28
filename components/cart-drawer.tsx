"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { formatMoney, requiredPolicyIds } from "@/lib/shop-model";
import { useSite } from "@/lib/site";

export function CartDrawer() {
  const site = useSite();
  if (!site.cartOpen) return null;
  const currency = site.shop.currency;
  const policies = site.shop.policies.filter((policy) => policy.cart !== "hidden");
  const needed = requiredPolicyIds(site.shop.policies, "cart");
  const ready = needed.every((id) => site.acceptedPolicies.includes(id));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 70 }}>
      <button type="button" aria-label="סגירת העגלה" onClick={site.closeCart} style={{ position: "absolute", inset: 0, border: 0, background: "rgba(28,28,28,.35)", cursor: "pointer" }} />
      <aside style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "min(420px, 100%)", background: "#fff", display: "flex", flexDirection: "column", boxShadow: "-16px 0 40px rgba(41,37,34,.12)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 22px 12px" }}>
          <h2 style={{ margin: 0, fontWeight: 400, fontSize: 22 }}>העגלה</h2>
          <button type="button" onClick={site.closeCart} aria-label="סגירה" style={{ border: 0, background: "#F7F5F2", width: 40, height: 40, borderRadius: 999, cursor: "pointer", fontFamily: "inherit" }}>×</button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "8px 22px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
          {site.cart.length === 0 ? (
            <p style={{ color: "#5A5A5A" }}>העגלה ריקה.</p>
          ) : site.cart.map((line) => (
            <div key={line.key} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 12 }}>
              <div style={{ width: 72, height: 90, borderRadius: 14, overflow: "hidden", background: "#F7F3EE" }}>
                {line.image ? <img src={line.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                <strong style={{ fontWeight: 500 }}>{line.name}</strong>
                {line.detail ? <span style={{ fontSize: 13, color: "#6B6B6B" }}>{line.detail}</span> : null}
                <span>{formatMoney(line.unitPrice, currency)}{line.bundle ? "" : line.quantity > 1 ? ` × ${line.quantity}` : ""}</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button type="button" aria-label="הפחתה" onClick={() => site.setQty(line.key, line.quantity - (line.bundleQty || 1))} style={qtyBtn}>−</button>
                  <span>{line.quantity}</span>
                  <button type="button" aria-label="הוספה" onClick={() => site.setQty(line.key, line.quantity + (line.bundleQty || 1))} style={qtyBtn}>+</button>
                  <button type="button" onClick={() => site.removeLine(line.key)} style={{ border: 0, background: "transparent", color: "#8A8A8A", cursor: "pointer", fontFamily: "inherit" }}>הסרה</button>
                </div>
              </div>
            </div>
          ))}
          {policies.map((policy) => (
            <PolicyRow key={policy.id} id={policy.id} title={policy.title} mode={policy.cart} />
          ))}
        </div>
        <div style={{ padding: 22, borderTop: "1px solid rgba(28,28,28,.08)" }}>
          {site.cart.length > 0 ? (
            <Link
              href={ready ? "/checkout" : "#"}
              aria-disabled={!ready}
              onClick={(event) => {
                if (!ready) event.preventDefault();
                else site.closeCart();
              }}
              className="pill gold"
              style={{ height: 52, width: "100%", opacity: ready ? 1 : 0.45, pointerEvents: ready ? "auto" : "none" }}
            >
              המשך לתשלום
            </Link>
          ) : (
            <Link href="/shop" onClick={site.closeCart} className="pill gold" style={{ height: 52, width: "100%" }}>לחנות</Link>
          )}
        </div>
      </aside>
    </div>
  );
}

export function PolicyRow({ id, title, mode }: { id: string; title: string; mode: "hidden" | "link" | "checkbox" }) {
  const site = useSite();
  if (mode === "hidden") return null;
  const href = `/policies/${id}`;
  if (mode === "link") {
    return <Link href={href} style={{ fontSize: 14, color: "#7A573C" }}>{title}</Link>;
  }
  const checked = site.acceptedPolicies.includes(id);
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, lineHeight: 1.5 }}>
      <input type="checkbox" checked={checked} onChange={(event) => site.togglePolicy(id, event.target.checked)} style={{ marginTop: 3 }} />
      <span>קראתי ואני מסכים ל<Link href={href} style={{ color: "#7A573C" }}>{title}</Link></span>
    </label>
  );
}

const qtyBtn: CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 999,
  border: 0,
  background: "#F7F5F2",
  cursor: "pointer",
  fontFamily: "inherit",
};
