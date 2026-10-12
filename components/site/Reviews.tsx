"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import type { Review } from "@/lib/types";
import { mediaUrl } from "@/lib/supabase/config";
import { useLightbox } from "./Lightbox";

/** Customer reviews: screenshots from WhatsApp or comments, and written quotes. */
export function Reviews({ reviews }: { reviews: Review[] }) {
  const shots = reviews.filter((r) => r.image_path);
  const { open, view } = useLightbox(shots.map((r) => ({ src: mediaUrl(r.image_path)!, alt: r.author_name ? `رأي ${r.author_name}` : "رأي عميلة", caption: r.author_name })));

  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {reviews.map((r, i) => {
          const shot = shots.indexOf(r);
          return (
            <li key={r.id} className="card reveal mb-4 break-inside-avoid overflow-hidden" style={{ "--d": `${(i % 6) * 70}ms` } as CSSProperties}>
              {r.image_path && (
                <button type="button" onClick={() => open(shot)} className="block w-full bg-paper-2" aria-label="تكبير صورة الرأي">
                  <Image src={mediaUrl(r.image_path)!} alt={r.author_name ? `رأي ${r.author_name}` : "رأي عميلة"} width={r.width ?? 720} height={r.height ?? 1280} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="h-auto w-full" />
                </button>
              )}
              {(r.quote || r.author_name) && (
                <figure className="grid gap-3 p-6">
                  {r.quote && (
                    <blockquote className="display relative text-[21px] leading-relaxed text-ink">
                      <span aria-hidden className="absolute -top-4 -right-1 text-[48px] leading-none text-gold/50">”</span>
                      {r.quote}
                    </blockquote>
                  )}
                  {r.author_name && <figcaption className="text-[14px] font-semibold text-henna">{r.author_name}</figcaption>}
                </figure>
              )}
            </li>
          );
        })}
      </ul>
      {view}
    </>
  );
}
