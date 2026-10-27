import type { Metadata } from "next";
import { HomePage } from "@/components/home";
import { getInstagramWallData } from "@/lib/instagram";

export const metadata: Metadata = { title: "SHIR LAVY — Aesthetics & Academy" };

export default async function Page() {
  const instagram = await getInstagramWallData();
  return <HomePage instagram={instagram} />;
}
