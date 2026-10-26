import type { Metadata } from "next";
import { BrowsPage } from "@/components/brows";

export const metadata: Metadata = { title: "טיפולי גבות" };

export default function Page() {
  return <BrowsPage />;
}
