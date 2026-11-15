import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import "./commerce.css";
import "./checkout.css";
import "./home.css";
import "./about.css";
import "./treatments.css";
import "./academy.css";
import "./contact.css";
import "./legal.css";
import { AccessibilityTools, CookiePreferences } from "@/components/legal-controls";
import { SiteProvider } from "@/lib/site";
import { Shell } from "@/components/shell";
import { loadShop } from "@/lib/storely";
import { ShabbatGate } from "@/components/shabbat-gate";
import { SITE_DESCRIPTION, SITE_EMAIL, SITE_NAME, SITE_URL, PHONE } from "@/lib/data";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#8F6A4B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const shop = await loadShop((await headers()).get("host"));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        alternateName: ["שיר לביא", "SHIR LAVY"],
        inLanguage: "he",
      },
      {
        "@type": ["BeautySalon", "EducationalOrganization"],
        "@id": `${SITE_URL}/#business`,
        name: SITE_NAME,
        alternateName: "SHIR LAVY",
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        email: SITE_EMAIL,
        telephone: `+${PHONE}`,
        image: `${SITE_URL}/assets/logo-gold.png`,
        inLanguage: "he",
      },
    ],
  };

  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className={heebo.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <SiteProvider shop={shop}>
          <ShabbatGate>
            <Shell>{children}</Shell>
          </ShabbatGate>
        </SiteProvider>
        <AccessibilityTools />
        <CookiePreferences />
      </body>
    </html>
  );
}
