-- SSB Prep Hub Phase 3 schema
-- Run this in Supabase SQL Editor after creating the first Auth user.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.ppdt_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  title text not null,
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ppdt_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  image_id uuid references public.ppdt_images(id) on delete set null,
  category text,
  difficulty text,
  story_source text not null default 'typed' check (story_source in ('typed', 'handwritten', 'both')),
  completed boolean not null default false,
  score numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.wat_words (
  id uuid primary key default gen_random_uuid(),
  word text not null,
  normalized_word text generated always as (lower(regexp_replace(trim(word), '\s+', ' ', 'g'))) stored unique,
  category text not null default 'General',
  tip text not null default '',
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.ppdt_images enable row level security;
alter table public.ppdt_attempts enable row level security;
alter table public.wat_words enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Anyone can read active PPDT images" on public.ppdt_images;
create policy "Anyone can read active PPDT images"
  on public.ppdt_images for select
  using (active = true or public.is_admin());

drop policy if exists "Admins can manage PPDT images" on public.ppdt_images;
create policy "Admins can manage PPDT images"
  on public.ppdt_images for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users can read their attempts" on public.ppdt_attempts;
create policy "Users can read their attempts"
  on public.ppdt_attempts for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can create their attempts" on public.ppdt_attempts;
create policy "Users can create their attempts"
  on public.ppdt_attempts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Anyone can read active WAT words" on public.wat_words;
create policy "Anyone can read active WAT words"
  on public.wat_words for select
  using (active = true or public.is_admin());

drop policy if exists "Admins can manage WAT words" on public.wat_words;
create policy "Admins can manage WAT words"
  on public.wat_words for all
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('ppdt-images', 'ppdt-images', false)
on conflict (id) do nothing;

drop policy if exists "Anyone can read active PPDT files" on storage.objects;
create policy "Anyone can read active PPDT files"
  on storage.objects for select
  using (bucket_id = 'ppdt-images' and (public.is_admin() or exists (
    select 1 from public.ppdt_images
    where storage_path = name and active = true
  )));

drop policy if exists "Admins can upload PPDT files" on storage.objects;
create policy "Admins can upload PPDT files"
  on storage.objects for insert
  with check (bucket_id = 'ppdt-images' and public.is_admin());

drop policy if exists "Admins can update PPDT files" on storage.objects;
create policy "Admins can update PPDT files"
  on storage.objects for update
  using (bucket_id = 'ppdt-images' and public.is_admin())
  with check (bucket_id = 'ppdt-images' and public.is_admin());

drop policy if exists "Admins can delete PPDT files" on storage.objects;
create policy "Admins can delete PPDT files"
  on storage.objects for delete
  using (bucket_id = 'ppdt-images' and public.is_admin());

-- After signing up with the admin email, run this once:
-- update public.profiles set role = 'admin' where email = 'Rajawatanuj8989@gmail.com';
