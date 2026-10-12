"use client";

import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function ReviewsAdmin() {
  return (
    <CollectionEditor
      config={{
        table: "reviews",
        title: "آراء العميلات",
        help: "أضيفي صور شاشة لرسائل واتساب أو التعليقات. يمكنكِ إضافة اسم العميلة أو كتابة رأيها نصًا بدل الصورة.",
        addLabel: "رأي مكتوب",
        emptyText: "لا توجد آراء بعد. قسم الآراء لا يظهر في الموقع حتى تضيفي رأيًا.",
        bulkUpload: { label: "＋ إضافة صور شاشة", folder: "reviews" },
        blank: { author_name: "", quote: "", image_path: null, is_visible: true },
        fields: [
          { key: "image_path", label: "صورة الشاشة", type: "image", folder: "reviews", withSize: true, help: "اختياري. يُفضّل إخفاء أرقام الهواتف قبل الرفع." },
          { key: "author_name", label: "اسم العميلة", type: "text", help: "اختياري، مثلًا: عروس من السادات" },
          { key: "quote", label: "الرأي مكتوبًا", type: "textarea", help: "اختياري" },
        ],
        summary: (r) => ({ title: String(r.author_name || r.quote || "صورة رأي"), subtitle: r.author_name ? String(r.quote ?? "") : undefined, image: r.image_path as string | null }),
      }}
    />
  );
}
