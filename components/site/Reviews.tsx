"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import type { Review } from "@/lib/types";
import { mediaUrl } from "@/lib/supabase/config";
import { useLightbox } from "./Lightbox";
import { Stars } from "./Ornaments";

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
            <li key={r.id} className="reveal mb-4 break-inside-avoid overflow-hidden rounded-[26px] border border-line bg-card shadow-[0_24px_50px_-36px_rgb(147_71_90/0.5)]" style={{ "--d": `${(i % 6) * 70}ms` } as CSSProperties}>
              {r.image_path && (
                <button type="button" onClick={() => open(shot)} className="block w-full bg-blush" aria-label="تكبير صورة الرأي">
                  <Image src={mediaUrl(r.image_path)!} alt={r.author_name ? `رأي ${r.author_name}` : "رأي عميلة"} width={r.width ?? 720} height={r.height ?? 1280} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="h-auto w-full" />
                </button>
              )}
              <figure className={`grid gap-3 ${r.quote || r.author_name ? "p-6" : "px-6 py-4"}`}>
                <Stars />
                {r.quote && <blockquote className="text-[17px] leading-relaxed text-ink">“{r.quote}”</blockquote>}
                {r.author_name && (
                  <figcaption className="flex items-center gap-2.5 text-[14px] font-semibold text-rose-deep">
                    <span aria-hidden className="grid size-9 place-items-center rounded-full bg-blush text-[15px]">{r.author_name.trim().charAt(0)}</span>
                    {r.author_name}
                  </figcaption>
                )}
              </figure>
            </li>
          );
        })}
      </ul>
      {view}
    </>
  );
}
