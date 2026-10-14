import type { SiteContent } from "./types";

/**
 * Local preview content, used only when Supabase is not configured. It mirrors the starting
 * content in Supabase (with one example review, marked "مثال") so every section of the page can
 * be reviewed. Production always reads Supabase.
 */
const base = { is_visible: true, created_at: "2026-10-12T00:00:00Z" };

export const sampleContent: SiteContent = {
  settings: {
    id: 1,
    brand_name: "صفاء محمد",
    tagline: "حنة ديزاين · رسم الحنة بكل أنواعها",
    hero_title: "حنة تليق بيومك",
    hero_subtitle: "نقوش حنة خليجي وهندي وعربي وسوداء، مرسومة بيد صفاء لكل المناسبات. في مكاني بمدينة السادات أو في بيتك.",
    about_title: "عن صفاء",
    about_body:
      "أرسم الحنة بكل أنواعها: الخليجي والهندي والعربي والسوداء، لكل المناسبات، وأرسم على الوجه وللأطفال بالألوان في الأعياد والحفلات المدرسية. يمكنكِ الحضور إليّ في المنطقة ١٣ بمدينة السادات، أو أصل إليكِ في بيتك داخل السادات والأماكن القريبة.",
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
    { ...base, id: "s1", sort_order: 1, image_path: null, title: "الحنة الخليجي", description: "نقوش ناعمة مليئة بالورود والتفاصيل." },
    { ...base, id: "s2", sort_order: 2, image_path: null, title: "الحنة الهندي", description: "نقوش كثيفة ودقيقة تغطي الكف والأصابع." },
    { ...base, id: "s3", sort_order: 3, image_path: null, title: "الحنة العربي", description: "نقوش ورود وأغصان بمساحات مفتوحة." },
    { ...base, id: "s4", sort_order: 4, image_path: null, title: "الحنة السوداء", description: "خطوط سوداء واضحة تدوم أطول على الأماكن الجافة." },
    { ...base, id: "s5", sort_order: 5, image_path: null, title: "حنة العرائس والمناسبات", description: "نقشة كاملة لليدين والقدمين لليلة الحنة والخطوبة والسهرات." },
    { ...base, id: "s6", sort_order: 6, image_path: null, title: "الرسم على الوجه", description: "رسومات على الوجه للأطفال والكبار في الحفلات والمناسبات." },
    { ...base, id: "s7", sort_order: 7, image_path: null, title: "رسم الأطفال بالألوان", description: "رسومات ملونة ومبهجة للأطفال في الأعياد وأعياد الميلاد." },
    { ...base, id: "s8", sort_order: 8, image_path: null, title: "الحفلات المدرسية والفعاليات", description: "رسم الحنة والوجه لعدد كبير من الأطفال في الحفلات المدرسية والمناسبات العامة." },
  ],
  packages: [
    { ...base, id: "p1", sort_order: 1, category: "الحنة الخليجي والهندي", name: "لمسة ندى", price: 60, price_prefix: "تبدأ من", price_note: "جنيه لليد", description: "رسمة رقيقة على الكف لليد الواحدة.", features: ["حنة خليجي أو هندي", "السعر حسب حجم الرسمة"], is_featured: false },
    { ...base, id: "p2", sort_order: 2, category: "الحنة الخليجي والهندي", name: "سوار الياسمين", price: 100, price_prefix: "", price_note: "جنيه لليد", description: "رسمة اليد مع المعصم لليد الواحدة.", features: ["اليد كاملة مع المعصم"], is_featured: false },
    { ...base, id: "p3", sort_order: 3, category: "الحنة الخليجي والهندي", name: "باقة الوردة", price: 400, price_prefix: "", price_note: "جنيه", description: "للكفوف فقط: اليدين والقدمين.", features: ["كفّا اليدين", "كفّا القدمين"], is_featured: false },
    { ...base, id: "p4", sort_order: 4, category: "الحنة الخليجي والهندي", name: "باقة الأميرة", price: 600, price_prefix: "", price_note: "جنيه", description: "النقشة الكاملة لليلة الحنة.", features: ["رسمتين لليدين حتى الكوع", "رسمتين للقدمين"], is_featured: true },
    { ...base, id: "p5", sort_order: 5, category: "الحنة السوداء", name: "رسمة نجمة", price: 25, price_prefix: "تبدأ من", price_note: "جنيه للرسمة", description: "رسمة واحدة، وسعرها يزيد حسب حجمها.", features: ["صغيرة ٢٥ · متوسطة ٣٥ · كبيرة ٤٥ جنيه", "رسمتين أو أكثر تُحسب باقة"], is_featured: false },
    { ...base, id: "p6", sort_order: 6, category: "الحنة السوداء", name: "باقة الفراشة", price: 300, price_prefix: "", price_note: "جنيه", description: "٤ رسومات تختارين أماكنها.", features: ["٣ رسومات بسيطة + رسمة كبيرة (سلسلة ظهر أو رسمة قدم)", "أو: رسمة صدر + رسمة قدم + رسمة يد أو معصم", "+ رسمة هدية لشخص تحبينه"], is_featured: false },
    { ...base, id: "p7", sort_order: 7, category: "الحنة السوداء", name: "باقة الغزالة", price: 400, price_prefix: "", price_note: "جنيه", description: "٥ رسومات، ويمكن تغيير أماكنها حسب رغبتك.", features: ["رسمة صدر", "رسمة سلسلة ظهر", "رسمتين للقدمين", "رسمة معصم أو يد", "+ رسمة هدية لشخص تحبينه"], is_featured: false },
    { ...base, id: "p8", sort_order: 8, category: "الحنة السوداء", name: "باقة الملكة", price: 500, price_prefix: "", price_note: "جنيه", description: "٧ رسومات بأحجام مختلفة.", features: ["رسمتين كبيرتين", "٣ رسومات متوسطة", "رسمتين بسيطتين", "+ رسمة هدية لشخص تحبينه"], is_featured: true },
  ],
  areas: [
    { ...base, id: "a1", sort_order: 1, name: "مدينة السادات والأماكن القريبة", note: "الزيارة المنزلية بزيادة ١٥٠ جنيهًا" },
  ],
  gallery: [],
  reviews: [
    { ...base, id: "r1", sort_order: 1, image_path: null, width: null, height: null, author_name: "عروس من السادات (مثال)", quote: "النقشة كانت أجمل مما تخيلت، والحنة لونها طلع غامق وثابت." },
  ],
  faqs: [
    { ...base, id: "f1", sort_order: 1, question: "أين مكانك؟", answer: "في المنطقة ١٣ بمدينة السادات: ثالث شارع، ثم ثاني شارع على اليسار. للعنوان بالتفصيل راسليني على واتساب." },
    { ...base, id: "f2", sort_order: 2, question: "هل تأتين إلى البيت؟", answer: "نعم، داخل مدينة السادات والأماكن القريبة فقط، بزيادة ١٥٠ جنيهًا على الحساب." },
    { ...base, id: "f3", sort_order: 3, question: "هل الأسعار قابلة للتفاوض؟", answer: "الأسعار ثابتة ولا يوجد فصال." },
    { ...base, id: "f4", sort_order: 4, question: "هل سعر العروس مختلف؟", answer: "لا، العرائس والمدامات نفس الأسعار بدون أي فرق." },
  ],
};
