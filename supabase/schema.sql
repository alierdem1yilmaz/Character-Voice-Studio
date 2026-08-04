-- Character Voice Studio - database schema
-- Supabase Dashboard -> SQL Editor icinde calistir.

create extension if not exists "pgcrypto";

-- Karakterler
create table if not exists characters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  personality text not null,
  appearance text not null,
  voice text not null,
  image_url text,
  created_at timestamptz not null default now()
);

-- Uretilen ses kayitlari
create table if not exists voice_generations (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  text text not null,
  emotion text not null,
  audio_url text,
  created_at timestamptz not null default now()
);

create index if not exists voice_generations_character_id_idx
  on voice_generations (character_id);

-- Bu proje giris/oturum (auth) kullanmiyor; uygulama sunucu tarafinda
-- (API route'lari) SUPABASE_ANON_KEY ile calisiyor ve tum yazma/okuma
-- islemleri backend uzerinden yapiliyor. RLS'i acik tutup herkese
-- okuma/yazma izni veriyoruz.
alter table characters enable row level security;
alter table voice_generations enable row level security;

create policy "Public read characters" on characters
  for select using (true);
create policy "Public insert characters" on characters
  for insert with check (true);

create policy "Public read voice_generations" on voice_generations
  for select using (true);
create policy "Public insert voice_generations" on voice_generations
  for insert with check (true);

-- Storage: karakter gorselleri ve ses dosyalari icin public bucket'lar
insert into storage.buckets (id, name, public)
values ('character-images', 'character-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('character-audio', 'character-audio', true)
on conflict (id) do nothing;

create policy "Public read character-images"
  on storage.objects for select
  using (bucket_id = 'character-images');
create policy "Public upload character-images"
  on storage.objects for insert
  with check (bucket_id = 'character-images');

create policy "Public read character-audio"
  on storage.objects for select
  using (bucket_id = 'character-audio');
create policy "Public upload character-audio"
  on storage.objects for insert
  with check (bucket_id = 'character-audio');
