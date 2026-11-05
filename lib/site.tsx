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
import { EMPTY_SHOP, type CartLine, type ShopSnapshot } from "./shop-model";

type SiteValue = {
  shop: ShopSnapshot;
  products: RichProduct[];
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
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  togglePolicy: (id: string, on: boolean) => void;
};

const SiteContext = createContext<SiteValue | null>(null);

export function SiteProvider({ shop = EMPTY_SHOP, children }: { shop?: ShopSnapshot; children: React.ReactNode }) {
  const products = useMemo(() => richProducts(), []);
  const storefront = useMemo(
    (): ShopSnapshot => ({
      ...EMPTY_SHOP,
      currency: shop.currency,
      events: shop.events,
      policies: shop.policies,
      popups: shop.popups,
      quiz: shop.quiz,
    }),
    [shop],
  );
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
    shop: storefront,
    products,
    cart: [],
    count: 0,
    mobile: width < 760,
    width,
    cartOpen: false,
    menuOpen,
    acceptedPolicies: [],
    openCart: noop,
    closeCart: noop,
    openMenu: () => setMenuOpen(true),
    closeMenu: () => setMenuOpen(false),
    setQty: noop,
    removeLine: noop,
    clearCart: noop,
    togglePolicy: noop,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
