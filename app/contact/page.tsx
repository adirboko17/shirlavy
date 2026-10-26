import type { Metadata } from "next";
import { ContactPage } from "@/components/contact";

export const metadata: Metadata = { title: "יצירת קשר" };

export default function Page() {
  return <ContactPage />;
}
