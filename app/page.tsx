import type { Metadata } from "next";
import { HomePage } from "@/components/home";

export const metadata: Metadata = { title: "SHIR LAVY — Aesthetics & Academy" };

export default function Page() {
  return <HomePage />;
}
