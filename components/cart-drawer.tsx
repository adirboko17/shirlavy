"use client";

import Link from "next/link";
import { formatMoney, requiredPolicyIds, type CartLine, type Currency } from "@/lib/shop-model";
import { useSite } from "@/lib/site";

export function CartDrawer() {
  const site = useSite();
  if (!site.cartOpen) return null;
  const currency = site.shop.currency;
  const policies = site.shop.policies.filter((policy) => policy.cart !== "hidden");
  const needed = requiredPolicyIds(site.shop.policies, "cart");
  const ready = needed.every((id) => site.acceptedPolicies.includes(id));
  const subtotal = cartSubtotal(site.cart);
  const count = site.cart.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="cart-drawer">
      <button type="button" aria-label="סגירת העגלה" onClick={site.closeCart} className="cart-drawer__backdrop" />
      <aside className="cart-drawer__panel" aria-label="העגלה">
        <header className="cart-drawer__head">
          <div>
            <h2>העגלה</h2>
            {count > 0 ? <p>{count === 1 ? "פריט אחד" : `${count} פריטים`}</p> : null}
          </div>
          <button type="button" onClick={site.closeCart} aria-label="סגירה">×</button>
        </header>
        <div className="cart-drawer__body">
          {site.cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <p>העגלה עדיין ריקה.</p>
              <Link href="/shop" onClick={site.closeCart} className="pill gold">לחנות</Link>
            </div>
          ) : site.cart.map((line) => (
            <CartLineRow key={line.key} line={line} currency={currency} />
          ))}
        </div>
        {site.cart.length > 0 ? (
          <footer className="cart-drawer__foot">
            <div className="cart-drawer__totals">
              <span>סכום ביניים</span>
              <strong>{formatMoney(subtotal, currency)}</strong>
            </div>
            <p>המשלוח וההנחה מחושבים בקופה.</p>
            {policies.length ? (
              <div className="cart-drawer__policies">
                {policies.map((policy) => (
                  <PolicyRow key={policy.id} id={policy.id} title={policy.title} mode={policy.cart} />
                ))}
              </div>
            ) : null}
            {!ready ? <p className="cart-drawer__hint">כדי להמשיך יש לאשר את התנאים.</p> : null}
            <Link
              href={ready ? "/checkout" : "#"}
              aria-disabled={!ready}
              onClick={(event) => {
                if (!ready) event.preventDefault();
                else site.closeCart();
              }}
              className="pill gold cart-drawer__pay"
              style={{ opacity: ready ? 1 : 0.45, pointerEvents: ready ? "auto" : "none" }}
            >
              המשך לתשלום
            </Link>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}

function CartLineRow({ line, currency }: { line: CartLine; currency: Currency }) {
  const site = useSite();
  const step = line.bundleQty || 1;
  const total = line.unitPrice * line.quantity;
  return (
    <article className="cart-line">
      <div className="cart-line__photo">
        {line.image ? <img src={line.image} alt="" /> : null}
      </div>
      <div className="cart-line__body">
        <div className="cart-line__top">
          <div>
            <strong>{line.name}</strong>
            {line.detail ? <span>{line.detail}</span> : null}
          </div>
          <b>{formatMoney(total, currency)}</b>
        </div>
        <div className="cart-line__actions">
          <div className="qty">
            <button type="button" aria-label="הפחתה" onClick={() => site.setQty(line.key, line.quantity - step)}>−</button>
            <span>{line.quantity}</span>
            <button type="button" aria-label="הוספה" onClick={() => site.setQty(line.key, line.quantity + step)}>+</button>
          </div>
          <button type="button" className="cart-line__remove" onClick={() => site.removeLine(line.key)}>הסרה</button>
        </div>
      </div>
    </article>
  );
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

export function PolicyRow({ id, title, mode }: { id: string; title: string; mode: "hidden" | "link" | "checkbox" }) {
  const site = useSite();
  if (mode === "hidden") return null;
  const href = `/policies/${id}`;
  if (mode === "link") {
    return <Link href={href} className="policy-link">{title}</Link>;
  }
  const checked = site.acceptedPolicies.includes(id);
  return (
    <label className="policy-check">
      <input type="checkbox" checked={checked} onChange={(event) => site.togglePolicy(id, event.target.checked)} />
      <span>קראתי ואני מסכימה ל<Link href={href}>{title}</Link></span>
    </label>
  );
}
