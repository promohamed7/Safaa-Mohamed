import type { SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";
import { Sprig } from "./Ornaments";
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
    <footer className="relative overflow-hidden border-t border-line bg-paper-2 pt-16 pb-28 text-ink md:pb-12">
      <Sprig className="pointer-events-none absolute -bottom-6 left-1/2 hidden h-52 w-auto -translate-x-1/2 text-sage/70 md:block" />
      <div className="shell relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div className="grid justify-items-start gap-3">
          <p className="display text-[36px] leading-none">{settings.brand_name}</p>
          <p className="signature text-[30px] text-rose" dir="ltr">Safaa Mohamed henna</p>
          <p className="text-ink-2">{settings.tagline} · {settings.city}</p>
          <a href={whatsappLink(settings.whatsapp_phone, settings.booking_message)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-olive no-underline hover:text-olive-deep">
            <WhatsAppIcon className="text-wa" />
            <span dir="ltr" className="tabular-nums">{settings.whatsapp_phone}</span>
          </a>
        </div>
        {socials.length > 0 && (
          <ul className="flex flex-wrap gap-2 md:justify-end">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-12 place-items-center rounded-full border border-blush-2 bg-card text-[20px] text-rose-deep transition-colors hover:border-rose-deep hover:bg-blush">
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="shell relative mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[13px] text-ink-3">
        <span>© {new Date().getFullYear().toLocaleString("ar-EG", { useGrouping: false })} {settings.brand_name}</span>
        <a href="https://inbyte.dev" target="_blank" rel="noopener" className="text-ink-3 no-underline hover:text-ink">
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
