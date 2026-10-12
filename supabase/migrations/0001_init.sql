-- Safaa Mohamed henna site: content managed from /admin, read by the public landing page.
-- Everyone may read visible content; only accounts listed in public.admins may write.

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

-- One row of page-wide settings: texts, contacts, social links, main images.
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  brand_name text not null default 'صفاء محمد',
  tagline text not null default 'رسم حنة لكل المناسبات',
  hero_title text not null default 'حنة تليق بيومك',
  hero_subtitle text not null default '',
  about_title text not null default 'عن صفاء',
  about_body text not null default '',
  city text not null default 'مدينة السادات، المنوفية',
  whatsapp_phone text not null default '+201012776533',
  booking_message text not null default 'مرحبًا صفاء، أريد حجز موعد حنة.',
  home_visits boolean not null default true,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  threads_url text,
  youtube_url text,
  hero_image_path text,
  about_image_path text,
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_path text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2),
  price_prefix text not null default '',
  price_note text not null default '',
  description text not null default '',
  features text[] not null default '{}',
  is_featured boolean not null default false,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  note text not null default '',
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  caption text not null default '',
  category text not null default '',
  width int,
  height int,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Customer reviews, usually a screenshot from WhatsApp or comments, with an optional name and quote.
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  image_path text,
  author_name text not null default '',
  quote text not null default '',
  width int,
  height int,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Row level security: public reads visible rows, admins read and write everything.
alter table public.admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.packages enable row level security;
alter table public.areas enable row level security;
alter table public.gallery_items enable row level security;
alter table public.reviews enable row level security;
alter table public.faqs enable row level security;

create policy "admins read themselves" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

create policy "public reads settings" on public.site_settings
  for select to anon, authenticated using (true);
create policy "admins update settings" on public.site_settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

do $$
declare t text;
begin
  foreach t in array array['services', 'packages', 'areas', 'gallery_items', 'reviews', 'faqs'] loop
    execute format('create policy "public reads visible %1$s" on public.%1$I for select to anon, authenticated using (is_visible or (select public.is_admin()))', t);
    execute format('create policy "admins insert %1$s" on public.%1$I for insert to authenticated with check ((select public.is_admin()))', t);
    execute format('create policy "admins update %1$s" on public.%1$I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('create policy "admins delete %1$s" on public.%1$I for delete to authenticated using ((select public.is_admin()))', t);
    execute format('create index %1$s_order_idx on public.%1$I (sort_order)', t);
  end loop;
end $$;

-- Storage: one public bucket for every image on the site, written only by admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and (select public.is_admin()));
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select public.is_admin()));

-- Starting content she can edit or hide from the dashboard.
insert into public.site_settings (id, hero_subtitle, about_body, instagram_url, facebook_url, tiktok_url, threads_url, youtube_url)
values (
  1,
  'نقوش حنة مرسومة بيد صفاء للعرائس والسهرات وكل المناسبات، في بيتك بمدينة السادات وما حولها.',
  'أرسم الحنة بكل أنواعها: نقوش العرائس الكاملة، والسهرات، والسوداني، والهندي، وحنة الأطفال. أصل إليكِ في بيتك، ونختار معًا النقشة التي تناسب يومك.',
  'https://www.instagram.com/safaa__mohamed22',
  'https://www.facebook.com/share/1CQWq88Hko/',
  'https://www.tiktok.com/@user3090773614553',
  'https://www.threads.com/@safaa__mohamed22',
  'https://www.youtube.com/channel/UCb9W6ZmfiJ9zPfPgh3G3v-g'
);

insert into public.services (title, description, sort_order) values
  ('حنة العروس', 'نقشة كاملة لليدين والقدمين بتفاصيل دقيقة تناسب ليلة الحنة ويوم الزفاف.', 1),
  ('حنة السهرات والمناسبات', 'نقوش أبسط وأسرع للخطوبة وعقد القران والسهرات.', 2),
  ('الحنة السوداني', 'نقوش سوداء جريئة بخطوط واضحة.', 3),
  ('الحنة الهندي والخليجي', 'نقوش غنية بالورود والتفاصيل الناعمة.', 4),
  ('حنة الأطفال', 'رسومات صغيرة ولطيفة للبنات في الأعياد والمناسبات.', 5);

insert into public.faqs (question, answer, sort_order) values
  ('هل تأتين إلى البيت؟', 'نعم، أصل إلى بيتك في مدينة السادات والمناطق القريبة. اكتبي منطقتك عند الحجز.', 1),
  ('كيف أحجز موعدًا؟', 'اضغطي زر الحجز عبر واتساب واكتبي التاريخ ونوع المناسبة، وسأرد عليكِ لتأكيد الموعد.', 2),
  ('كم تدوم الحنة؟', 'تدوم عادة من أسبوع إلى أسبوعين، ويختلف ذلك حسب البشرة والعناية بعد الرسم.', 3);
