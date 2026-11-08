import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { AestheticsPage } from "@/components/treatments";

export const metadata: Metadata = { title: "טיפולי אסתטיקה" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "tightening") permanentRedirect("/aesthetics/firming");

  return <AestheticsPage />;
}
