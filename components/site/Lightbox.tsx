"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Full-screen photo viewer on a native <dialog>: Escape and the back gesture close it,
 * arrow keys and a horizontal swipe move between photos (right-to-left order).
 */
export function useLightbox(items: LightboxItem[]) {
  const [index, setIndex] = useState<number | null>(null);
  const open = useCallback((i: number) => setIndex(i), []);
  const view = <Lightbox items={items} index={index} onIndex={setIndex} />;
  return { open, view };
}

function Lightbox({ items, index, onIndex }: { items: LightboxItem[]; index: number | null; onIndex: (i: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const startX = useRef<number | null>(null);
  const count = items.length;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  const step = useCallback((by: number) => onIndex(index === null ? null : (index + by + count) % count), [count, index, onIndex]);

  if (count === 0) return null;
  const item = index !== null ? items[index] : null;

  return (
    <dialog
      ref={ref}
      onClose={() => onIndex(null)}
      onKeyDown={(e) => {
        // In RTL the next photo is to the left.
        if (e.key === "ArrowLeft") step(1);
        if (e.key === "ArrowRight") step(-1);
      }}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 50) step(dx > 0 ? 1 : -1);
      }}
      onClick={(e) => e.target === e.currentTarget && onIndex(null)}
      className="m-0 size-full max-h-none max-w-none bg-transparent p-0 backdrop:bg-[rgb(28_16_10/0.92)]"
      aria-label="عرض الصورة"
    >
      {item && (
        <div className="grid size-full grid-rows-[auto_1fr_auto] text-white" style={{ touchAction: "pan-y" }}>
          <div className="flex items-center justify-between p-4">
            <span className="text-[14px] text-white/70">{(index! + 1).toLocaleString("ar-EG")} / {count.toLocaleString("ar-EG")}</span>
            <button type="button" onClick={() => onIndex(null)} className="grid size-11 place-items-center rounded-full bg-white/10 text-[22px]" aria-label="إغلاق">×</button>
          </div>
          <div className="relative mx-4" onClick={(e) => e.target === e.currentTarget && onIndex(null)}>
            <Image key={item.src} src={item.src} alt={item.alt} fill sizes="100vw" className="object-contain" style={{ animation: "lb-in 260ms ease-out" }} />
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <button type="button" onClick={() => step(-1)} className="grid size-12 place-items-center rounded-full bg-white/10 text-[22px]" aria-label="الصورة السابقة">→</button>
            <p className="min-w-0 flex-1 text-center text-[15px] text-white/85">{item.caption}</p>
            <button type="button" onClick={() => step(1)} className="grid size-12 place-items-center rounded-full bg-white/10 text-[22px]" aria-label="الصورة التالية">←</button>
          </div>
        </div>
      )}
    </dialog>
  );
}
