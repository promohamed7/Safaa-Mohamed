import type { SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";
import { Blossom } from "./Ornaments";
import { WhatsAppIcon } from "./icons";

export function Header({ settings, links }: { settings: SiteSettings; links: { href: string; label: string }[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-paper/85 backdrop-blur-md">
      <div className="shell flex h-[68px] items-center gap-6">
        <a href="#top" className="flex items-center gap-2 no-underline">
          <Blossom className="size-5 text-rose" />
          <span className="display text-[23px] leading-none text-ink md:text-[25px]">{settings.brand_name}</span>
        </a>
        <nav aria-label="أقسام الصفحة" className="ms-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-3.5 py-2 text-[15px] text-ink-2 no-underline transition-colors hover:bg-blush hover:text-rose-deep">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={whatsappLink(settings.whatsapp_phone, settings.booking_message)} target="_blank" rel="noopener noreferrer" className="btn btn-olive ms-auto min-h-[42px] px-4 text-[14px] md:ms-0">
          <WhatsAppIcon />
          احجزي الآن
        </a>
      </div>
    </header>
  );
}
