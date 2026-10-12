import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { SiteContent } from "./types";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigured } from "./supabase/config";
import { sampleContent } from "./sample-content";

/**
 * Everything the landing page shows, read as an anonymous visitor (row level security returns
 * only visible rows). Without Supabase settings, as in local previews, sample content stands in.
 */
export async function getSiteContent(): Promise<SiteContent> {
  if (!supabaseConfigured) return sampleContent;

  const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
  const ordered = (table: string) => db.from(table).select("*").eq("is_visible", true).order("sort_order").order("created_at");

  const [settings, services, packages, areas, gallery, reviews, faqs] = await Promise.all([
    db.from("site_settings").select("*").eq("id", 1).single(),
    ordered("services"),
    ordered("packages"),
    ordered("areas"),
    ordered("gallery_items"),
    ordered("reviews"),
    ordered("faqs"),
  ]);

  const failed = [settings, services, packages, areas, gallery, reviews, faqs].find((r) => r.error);
  if (failed?.error) throw new Error(`Could not load site content: ${failed.error.message}`);

  return {
    settings: settings.data,
    services: services.data ?? [],
    packages: packages.data ?? [],
    areas: areas.data ?? [],
    gallery: gallery.data ?? [],
    reviews: reviews.data ?? [],
    faqs: faqs.data ?? [],
  };
}
