"use client";

import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function PackagesAdmin() {
  return (
    <CollectionEditor
      config={{
        table: "packages",
        title: "الباقات والأسعار",
        help: "الباقات تظهر في الموقع بنفس الترتيب هنا. يمكنكِ ترك السعر فارغًا وكتابة «السعر حسب الطلب» مثلًا.",
        addLabel: "باقة جديدة",
        emptyText: "لا توجد باقات بعد. قسم الباقات لا يظهر في الموقع حتى تضيفي باقة.",
        blank: { name: "", price: null, price_prefix: "", price_note: "جنيه", description: "", features: [], is_featured: false, is_visible: true },
        fields: [
          { key: "name", label: "اسم الباقة", type: "text", required: true },
          { key: "price", label: "السعر", type: "number", help: "بالأرقام فقط، أو اتركيه فارغًا." },
          { key: "price_prefix", label: "قبل السعر", type: "text", help: "مثلًا: تبدأ من" },
          { key: "price_note", label: "بعد السعر", type: "text", help: "مثلًا: جنيه، أو: السعر حسب العدد" },
          { key: "description", label: "وصف قصير", type: "textarea" },
          { key: "features", label: "ما تشمله الباقة", type: "lines" },
          { key: "is_featured", label: "تمييز الباقة (الأكثر طلبًا)", type: "switch" },
        ],
        summary: (r) => ({
          title: String(r.name),
          subtitle: [r.price_prefix, r.price !== null && r.price !== undefined ? Number(r.price).toLocaleString("ar-EG") : "", r.price_note].filter(Boolean).join(" "),
        }),
      }}
    />
  );
}
