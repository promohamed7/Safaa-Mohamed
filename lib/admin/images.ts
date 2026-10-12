"use client";

import { browserClient } from "@/lib/supabase/browser";
import { MEDIA_BUCKET } from "@/lib/supabase/config";

const MAX_SIDE = 1800;

/**
 * Phone photos are often 4000px and several MB. Shrink to 1800px on the longest side and save
 * as WebP before uploading, so uploads are quick on mobile data and the page stays light.
 */
async function compress(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
  if (!blob) throw new Error("تعذّر تجهيز الصورة");
  return { blob, width, height };
}

export interface UploadedImage {
  path: string;
  width: number;
  height: number;
}

export async function uploadImage(file: File, folder: string): Promise<UploadedImage> {
  if (!file.type.startsWith("image/")) throw new Error("الملف ليس صورة");
  const { blob, width, height } = await compress(file);
  const path = `${folder}/${crypto.randomUUID()}.webp`;
  const { error } = await browserClient().storage.from(MEDIA_BUCKET).upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return { path, width, height };
}

/** Remove files that no row points to any more. Best effort: a leftover file is harmless. */
export async function removeImages(paths: (string | null | undefined)[]) {
  const list = paths.filter((p): p is string => Boolean(p));
  if (list.length) await browserClient().storage.from(MEDIA_BUCKET).remove(list);
}
