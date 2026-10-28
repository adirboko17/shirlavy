import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { SiteProvider } from "@/lib/site";
import { Shell } from "@/components/shell";
import { RenovationGate } from "@/components/renovation-gate";
import { loadShop } from "@/lib/storely";
import { ShabbatGate } from "@/components/shabbat-gate";

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const shop = await loadShop((await headers()).get("host"));
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className={heebo.className}>
        <SiteProvider shop={shop}>
          <ShabbatGate>
            <RenovationGate>
              <Shell>{children}</Shell>
            </RenovationGate>
          </ShabbatGate>
        </SiteProvider>
      </body>
    </html>
  );
}
