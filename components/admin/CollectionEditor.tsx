"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { browserClient } from "@/lib/supabase/browser";
import { mediaUrl } from "@/lib/supabase/config";
import { removeImages, uploadImage } from "@/lib/admin/images";
import { refreshSite } from "@/app/admin/actions";
import { ImageInput, LinesInput, PageTitle, Switch, TextArea, TextInput, useToast } from "./ui";

type Row = Record<string, unknown> & { id: string; sort_order: number; is_visible: boolean };

export type FieldDef =
  | { key: string; label: string; type: "text" | "textarea" | "number"; help?: string; required?: boolean; suggest?: boolean }
  | { key: string; label: string; type: "lines" | "switch"; help?: string }
  | { key: string; label: string; type: "image"; folder: string; help?: string; withSize?: boolean };

export interface CollectionConfig {
  table: string;
  title: string;
  help?: string;
  addLabel: string;
  emptyText: string;
  fields: FieldDef[];
  blank: Record<string, unknown>;
  summary: (row: Row) => { title: string; subtitle?: string; image?: string | null };
  /** Thumbnails in a grid (photos) instead of a list. */
  layout?: "list" | "grid";
  /** Pick several photos at once; each becomes a new row with only its image. */
  bulkUpload?: { label: string; folder: string };
}

/**
 * Add, edit, hide, reorder and delete the rows of one table. Every change is written straight to
 * Supabase (row level security allows it only for admins) and then refreshes the public page.
 */
export function CollectionEditor({ config }: { config: CollectionConfig }) {
  const toast = useToast();
  const db = browserClient();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<{ id: string | "new"; draft: Record<string, unknown> } | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(0);
  const bulkId = useId();

  const load = useCallback(async () => {
    const { data, error } = await db.from(config.table).select("*").order("sort_order").order("created_at");
    if (error) toast("error", `تعذّر التحميل: ${error.message}`);
    else setRows(data as Row[]);
  }, [config.table, db, toast]);

  useEffect(() => {
    let live = true;
    db.from(config.table)
      .select("*")
      .order("sort_order")
      .order("created_at")
      .then(({ data, error }) => {
        if (!live) return;
        if (error) toast("error", `تعذّر التحميل: ${error.message}`);
        else setRows(data as Row[]);
      });
    return () => {
      live = false;
    };
  }, [config.table, db, toast]);

  /** Run a change, then reload the list and refresh the public page. */
  const commit = async (task: () => PromiseLike<{ error: { message: string } | null }>, okText = "تم الحفظ") => {
    setBusy(true);
    const { error } = await task();
    setBusy(false);
    if (error) {
      toast("error", `لم يتم الحفظ: ${error.message}`);
      return false;
    }
    toast("ok", okText);
    await load();
    void refreshSite();
    return true;
  };

  const nextOrder = () => (rows?.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 1);

  const save = async () => {
    if (!editing) return;
    const missing = config.fields.find((f) => "required" in f && f.required && !String(editing.draft[f.key] ?? "").trim());
    if (missing) return toast("error", `اكتبي ${missing.label} أولًا`);
    const values: Record<string, unknown> = { is_visible: editing.draft.is_visible !== false };
    for (const f of config.fields) {
      values[f.key] = editing.draft[f.key];
      if (f.type === "number") values[f.key] = String(editing.draft[f.key] ?? "").trim() === "" ? null : Number(editing.draft[f.key]);
      if (f.type === "image" && f.withSize) {
        values.width = editing.draft.width ?? null;
        values.height = editing.draft.height ?? null;
      }
    }
    const ok =
      editing.id === "new"
        ? await commit(() => db.from(config.table).insert({ ...values, sort_order: nextOrder() }))
        : await commit(() => db.from(config.table).update(values).eq("id", editing.id));
    if (ok) setEditing(null);
  };

  const remove = async (row: Row) => {
    if (!window.confirm("حذف هذا العنصر نهائيًا؟")) return;
    const ok = await commit(() => db.from(config.table).delete().eq("id", row.id), "تم الحذف");
    if (ok) {
      void removeImages(config.fields.filter((f) => f.type === "image").map((f) => row[f.key] as string | null));
      setEditing(null);
    }
  };

  const toggle = (row: Row) => commit(() => db.from(config.table).update({ is_visible: !row.is_visible }).eq("id", row.id), row.is_visible ? "تم الإخفاء من الموقع" : "يظهر الآن في الموقع");

  const move = async (index: number, by: number) => {
    if (!rows) return;
    const to = index + by;
    if (to < 0 || to >= rows.length) return;
    const next = rows.slice();
    [next[index], next[to]] = [next[to], next[index]];
    setRows(next);
    const changed = next.map((r, i) => ({ id: r.id, sort_order: i + 1 })).filter((r, i) => next[i].sort_order !== r.sort_order);
    await commit(async () => {
      const results = await Promise.all(changed.map((c) => db.from(config.table).update({ sort_order: c.sort_order }).eq("id", c.id)));
      return { error: results.find((r) => r.error)?.error ?? null };
    }, "تم تغيير الترتيب");
  };

  const bulk = async (files: FileList | null) => {
    if (!files?.length || !config.bulkUpload) return;
    const list = Array.from(files);
    setUploading(list.length);
    let order = nextOrder();
    let failed = 0;
    for (const file of list) {
      try {
        const up = await uploadImage(file, config.bulkUpload.folder);
        const { error } = await db.from(config.table).insert({ ...config.blank, image_path: up.path, width: up.width, height: up.height, sort_order: order++ });
        if (error) throw new Error(error.message);
      } catch {
        failed++;
      } finally {
        setUploading((n) => n - 1);
      }
    }
    toast(failed ? "error" : "ok", failed ? `تعذّر رفع ${failed.toLocaleString("ar-EG")} من الصور` : `تمت إضافة ${list.length.toLocaleString("ar-EG")} صورة`);
    await load();
    void refreshSite();
  };

  const grid = config.layout === "grid";

  return (
    <>
      <PageTitle
        title={config.title}
        help={config.help}
        action={
          <div className="flex flex-wrap gap-2">
            {config.bulkUpload && (
              <>
                <label htmlFor={bulkId} className={`btn btn-primary cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}>
                  {uploading ? `جارٍ الرفع… (${uploading.toLocaleString("ar-EG")})` : config.bulkUpload.label}
                </label>
                <input id={bulkId} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { void bulk(e.target.files); e.target.value = ""; }} />
              </>
            )}
            <button type="button" onClick={() => setEditing({ id: "new", draft: { ...config.blank } })} className={`btn ${config.bulkUpload ? "btn-ghost" : "btn-primary"}`}>
              ＋ {config.addLabel}
            </button>
          </div>
        }
      />

      {rows === null ? (
        <div className="grid gap-3" aria-busy="true">
          {[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-paper-2" />)}
        </div>
      ) : rows.length === 0 && !uploading ? (
        <div className="card grid justify-items-center gap-2 p-10 text-center">
          <p className="text-ink-2">{config.emptyText}</p>
        </div>
      ) : (
        <ul className={grid ? "grid grid-cols-2 gap-3 sm:grid-cols-3" : "grid gap-3"}>
          {rows.map((row, i) => {
            const s = config.summary(row);
            const img = mediaUrl(s.image);
            const controls = (
              <div className="flex items-center gap-1">
                <IconButton label="تحريك للأمام" disabled={busy || i === 0} onClick={() => move(i, -1)}>{grid ? "→" : "↑"}</IconButton>
                <IconButton label="تحريك للخلف" disabled={busy || i === rows.length - 1} onClick={() => move(i, 1)}>{grid ? "←" : "↓"}</IconButton>
                <IconButton label={row.is_visible ? "إخفاء من الموقع" : "إظهار في الموقع"} disabled={busy} onClick={() => toggle(row)}>
                  {row.is_visible ? <EyeIcon /> : <EyeOffIcon />}
                </IconButton>
              </div>
            );
            return grid ? (
              <li key={row.id} className={`card overflow-hidden ${row.is_visible ? "" : "opacity-55"}`}>
                <button type="button" onClick={() => setEditing({ id: row.id, draft: { ...row } })} className="relative block aspect-square w-full bg-paper-2" aria-label={`تعديل ${s.title || "الصورة"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- dashboard thumbnail */}
                  {img && <img src={img} alt="" className="size-full object-cover" loading="lazy" />}
                  {!row.is_visible && <span className="absolute top-2 start-2 rounded-full bg-ink/80 px-2 py-0.5 text-[11px] text-white">مخفية</span>}
                </button>
                <div className="flex items-center justify-center p-1.5">{controls}</div>
              </li>
            ) : (
              <li key={row.id} className={`card flex items-center gap-3 p-3 ${row.is_visible ? "" : "opacity-60"}`}>
                <button type="button" onClick={() => setEditing({ id: row.id, draft: { ...row } })} className="flex min-w-0 flex-1 items-center gap-3 text-start">
                  {img && (
                    // eslint-disable-next-line @next/next/no-img-element -- dashboard thumbnail
                    <img src={img} alt="" className="size-14 shrink-0 rounded-xl object-cover" loading="lazy" />
                  )}
                  <span className="grid min-w-0 gap-0.5">
                    <span className="truncate font-semibold">{s.title || "بدون عنوان"}</span>
                    {s.subtitle && <span className="truncate text-[13px] text-ink-3">{s.subtitle}</span>}
                    {!row.is_visible && <span className="text-[12px] font-semibold text-henna">مخفي من الموقع</span>}
                  </span>
                </button>
                {controls}
              </li>
            );
          })}
          {Array.from({ length: uploading }, (_, i) => <li key={`up-${i}`} className="aspect-square animate-pulse rounded-2xl bg-paper-2" />)}
        </ul>
      )}

      {editing && (
        <Sheet title={editing.id === "new" ? config.addLabel : "تعديل"} onClose={() => !busy && setEditing(null)}>
          <div className="grid gap-4">
            {config.fields.map((f) => {
              const value = editing.draft[f.key];
              const set = (v: unknown, extra?: Record<string, unknown>) => setEditing((e) => (e ? { ...e, draft: { ...e.draft, [f.key]: v, ...extra } } : e));
              switch (f.type) {
                case "text":
                  return (
                    <TextInput
                      key={f.key}
                      label={f.label}
                      help={f.help}
                      value={String(value ?? "")}
                      onChange={set}
                      // Offer the values already used, so rows that belong together keep the same spelling.
                      suggestions={f.suggest ? [...new Set((rows ?? []).map((r) => String(r[f.key] ?? "").trim()).filter(Boolean))] : undefined}
                    />
                  );
                case "number":
                  return <TextInput key={f.key} label={f.label} help={f.help} type="number" dir="ltr" value={value === null || value === undefined ? "" : String(value)} onChange={set} />;
                case "textarea":
                  return <TextArea key={f.key} label={f.label} help={f.help} value={String(value ?? "")} onChange={set} />;
                case "lines":
                  return <LinesInput key={f.key} label={f.label} help={f.help} value={(value as string[]) ?? []} onChange={set} />;
                case "switch":
                  return <Switch key={f.key} label={f.label} checked={Boolean(value)} onChange={set} />;
                case "image":
                  return (
                    <ImageInput
                      key={f.key}
                      label={f.label}
                      help={f.help}
                      folder={f.folder}
                      value={(value as string | null) ?? null}
                      onChange={(path, size) => set(path, f.withSize ? { width: size?.width ?? null, height: size?.height ?? null } : undefined)}
                    />
                  );
              }
            })}
            <Switch label="يظهر في الموقع" checked={editing.draft.is_visible !== false} onChange={(v) => setEditing((e) => (e ? { ...e, draft: { ...e.draft, is_visible: v } } : e))} />
          </div>
          <div className="sticky bottom-0 -mx-5 mt-6 flex flex-wrap items-center gap-2 border-t border-line bg-card px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button type="button" onClick={save} disabled={busy} className="btn btn-primary flex-1 disabled:opacity-60">{busy ? "جارٍ الحفظ…" : "حفظ"}</button>
            <button type="button" onClick={() => setEditing(null)} disabled={busy} className="btn btn-ghost">إلغاء</button>
            {editing.id !== "new" && (
              <button type="button" onClick={() => rows && remove(rows.find((r) => r.id === editing.id)!)} disabled={busy} className="btn px-4 text-henna">حذف</button>
            )}
          </div>
        </Sheet>
      )}
    </>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid items-end bg-ink/50 md:items-center md:justify-center md:p-6" onClick={(e) => e.target === e.currentTarget && onClose()} style={{ animation: "lb-fade 160ms ease-out" }}>
      <div role="dialog" aria-modal="true" aria-label={title} className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-card px-5 pt-5 md:w-[560px] md:rounded-3xl" style={{ animation: "sheet-up 260ms cubic-bezier(0.22,1,0.36,1)" }}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="display text-[24px]">{title}</h2>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-paper-2 text-[20px]" aria-label="إغلاق">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className="grid size-10 place-items-center rounded-full text-[16px] text-ink-2 transition-colors hover:bg-paper-2 disabled:opacity-30">
      {children}
    </button>
  );
}

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
    <path d="M3 3l18 18M10.6 6a9.6 9.6 0 0 1 1.4-.1c6 0 9.5 6.1 9.5 6.1a17 17 0 0 1-3 3.6M6.4 7.6A16.4 16.4 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4-.9" />
  </svg>
);
