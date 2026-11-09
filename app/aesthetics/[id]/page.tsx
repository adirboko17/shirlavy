import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

export const metadata: Metadata = { title: "טיפולי אסתטיקה" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const section = id === "tightening" ? "firming" : id;
  if (!["laser", "firming", "medical"].includes(section)) notFound();
  permanentRedirect(`/aesthetics#${section}`);
}
