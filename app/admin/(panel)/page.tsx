"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase/browser";

const TILES = [
  { href: "/admin/gallery", table: "gallery_items", title: "الأعمال", note: "صور النقوش" },
  { href: "/admin/packages", table: "packages", title: "الباقات والأسعار", note: "الأسعار وما تشمله كل باقة" },
  { href: "/admin/reviews", table: "reviews", title: "آراء العميلات", note: "صور الشاشة والتعليقات" },
  { href: "/admin/areas", table: "areas", title: "المناطق", note: "الأماكن التي تصلين إليها" },
  { href: "/admin/services", table: "services", title: "أنواع الحنة", note: "الخدمات في الموقع" },
  { href: "/admin/faq", table: "faqs", title: "الأسئلة المتكررة", note: "قبل أن تحجز العميلة" },
] as const;

export default function AdminHome() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const db = browserClient();
    let live = true;
    Promise.all(TILES.map((t) => db.from(t.table).select("id", { count: "exact", head: true }).then(({ count }) => [t.table, count ?? 0] as const))).then((pairs) => {
      if (live) setCounts(Object.fromEntries(pairs));
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <>
      <header className="mb-6 grid gap-1">
        <h1 className="display text-[34px]">أهلًا يا صفاء</h1>
        <p className="text-ink-2">كل ما تغيّرينه هنا يظهر في الموقع خلال ثوانٍ.</p>
      </header>
      <Link href="/admin/settings" className="card mb-4 flex items-center justify-between gap-4 bg-henna p-5 text-white no-underline">
        <span className="grid gap-0.5">
          <span className="display text-[22px]">بيانات الصفحة</span>
          <span className="text-[14px] text-white/80">العنوان والنبذة والصور ورقم واتساب والحسابات</span>
        </span>
        <span aria-hidden className="text-[22px]">←</span>
      </Link>
      <ul className="grid gap-3 sm:grid-cols-2">
        {TILES.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="card flex h-full items-center justify-between gap-4 p-5 no-underline transition-colors hover:border-gold">
              <span className="grid gap-0.5">
                <span className="text-[17px] font-semibold text-ink">{t.title}</span>
                <span className="text-[13px] text-ink-3">{t.note}</span>
              </span>
              <span className="display text-[30px] leading-none text-henna">{counts[t.table] !== undefined ? counts[t.table].toLocaleString("ar-EG") : "…"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
