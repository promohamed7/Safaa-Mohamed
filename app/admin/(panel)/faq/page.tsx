"use client";

import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function FaqAdmin() {
  return (
    <CollectionEditor
      config={{
        table: "faqs",
        title: "الأسئلة المتكررة",
        addLabel: "سؤال جديد",
        emptyText: "لا توجد أسئلة بعد.",
        blank: { question: "", answer: "", is_visible: true },
        fields: [
          { key: "question", label: "السؤال", type: "text", required: true },
          { key: "answer", label: "الإجابة", type: "textarea", required: true },
        ],
        summary: (r) => ({ title: String(r.question), subtitle: String(r.answer) }),
      }}
    />
  );
}
