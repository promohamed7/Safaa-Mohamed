/** Rows as stored in Supabase (see supabase/migrations). */

export interface SiteSettings {
  id: number;
  brand_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_body: string;
  city: string;
  whatsapp_phone: string;
  booking_message: string;
  home_visits: boolean;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  threads_url: string | null;
  youtube_url: string | null;
  hero_image_path: string | null;
  about_image_path: string | null;
  updated_at: string;
}

interface Ordered {
  id: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Service extends Ordered {
  title: string;
  description: string;
  image_path: string | null;
}

export interface Package extends Ordered {
  name: string;
  price: number | null;
  price_prefix: string;
  price_note: string;
  description: string;
  features: string[];
  is_featured: boolean;
}

export interface Area extends Ordered {
  name: string;
  note: string;
}

export interface GalleryItem extends Ordered {
  image_path: string;
  caption: string;
  category: string;
  width: number | null;
  height: number | null;
}

export interface Review extends Ordered {
  image_path: string | null;
  author_name: string;
  quote: string;
  width: number | null;
  height: number | null;
}

export interface Faq extends Ordered {
  question: string;
  answer: string;
}

export interface SiteContent {
  settings: SiteSettings;
  services: Service[];
  packages: Package[];
  areas: Area[];
  gallery: GalleryItem[];
  reviews: Review[];
  faqs: Faq[];
}
