import type { Metadata } from "next";
import { ShopPage } from "@/components/shop";

export const metadata: Metadata = { title: "החנות" };

export default function Page() {
  return <ShopPage />;
}
