import { cache } from "react";
import {
  currencyOf,
  EMPTY_SHOP,
  type Currency,
  type PolicyDoc,
  type PolicyMode,
  type PublicEvent,
  type ShopBundle,
  type ShopCollection,
  type ShippingMethod,
  type ShopProduct,
  type ShopSnapshot,
  type ShopVariant,
} from "@/lib/shop-model";

const ALLOWED_HOSTS = new Set(["shirlavy.vercel.app", "www.shirlavy.co.il"]);
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const LOCAL_STORE_HOST = "shirlavy.vercel.app";

const FALLBACK_POLICIES: { id: string; title: string }[] = [
  { id: "return", title: "החזרות" },
  { id: "privacy", title: "מדיניות פרטיות" },
  { id: "terms", title: "תקנון" },
  { id: "shipping", title: "משלוחים" },
  { id: "contact", title: "יצירת קשר" },
  { id: "legal", title: "מידע משפטי" },
  { id: "purchase", title: "מדיניות רכישה" },
];

export function requestHostname(hostHeader: string | null) {
  return (hostHeader ?? "").split(",")[0]?.trim().toLowerCase().replace(/:\d+$/, "") ?? "";
}

export function storefrontHostname(hostHeader: string | null) {
  const host = requestHostname(hostHeader);
  if (ALLOWED_HOSTS.has(host)) return host;
  if (LOCAL_HOSTS.has(host)) return LOCAL_STORE_HOST;
  return "";
}

function storelyEnv() {
  const url = (process.env.STORELY_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim().replace(/\/$/, "");
  const key = (process.env.STORELY_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)?.trim();
  const trackingKey = process.env.STORELY_TRACKING_KEY?.trim();
  if (!url || !key || !trackingKey) return null;
  return { url, key, trackingKey };
}

function recordOf(value: unknown): Record<string, unknown> | null {
  if (typeof value === "string") {
    try {
      return recordOf(JSON.parse(value));
    } catch {
      return null;
    }
  }
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function text(value: unknown, max = 4000) {
  return typeof value === "string" ? value.replace(/\u0000/g, "").trim().slice(0, max) : "";
}

function amount(value: unknown) {
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : null;
}

function httpsOrPath(value: unknown) {
  const raw = text(value, 2000);
  if (raw.startsWith("https://")) return raw;
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "";
}

async function rpc(name: string, body: Record<string, unknown>) {
  const env = storelyEnv();
  if (!env) return null;
  try {
    const response = await fetch(`${env.url}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: {
        apikey: env.key,
        authorization: `Bearer ${env.key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) return null;
    return payload;
  } catch {
    return null;
  }
}

function modeOf(value: unknown): PolicyMode {
  return value === "link" || value === "checkbox" || value === "hidden" ? value : "hidden";
}

function policiesOf(value: unknown): PolicyDoc[] {
  const record = recordOf(value);
  if (!record) return [];
  if (Array.isArray(record.items)) {
    const docs: PolicyDoc[] = [];
    for (const item of record.items) {
      const row = recordOf(item);
      const id = text(row?.id, 80);
      const title = text(row?.title, 160);
      if (!id || !title) continue;
      docs.push({
        id,
        title,
        body: text(row?.body, 200000),
        footer: row?.footer === true,
        cart: modeOf(row?.cart),
        checkout: modeOf(row?.checkout),
      });
    }
    return docs;
  }
  const docs: PolicyDoc[] = [];
  for (const item of FALLBACK_POLICIES) {
    const body = text(record[item.id], 200000);
    if (!body) continue;
    docs.push({ id: item.id, title: item.title, body, footer: true, cart: "link", checkout: "link" });
  }
  return docs;
}

function bundlesOf(value: unknown): ShopBundle[] {
  if (!Array.isArray(value)) return [];
  const bundles: ShopBundle[] = [];
  for (const item of value) {
    const row = recordOf(item);
    const qty = Number(row?.qty);
    const price = amount(row?.price);
    if (!Number.isInteger(qty) || qty < 2 || qty > 99 || price == null || price < 0) continue;
    const image = httpsOrPath(row?.image);
    const tag = text(row?.tag, 24);
    bundles.push({
      qty,
      price,
      label: text(row?.label, 80) || `מארז ${qty}`,
      ...(image ? { image } : {}),
      ...(tag ? { tag } : {}),
    });
  }
  return bundles.sort((a, b) => a.qty - b.qty);
}

function variantsOf(value: unknown, fallbackPrice: number): ShopVariant[] {
  if (!Array.isArray(value)) return [];
  const variants: ShopVariant[] = [];
  for (const item of value) {
    const row = recordOf(item);
    const id = text(row?.id, 80);
    const price = amount(row?.price) ?? fallbackPrice;
    if (!id || price < 0) continue;
    const stockValue = row?.stock ?? row?.available;
    const stockNumber = typeof stockValue === "number" ? stockValue : typeof stockValue === "string" ? Number(stockValue) : NaN;
    variants.push({
      id,
      title: text(row?.title, 120),
      sku: text(row?.sku, 80),
      price,
      stock: Number.isFinite(stockNumber) ? stockNumber : null,
    });
  }
  return variants;
}

function productsOf(value: unknown, collections: ShopCollection[]): ShopProduct[] {
  if (!Array.isArray(value)) return [];
  const products: ShopProduct[] = [];
  value.forEach((item, index) => {
    const row = recordOf(item);
    const id = text(row?.id, 80);
    const name = text(row?.title, 200);
    if (!id || !name) return;
    const price = amount(row?.price) ?? 0;
    const compare = amount(row?.compareAt);
    const variants = variantsOf(row?.variants, price);
    const merch = recordOf(row?.merch);
    const badge = recordOf(merch?.badge);
    const badgeLabel = badge?.hidden === true ? "" : text(badge?.label, 24);
    const tags = Array.isArray(row?.tags) ? row.tags.filter((tag): tag is string => typeof tag === "string") : [];
    const description = text(row?.description, 8000);
    const collection = collections.find((entry) => entry.productIds.includes(id));
    const images = Array.isArray(row?.media)
      ? row.media.flatMap((media) => {
          const path = httpsOrPath(recordOf(media)?.path ?? media);
          return path ? [path] : [];
        })
      : [];
    const haystack = `${tags.join(" ")} ${badgeLabel}`;
    products.push({
      id,
      name,
      handle: text(row?.handle, 160),
      short: description.replace(/\s+/g, " ").slice(0, 180),
      description,
      cat: collection?.id || text(row?.category, 80),
      catName: collection?.title || text(row?.category, 80),
      ...(badgeLabel ? { tag: badgeLabel } : {}),
      isNew: /חדש|\bnew\b/i.test(haystack),
      best: /נמכר|מומלץ|\bbest\b/i.test(haystack),
      rank: index,
      price: variants[0]?.price ?? price,
      compareAt: compare != null && compare > (variants[0]?.price ?? price) ? compare : null,
      images,
      variants: variants.length ? variants : [{ id, title: "", sku: "", price, stock: null }],
      bundles: bundlesOf(merch?.bundles),
    });
  });
  return products;
}

function collectionsOf(value: unknown): ShopCollection[] {
  if (!Array.isArray(value)) return [];
  const collections: ShopCollection[] = [];
  for (const item of value) {
    const row = recordOf(item);
    const id = text(row?.id, 80);
    const title = text(row?.title, 160);
    if (!id || !title) continue;
    const productIds = Array.isArray(row?.productIds)
      ? row.productIds.filter((entry): entry is string => typeof entry === "string" && entry.length > 0)
      : [];
    collections.push({ id, title, handle: text(row?.handle, 160), productIds });
  }
  return collections;
}

function shippingOf(value: unknown): ShippingMethod[] {
  if (!Array.isArray(value)) return [];
  const methods: ShippingMethod[] = [];
  for (const item of value) {
    const row = recordOf(item);
    const name = text(row?.name, 160);
    const price = amount(row?.price);
    if (!name || price == null || price < 0) continue;
    methods.push({ name, price, zone: text(row?.zone, 160) });
  }
  return methods;
}

function eventsOf(value: unknown): PublicEvent[] {
  if (!Array.isArray(value)) return [];
  const events: PublicEvent[] = [];
  for (const item of value) {
    const row = recordOf(item);
    const slug = text(row?.slug, 160);
    const title = text(row?.title, 200);
    const status = row?.status;
    if (!slug || !title) continue;
    if (status !== "open" && status !== "full" && status !== "ended" && status !== "cancelled") continue;
    const image = text(row?.image, 2000);
    events.push({
      slug,
      title,
      short: text(row?.short, 500),
      body: Array.isArray(row?.body) ? row.body.filter((part): part is string => typeof part === "string") : [],
      date: text(row?.date, 10),
      from: text(row?.from, 5),
      to: text(row?.to, 5),
      online: row?.online === true,
      address: row?.online === true ? null : text(row?.address, 300) || null,
      price: amount(row?.price) ?? 0,
      status,
      image: image.startsWith("https://") ? image : null,
    });
  }
  return events;
}

async function loadEvents() {
  const storeId = process.env.STORELY_STORE_ID?.trim();
  if (!storeId) return [];
  const payload = await rpc("store_public_events", { target_store: storeId });
  return eventsOf(payload);
}

export const loadShop = cache(async (hostHeader: string | null): Promise<ShopSnapshot> => {
  const hostname = storefrontHostname(hostHeader);
  const env = storelyEnv();
  if (!hostname || !env) return EMPTY_SHOP;
  const [payload, events] = await Promise.all([
    rpc("storefront_shop", { tracking_key: env.trackingKey, hostname }),
    loadEvents(),
  ]);
  const record = recordOf(payload);
  if (!record || record.ok !== true) return { ...EMPTY_SHOP, events };
  const collections = collectionsOf(record.collections);
  return {
    currency: currencyOf(record.currency),
    products: productsOf(record.products, collections),
    collections,
    shipping: shippingOf(record.shipping),
    policies: policiesOf(record.policies),
    popups: Array.isArray(record.popups) ? record.popups.slice(0, 20) : [],
    quiz: record.quiz && typeof record.quiz === "object" ? record.quiz : null,
    events,
  };
});

export type StoreLine = { variantId: string; quantity: number; bundle?: boolean; bundleQty?: number };

export type QuoteResult =
  | {
      ok: true;
      total: number;
      currency: Currency;
      shipping: number | null;
      discount: number;
      discountCode: string;
      addGift: boolean;
      giftVariantId: string;
      giftQuantity: number;
      giftTitle: string;
      bundleBlocked: boolean;
    }
  | { ok: false; reason: string };

export async function quoteShop(input: {
  hostHeader: string | null;
  lines: StoreLine[];
  code: string;
  shippingName: string;
  email: string;
  giftCode: string;
}): Promise<QuoteResult> {
  const hostname = storefrontHostname(input.hostHeader);
  const env = storelyEnv();
  if (!hostname || !env) return { ok: false, reason: "לא הצלחנו לחשב את הסכום לתשלום" };
  const payload = await rpc("quote_storefront", {
    tracking_key: env.trackingKey,
    hostname,
    lines: input.lines,
    code: input.code,
    shipping_name: input.shippingName,
    customer_email: input.email,
    gift_code: input.giftCode,
  });
  const record = recordOf(payload);
  const total = amount(record?.total);
  if (!record || record.ok !== true || total == null || total < 0) {
    return { ok: false, reason: text(record?.reason, 300) || text(record?.message, 300) || "לא הצלחנו לחשב את הסכום לתשלום" };
  }
  const giftQuantity = Number(record.giftQuantity);
  return {
    ok: true,
    total,
    currency: currencyOf(record.currency),
    shipping: amount(record.shipping),
    discount: amount(record.discount) ?? 0,
    discountCode: text(record.discountCode, 80),
    addGift: record.addGift === true,
    giftVariantId: text(record.giftVariantId, 80),
    giftQuantity: Number.isInteger(giftQuantity) && giftQuantity > 0 ? giftQuantity : 1,
    giftTitle: text(record.giftTitle, 200),
    bundleBlocked: record.bundleBlocked === true,
  };
}

export async function saveCheckout(input: {
  hostHeader: string | null;
  visitorKey: string;
  lines: StoreLine[];
  customer: { name?: string; email?: string; phone?: string; street?: string; city?: string; zip?: string };
  shippingName: string;
}) {
  const hostname = storefrontHostname(input.hostHeader);
  const env = storelyEnv();
  if (!hostname || !env || !input.lines.length) return;
  const customer = input.customer;
  await rpc("save_storefront_checkout", {
    tracking_key: env.trackingKey,
    hostname,
    visitor_key: input.visitorKey,
    lines: input.lines,
    customer_name: customer.name ?? "",
    customer_email: customer.email ?? "",
    customer_phone: customer.phone ?? "",
    customer_street: customer.street ?? "",
    customer_city: customer.city ?? "",
    customer_zip: customer.zip ?? "",
    shipping_name: input.shippingName,
  });
}

export async function placeOrder(input: {
  hostHeader: string | null;
  visitorKey: string;
  lines: StoreLine[];
  customer: { name: string; email: string; phone: string; street: string; city: string; zip: string };
  shippingName: string;
  code: string;
  giftCode: string;
}) {
  const hostname = storefrontHostname(input.hostHeader);
  const env = storelyEnv();
  if (!hostname || !env) return { ok: false as const, reason: "לא הצלחנו לשמור את ההזמנה" };
  const payload = await rpc("place_storefront_order", {
    tracking_key: env.trackingKey,
    hostname,
    visitor_key: input.visitorKey,
    lines: input.lines,
    customer_name: input.customer.name,
    customer_email: input.customer.email,
    customer_phone: input.customer.phone,
    customer_street: input.customer.street,
    customer_city: input.customer.city,
    customer_zip: input.customer.zip,
    shipping_name: input.shippingName,
    code: input.code,
    gift_code: input.giftCode,
    payment_status: "paid",
  });
  const record = recordOf(payload);
  const orderNumber = record?.orderNumber;
  const number = typeof orderNumber === "string" || typeof orderNumber === "number" ? String(orderNumber).trim() : "";
  if (!record || record.ok !== true || !number) {
    return { ok: false as const, reason: text(record?.reason, 300) || "לא הצלחנו לשמור את ההזמנה" };
  }
  const total = amount(record.total) ?? 0;
  await recordEvent({
    hostHeader: input.hostHeader,
    visitorKey: input.visitorKey,
    event: "purchase",
    path: "/checkout",
    amount: total,
  });
  return { ok: true as const, orderNumber: number, total, currency: currencyOf(record.currency) };
}

export async function recordEvent(input: {
  hostHeader: string | null;
  visitorKey: string;
  event: "page_view" | "add_to_cart" | "begin_checkout" | "purchase";
  path: string;
  country?: string;
  city?: string;
  amount?: number;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}) {
  const hostname = storefrontHostname(input.hostHeader);
  const env = storelyEnv();
  if (!hostname || !env) return false;
  const body: Record<string, string | number> = {
    tracking_key: env.trackingKey,
    hostname,
    visitor_key: input.visitorKey,
    event_name: input.event,
    path: input.path.split("?")[0]?.split("#")[0] || "/",
    country: input.country ?? "",
    city: input.city ?? "",
    referrer: input.referrer ?? "",
    utm_source: input.utmSource ?? "",
    utm_medium: input.utmMedium ?? "",
    utm_campaign: input.utmCampaign ?? "",
  };
  if (input.event === "purchase" && Number.isFinite(input.amount)) body.amount = input.amount as number;
  const payload = await rpc("record_storefront_event", body);
  return recordOf(payload)?.ok === true;
}

export async function submitPopupLead(input: {
  hostHeader: string | null;
  popupId: string;
  fields: Record<string, string>;
  pagePath: string;
}) {
  const hostname = storefrontHostname(input.hostHeader);
  const env = storelyEnv();
  if (!hostname || !env) return { ok: false as const, reason: "לא הצלחנו לשמור את הפרטים" };
  const payload = await rpc("submit_store_popup_lead", {
    tracking_key: env.trackingKey,
    hostname,
    popup_id: input.popupId,
    fields: input.fields,
    page_path: input.pagePath,
  });
  const record = recordOf(payload);
  if (!record || record.ok !== true) return { ok: false as const, reason: text(record?.reason, 300) || "לא הצלחנו לשמור את הפרטים" };
  return { ok: true as const };
}

function storeId() {
  return process.env.STORELY_STORE_ID?.trim() || "";
}

export async function registerEvent(input: {
  eventSlug: string;
  fullName: string;
  phone: string;
  email: string;
  stage: "pregnant" | "gave_birth";
  dueDate: string | null;
  pregnancyWeek: number | null;
  babyBirthDate: string | null;
  termsAccepted: boolean;
  marketingConsent: boolean;
}) {
  const target = storeId();
  if (!target) return { ok: false as const, reason: "האירוע לא זמין" };
  const payload = await rpc("register_store_event", {
    target_store: target,
    event_slug: input.eventSlug,
    full_name: input.fullName,
    phone: input.phone,
    email: input.email,
    stage: input.stage,
    due_date: input.dueDate,
    pregnancy_week: input.pregnancyWeek,
    baby_birth_date: input.babyBirthDate,
    terms_accepted: input.termsAccepted,
    marketing_consent: input.marketingConsent,
  });
  const record = recordOf(payload);
  if (!record || record.ok !== true) return { ok: false as const, reason: text(record?.reason, 300) || "ההרשמה לא נשמרה" };
  return {
    ok: true as const,
    pending: record.pending === true,
    registrationId: text(record.registrationId, 80),
    price: amount(record.price) ?? 0,
  };
}

export async function confirmEventPayment(registrationId: string) {
  const target = storeId();
  if (!target) return { ok: false as const, reason: "האירוע לא זמין" };
  const payload = await rpc("confirm_store_event_payment", {
    target_store: target,
    registration_id: registrationId,
  });
  const record = recordOf(payload);
  const orderNumber = record?.orderNumber;
  const number = typeof orderNumber === "string" || typeof orderNumber === "number" ? String(orderNumber).trim() : "";
  if (!record || record.ok !== true) return { ok: false as const, reason: text(record?.reason, 300) || "התשלום לא נרשם" };
  return { ok: true as const, orderNumber: number };
}
