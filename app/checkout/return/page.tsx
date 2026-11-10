import type { Metadata } from "next";
import { PaymentReturn } from "@/components/payment-return";

export const metadata: Metadata = { title: "אישור תשלום" };

export default function Page() {
  return <PaymentReturn />;
}
