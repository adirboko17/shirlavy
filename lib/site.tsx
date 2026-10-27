"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { richProducts, type RichProduct } from "./data";

export type CartItem = { key: string; id: string; variant: string | null; qty: number };

export type CartLine = CartItem & {
  name: string;
  slot: string;
  meta: string;
};

type SiteValue = {
  products: RichProduct[];
  cart: CartItem[];
  lines: CartLine[];
  count: number;
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, setWidth] = useState(1280);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const noop = useCallback(() => {}, []);

  const value: SiteValue = {
    products,
    cart: [],
    lines: [],
    count: 0,
    mobile: width < 760,
    width,
    cartOpen: false,
    menuOpen,
    openCart: noop,
    closeCart: noop,
    openMenu: () => setMenuOpen(true),
    closeMenu: () => setMenuOpen(false),
    addToCart: noop,
    setQty: noop,
    clearCart: noop,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
