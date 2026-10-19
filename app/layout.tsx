import type { Metadata, Viewport } from "next";
import { Assistant, Heebo, Marcellus } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "600"],
  variable: "--font-assistant",
  display: "swap",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["200", "300"],
  variable: "--font-heebo",
  display: "swap",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SHIR LAVY — Aesthetics & Academy",
  description: "SHIR LAVY Aesthetics & Academy — האתר החדש בדרך.",
};

export const viewport: Viewport = {
  themeColor: "#A47B58",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${assistant.variable} ${heebo.variable} ${marcellus.variable}`}
    >
      <body className={assistant.className}>{children}</body>
    </html>
  );
}
