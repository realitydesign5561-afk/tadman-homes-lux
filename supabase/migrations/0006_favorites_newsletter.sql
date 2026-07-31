-- Saved properties (favourites) + newsletter subscribers
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, property_id)
);

grant select, insert, delete on public.favorites to authenticated;
grant all on public.favorites to service_role;

alter table public.favorites enable row level security;

drop policy if exists "Users read own favorites" on public.favorites;
create policy "Users read own favorites" on public.favorites
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users add own favorites" on public.favorites;
create policy "Users add own favorites" on public.favorites
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users remove own favorites" on public.favorites;
create policy "Users remove own favorites" on public.favorites
  for delete to authenticated using (auth.uid() = user_id);

create index if not exists favorites_user_idx on public.favorites(user_id);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

grant insert on public.newsletter_subscribers to anon, authenticated;
grant all on public.newsletter_subscribers to service_role;

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);
