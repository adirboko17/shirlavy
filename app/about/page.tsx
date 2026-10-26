import type { Metadata } from "next";
import { AboutPage } from "@/components/about";

export const metadata: Metadata = { title: "נעים להכיר" };

export default function Page() {
  return <AboutPage />;
}
