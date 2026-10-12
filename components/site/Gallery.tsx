"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/types";
import { mediaUrl } from "@/lib/supabase/config";
import { useLightbox } from "./Lightbox";

/** Masonry of her work with optional category filters; a tap opens the photo full screen. */
export function Gallery({ items, brand }: { items: GalleryItem[]; brand: string }) {
  const categories = useMemo(() => [...new Set(items.map((i) => i.category.trim()).filter(Boolean))], [items]);
  const [filter, setFilter] = useState<string | null>(null);
  const shown = filter ? items.filter((i) => i.category.trim() === filter) : items;
  const { open, view } = useLightbox(shown.map((i) => ({ src: mediaUrl(i.image_path)!, alt: i.caption || `نقشة حنة من أعمال ${brand}`, caption: i.caption })));

  return (
    <>
      {categories.length > 1 && (
        <div role="tablist" aria-label="تصنيف الأعمال" className="mb-8 flex flex-wrap justify-center gap-2">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "all"}
              role="tab"
              type="button"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${filter === c ? "border-henna bg-henna text-white" : "border-line bg-card text-ink-2 hover:text-ink"}`}
            >
              {c ?? "الكل"}
            </button>
          ))}
        </div>
      )}
      <ul className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
        {shown.map((item, i) => (
          <li key={item.id} className="reveal mb-3 break-inside-avoid md:mb-4" style={{ "--d": `${(i % 8) * 60}ms` } as CSSProperties}>
            <button type="button" onClick={() => open(i)} className="group relative block w-full overflow-hidden rounded-2xl border border-line bg-paper-2" aria-label={`عرض ${item.caption || "الصورة"}`}>
              <Image
                src={mediaUrl(item.image_path)!}
                alt={item.caption || `نقشة حنة من أعمال ${brand}`}
                width={item.width ?? 800}
                height={item.height ?? 1000}
                sizes="(min-width: 1024px) 280px, (min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.04]"
              />
              {item.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgb(28_16_10/0.75)] to-transparent px-3 pt-8 pb-2.5 text-start text-[13px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100">
                  {item.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {view}
    </>
  );
}
