"use client";

import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function GalleryAdmin() {
  return (
    <CollectionEditor
      config={{
        table: "gallery_items",
        title: "الأعمال",
        help: "صور النقوش التي تظهر في معرض الموقع. اختاري عدة صور مرة واحدة، ثم اضغطي على أي صورة لإضافة وصف أو تصنيف.",
        addLabel: "صورة واحدة",
        emptyText: "لا توجد صور بعد. اضغطي «إضافة صور» واختاري صورًا من هاتفك.",
        layout: "grid",
        bulkUpload: { label: "＋ إضافة صور", folder: "gallery" },
        blank: { caption: "", category: "", is_visible: true, image_path: null },
        fields: [
          { key: "image_path", label: "الصورة", type: "image", folder: "gallery", withSize: true },
          { key: "caption", label: "وصف قصير", type: "text", help: "مثلًا: حنة عروس كاملة لليدين" },
          { key: "category", label: "التصنيف", type: "text", help: "مثلًا: عرائس، سهرات، سوداني. الصور التي لها نفس التصنيف تُجمع معًا في الموقع." },
        ],
        summary: (r) => ({ title: String(r.caption ?? ""), image: r.image_path as string }),
      }}
    />
  );
}
