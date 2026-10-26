import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutPage } from "@/components/checkout";

export const metadata: Metadata = { title: "תשלום" };

export default function Page() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
