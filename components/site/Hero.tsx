import type { CSSProperties } from "react";
import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import { mediaUrl } from "@/lib/supabase/config";
import { whatsappLink } from "@/lib/whatsapp";
import { Mandala } from "./Ornaments";
import { HomeIcon, PinIcon, WhatsAppIcon } from "./icons";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero({ settings, image, worksHref }: { settings: SiteSettings; image: string | null; worksHref: string }) {
  const photo = mediaUrl(image);
  return (
    <section id="top" className="relative overflow-hidden">
      {/* A large faint mandala turns slowly behind everything. */}
      <Mandala className="spin-slow pointer-events-none absolute -top-40 -left-44 w-[560px] text-gold/12 md:-left-24 md:w-[720px] md:text-gold/25" strokeWidth={0.6} />
      <div className="shell relative grid items-center gap-12 pt-10 pb-16 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:pt-16 md:pb-24">
        <div className="grid justify-items-start gap-6">
          <span className="eyebrow reveal" style={d(0)}>{settings.tagline}</span>
          <h1 className="display reveal text-[46px] text-ink md:text-[72px]" style={d(90)}>
            {settings.hero_title}
          </h1>
          {settings.hero_subtitle && (
            <p className="reveal max-w-[34ch] text-[17px] text-ink-2 md:text-[19px]" style={d(180)}>
              {settings.hero_subtitle}
            </p>
          )}
          <div className="reveal flex flex-wrap gap-3" style={d(270)}>
            <a href={whatsappLink(settings.whatsapp_phone, settings.booking_message)} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
              <WhatsAppIcon />
              احجزي موعدك على واتساب
            </a>
            <a href={worksHref} className="btn btn-ghost">شاهدي الأعمال</a>
          </div>
          <ul className="reveal flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-ink-2" style={d(360)}>
            <li className="flex items-center gap-1.5"><PinIcon className="text-henna" />{settings.city}</li>
            {settings.home_visits && <li className="flex items-center gap-1.5"><HomeIcon className="text-henna" />أصل إليكِ في البيت</li>}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="arch reveal relative aspect-[4/5] border border-line bg-paper-2 shadow-[0_40px_80px_-40px_rgb(107_39_17/0.45)]" style={d(120)}>
            {photo ? (
              <Image src={photo} alt={`نقشة حنة من أعمال ${settings.brand_name}`} fill priority sizes="(min-width: 768px) 420px, 90vw" className="object-cover" />
            ) : (
              <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_50%_40%,var(--henna-soft),transparent_70%)]">
                <Mandala className="w-[78%] text-henna" strokeWidth={1.2} />
              </div>
            )}
          </div>
          <Mandala className="float absolute -bottom-6 -right-4 w-28 rounded-full bg-paper p-2 text-gold md:-right-10 md:w-32" strokeWidth={1.4} />
        </div>
      </div>
    </section>
  );
}
