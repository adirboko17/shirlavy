"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  EMPTY_SHOP,
  lineKey,
  storefrontLine,
  type CartLine,
  type ShopProduct,
  type ShopSnapshot,
} from "@/lib/shop-model";

type SiteValue = {
  shop: ShopSnapshot;
  products: ShopProduct[];
  cart: CartLine[];
  count: number;
  mobile: boolean;
  width: number;
  cartOpen: boolean;
  menuOpen: boolean;
  acceptedPolicies: string[];
  openCart: () => void;
  closeCart: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  addLine: (line: CartLine, open?: boolean, track?: boolean) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  togglePolicy: (id: string, on: boolean) => void;
};

const SiteContext = createContext<SiteValue | null>(null);
const CART_KEY = "shirlavy-cart";
const POLICY_KEY = "shirlavy-policies";

function readCart(): CartLine[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.variantId === "string" && typeof item.key === "string");
  } catch {
    return [];
  }
}

export function SiteProvider({ shop = EMPTY_SHOP, children }: { shop?: ShopSnapshot; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [width, setWidth] = useState(1280);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [acceptedPolicies, setAcceptedPolicies] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(readCart());
    try {
      const stored = JSON.parse(sessionStorage.getItem(POLICY_KEY) || "[]");
      if (Array.isArray(stored)) setAcceptedPolicies(stored.filter((item) => typeof item === "string"));
    } catch {
      /* ignore a broken session value */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(POLICY_KEY, JSON.stringify(acceptedPolicies));
  }, [acceptedPolicies, ready]);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen]);

  useEffect(() => {
    if (!ready || !cart.length) return;
    const timer = window.setTimeout(() => {
      const draft = readCustomerDraft();
      void fetch("/api/storely/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lines: cart.map(storefrontLine),
          shippingName: draft.shippingName,
          customer: draft,
        }),
      });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [cart, ready]);

  const addLine = useCallback((line: CartLine, open = true, track = true) => {
    setCart((current) => {
      const existing = current.find((item) => item.key === line.key);
      if (!existing) return [...current, line];
      return current.map((item) => (item.key === line.key ? { ...item, quantity: Math.min(99, item.quantity + line.quantity) } : item));
    });
    if (open) setCartOpen(true);
    if (!track) return;
    void fetch("/api/storely/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "add_to_cart", path: window.location.pathname }),
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.key !== key) return [item];
      if (qty < 1) return [];
      const step = item.bundle && item.bundleQty ? item.bundleQty : 1;
      const packs = Math.max(1, Math.round(qty / step));
      return [{ ...item, quantity: Math.min(99, packs * step) }];
    }));
  }, []);

  const removeLine = useCallback((key: string) => {
    setCart((current) => current.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const togglePolicy = useCallback((id: string, on: boolean) => {
    setAcceptedPolicies((current) => (on ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id)));
  }, []);

  const value = useMemo<SiteValue>(() => ({
    shop,
    products: shop.products,
    cart,
    count: cart.reduce((sum, item) => sum + item.quantity, 0),
    mobile: width < 760,
    width,
    cartOpen,
    menuOpen,
    acceptedPolicies,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    openMenu: () => setMenuOpen(true),
    closeMenu: () => setMenuOpen(false),
    addLine,
    setQty,
    removeLine,
    clearCart,
    togglePolicy,
  }), [shop, cart, width, cartOpen, menuOpen, acceptedPolicies, addLine, setQty, removeLine, clearCart, togglePolicy]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}

export function productLine(product: ShopProduct, variantId: string, packs = 1, bundleQty?: number): CartLine | null {
  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  if (!variant) return null;
  const bundle = bundleQty ? product.bundles.find((item) => item.qty === bundleQty) : undefined;
  const quantity = bundle ? bundle.qty * packs : packs;
  return {
    key: lineKey(variant.id, bundle?.qty),
    variantId: variant.id,
    productId: product.id,
    name: product.name,
    detail: bundle ? bundle.label : variant.title,
    image: bundle?.image || product.images[0] || "",
    unitPrice: bundle ? bundle.price : variant.price,
    quantity,
    bundle: Boolean(bundle),
    ...(bundle ? { bundleQty: bundle.qty } : {}),
    gift: false,
  };
}

export function readCustomerDraft() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem("shirlavy-customer") || "{}") as Record<string, unknown>;
    const text = (key: string) => (typeof parsed[key] === "string" ? parsed[key] as string : "");
    return {
      name: text("name"),
      email: text("email"),
      phone: text("phone"),
      street: text("street"),
      city: text("city"),
      zip: text("zip"),
      shippingName: text("shippingName"),
    };
  } catch {
    return { name: "", email: "", phone: "", street: "", city: "", zip: "", shippingName: "" };
  }
}

export function writeCustomerDraft(draft: ReturnType<typeof readCustomerDraft>) {
  sessionStorage.setItem("shirlavy-customer", JSON.stringify(draft));
}
