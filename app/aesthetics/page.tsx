import type { Metadata } from "next";
import { AestheticsPage } from "@/components/treatments";

export const metadata: Metadata = { title: "טיפולי אסתטיקה" };

export default function Page() {
  return <AestheticsPage />;
}
