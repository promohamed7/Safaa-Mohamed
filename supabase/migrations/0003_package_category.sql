-- Prices differ by henna type (Khaleeji and Indian, black henna, …), so every package names its
-- type. The page groups packages by this text, in the order of their first package.

alter table public.packages add column if not exists category text not null default '';
