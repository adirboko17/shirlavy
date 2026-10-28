export type Currency = "ILS" | "USD" | "EUR";

export type ShopVariant = {
  id: string;
  title: string;
  sku: string;
  price: number;
  stock: number | null;
};

export type ShopBundle = {
  qty: number;
  price: number;
  label: string;
  image?: string;
  tag?: string;
};

export type ShopProduct = {
  id: string;
  name: string;
  handle: string;
  short: string;
  description: string;
  cat: string;
  catName: string;
  tag?: string;
  isNew: boolean;
  best: boolean;
  rank: number;
  price: number;
  compareAt: number | null;
  images: string[];
  variants: ShopVariant[];
  bundles: ShopBundle[];
};

export type ShopCollection = {
  id: string;
  title: string;
  handle: string;
  productIds: string[];
};

export type ShippingMethod = {
  name: string;
  price: number;
  zone: string;
};

export type PolicyMode = "hidden" | "link" | "checkbox";

export type PolicyDoc = {
  id: string;
  title: string;
  body: string;
  footer: boolean;
  cart: PolicyMode;
  checkout: PolicyMode;
};

export type CartLine = {
  key: string;
  variantId: string;
  productId: string;
  name: string;
  detail: string;
  image: string;
  unitPrice: number;
  quantity: number;
  bundle: boolean;
  bundleQty?: number;
  gift: boolean;
};

export type PublicEvent = {
  slug: string;
  title: string;
  short: string;
  body: string[];
  date: string;
  from: string;
  to: string;
  online: boolean;
  address: string | null;
  price: number;
  status: "open" | "full" | "ended" | "cancelled";
  image: string | null;
};

export type ShopSnapshot = {
  currency: Currency;
  products: ShopProduct[];
  collections: ShopCollection[];
  shipping: ShippingMethod[];
  policies: PolicyDoc[];
  popups: unknown[];
  quiz: unknown | null;
  events: PublicEvent[];
};

export const EMPTY_SHOP: ShopSnapshot = {
  currency: "ILS",
  products: [],
  collections: [],
  shipping: [],
  policies: [],
  popups: [],
  quiz: null,
  events: [],
};

const SYMBOLS: Record<Currency, string> = { ILS: "₪", USD: "$", EUR: "€" };

export function currencyOf(value: unknown): Currency {
  const code = typeof value === "string" ? value.trim().toUpperCase() : "";
  return code === "USD" || code === "EUR" || code === "ILS" ? code : "ILS";
}

export function formatMoney(amount: number, currency: Currency) {
  const rounded = Math.round(amount * 100) / 100;
  const text = Number.isInteger(rounded)
    ? rounded.toLocaleString("he-IL")
    : rounded.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return SYMBOLS[currency] + text;
}

export function formatShippingPrice(price: number, currency: Currency) {
  return price === 0 ? "משלוח חינם" : formatMoney(price, currency);
}

export function isPickupZone(zone: string) {
  return /pickup|collect|locker|איסוף|נקוד/i.test(zone);
}

export function lineKey(variantId: string, bundleQty?: number, gift?: boolean) {
  return `${gift ? "gift:" : ""}${variantId}:${bundleQty && bundleQty > 1 ? bundleQty : "1"}`;
}

export function storefrontLine(line: CartLine) {
  const row: { variantId: string; quantity: number; bundle?: boolean; bundleQty?: number } = {
    variantId: line.variantId,
    quantity: line.quantity,
  };
  if (line.bundle && line.bundleQty && line.bundleQty > 1) {
    row.bundle = true;
    row.bundleQty = line.bundleQty;
  }
  return row;
}

export function policyHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

export function requiredPolicyIds(policies: PolicyDoc[], where: "cart" | "checkout" | "both") {
  return policies
    .filter((policy) => {
      if (where === "both") return policy.cart === "checkbox" || policy.checkout === "checkbox";
      return policy[where] === "checkbox";
    })
    .map((policy) => policy.id);
}
