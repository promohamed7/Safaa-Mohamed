"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/types";
import { mediaUrl } from "@/lib/supabase/config";
import { useLightbox } from "./Lightbox";

// Collage rhythm: a big square, then small and tall tiles, repeating every six photos.
const TILE = ["col-span-2 row-span-2", "", "", "row-span-2", "", ""];

/** A collage of her work with optional category filters; a tap opens the photo full screen. */
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
              className={`min-h-10 rounded-full border px-4 text-[14px] font-semibold transition-colors ${filter === c ? "border-rose-deep bg-rose-deep text-white" : "border-blush-2 bg-card text-ink-2 hover:bg-blush hover:text-rose-deep"}`}
            >
              {c ?? "الكل"}
            </button>
          ))}
        </div>
      )}
      <ul className="grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
        {shown.map((item, i) => (
          <li key={item.id} className={`reveal ${TILE[i % TILE.length]}`} style={{ "--d": `${(i % 8) * 60}ms` } as CSSProperties}>
            <button type="button" onClick={() => open(i)} className="group relative block size-full overflow-hidden rounded-[24px] border-4 border-card bg-blush shadow-[0_20px_40px_-30px_rgb(147_71_90/0.6)]" aria-label={`عرض ${item.caption || "الصورة"}`}>
              <Image
                src={mediaUrl(item.image_path)!}
                alt={item.caption || `نقشة حنة من أعمال ${brand}`}
                fill
                sizes={i % TILE.length === 0 ? "(min-width: 768px) 560px, 100vw" : "(min-width: 768px) 280px, 50vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              {item.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgb(59_43_37/0.7)] to-transparent px-3 pt-8 pb-2.5 text-start text-[13px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100">
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
