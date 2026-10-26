import type { Metadata } from "next";
import { RemovalPage } from "@/components/treatments";

export const metadata: Metadata = { title: "הסרת איפור קבוע" };

export default function Page() {
  return <RemovalPage />;
}
