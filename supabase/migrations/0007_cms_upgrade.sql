-- =====================================================================
-- Tadman Homes & Properties — CMS upgrade
-- Idempotent. Safe to run on the existing project.
-- =====================================================================

-- ---------- helper: allow extra status values when status is an enum ----------
do $$
declare t text;
begin
  select udt_name into t from information_schema.columns
   where table_schema='public' and table_name='properties' and column_name='status';
  if t is not null and exists (select 1 from pg_type where typname=t and typtype='e') then
    execute format('alter type public.%I add value if not exists %L', t, 'draft');
    execute format('alter type public.%I add value if not exists %L', t, 'pending');
    execute format('alter type public.%I add value if not exists %L', t, 'approved');
    execute format('alter type public.%I add value if not exists %L', t, 'rejected');
    execute format('alter type public.%I add value if not exists %L', t, 'sold');
    execute format('alter type public.%I add value if not exists %L', t, 'rented');
    execute format('alter type public.%I add value if not exists %L', t, 'archived');
  end if;
end $$;

-- ---------- properties ----------
alter table public.properties add column if not exists slug text;
alter table public.properties add column if not exists currency text not null default 'NGN';
alter table public.properties add column if not exists country text;
alter table public.properties add column if not exists state text;
alter table public.properties add column if not exists city text;
alter table public.properties add column if not exists address text;
alter table public.properties add column if not exists property_type text;
alter table public.properties add column if not exists category text;
alter table public.properties add column if not exists listing_type text not null default 'buy';
alter table public.properties add column if not exists bedrooms int;
alter table public.properties add column if not exists bathrooms int;
alter table public.properties add column if not exists parking int;
alter table public.properties add column if not exists size numeric(12,2);
alter table public.properties add column if not exists size_unit text default 'sqm';
alter table public.properties add column if not exists amenities text[] not null default '{}';
alter table public.properties add column if not exists featured_image text;
alter table public.properties add column if not exists gallery text[] not null default '{}';
alter table public.properties add column if not exists map_url text;
alter table public.properties add column if not exists views_count int not null default 0;
alter table public.properties add column if not exists owner_id uuid;
alter table public.properties add column if not exists agent_id uuid;
alter table public.properties add column if not exists published_at timestamptz;
alter table public.properties add column if not exists rejection_reason text;

do $$ begin
  begin
    alter table public.properties add constraint properties_slug_key unique (slug);
  exception when duplicate_table or duplicate_object then null; end;
end $$;

create index if not exists properties_status_idx on public.properties(status);
create index if not exists properties_owner_idx on public.properties(owner_id);
create index if not exists properties_location_idx on public.properties(country, state, city);

-- ---------- merchants ----------
alter table public.merchants add column if not exists slug text;
alter table public.merchants add column if not exists logo_url text;
alter table public.merchants add column if not exists description text;
alter table public.merchants add column if not exists email text;
alter table public.merchants add column if not exists phone text;
alter table public.merchants add column if not exists whatsapp text;
alter table public.merchants add column if not exists address text;
alter table public.merchants add column if not exists city text;
alter table public.merchants add column if not exists state text;
alter table public.merchants add column if not exists country text;
alter table public.merchants add column if not exists website text;
alter table public.merchants add column if not exists verified boolean not null default false;

-- ---------- profiles ----------
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists avatar_url text;

-- ---------- agents ----------
alter table public.agents add column if not exists facebook text;
alter table public.agents add column if not exists instagram text;
alter table public.agents add column if not exists linkedin text;
alter table public.agents add column if not exists twitter text;

-- ---------- contact requests ----------
alter table public.contact_requests add column if not exists status text not null default 'new';
alter table public.contact_requests add column if not exists assigned_to uuid;
alter table public.contact_requests add column if not exists reply text;
alter table public.contact_requests add column if not exists replied_at timestamptz;
alter table public.contact_requests add column if not exists source text not null default 'contact';

-- ---------- subscriptions (Paystack-ready, no payment logic yet) ----------
alter table public.subscriptions add column if not exists plan_id uuid;
alter table public.subscriptions add column if not exists status text not null default 'inactive';
alter table public.subscriptions add column if not exists auto_renew boolean not null default false;
alter table public.subscriptions add column if not exists provider text default 'paystack';
alter table public.subscriptions add column if not exists provider_customer_code text;
alter table public.subscriptions add column if not exists provider_subscription_code text;
alter table public.subscriptions add column if not exists last_payment_reference text;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid references public.merchants(id) on delete set null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  amount numeric(12,2) not null default 0,
  currency text not null default 'NGN',
  provider text not null default 'paystack',
  reference text unique,
  status text not null default 'pending',
  paid_at timestamptz,
  metadata jsonb,
  created_at timestamptz not null default now()
);
grant select on public.payments to authenticated;
grant all on public.payments to service_role;
alter table public.payments enable row level security;

-- ---------- property management requests ----------
create table if not exists public.property_management_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  full_name text not null,
  email text,
  phone text,
  property_address text,
  property_type text,
  service text,
  message text,
  status text not null default 'new',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.property_management_requests to authenticated;
grant insert on public.property_management_requests to anon;
grant all on public.property_management_requests to service_role;
alter table public.property_management_requests enable row level security;

-- ---------- activity log ----------
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_name text,
  action text not null,
  entity text,
  entity_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists activity_log_created_idx on public.activity_log(created_at desc);
grant select, insert on public.activity_log to authenticated;
grant all on public.activity_log to service_role;
alter table public.activity_log enable row level security;

-- ---------- website settings ----------
create table if not exists public.website_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);
grant select on public.website_settings to anon, authenticated;
grant insert, update, delete on public.website_settings to authenticated;
grant all on public.website_settings to service_role;
alter table public.website_settings enable row level security;

-- =====================================================================
-- Row level security
-- =====================================================================
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role::text = 'admin'
  )
$$;

do $$
declare p record;
begin
  for p in
    select schemaname, tablename, policyname from pg_policies
    where schemaname='public'
      and tablename in ('properties','website_settings','property_management_requests',
                        'activity_log','agents','merchants','contact_requests','payments')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- properties
create policy "public reads published properties" on public.properties
  for select to anon, authenticated
  using (status in ('approved','sold','rented'));
create policy "owners read own properties" on public.properties
  for select to authenticated using (owner_id = auth.uid() or public.is_admin());
create policy "owners insert properties" on public.properties
  for insert to authenticated with check (owner_id = auth.uid() or public.is_admin());
create policy "owners update properties" on public.properties
  for update to authenticated using (owner_id = auth.uid() or public.is_admin());
create policy "owners delete properties" on public.properties
  for delete to authenticated using (owner_id = auth.uid() or public.is_admin());

-- website settings
create policy "anyone reads settings" on public.website_settings
  for select to anon, authenticated using (true);
create policy "admins write settings" on public.website_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- agents
create policy "anyone reads agents" on public.agents for select to anon, authenticated using (true);
create policy "admins manage agents" on public.agents
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- merchants
create policy "anyone reads merchants" on public.merchants for select to anon, authenticated using (true);
create policy "merchant manages own record" on public.merchants
  for all to authenticated using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- contact requests / enquiries
create policy "anyone submits enquiry" on public.contact_requests
  for insert to anon, authenticated with check (true);
create policy "admins read enquiries" on public.contact_requests
  for select to authenticated using (public.is_admin());
create policy "admins manage enquiries" on public.contact_requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- property management requests
create policy "anyone submits management request" on public.property_management_requests
  for insert to anon, authenticated with check (true);
create policy "admins manage management requests" on public.property_management_requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- activity log
create policy "admins read activity" on public.activity_log
  for select to authenticated using (public.is_admin());
create policy "authenticated writes activity" on public.activity_log
  for insert to authenticated with check (true);

-- payments
create policy "admins read payments" on public.payments
  for select to authenticated using (public.is_admin());

-- =====================================================================
-- Company details
-- =====================================================================
insert into public.website_settings (key, value) values
  ('brand', '{"site_name":"Tadman Homes and Properties","motto":"Buy, Sell, Rent & Manage Premium Properties with Confidence.","logo_url":"","favicon_url":""}'),
  ('contact', '{"address":"26 Adisa Akintoye Street, Ketu Alapere, Lagos, Nigeria","email":"tadmanhomes@gmail.com","email_secondary":"ralphconsult99@gmail.com","phone":"07031556176","whatsapp":"09117511768","hours":"Mon – Sat, 8:00am – 6:00pm"}'),
  ('hero', '{"title":"Find Your Perfect Property with Confidence","subtitle":"Buy, sell, rent and manage premium properties through trusted professionals.","cta_label":"Find Properties","cta_secondary_label":"Become a Merchant"}'),
  ('footer', '{"about":"Buy, Sell, Rent & Manage Premium Properties with Confidence.","socials":{"facebook":"","instagram":"","linkedin":"","x":""}}'),
  ('about_page', '{"heading":"About Tadman Homes and Properties","body":"Tadman Homes and Properties is a Lagos-based real estate company helping clients buy, sell, rent and manage premium properties with confidence."}'),
  ('property_management_page', '{"heading":"Property Management","body":"We manage residential and commercial properties end to end — tenant sourcing, rent collection, maintenance, inspections and reporting."}'),
  ('legal_team_page', '{"heading":"Our Standby Legal Team","body":"Our legal team assists with property searches, due diligence, acquisition, sales, title verification, documentation and drafting legal agreements for a reasonable professional fee.","cta_label":"Speak With Our Legal Team"}'),
  ('contact_page', '{"heading":"Contact Tadman Homes and Properties","body":"Reach our team any time — we respond within one business day."}')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- remove any demo/placeholder listings
delete from public.properties where title ilike '%lorem%' or title ilike '%demo%' or title ilike '%sample%';
