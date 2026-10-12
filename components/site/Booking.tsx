"use client";

import { useId, useState, type FormEvent } from "react";
import type { Area, Service, SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

/**
 * No account and no server: the form writes a tidy WhatsApp message with the booking details,
 * and the visitor sends it from her own WhatsApp.
 */
export function BookingForm({ settings, services, areas }: { settings: SiteSettings; services: Service[]; areas: Area[] }) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    if (!get("name")) {
      setError("اكتبي اسمك من فضلك.");
      return;
    }
    setError(null);
    const date = get("date") ? new Date(`${get("date")}T12:00:00`).toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" }) : "";
    const lines = [
      settings.booking_message,
      `الاسم: ${get("name")}`,
      get("occasion") && `المناسبة: ${get("occasion")}`,
      date && `التاريخ: ${date}`,
      get("area") && `المنطقة: ${get("area")}`,
      get("notes") && `ملاحظات: ${get("notes")}`,
    ].filter(Boolean);
    window.open(whatsappLink(settings.whatsapp_phone, lines.join("\n")), "_blank", "noopener");
  };

  return (
    <form onSubmit={submit} noValidate className="card grid gap-4 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${id}-name`}>الاسم</label>
          <input id={`${id}-name`} name="name" autoComplete="name" className="input" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-date`}>تاريخ المناسبة</label>
          <input id={`${id}-date`} name="date" type="date" className="input" />
        </div>
        <div className="field">
          <label htmlFor={`${id}-occasion`}>نوع الحنة</label>
          <select id={`${id}-occasion`} name="occasion" className="input" defaultValue="">
            <option value="">اختاري…</option>
            {services.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
            <option value="أخرى">أخرى</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${id}-area`}>المنطقة</label>
          {areas.length > 0 ? (
            <select id={`${id}-area`} name="area" className="input" defaultValue="">
              <option value="">اختاري…</option>
              {areas.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
              <option value="منطقة أخرى">منطقة أخرى</option>
            </select>
          ) : (
            <input id={`${id}-area`} name="area" className="input" placeholder={settings.city} />
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${id}-notes`}>ملاحظات (اختياري)</label>
        <textarea id={`${id}-notes`} name="notes" className="input" placeholder="مثلًا: النقشة التي أعجبتكِ أو عدد الأشخاص" />
      </div>
      {error && <p id={`${id}-err`} role="alert" className="text-[14px] text-henna">{error}</p>}
      <button type="submit" className="btn btn-wa w-full sm:w-fit">
        <WhatsAppIcon />
        أرسلي الطلب على واتساب
      </button>
    </form>
  );
}
