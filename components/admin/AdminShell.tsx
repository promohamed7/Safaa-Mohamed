"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { browserClient } from "@/lib/supabase/browser";
import { supabaseConfigured } from "@/lib/supabase/config";
import { ToastProvider } from "./ui";

export const NAV = [
  { href: "/admin", label: "الرئيسية", icon: "M4 11 12 4l8 7v9h-5v-6H9v6H4z" },
  { href: "/admin/gallery", label: "الأعمال", icon: "M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4" },
  { href: "/admin/packages", label: "الباقات", icon: "M4 8h16v12H4zM8 8V5h8v3M4 13h16" },
  { href: "/admin/reviews", label: "الآراء", icon: "M5 5h14v10H9l-4 4zM9 9h6M9 12h4" },
  { href: "/admin/areas", label: "المناطق", icon: "M12 21s-7-6.1-7-11.5a7 7 0 1 1 14 0C19 14.9 12 21 12 21ZM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5" },
] as const;

type Gate = "checking" | "signed-out" | "not-admin" | "ok";

/**
 * Every dashboard page sits inside this: it sends visitors to the login page, refuses accounts
 * that are not in the admins table, and shows the navigation (a bottom bar on phones).
 * The database enforces the same rule on every write.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [gate, setGate] = useState<Gate>("checking");

  useEffect(() => {
    if (!supabaseConfigured) return;
    const db = browserClient();
    let live = true;
    const check = async () => {
      const { data } = await db.auth.getUser();
      if (!live) return;
      if (!data.user) {
        setGate("signed-out");
        router.replace("/admin/login");
        return;
      }
      const { data: admin } = await db.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
      if (live) setGate(admin ? "ok" : "not-admin");
    };
    void check();
    const { data: sub } = db.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.replace("/admin/login");
    });
    return () => {
      live = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    await browserClient().auth.signOut();
    router.replace("/admin/login");
  };

  if (!supabaseConfigured) {
    return <Notice title="لوحة التحكم غير مفعّلة" body="أضيفي إعدادات Supabase إلى متغيرات البيئة ثم أعيدي النشر." />;
  }
  if (gate === "checking" || gate === "signed-out") {
    return (
      <div className="grid min-h-dvh place-items-center" aria-busy="true">
        <span className="size-8 animate-spin rounded-full border-2 border-line border-t-henna" />
      </div>
    );
  }
  if (gate === "not-admin") {
    return (
      <Notice title="هذا الحساب ليس له صلاحية" body="سجّلتِ الدخول بحساب غير مسجّل كمسؤولة عن الموقع.">
        <button type="button" onClick={signOut} className="btn btn-ghost">تسجيل الخروج</button>
      </Notice>
    );
  }

  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <ToastProvider>
      <div className="min-h-dvh bg-paper md:grid md:grid-cols-[240px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-1 border-e border-line bg-card p-5 md:flex">
          <p className="display mb-6 text-[26px]">لوحة صفاء</p>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined} className={`flex h-12 items-center gap-3 rounded-2xl px-4 text-[15px] no-underline transition-colors ${active(n.href) ? "bg-henna text-white" : "text-ink-2 hover:bg-paper-2"}`}>
              <NavIcon d={n.icon} />
              {n.label}
            </Link>
          ))}
          <div className="mt-auto grid gap-1">
            <a href="/" target="_blank" className="flex h-11 items-center rounded-2xl px-4 text-[14px] text-ink-2 no-underline hover:bg-paper-2">عرض الموقع ↗</a>
            <button type="button" onClick={signOut} className="flex h-11 items-center rounded-2xl px-4 text-[14px] text-henna hover:bg-paper-2">تسجيل الخروج</button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur md:hidden">
            <span className="display text-[22px]">لوحة صفاء</span>
            <a href="/" target="_blank" className="text-[14px] font-semibold text-henna no-underline">عرض الموقع ↗</a>
          </header>
          <main className="mx-auto max-w-3xl px-4 pt-6 pb-32 md:px-8 md:pt-10 md:pb-16">{children}</main>
        </div>

        <nav aria-label="أقسام اللوحة" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
          <ul className="grid grid-cols-5">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={active(n.href) ? "page" : undefined} className={`flex h-16 flex-col items-center justify-center gap-1 text-[12px] no-underline ${active(n.href) ? "font-semibold text-henna" : "text-ink-3"}`}>
                  <NavIcon d={n.icon} />
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </ToastProvider>
  );
}

function NavIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Notice({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center px-5">
      <div className="card grid max-w-sm justify-items-center gap-3 p-8 text-center">
        <h1 className="display text-[26px]">{title}</h1>
        <p className="text-ink-2">{body}</p>
        {children}
      </div>
    </div>
  );
}
