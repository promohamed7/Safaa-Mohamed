import type { CSSProperties } from "react";
import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import { mediaUrl } from "@/lib/supabase/config";
import { whatsappLink } from "@/lib/whatsapp";
import { Motif } from "./Motifs";
import { Blossom, Sprig } from "./Ornaments";
import { HomeIcon, PinIcon, WhatsAppIcon } from "./icons";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero({ settings, image, worksHref }: { settings: SiteSettings; image: string | null; worksHref: string }) {
  const photo = mediaUrl(image);
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Soft blush light behind the page top. */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-32 size-[520px] rounded-full bg-blush/70 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-40 -right-40 size-[420px] rounded-full bg-sage-soft/80 blur-3xl" />

      <div className="shell relative grid items-center gap-14 pt-10 pb-16 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:pt-16 md:pb-24">
        <div className="grid justify-items-start gap-5">
          <span className="eyebrow reveal" style={d(0)}>
            <Blossom className="size-3.5 text-rose" />
            {settings.tagline}
          </span>
          <p className="script reveal text-[30px] md:text-[38px]" style={d(80)}>كل نقشة حكاية</p>
          <h1 className="display reveal text-[44px] leading-[1.2] text-ink md:text-[68px]" style={d(140)}>
            {settings.hero_title}
          </h1>
          {settings.hero_subtitle && (
            <p className="reveal max-w-[36ch] text-[17px] text-ink-2 md:text-[19px]" style={d(220)}>
              {settings.hero_subtitle}
            </p>
          )}
          <div className="reveal flex flex-wrap gap-3 pt-1" style={d(300)}>
            <a href={whatsappLink(settings.whatsapp_phone, settings.booking_message)} target="_blank" rel="noopener noreferrer" className="btn btn-olive">
              <WhatsAppIcon />
              احجزي موعدك على واتساب
            </a>
            <a href={worksHref} className="btn btn-ghost">شاهدي الأعمال</a>
          </div>
          <ul className="reveal flex flex-wrap gap-2 text-[14px] text-ink-2" style={d(380)}>
            <li className="flex items-center gap-1.5 rounded-full border border-line bg-card/70 px-3 py-1.5"><PinIcon className="text-rose" />{settings.city}</li>
            {settings.home_visits && <li className="flex items-center gap-1.5 rounded-full border border-line bg-card/70 px-3 py-1.5"><HomeIcon className="text-rose" />أصل إليكِ في البيت</li>}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[400px] md:max-w-[440px]">
          <Sprig className="sway pointer-events-none absolute -top-6 -left-10 h-48 w-auto text-sage md:-left-16 md:h-60" />
          <Sprig className="sway pointer-events-none absolute -right-8 bottom-10 h-36 w-auto -scale-x-100 text-sage md:-right-14 md:h-44" style={{ animationDelay: "-3s" }} />

          <div className="arch reveal relative aspect-[4/5] border-[6px] border-card bg-blush shadow-[0_40px_80px_-40px_rgb(147_71_90/0.5)]" style={d(120)}>
            {photo ? (
              <Image src={photo} alt={`نقشة حنة من أعمال ${settings.brand_name}`} fill priority sizes="(min-width: 768px) 440px, 90vw" className="object-cover" />
            ) : (
              <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_50%_38%,var(--card),var(--blush)_72%)] p-[12%] pt-[18%]">
                <Motif slot={0} className="h-full w-full text-rose-deep" strokeWidth={2} />
              </div>
            )}
          </div>

          <div className="float absolute -bottom-7 -left-3 grid size-28 place-items-center rounded-full border-[5px] border-card bg-sage-soft p-4 shadow-lg md:-left-8 md:size-32">
            <Motif slot={1} className="h-full w-full text-olive" strokeWidth={2.4} />
          </div>
          <p className="absolute -right-2 top-[18%] rotate-6 rounded-2xl border border-line bg-card px-4 py-2 shadow-md md:-right-8">
            <span className="script block text-[22px]">بإيد صفاء</span>
            <span className="signature block text-[18px] text-olive" dir="ltr">with love</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/** The henna types sliding slowly in a ribbon under the hero. */
export function Ribbon({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const row = (copy: number) => (
    <ul aria-hidden={copy > 0 || undefined} className="flex shrink-0 items-center gap-6 pe-6">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-6 whitespace-nowrap">
          <span className="display text-[18px] md:text-[20px]">{t}</span>
          <Blossom className="size-4 text-blush-2" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden bg-olive py-4 text-paper">
      <div className="marquee flex w-max">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
