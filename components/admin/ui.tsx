"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { removeImages, uploadImage } from "@/lib/admin/images";
import { mediaUrl } from "@/lib/supabase/config";

/* ---------- Toast ---------- */

type Toast = { tone: "ok" | "error"; text: string } | null;
const ToastContext = createContext<(tone: "ok" | "error", text: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast>(null);
  const timer = useRef(0);
  const show = useCallback((tone: "ok" | "error", text: string) => {
    window.clearTimeout(timer.current);
    setToast({ tone, text });
    timer.current = window.setTimeout(() => setToast(null), tone === "ok" ? 2200 : 6000);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div
          role={toast.tone === "error" ? "alert" : "status"}
          className={`fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-2xl px-4 py-3 text-center text-[15px] font-semibold shadow-xl md:bottom-6 ${toast.tone === "error" ? "bg-henna text-white" : "bg-ink text-paper"}`}
          style={{ animation: "lb-fade 180ms ease-out" }}
        >
          {toast.text}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/* ---------- Fields ---------- */

export function Field({ label, help, children }: { label: string; help?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children(id)}
      {help && <p className="text-[13px] text-ink-3">{help}</p>}
    </div>
  );
}

export function TextInput({ label, help, value, onChange, type = "text", dir, placeholder }: { label: string; help?: string; value: string; onChange: (v: string) => void; type?: string; dir?: "ltr" | "rtl"; placeholder?: string }) {
  return (
    <Field label={label} help={help}>
      {(id) => <input id={id} type={type} dir={dir} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="input" />}
    </Field>
  );
}

export function TextArea({ label, help, value, onChange, rows = 4 }: { label: string; help?: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <Field label={label} help={help}>
      {(id) => <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="input" />}
    </Field>
  );
}

export function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-card px-4">
      <span className="text-[15px] font-semibold">{label}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span aria-hidden className="relative h-7 w-12 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-henna peer-focus-visible:outline-2 peer-focus-visible:outline-gold after:absolute after:top-1 after:right-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:-translate-x-5" />
    </label>
  );
}

/** A list of short lines, one per row, such as the features of a package. */
export function LinesInput({ label, help, value, onChange }: { label: string; help?: string; value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <Field label={label} help={help ?? "كل سطر يظهر كنقطة منفصلة."}>
      {(id) => (
        <textarea
          id={id}
          rows={Math.max(3, value.length + 1)}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean));
          }}
          className="input"
        />
      )}
    </Field>
  );
}

/** One picture: preview, upload a new one (shrunk first), or remove it. */
export function ImageInput({ label, help, folder, value, onChange }: { label: string; help?: string; folder: string; value: string | null; onChange: (path: string | null, size?: { width: number; height: number }) => void }) {
  const id = useId();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const url = mediaUrl(value);
  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const up = await uploadImage(file, folder);
      const old = value;
      onChange(up.path, { width: up.width, height: up.height });
      void removeImages([old]);
    } catch (err) {
      toast("error", `تعذّر رفع الصورة: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="field">
      <span className="text-[13px] font-semibold text-ink-2">{label}</span>
      <div className="flex items-center gap-4">
        <div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-dashed border-line bg-paper-2">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- dashboard preview straight from storage
            <img src={url} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-[28px] text-ink-3">＋</span>
          )}
          {busy && <span className="absolute inset-0 grid place-items-center bg-card/80 text-[12px] font-semibold">جارٍ الرفع…</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <label htmlFor={id} className={`btn btn-ghost min-h-11 cursor-pointer px-4 text-[14px] ${busy ? "pointer-events-none opacity-50" : ""}`}>
            {url ? "تغيير الصورة" : "اختيار صورة"}
          </label>
          <input id={id} type="file" accept="image/*" className="sr-only" onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
          {url && (
            <button type="button" className="btn min-h-11 px-4 text-[14px] text-henna" onClick={() => { void removeImages([value]); onChange(null); }}>
              إزالة
            </button>
          )}
        </div>
      </div>
      {help && <p className="text-[13px] text-ink-3">{help}</p>}
    </div>
  );
}

export function PageTitle({ title, help, action }: { title: string; help?: string; action?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="grid gap-1">
        <h1 className="display text-[32px] leading-tight">{title}</h1>
        {help && <p className="max-w-[60ch] text-[15px] text-ink-2">{help}</p>}
      </div>
      {action}
    </header>
  );
}
