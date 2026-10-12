"use client";

import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function ServicesAdmin() {
  return (
    <CollectionEditor
      config={{
        table: "services",
        title: "أنواع الحنة",
        help: "الخدمات التي تظهر في قسم «كل أنواع الحنة» وفي نموذج الحجز.",
        addLabel: "نوع جديد",
        emptyText: "لا توجد خدمات بعد.",
        blank: { title: "", description: "", image_path: null, is_visible: true },
        fields: [
          { key: "title", label: "الاسم", type: "text", required: true },
          { key: "description", label: "الوصف", type: "textarea" },
          { key: "image_path", label: "صورة", type: "image", folder: "services", help: "اختياري" },
        ],
        summary: (r) => ({ title: String(r.title), subtitle: String(r.description ?? ""), image: r.image_path as string | null }),
      }}
    />
  );
}
