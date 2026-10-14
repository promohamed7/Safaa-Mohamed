import type { CSSProperties } from "react";
import Image from "next/image";
import type { Area, Faq, Package, Service, SiteSettings } from "@/lib/types";
import { mediaUrl } from "@/lib/supabase/config";
import { whatsappLink } from "@/lib/whatsapp";
import { Section } from "./Section";
import { Motif } from "./Motifs";
import { Bloom, Sprig } from "./Ornaments";
import { PackageTabs } from "./PackageTabs";
import { HomeIcon, PinIcon, WhatsAppIcon } from "./icons";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function About({ settings }: { settings: SiteSettings }) {
  if (!settings.about_body.trim()) return null;
  const photo = mediaUrl(settings.about_image_path);
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 md:py-28">
      <div className="shell grid items-center gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div className="relative mx-auto w-full max-w-[360px] pb-16 md:pb-10">
          <div className="arch reveal relative aspect-[3/4] w-[78%] border-[6px] border-card bg-blush shadow-[0_30px_60px_-36px_rgb(147_71_90/0.5)]">
            {photo ? (
              <Image src={photo} alt={settings.brand_name} fill sizes="(min-width: 768px) 280px, 70vw" className="object-cover" />
            ) : (
              <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_50%_40%,var(--card),var(--blush)_75%)]">
                <Sprig className="h-[72%] w-auto text-rose" />
              </div>
            )}
          </div>
          {/* The sage arch card: every girl has her own style. */}
          <div className="arch reveal absolute bottom-0 left-0 grid w-[58%] justify-items-center gap-1 border-[6px] border-card bg-sage px-4 pt-6 pb-5 text-center text-white shadow-[0_30px_60px_-30px_rgb(59_68_33/0.55)]" style={d(160)}>
            <Motif slot={2} className="h-24 w-full text-olive-deep md:h-28" strokeWidth={1.8} />
            <p className="script text-[22px] text-white md:text-[24px]">لكل بنت ستايلها</p>
            <p className="text-[12px] leading-snug text-white/90">نقشة بسيطة أو ليلة حنة كاملة</p>
          </div>
        </div>
        <div className="grid justify-items-start gap-4">
          <span className="eyebrow reveal">{settings.city}</span>
          <p className="script reveal text-[28px] md:text-[34px]" style={d(60)}>الحلو يستاهل الانتظار</p>
          <h2 id="about-title" className="display reveal text-[34px] md:text-[46px]" style={d(120)}>{settings.about_title}</h2>
          <p className="reveal max-w-[60ch] whitespace-pre-line text-[17px] text-ink-2 md:text-[18px]" style={d(180)}>{settings.about_body}</p>
          <a href="#packages" className="btn btn-ghost reveal mt-2" style={d(240)}>شوفي الباقات</a>
        </div>
      </div>
    </section>
  );
}

const SERVICE_TINTS = ["bg-blush", "bg-sage-soft", "bg-paper-2", "bg-blush-2/60"];

export function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null;
  return (
    <Section id="services" eyebrow="ما أقدّمه" script="لكل مناسبة نقشتها" title="كل أنواع الحنة" intro="اختاري النوع الذي يناسب مناسبتك، أو اطلبي نقشة خاصة بكِ." tone="tinted">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {services.map((s, i) => {
          const photo = mediaUrl(s.image_path);
          return (
            <li key={s.id} className="reveal group grid content-start gap-3 text-center" style={d((i % 4) * 70)}>
              <div className={`arch relative aspect-[3/4] border-[5px] border-card shadow-[0_24px_40px_-28px_rgb(147_71_90/0.45)] ${SERVICE_TINTS[i % SERVICE_TINTS.length]}`}>
                {photo ? (
                  <Image src={photo} alt={s.title} fill sizes="(min-width: 1024px) 270px, (min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                ) : (
                  <div className="grid size-full place-items-center">
                    {i % 2 ? <Bloom className="h-[64%] w-auto text-olive/70" /> : <Sprig className={`h-[62%] w-auto text-rose/80 ${i % 4 === 2 ? "-scale-x-100" : ""}`} />}
                  </div>
                )}
              </div>
              <h3 className="display text-[19px] leading-snug md:text-[22px]">{s.title}</h3>
              {s.description && <p className="text-[14px] leading-relaxed text-ink-2 md:text-[15px]">{s.description}</p>}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function Packages({ packages, settings, areas }: { packages: Package[]; settings: SiteSettings; areas: Area[] }) {
  if (packages.length === 0) return null;
  // Group by henna type, in the order each type first appears.
  const groups: { name: string; packages: Package[] }[] = [];
  for (const p of packages) {
    const name = p.category.trim();
    const group = groups.find((g) => g.name === name);
    if (group) group.packages.push(p);
    else groups.push({ name, packages: [p] });
  }
  const visitNote = settings.home_visits ? areas.find((a) => a.note.trim())?.note : undefined;
  return (
    <Section id="packages" eyebrow="الباقات والأسعار" script="دلّعي نفسك" title="اختاري باقتك" intro={groups.length > 1 ? "الأسعار تختلف حسب نوع الحنة، اختاري النوع ثم الباقة." : "اختاري الباقة التي تناسبكِ، ولأي سؤال عن النقشة راسليني على واتساب."} tone="blush">
      <PackageTabs groups={groups} settings={settings} />
      {visitNote && (
        <p className="reveal mx-auto mt-10 flex max-w-2xl items-center justify-center gap-2 text-center text-[14px] text-ink-2">
          <HomeIcon className="shrink-0 text-rose" />
          {visitNote}
        </p>
      )}
    </Section>
  );
}

export function Areas({ areas, settings }: { areas: Area[]; settings: SiteSettings }) {
  if (areas.length === 0) return null;
  return (
    <Section id="areas" eyebrow={settings.home_visits ? "زيارات منزلية" : "أماكن العمل"} title="أصل إليكِ في">
      <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
        {areas.map((a, i) => (
          <li key={a.id} className="reveal flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-line bg-card px-6 py-3 shadow-[0_14px_30px_-24px_rgb(147_71_90/0.5)]" style={d(i * 50)}>
            {settings.home_visits ? <HomeIcon className="text-rose" /> : <PinIcon className="text-rose" />}
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
    <Section id="faq" eyebrow="أسئلة متكررة" script="قبل ما تحجزي" title="كل اللي محتاجة تعرفيه">
      <div className="mx-auto grid max-w-3xl gap-3">
        {faqs.map((f, i) => (
          <details key={f.id} className="reveal group rounded-[22px] border border-line bg-card px-6 py-1 transition-colors open:border-blush-2 open:bg-blush/40 open:pb-4" style={d(i * 60)}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
              {f.question}
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-blush text-rose-deep transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="whitespace-pre-line text-[16px] text-ink-2">{f.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/** The closing invitation before the footer. */
export function CtaBand({ settings }: { settings: SiteSettings }) {
  return (
    <section aria-labelledby="cta-title" className="px-4 pb-20 md:pb-28">
      <div className="reveal relative mx-auto max-w-[1120px] overflow-hidden rounded-[36px] bg-olive-deep px-6 py-16 text-center text-paper md:rounded-[48px] md:py-20">
        <Sprig className="sway pointer-events-none absolute -bottom-6 left-2 h-52 w-auto text-sage/60 md:left-12 md:h-64" />
        <Sprig className="sway pointer-events-none absolute -bottom-6 right-2 h-44 w-auto -scale-x-100 text-sage/60 md:right-12 md:h-56" style={{ animationDelay: "-3.5s" }} />
        <Motif slot={3} className="pointer-events-none absolute top-8 right-10 hidden h-36 w-auto text-sage/30 lg:block" strokeWidth={1.2} />
        <div className="relative mx-auto grid max-w-xl justify-items-center gap-4">
          <p className="script text-[28px] text-blush-2 md:text-[34px]">يلا نرسم حاجة حلوة</p>
          <h2 id="cta-title" className="display text-[32px] leading-tight md:text-[46px]">جاهزة لإطلالة حنة جديدة؟</h2>
          <p className="text-[16px] text-paper/80 md:text-[17px]">ابعتي اسمك ورقم موبايلك واليوم اللي يناسبك، وأرد عليكِ لتأكيد الموعد.</p>
          <a href={whatsappLink(settings.whatsapp_phone, settings.booking_message)} target="_blank" rel="noopener noreferrer" className="btn btn-cream mt-2">
            <WhatsAppIcon className="text-wa" />
            احجزي على واتساب
          </a>
        </div>
      </div>
    </section>
  );
}
