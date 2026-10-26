import type { Metadata } from "next";
import { AcademyPage } from "@/components/academy";

export const metadata: Metadata = { title: "האקדמיה" };

export default function Page() {
  return <AcademyPage />;
}
