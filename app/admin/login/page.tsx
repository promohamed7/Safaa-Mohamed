"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { browserClient } from "@/lib/supabase/browser";
import { supabaseConfigured } from "@/lib/supabase/config";
import { Mandala } from "@/components/site/Ornaments";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigured) return setError("لوحة التحكم غير مفعّلة بعد.");
    setBusy(true);
    setError(null);
    const { error: err } = await browserClient().auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) return setError(err.message.includes("Invalid") ? "البريد أو كلمة المرور غير صحيحة." : err.message);
    router.replace("/admin");
  };

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-5">
      <Mandala className="spin-slow pointer-events-none absolute -top-32 -left-32 w-[460px] text-gold/20 is-in" strokeWidth={0.6} />
      <form onSubmit={submit} className="card relative grid w-full max-w-sm gap-4 p-7">
        <div className="grid gap-1 text-center">
          <h1 className="display text-[30px]">لوحة صفاء</h1>
          <p className="text-[15px] text-ink-2">سجّلي الدخول لتعديل الموقع</p>
        </div>
        <div className="field">
          <label htmlFor="email">البريد الإلكتروني</label>
          <input id="email" type="email" dir="ltr" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        </div>
        <div className="field">
          <label htmlFor="password">كلمة المرور</label>
          <input id="password" type="password" dir="ltr" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
        </div>
        {error && <p role="alert" className="text-[14px] font-semibold text-henna">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full disabled:opacity-60">{busy ? "جارٍ الدخول…" : "دخول"}</button>
      </form>
    </main>
  );
}
