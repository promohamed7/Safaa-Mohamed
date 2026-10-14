"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Package, SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";
import { Blossom } from "./Ornaments";
import { WhatsAppIcon } from "./icons";

const arabicNumber = (n: number) => n.toLocaleString("ar-EG");

/** Packages grouped by henna type: one tab per type, and the cards of the chosen type. */
export function PackageTabs({ groups, settings }: { groups: { name: string; packages: Package[] }[]; settings: SiteSettings }) {
  const id = useId();
  const [active, setActive] = useState(0);
  // Cards fade in on the first scroll; after a tab change they show at once.
  const [switched, setSwitched] = useState(false);
  const choose = (i: number) => {
    setActive(i);
    setSwitched(true);
  };
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = groups[Math.min(active, groups.length - 1)];
  const withTabs = groups.length > 1;

  // Right to left: the left arrow moves to the next type.
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + groups.length) % groups.length;
    choose(next);
    tabs.current[next]?.focus();
  };

  return (
    <>
      {withTabs && (
        <div role="tablist" aria-label="نوع الحنة" onKeyDown={onKey} className="reveal mx-auto mb-10 grid w-full max-w-md auto-cols-fr grid-flow-col gap-1 rounded-full border border-blush-2 bg-card/80 p-1.5 sm:flex sm:w-fit sm:max-w-full">
          {groups.map((g, i) => (
            <button
              key={g.name || i}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${id}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls={`${id}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => choose(i)}
              className={`flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 text-[14px] font-semibold transition-colors sm:px-5 sm:text-[15px] ${i === active ? "bg-rose-deep text-white shadow-[0_10px_20px_-12px_rgb(147_71_90/0.9)]" : "text-ink-2 hover:bg-blush hover:text-rose-deep"}`}
            >
              <Blossom className={`size-3.5 shrink-0 max-sm:hidden ${i === active ? "text-blush-2" : "text-rose"}`} />
              {g.name || "باقات أخرى"}
            </button>
          ))}
        </div>
      )}

      <ul
        key={active}
        id={`${id}-panel`}
        role={withTabs ? "tabpanel" : undefined}
        aria-labelledby={withTabs ? `${id}-tab-${active}` : undefined}
        className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {group.packages.map((p, i) => {
          const hot = p.is_featured;
          const message = [settings.booking_message, group.name && `نوع الحنة: ${group.name}`, `الباقة: ${p.name}`].filter(Boolean).join("\n");
          return (
            <li
              key={p.id}
              className={`${switched ? "" : "reveal "}relative flex flex-col gap-4 rounded-[28px] border p-6 pt-8 ${hot ? "border-olive bg-olive text-paper shadow-[0_30px_60px_-30px_rgb(59_68_33/0.8)]" : "border-line bg-card shadow-[0_24px_50px_-36px_rgb(147_71_90/0.5)]"}`}
              style={{ "--d": `${i * 80}ms` } as CSSProperties}
            >
              {hot && <span className="absolute -top-3.5 start-6 rounded-full bg-rose px-3.5 py-1 text-[12px] font-semibold text-white shadow-md">الأكثر طلبًا</span>}
              <div className="grid gap-1">
                <h3 className="display flex items-center gap-2 text-[25px] leading-tight">
                  <Blossom className={`size-4 shrink-0 ${hot ? "text-blush-2" : "text-rose"}`} />
                  {p.name}
                </h3>
                {p.description && <p className={`text-[15px] ${hot ? "text-paper/85" : "text-ink-2"}`}>{p.description}</p>}
              </div>
              <div className={`flex flex-wrap items-baseline gap-x-2 border-y border-dashed py-3 ${hot ? "border-paper/25" : "border-blush-2"}`}>
                {p.price_prefix && <span className={`text-[14px] ${hot ? "text-paper/80" : "text-ink-3"}`}>{p.price_prefix}</span>}
                {p.price !== null && <span className="display text-[42px] leading-none">{arabicNumber(Number(p.price))}</span>}
                {p.price_note && <span className={`text-[15px] ${hot ? "text-paper/85" : "text-ink-2"}`}>{p.price_note}</span>}
              </div>
              {p.features.length > 0 && (
                <ul className="grid gap-2 text-[15px]">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span aria-hidden className={`mt-2.5 size-1.5 shrink-0 rounded-full ${hot ? "bg-blush-2" : "bg-rose"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <a href={whatsappLink(settings.whatsapp_phone, message)} target="_blank" rel="noopener noreferrer" className={`btn mt-auto ${hot ? "btn-cream" : "btn-ghost"}`}>
                <WhatsAppIcon className="text-wa" />
                اطلبي هذه الباقة
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
