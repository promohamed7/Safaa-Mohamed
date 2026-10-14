import { getSiteContent } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/config";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About, Areas, Faqs, Packages, Services } from "@/components/site/Sections";
import { Section } from "@/components/site/Section";
import { Gallery } from "@/components/site/Gallery";
import { Reviews } from "@/components/site/Reviews";
import { BookingForm } from "@/components/site/Booking";
import { Footer, WhatsAppFab } from "@/components/site/Footer";
import { MotionObserver } from "@/components/site/MotionObserver";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/site/icons";

// Cached for an hour; saving anything in /admin refreshes it straight away (app/admin/actions.ts).
export const revalidate = 3600;

export default async function Home() {
  const { settings, services, packages, areas, gallery, reviews, faqs } = await getSiteContent();
  const heroImage = settings.hero_image_path ?? gallery[0]?.image_path ?? null;

  const links = [
    services.length > 0 && { href: "#services", label: "الخدمات" },
    gallery.length > 0 && { href: "#gallery", label: "الأعمال" },
    packages.length > 0 && { href: "#packages", label: "الباقات" },
    reviews.length > 0 && { href: "#reviews", label: "آراء العميلات" },
    { href: "#booking", label: "الحجز" },
  ].filter(Boolean) as { href: string; label: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: settings.brand_name,
    description: settings.hero_subtitle,
    telephone: settings.whatsapp_phone,
    address: { "@type": "PostalAddress", addressLocality: "مدينة السادات", addressRegion: "المنوفية", addressCountry: "EG" },
    areaServed: areas.map((a) => a.name),
    image: mediaUrl(heroImage) ?? undefined,
    sameAs: [settings.instagram_url, settings.facebook_url, settings.tiktok_url, settings.youtube_url, settings.threads_url].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Header settings={settings} links={links} />
      <main>
        <Hero settings={settings} image={settings.hero_image_path} worksHref={gallery.length > 0 ? "#gallery" : "#services"} />
        <About settings={settings} />
        <Services services={services} />
        {gallery.length > 0 && (
          <Section id="gallery" eyebrow="من أعمالي" title="نقوش رسمتها" intro="اضغطي على أي صورة لعرضها بالحجم الكامل.">
            <Gallery items={gallery} brand={settings.brand_name} />
          </Section>
        )}
        <Packages packages={packages} settings={settings} />
        {reviews.length > 0 && (
          <Section id="reviews" eyebrow="آراء العميلات" title="قلن عن الحنة" tone="tinted">
            <Reviews reviews={reviews} />
          </Section>
        )}
        <Areas areas={areas} settings={settings} />
        <section id="booking" aria-labelledby="booking-title" className="bg-paper-2 py-20 md:py-28">
          <div className="shell grid items-start gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <div className="grid justify-items-start gap-5 md:sticky md:top-28">
              <span className="eyebrow reveal">الحجز</span>
              <h2 id="booking-title" className="display reveal text-[34px] md:text-[48px]">احجزي موعدك</h2>
              <p className="reveal max-w-[44ch] text-[17px] text-ink-2">
                اكتبي التفاصيل وسيفتح واتساب برسالة جاهزة، أو راسليني مباشرة وسأرد عليكِ لتأكيد الموعد.
              </p>
              <a href={whatsappLink(settings.whatsapp_phone, settings.booking_message)} target="_blank" rel="noopener noreferrer" className="reveal inline-flex items-center gap-2 text-[17px] font-semibold text-wa no-underline">
                <WhatsAppIcon />
                <span dir="ltr" className="tabular-nums">{settings.whatsapp_phone}</span>
              </a>
            </div>
            <div className="reveal">
              <BookingForm settings={settings} services={services} areas={areas} />
            </div>
          </div>
        </section>
        <Faqs faqs={faqs} />
      </main>
      <Footer settings={settings} />
      <WhatsAppFab settings={settings} />
      <MotionObserver />
    </>
  );
}
