import type { Metadata, Viewport } from "next";
import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });
const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "صفاء محمد | رسم حنة في مدينة السادات", template: "%s | صفاء محمد" },
  description: "رسامة حنة في مدينة السادات بالمنوفية: حنة العرائس والسهرات والسوداني والهندي وحنة الأطفال، مع زيارات منزلية والحجز عبر واتساب.",
  openGraph: { type: "website", locale: "ar_EG", siteName: "صفاء محمد" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f8f1e7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${plex.variable}`}>
      <body>
        {/* Without JavaScript, nothing waits for a scroll reveal. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.draw [data-stroke]{stroke-dashoffset:0!important}.draw [data-dot]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
