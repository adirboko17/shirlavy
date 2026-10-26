import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/lib/site";
import { Shell } from "@/components/shell";
import { RenovationGate } from "@/components/renovation-gate";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SHIR LAVY — Aesthetics & Academy",
    template: "%s — SHIR LAVY",
  },
  description: "קליניקת בוטיק לאיפור קבוע ואסתטיקה מתקדמת, ואקדמיה מקצועית לנשים.",
};

export const viewport: Viewport = {
  themeColor: "#8F6A4B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className={heebo.className}>
        <SiteProvider>
          <RenovationGate>
            <Shell>{children}</Shell>
          </RenovationGate>
        </SiteProvider>
      </body>
    </html>
  );
}
