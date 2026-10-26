"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fmt, richProducts, type RichProduct } from "./data";

export type CartItem = { key: string; id: string; variant: string | null; qty: number };

export type CartLine = CartItem & {
  unit: number;
  name: string;
  slot: string;
  meta: string;
  total: string;
};

type SiteValue = {
  products: RichProduct[];
  cart: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  mobile: boolean;
  width: number;
  cartOpen: boolean;
  menuOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  addToCart: (id: string, variant: string | null, qty?: number, open?: boolean) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
};

const SiteContext = createContext<SiteValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const products = useMemo(() => richProducts(), []);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, setWidth] = useState(1280);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sl-cart") || "null");
      if (Array.isArray(saved)) setCart(saved);
    } catch {
      /* ignore */
    }
    setReady(true);
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("sl-cart", JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart, ready]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen]);

  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);

  const lines: CartLine[] = cart
    .filter((c) => byId[c.id])
    .map((c) => {
      const p = byId[c.id];
      const v = p.variants?.find((x) => x.id === c.variant);
      const unit = p.price + (v ? v.add : 0);
      return {
        ...c,
        unit,
        name: p.name,
        slot: "p-" + p.id + "-1",
        meta: (v ? v.label : p.size || "") + " · " + fmt(unit),
        total: fmt(unit * c.qty),
      };
    });

  const count = lines.reduce((a, l) => a + l.qty, 0);
  const subtotal = lines.reduce((a, l) => a + l.unit * l.qty, 0);

  const addToCart = useCallback((id: string, variant: string | null, qty = 1, open = false) => {
    const key = id + "|" + (variant || "");
    setCart((prev) => {
      const ex = prev.find((c) => c.key === key);
      if (ex) return prev.map((c) => (c.key === key ? { ...c, qty: c.qty + qty } : c));
      return [...prev, { key, id, variant, qty }];
    });
    if (open) setCartOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) => (qty <= 0 ? prev.filter((c) => c.key !== key) : prev.map((c) => (c.key === key ? { ...c, qty } : c))));
  }, []);

  const value: SiteValue = {
    products,
    cart,
    lines,
    count,
    subtotal,
    mobile: width < 760,
    width,
    cartOpen,
    menuOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    openMenu: () => setMenuOpen(true),
    closeMenu: () => setMenuOpen(false),
    addToCart,
    setQty,
    clearCart: () => setCart([]),
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
