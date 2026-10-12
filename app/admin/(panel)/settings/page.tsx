"use client";

import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase/browser";
import { refreshSite } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/types";
import { ImageInput, PageTitle, Switch, TextArea, TextInput, useToast } from "@/components/admin/ui";

type Editable = Omit<SiteSettings, "id" | "updated_at">;

export default function SettingsAdmin() {
  const db = browserClient();
  const toast = useToast();
  const [s, setS] = useState<Editable | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    db.from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data, error }) => {
        if (!live) return;
        if (error) toast("error", `تعذّر التحميل: ${error.message}`);
        else {
          const rest: Partial<SiteSettings> = { ...(data as SiteSettings) };
          delete rest.id;
          delete rest.updated_at;
          setS(rest as Editable);
        }
      });
    return () => {
      live = false;
    };
  }, [db, toast]);

  if (!s) return <div className="h-96 animate-pulse rounded-2xl bg-paper-2" aria-busy="true" />;

  const set = <K extends keyof Editable>(key: K) => (v: Editable[K]) => setS((x) => (x ? { ...x, [key]: v } : x));
  const url = (v: string) => v.trim() || null;

  const save = async () => {
    if (!s.brand_name.trim() || !s.whatsapp_phone.trim()) return toast("error", "الاسم ورقم واتساب مطلوبان");
    setBusy(true);
    const { error } = await db
      .from("site_settings")
      .update({
        ...s,
        instagram_url: url(s.instagram_url ?? ""),
        facebook_url: url(s.facebook_url ?? ""),
        tiktok_url: url(s.tiktok_url ?? ""),
        threads_url: url(s.threads_url ?? ""),
        youtube_url: url(s.youtube_url ?? ""),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    setBusy(false);
    if (error) return toast("error", `لم يتم الحفظ: ${error.message}`);
    toast("ok", "تم حفظ بيانات الصفحة");
    void refreshSite();
  };

  return (
    <>
      <PageTitle title="بيانات الصفحة" help="النصوص والصور الرئيسية وطرق التواصل." />
      <div className="grid gap-6">
        <Group title="أعلى الصفحة">
          <TextInput label="الاسم" value={s.brand_name} onChange={set("brand_name")} />
          <TextInput label="العبارة القصيرة" value={s.tagline} onChange={set("tagline")} />
          <TextInput label="العنوان الكبير" value={s.hero_title} onChange={set("hero_title")} />
          <TextArea label="النص تحت العنوان" value={s.hero_subtitle} onChange={set("hero_subtitle")} rows={3} />
          <ImageInput label="الصورة الرئيسية" help="إن تركتِها فارغة تظهر أول صورة من الأعمال." folder="site" value={s.hero_image_path} onChange={(p) => set("hero_image_path")(p)} />
        </Group>
        <Group title="عن صفاء">
          <TextInput label="العنوان" value={s.about_title} onChange={set("about_title")} />
          <TextArea label="النبذة" value={s.about_body} onChange={set("about_body")} rows={6} />
          <ImageInput label="صورة النبذة" help="اختياري، مثلًا صورتك أثناء الرسم." folder="site" value={s.about_image_path} onChange={(p) => set("about_image_path")(p)} />
        </Group>
        <Group title="الحجز والتواصل">
          <TextInput label="رقم واتساب" type="tel" dir="ltr" value={s.whatsapp_phone} onChange={set("whatsapp_phone")} help="بالصيغة الدولية، مثل +201012776533" />
          <TextArea label="رسالة الحجز الجاهزة" value={s.booking_message} onChange={set("booking_message")} rows={2} />
          <TextInput label="المدينة" value={s.city} onChange={set("city")} />
          <Switch label="أصل إلى البيوت" checked={s.home_visits} onChange={set("home_visits")} />
        </Group>
        <Group title="حسابات التواصل">
          <TextInput label="إنستجرام" type="url" dir="ltr" value={s.instagram_url ?? ""} onChange={set("instagram_url")} placeholder="https://" />
          <TextInput label="تيك توك" type="url" dir="ltr" value={s.tiktok_url ?? ""} onChange={set("tiktok_url")} placeholder="https://" />
          <TextInput label="فيسبوك" type="url" dir="ltr" value={s.facebook_url ?? ""} onChange={set("facebook_url")} placeholder="https://" />
          <TextInput label="يوتيوب" type="url" dir="ltr" value={s.youtube_url ?? ""} onChange={set("youtube_url")} placeholder="https://" />
          <TextInput label="ثريدز" type="url" dir="ltr" value={s.threads_url ?? ""} onChange={set("threads_url")} placeholder="https://" />
        </Group>
      </div>
      <div className="sticky bottom-20 z-20 mt-6 md:bottom-4">
        <button type="button" onClick={save} disabled={busy} className="btn btn-primary w-full shadow-xl disabled:opacity-60">{busy ? "جارٍ الحفظ…" : "حفظ التغييرات"}</button>
      </div>
    </>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card grid gap-4 p-5">
      <h2 className="display text-[22px]">{title}</h2>
      {children}
    </section>
  );
}
