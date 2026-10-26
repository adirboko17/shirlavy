import type { Metadata } from "next";
import { ProductPage } from "@/components/product";

export const metadata: Metadata = { title: "מוצר" };

export default function Page() {
  return <ProductPage />;
}
