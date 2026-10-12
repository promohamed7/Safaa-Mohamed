"use client";

import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function AreasAdmin() {
  return (
    <CollectionEditor
      config={{
        table: "areas",
        title: "المناطق",
        help: "الأماكن التي تصلين إليها. تظهر في الموقع وفي نموذج الحجز.",
        addLabel: "منطقة جديدة",
        emptyText: "لا توجد مناطق بعد.",
        blank: { name: "", note: "", is_visible: true },
        fields: [
          { key: "name", label: "اسم المنطقة", type: "text", required: true },
          { key: "note", label: "ملاحظة", type: "text", help: "اختياري، مثلًا: رسوم انتقال إضافية" },
        ],
        summary: (r) => ({ title: String(r.name), subtitle: String(r.note ?? "") }),
      }}
    />
  );
}
