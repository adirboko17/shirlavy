"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CommerceIcon } from "./commerce-icon";
import { formatMoney, requiredPolicyIds, type CartLine, type Currency } from "@/lib/shop-model";
import { useSite } from "@/lib/site";

export function CartDrawer() {
  const site = useSite();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    let frame = 0;
    let nextFrame = 0;
    let timer = 0;
    if (site.cartOpen) {
      if (!dialog.open) dialog.showModal();
      closeRef.current?.focus({ preventScroll: true });
      frame = requestAnimationFrame(() => {
        nextFrame = requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      // Keep the native modal mounted until the exit transition finishes.
      timer = window.setTimeout(() => dialog.close(), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420);
    }
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(nextFrame); window.clearTimeout(timer); };
  }, [site.cartOpen]);
  const currency = site.shop.currency;
  const policies = site.shop.policies.filter((policy) => policy.cart !== "hidden");
  const needed = requiredPolicyIds(site.shop.policies, "cart");
  const ready = needed.every((id) => site.acceptedPolicies.includes(id));
  const subtotal = cartSubtotal(site.cart);
  const count = site.cart.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <dialog ref={dialogRef} className="cart-drawer" data-visible={visible} aria-labelledby="cart-title" onCancel={(event) => { event.preventDefault(); site.closeCart(); }}>
      <button type="button" tabIndex={-1} aria-label="סגירת העגלה" onClick={site.closeCart} className="cart-drawer__backdrop" />
      <div className="cart-drawer__panel">
        <header className="cart-drawer__head">
          <div>
            <span className="commerce-eyebrow">YOUR LITTLE EDIT</span>
            <h2 id="cart-title">הסל שלך <span className="cart-drawer__count">{count}</span></h2>
            <p>הבחירות היפות שלך, במקום אחד.</p>
          </div>
          <button ref={closeRef} type="button" onClick={site.closeCart} aria-label="סגירת הסל"><CommerceIcon name="close" /></button>
        </header>
        <div className="cart-drawer__body">
          {site.cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon"><CommerceIcon name="bag" width="42" height="42" /></div>
              <h3>מקום לדברים שאת אוהבת</h3>
              <p>הסל שלך עדיין ריק.<br />הבחירה הבאה שלך מחכה בקולקציה.</p>
              <Link href="/shop" onClick={site.closeCart} className="commerce-button">בואי לגלות <CommerceIcon name="arrow" /></Link>
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
              className="commerce-button cart-drawer__pay"
            >
              <span>המשך לתשלום</span><CommerceIcon name="arrow" />
            </Link>
            <button type="button" className="cart-drawer__continue" onClick={site.closeCart}>להמשיך לגלות</button>
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}

function CartLineRow({ line, currency }: { line: CartLine; currency: Currency }) {
  const site = useSite();
  const step = line.bundleQty || 1;
  const total = line.unitPrice * line.quantity;
  return (
    <article className="cart-line">
      <Link href={`/shop/${line.productId}`} onClick={site.closeCart} className="cart-line__photo" aria-label={line.name}>
        {line.image ? <img src={line.image} alt="" /> : null}
      </Link>
      <div className="cart-line__body">
        <div className="cart-line__top">
          <div>
            <Link href={`/shop/${line.productId}`} onClick={site.closeCart}><strong>{line.name}</strong></Link>
            {line.detail ? <span>{line.detail}</span> : null}
          </div>
          <b>{formatMoney(total, currency)}</b>
        </div>
        <div className="cart-line__actions">
          <div className="commerce-quantity">
            <button type="button" aria-label={`הפחתת כמות: ${line.name}`} onClick={() => site.setQty(line.key, line.quantity - step)}>−</button>
            <span aria-live="polite">{line.quantity}</span>
            <button type="button" aria-label={`הגדלת כמות: ${line.name}`} onClick={() => site.setQty(line.key, line.quantity + step)}>+</button>
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
