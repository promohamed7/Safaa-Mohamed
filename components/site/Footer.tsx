import type { SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";
import { Mandala } from "./Ornaments";
import { FacebookIcon, InstagramIcon, ThreadsIcon, TikTokIcon, WhatsAppIcon, YouTubeIcon } from "./icons";

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: settings.instagram_url, label: "إنستجرام", Icon: InstagramIcon },
    { href: settings.tiktok_url, label: "تيك توك", Icon: TikTokIcon },
    { href: settings.facebook_url, label: "فيسبوك", Icon: FacebookIcon },
    { href: settings.youtube_url, label: "يوتيوب", Icon: YouTubeIcon },
    { href: settings.threads_url, label: "ثريدز", Icon: ThreadsIcon },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden bg-ink pt-16 pb-28 text-paper md:pb-12">
      <Mandala className="pointer-events-none absolute -bottom-40 -left-32 w-[420px] text-gold/20" strokeWidth={0.7} />
      <div className="shell relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div className="grid justify-items-start gap-4">
          <p className="display text-[36px] leading-none">{settings.brand_name}</p>
          <p className="text-paper/70">{settings.tagline} · {settings.city}</p>
          <a href={whatsappLink(settings.whatsapp_phone, settings.booking_message)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-paper no-underline hover:text-white">
            <WhatsAppIcon className="text-[#4cd17f]" />
            <span dir="ltr" className="tabular-nums">{settings.whatsapp_phone}</span>
          </a>
        </div>
        {socials.length > 0 && (
          <ul className="flex flex-wrap gap-2 md:justify-end">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-12 place-items-center rounded-full border border-paper/15 text-[20px] text-paper/85 transition-colors hover:border-gold hover:text-gold">
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="shell relative mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 pt-6 text-[13px] text-paper/55">
        <span>© {new Date().getFullYear().toLocaleString("ar-EG", { useGrouping: false })} {settings.brand_name}</span>
        <a href="https://inbyte.dev" target="_blank" rel="noopener" className="text-paper/55 no-underline hover:text-paper">
          تصميم وتطوير <span className="font-semibold tracking-wide" dir="ltr">INBYTE</span>
        </a>
      </div>
    </footer>
  );
}

/** The floating WhatsApp button on phones. */
export function WhatsAppFab({ settings }: { settings: SiteSettings }) {
  return (
    <a
      href={whatsappLink(settings.whatsapp_phone, settings.booking_message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصلي على واتساب"
      className="wa-pulse fixed bottom-5 left-5 z-40 grid size-14 place-items-center rounded-full bg-wa text-[26px] text-white shadow-lg md:hidden"
    >
      <WhatsAppIcon />
    </a>
  );
}
