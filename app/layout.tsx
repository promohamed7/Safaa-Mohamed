import type { Metadata, Viewport } from "next";
import { Aref_Ruqaa, El_Messiri, Great_Vibes, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

// Soft rounded headings, a handwritten accent for short phrases, and a Latin script for her signature.
const messiri = El_Messiri({ subsets: ["arabic", "latin"], weight: ["500", "600", "700"], variable: "--font-messiri", display: "swap" });
const ruqaa = Aref_Ruqaa({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-ruqaa", display: "swap" });
const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-vibes", display: "swap" });
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
  themeColor: "#fbf6f0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${messiri.variable} ${ruqaa.variable} ${vibes.variable} ${plex.variable}`}>
      <body>
        {/* Without JavaScript, nothing waits for a scroll reveal. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.draw [data-stroke]{stroke-dashoffset:0!important}.draw [data-dot],.draw [data-fill]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
