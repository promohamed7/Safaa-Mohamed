import type { SiteContent } from "./types";

/**
 * Local preview content, used only when Supabase is not configured. It mirrors the starting
 * rows in supabase/migrations/0001_init.sql, plus example packages and areas (marked "مثال")
 * so every section of the page can be reviewed. Production always reads Supabase.
 */
const base = { is_visible: true, created_at: "2026-10-12T00:00:00Z" };

export const sampleContent: SiteContent = {
  settings: {
    id: 1,
    brand_name: "صفاء محمد",
    tagline: "رسم حنة لكل المناسبات",
    hero_title: "حنة تليق بيومك",
    hero_subtitle: "نقوش حنة مرسومة بيد صفاء للعرائس والسهرات وكل المناسبات، في بيتك بمدينة السادات وما حولها.",
    about_title: "عن صفاء",
    about_body:
      "أرسم الحنة بكل أنواعها: نقوش العرائس الكاملة، والسهرات، والسوداني، والهندي، وحنة الأطفال. أصل إليكِ في بيتك، ونختار معًا النقشة التي تناسب يومك.",
    city: "مدينة السادات، المنوفية",
    whatsapp_phone: "+201012776533",
    booking_message: "مرحبًا صفاء، أريد حجز موعد حنة.",
    home_visits: true,
    instagram_url: "https://www.instagram.com/safaa__mohamed22",
    facebook_url: "https://www.facebook.com/share/1CQWq88Hko/",
    tiktok_url: "https://www.tiktok.com/@user3090773614553",
    threads_url: "https://www.threads.com/@safaa__mohamed22",
    youtube_url: "https://www.youtube.com/channel/UCb9W6ZmfiJ9zPfPgh3G3v-g",
    hero_image_path: null,
    about_image_path: null,
    updated_at: "2026-10-12T00:00:00Z",
  },
  services: [
    { ...base, id: "s1", sort_order: 1, image_path: null, title: "حنة العروس", description: "نقشة كاملة لليدين والقدمين بتفاصيل دقيقة تناسب ليلة الحنة ويوم الزفاف." },
    { ...base, id: "s2", sort_order: 2, image_path: null, title: "حنة السهرات والمناسبات", description: "نقوش أبسط وأسرع للخطوبة وعقد القران والسهرات." },
    { ...base, id: "s3", sort_order: 3, image_path: null, title: "الحنة السوداني", description: "نقوش سوداء جريئة بخطوط واضحة." },
    { ...base, id: "s4", sort_order: 4, image_path: null, title: "الحنة الهندي والخليجي", description: "نقوش غنية بالورود والتفاصيل الناعمة." },
    { ...base, id: "s5", sort_order: 5, image_path: null, title: "حنة الأطفال", description: "رسومات صغيرة ولطيفة للبنات في الأعياد والمناسبات." },
  ],
  packages: [
    { ...base, id: "p1", sort_order: 1, name: "باقة السهرة (مثال)", price: 300, price_prefix: "تبدأ من", price_note: "جنيه", description: "نقشة لليدين لمناسبة واحدة.", features: ["اليدين حتى الرسغ", "نقشة من اختيارك"], is_featured: false },
    { ...base, id: "p2", sort_order: 2, name: "باقة العروس (مثال)", price: 1500, price_prefix: "", price_note: "جنيه", description: "نقشة كاملة ليلة الحنة.", features: ["اليدين حتى الكوع", "القدمين", "زيارة في البيت"], is_featured: true },
    { ...base, id: "p3", sort_order: 3, name: "باقة العروس وصديقاتها (مثال)", price: null, price_prefix: "", price_note: "السعر حسب العدد", description: "العروس ومعها من تشاء من الأهل والصديقات.", features: ["نقشة العروس كاملة", "نقوش بسيطة للمرافقات"], is_featured: false },
  ],
  areas: [
    { ...base, id: "a1", sort_order: 1, name: "مدينة السادات (مثال)", note: "" },
    { ...base, id: "a2", sort_order: 2, name: "الخطاطبة (مثال)", note: "رسوم انتقال إضافية" },
  ],
  gallery: [],
  reviews: [
    { ...base, id: "r1", sort_order: 1, image_path: null, width: null, height: null, author_name: "عروس من السادات (مثال)", quote: "النقشة كانت أجمل مما تخيلت، والحنة لونها طلع غامق وثابت." },
  ],
  faqs: [
    { ...base, id: "f1", sort_order: 1, question: "هل تأتين إلى البيت؟", answer: "نعم، أصل إلى بيتك في مدينة السادات والمناطق القريبة. اكتبي منطقتك عند الحجز." },
    { ...base, id: "f2", sort_order: 2, question: "كيف أحجز موعدًا؟", answer: "اضغطي زر الحجز عبر واتساب واكتبي التاريخ ونوع المناسبة، وسأرد عليكِ لتأكيد الموعد." },
    { ...base, id: "f3", sort_order: 3, question: "كم تدوم الحنة؟", answer: "تدوم عادة من أسبوع إلى أسبوعين، ويختلف ذلك حسب البشرة والعناية بعد الرسم." },
  ],
};
