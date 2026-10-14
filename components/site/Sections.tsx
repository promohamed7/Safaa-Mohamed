import type { CSSProperties } from "react";
import Image from "next/image";
import type { Area, Faq, Package, Service, SiteSettings } from "@/lib/types";
import { mediaUrl } from "@/lib/supabase/config";
import { whatsappLink } from "@/lib/whatsapp";
import { Section } from "./Section";
import { Mandala } from "./Ornaments";
import { CheckIcon, HomeIcon, PinIcon, WhatsAppIcon } from "./icons";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const arabicNumber = (n: number) => n.toLocaleString("ar-EG");

export function About({ settings }: { settings: SiteSettings }) {
  if (!settings.about_body.trim()) return null;
  const photo = mediaUrl(settings.about_image_path);
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 md:py-28">
      <div className="shell grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <div className="relative mx-auto w-full max-w-[340px] md:order-last">
          {photo ? (
            <div className="arch reveal relative aspect-[3/4] border border-line">
              <Image src={photo} alt={settings.brand_name} fill sizes="(min-width: 768px) 340px, 80vw" className="object-cover" />
            </div>
          ) : (
            <Mandala className="mx-auto w-full max-w-[300px] text-henna/80" />
          )}
        </div>
        <div className="grid justify-items-start gap-5">
          <span className="eyebrow reveal">{settings.city}</span>
          <h2 id="about-title" className="display reveal text-[34px] md:text-[46px]" style={d(80)}>{settings.about_title}</h2>
          <p className="reveal max-w-[60ch] whitespace-pre-line text-[17px] text-ink-2 md:text-[18px]" style={d(160)}>{settings.about_body}</p>
        </div>
      </div>
    </section>
  );
}

export function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null;
  return (
    <Section id="services" eyebrow="ما أقدّمه" title="كل أنواع الحنة" intro="اختاري النوع الذي يناسب مناسبتك، أو اطلبي نقشة خاصة بكِ." tone="tinted">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const photo = mediaUrl(s.image_path);
          return (
            <li key={s.id} className="card reveal group overflow-hidden" style={d(i * 70)}>
              {photo && (
                <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
                  <Image src={photo} alt={s.title} fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </div>
              )}
              <div className="grid gap-2 p-6">
                <span className="display text-[28px] leading-none text-gold">{arabicNumber(i + 1)}</span>
                <h3 className="display text-[24px]">{s.title}</h3>
                {s.description && <p className="text-[15px] text-ink-2">{s.description}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function Packages({ packages, settings }: { packages: Package[]; settings: SiteSettings }) {
  if (packages.length === 0) return null;
  return (
    <Section id="packages" eyebrow="الباقات والأسعار" title="اختاري باقتك" intro="اختاري الباقة التي تناسبكِ، ولأي سؤال عن النقشة راسليني على واتساب.">
      <ul className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((p, i) => {
          const hot = p.is_featured;
          return (
            <li
              key={p.id}
              className={`reveal relative flex flex-col gap-5 rounded-[var(--radius)] border p-7 ${hot ? "border-henna bg-henna text-white shadow-[0_30px_60px_-30px_rgb(107_39_17/0.8)]" : "border-line bg-card"}`}
              style={d(i * 80)}
            >
              {hot && <span className="absolute -top-3 start-6 rounded-full bg-gold px-3 py-0.5 text-[12px] font-semibold text-white">الأكثر طلبًا</span>}
              <div className="grid gap-1">
                <h3 className="display text-[26px]">{p.name}</h3>
                {p.description && <p className={`text-[15px] ${hot ? "text-white/85" : "text-ink-2"}`}>{p.description}</p>}
              </div>
              <div className="flex flex-wrap items-baseline gap-x-2">
                {p.price_prefix && <span className={`text-[14px] ${hot ? "text-white/80" : "text-ink-3"}`}>{p.price_prefix}</span>}
                {p.price !== null && <span className="display text-[44px] leading-none">{arabicNumber(Number(p.price))}</span>}
                {p.price_note && <span className={`text-[15px] ${hot ? "text-white/85" : "text-ink-2"}`}>{p.price_note}</span>}
              </div>
              {p.features.length > 0 && (
                <ul className="grid gap-2.5 text-[15px]">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckIcon className={`mt-1.5 ${hot ? "text-white" : "text-henna"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={whatsappLink(settings.whatsapp_phone, `${settings.booking_message}\nالباقة: ${p.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn mt-auto ${hot ? "bg-white text-henna" : "btn-ghost"}`}
              >
                <WhatsAppIcon />
                اطلبي هذه الباقة
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function Areas({ areas, settings }: { areas: Area[]; settings: SiteSettings }) {
  if (areas.length === 0) return null;
  return (
    <Section id="areas" eyebrow={settings.home_visits ? "زيارات منزلية" : "أماكن العمل"} title="أصل إليكِ في">
      <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
        {areas.map((a, i) => (
          <li key={a.id} className="card reveal flex items-center gap-2.5 px-5 py-3" style={d(i * 50)}>
            {settings.home_visits ? <HomeIcon className="text-henna" /> : <PinIcon className="text-henna" />}
            <span className="font-semibold">{a.name}</span>
            {a.note && <span className="text-[13px] text-ink-3">· {a.note}</span>}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Faqs({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <Section id="faq" eyebrow="أسئلة متكررة" title="قبل أن تحجزي">
      <div className="mx-auto grid max-w-3xl gap-3">
        {faqs.map((f, i) => (
          <details key={f.id} className="card reveal group px-6 py-1 open:pb-4" style={d(i * 60)}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
              {f.question}
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-henna transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="whitespace-pre-line text-[16px] text-ink-2">{f.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
