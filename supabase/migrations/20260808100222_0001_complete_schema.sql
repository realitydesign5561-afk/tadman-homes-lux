-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Drop existing function signatures cleanly with CASCADE to prevent 42P13 & 42725 errors
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE public.user_roles.user_id = is_admin.user_id 
      AND role::text = 'admin'
  );
END;
$$;
-- ROW LEVEL SECURITY POLICIES (EXPLICIT FUNCTION CALLS)
-- ============================================================================

-- Profiles
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id) OR is_admin(auth.uid()));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO public USING (auth.uid() = id);

-- User Roles
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR is_admin(auth.uid()));

-- Merchants
CREATE POLICY "merchants_select_public" ON public.merchants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "merchants_manage_own" ON public.merchants FOR ALL TO authenticated USING ((user_id = auth.uid()) OR is_admin(auth.uid())) WITH CHECK ((user_id = auth.uid()) OR is_admin(auth.uid()));

-- Subscription Plans
CREATE POLICY "plans_select_public" ON public.subscription_plans FOR SELECT TO anon, authenticated USING (is_active OR is_admin(auth.uid()));
CREATE POLICY "plans_admin_write" ON public.subscription_plans FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Subscriptions
CREATE POLICY "subscriptions_read_own" ON public.subscriptions FOR SELECT TO public USING ((merchant_id IN (SELECT merchants.id FROM public.merchants WHERE merchants.user_id = auth.uid())) OR is_admin(auth.uid()));
CREATE POLICY "subscriptions_admin_manage" ON public.subscriptions FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Properties
CREATE POLICY "properties_select_public" ON public.properties FOR SELECT TO anon, authenticated USING (status = ANY (ARRAY['approved'::property_status, 'sold'::property_status, 'rented'::property_status]));
CREATE POLICY "properties_select_own" ON public.properties FOR SELECT TO authenticated USING ((owner_id = auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "properties_insert_own" ON public.properties FOR INSERT TO authenticated WITH CHECK ((owner_id = auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "properties_update_own" ON public.properties FOR UPDATE TO authenticated USING ((owner_id = auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "properties_delete_own" ON public.properties FOR DELETE TO authenticated USING ((owner_id = auth.uid()) OR is_admin(auth.uid()));

-- Agents
CREATE POLICY "agents_select_public" ON public.agents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "agents_admin_manage" ON public.agents FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Contact Requests
CREATE POLICY "contact_insert_public" ON public.contact_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_admin_manage" ON public.contact_requests FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Property Management Requests
CREATE POLICY "mgmt_insert_public" ON public.property_management_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "mgmt_admin_manage" ON public.property_management_requests FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Favorites
CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Newsletter
CREATE POLICY "newsletter_insert_public" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Blog Posts
CREATE POLICY "blog_select_public" ON public.blog_posts FOR SELECT TO anon, authenticated USING (is_published OR is_admin(auth.uid()));
CREATE POLICY "blog_admin_write" ON public.blog_posts FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Testimonials
CREATE POLICY "testimonials_select_public" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published OR is_admin(auth.uid()));
CREATE POLICY "testimonials_admin_write" ON public.testimonials FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- FAQs
CREATE POLICY "faq_select_public" ON public.faqs FOR SELECT TO anon, authenticated USING (is_published OR is_admin(auth.uid()));
CREATE POLICY "faq_admin_write" ON public.faqs FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Activity Log
CREATE POLICY "activity_select_admin" ON public.activity_log FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "activity_insert_self" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- Notifications
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO public USING (auth.uid() = user_id);

-- Site Settings
CREATE POLICY "site_settings_select_public" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "site_settings_insert_admin" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "site_settings_update_admin" ON public.site_settings FOR UPDATE TO authenticated USING (is_admin(auth.uid()));


-- ============================================================================
-- STORAGE BUCKETS AND POLICIES
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true) ON CONFLICT DO NOTHING;

CREATE POLICY "property_images_read_public" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'property-images');
CREATE POLICY "property_images_upload_own" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "property_images_update_own" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "property_images_delete_own" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "profile_images_read_public" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'profile-images');
CREATE POLICY "profile_images_upload_own" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "profile_images_update_own" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);


-- ============================================================================
-- SEED DATA
-- ============================================================================
INSERT INTO public.subscription_plans (name, slug, description, price, currency, interval, listing_limit, is_active, sort_order, features)
VALUES
  ('Starter', 'starter', 'Perfect for individual agents getting started', 10000, 'NGN', 'monthly', 5, true, 1, ARRAY['List up to 5 properties', 'Merchant dashboard', 'Manage enquiries', 'Basic analytics']),
  ('Professional', 'professional', 'For growing agencies and developers', 25000, 'NGN', 'monthly', 50, true, 2, ARRAY['List up to 50 properties', 'Featured property listings', 'Priority visibility', 'Advanced analytics', 'Enquiry management']),
  ('Enterprise', 'enterprise', 'For large agencies and developers', 50000, 'NGN', 'monthly', NULL, true, 3, ARRAY['Unlimited property listings', 'Multiple agent accounts', 'Priority support', 'Custom branding', 'Advanced management tools'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('brand', '{"site_name":"Tadman Homes and Properties","motto":"Buy, Sell & Rent Premium Properties Worldwide","logo_url":"","favicon_url":""}'::jsonb),
  ('contact', '{"address":"26 Adisa Akintoye Street, Ketu Alapere, Lagos","email":"tadmanhomes@gmail.com","email_secondary":"ralphconsult99@gmail.com","phone":"07031556176","whatsapp":"09117511768","hours":""}'::jsonb),
  ('hero', '{"title":"Buy, Sell & Rent Premium Properties Worldwide","subtitle":"","cta_label":"Find Properties","cta_secondary_label":"List Your Property"}'::jsonb),
  ('footer', '{"about":"","socials":{"facebook":"","instagram":"","linkedin":"","x":"","youtube":"","tiktok":""}}'::jsonb),
  ('about_page', '{"heading":"About Tadman Homes and Properties","body":""}'::jsonb),
  ('property_management_page', '{"heading":"Property Management","body":""}'::jsonb),
  ('legal_team_page', '{"heading":"Legal Team","body":"","cta_label":"Speak With Our Legal Team"}'::jsonb),
  ('contact_page', '{"heading":"Contact Tadman Homes and Properties","body":""}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;


On Sat, Aug 8, 2026, 3:26 PM Reality Design <realitydesign5561@gmail.com> wrote:
-- ============================================================================
-- TADMAN HOMES & PROPERTIES — COMPLETE DATABASE SCHEMA
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS (Aligned with Live Database)
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM ('admin', 'merchant', 'customer', 'guest');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
        CREATE TYPE property_status AS ENUM ('pending', 'approved', 'rejected', 'draft', 'sold', 'rented', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_type') THEN
        CREATE TYPE listing_type AS ENUM ('buy', 'sell', 'rent', 'shortlet');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('pending_approval', 'active', 'expired', 'suspended');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'merchant_status') THEN
        CREATE TYPE merchant_status AS ENUM ('pending_approval', 'active', 'suspended', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');
    END IF;
END $$;

-- Add any missing ENUM values to existing types safely
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'guest';
ALTER TYPE public.merchant_status ADD VALUE IF NOT EXISTS 'pending_approval';
ALTER TYPE public.merchant_status ADD VALUE IF NOT EXISTS 'active';
ALTER TYPE public.subscription_status ADD VALUE IF NOT EXISTS 'pending_approval';

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = user_id_param
      AND role = 'admin'::app_role
  );
END;
$$;

-- ============================================================================
-- TABLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text DEFAULT '',
  phone text,
  avatar_url text,
  role app_role DEFAULT 'customer'::app_role,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer'::app_role,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.merchants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  business_name text NOT NULL,
  email text,
  phone text,
  whatsapp_number text,
  address text,
  city text,
  state text,
  country text DEFAULT 'Nigeria',
  website text,
  logo_url text,
  description text,
  status merchant_status DEFAULT 'pending_approval'::merchant_status,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'NGN',
  interval text DEFAULT 'monthly',
  listing_limit integer,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  status subscription_status DEFAULT 'pending_approval'::subscription_status,
  start_date date,
  expiry_date date NOT NULL,
  payment_reference text,
  amount numeric,
  currency text DEFAULT 'NGN',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE,
  title text NOT NULL,
  description text,
  price numeric,
  currency text DEFAULT 'NGN',
  country text DEFAULT 'Nigeria',
  state text,
  city text,
  address text,
  area text,
  property_type text DEFAULT 'Apartment',
  listing_type listing_type DEFAULT 'buy'::listing_type,
  bedrooms integer,
  bathrooms integer,
  toilets integer,
  area_size numeric,
  area_unit text DEFAULT 'sqm',
  amenities text[] DEFAULT '{}',
  featured_image text,
  images text[] DEFAULT '{}',
  status property_status DEFAULT 'draft'::property_status,
  is_featured boolean DEFAULT false,
  views integer DEFAULT 0,
  views_count integer DEFAULT 0,
  merchant_id uuid REFERENCES public.merchants(id) ON DELETE SET NULL,
  agent_id uuid,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  title text,
  bio text,
  photo_url text,
  email text,
  phone text,
  whatsapp text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text,
  phone text,
  subject text,
  message text NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  merchant_id uuid REFERENCES public.merchants(id) ON DELETE SET NULL,
  source text,
  is_read boolean DEFAULT false,
  reply text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.property_management_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  email text,
  phone text,
  property_address text,
  property_type text,
  service text,
  message text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'homepage',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  cover_image text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  author text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name text NOT NULL,
  author_role text,
  content text NOT NULL,
  rating integer DEFAULT 5,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id uuid,
  actor_name text,
  action text NOT NULL,
  entity text,
  entity_id text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  audience text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb,
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_merchant ON public.properties(merchant_id);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON public.merchants(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON public.merchants(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_merchant ON public.subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'customer'::app_role)
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'customer'::app_role)
  )
  ON CONFLICT DO NOTHING;

  IF COALESCE(NEW.raw_user_meta_data->>'role','customer') = 'merchant' THEN
    INSERT INTO public.merchants (user_id, business_name, status)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'business_name', NEW.raw_user_meta_data->>'full_name', ''),
      'pending_approval'::merchant_status
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (ENABLE)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_management_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Dynamic Cleanup of Existing Public Policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Dynamic Cleanup of Existing Storage Policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Profiles
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id) OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO public USING (auth.uid() = id);

-- User Roles
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR is_admin(auth.uid()));

-- Merchants
DROP POLICY IF EXISTS "merchants_select_public" ON public.merchants;
CREATE POLICY "merchants_select_public" ON public.merchants FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "merchants_manage_own" ON public.merchants;
CREATE POLICY "merchants_manage_own" ON public.merchants FOR ALL TO authenticated USING ((user_id = auth.uid()) OR is_admin(auth.uid())) WITH CHECK ((user_id = auth.uid()) OR is_admin(auth.uid()));

-- Subscription Plans
DROP POLICY IF EXISTS "plans_select_public" ON public.subscription_plans;
CREATE POLICY "plans_select_public" ON public.subscription_plans FOR SELECT TO anon, authenticated USING (is_active OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "plans_admin_write" ON public.subscription_plans;
CREATE POLICY "plans_admin_write" ON public.subscription_plans FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Subscriptions
DROP POLICY IF EXISTS "subscriptions_read_own" ON public.subscriptions;
CREATE POLICY "subscriptions_read_own" ON public.subscriptions FOR SELECT TO public USING ((merchant_id IN (SELECT merchants.id FROM public.merchants WHERE merchants.user_id = auth.uid())) OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "subscriptions_admin_manage" ON public.subscriptions;
CREATE POLICY "subscriptions_admin_manage" ON public.subscriptions FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Properties
DROP POLICY IF EXISTS "properties_select_public" ON public.properties;
CREATE POLICY "properties_select_public" ON public.properties FOR SELECT TO anon, authenticated USING (status = ANY (ARRAY['approved'::property_status, 'sold'::property_status, 'rented'::property_status]));

DROP POLICY IF EXISTS "properties_select_own" ON public.properties;
CREATE POLICY "properties_select_own" ON public.properties FOR SELECT TO authenticated USING ((owner_id = auth.uid()) OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "properties_insert_own" ON public.properties;
CREATE POLICY "properties_insert_own" ON public.properties FOR INSERT TO authenticated WITH CHECK ((owner_id = auth.uid()) OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "properties_update_own" ON public.properties;
CREATE POLICY "properties_update_own" ON public.properties FOR UPDATE TO authenticated USING ((owner_id = auth.uid()) OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "properties_delete_own" ON public.properties;
CREATE POLICY "properties_delete_own" ON public.properties FOR DELETE TO authenticated USING ((owner_id = auth.uid()) OR is_admin(auth.uid()));

-- Agents
DROP POLICY IF EXISTS "agents_select_public" ON public.agents;
CREATE POLICY "agents_select_public" ON public.agents FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "agents_admin_manage" ON public.agents;
CREATE POLICY "agents_admin_manage" ON public.agents FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Contact Requests
DROP POLICY IF EXISTS "contact_insert_public" ON public.contact_requests;
CREATE POLICY "contact_insert_public" ON public.contact_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "contact_admin_manage" ON public.contact_requests;
CREATE POLICY "contact_admin_manage" ON public.contact_requests FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Property Management Requests
DROP POLICY IF EXISTS "mgmt_insert_public" ON public.property_management_requests;
CREATE POLICY "mgmt_insert_public" ON public.property_management_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "mgmt_admin_manage" ON public.property_management_requests;
CREATE POLICY "mgmt_admin_manage" ON public.property_management_requests FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Favorites
DROP POLICY IF EXISTS "favorites_select_own" ON public.favorites;
CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_insert_own" ON public.favorites;
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_delete_own" ON public.favorites;
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Newsletter
DROP POLICY IF EXISTS "newsletter_insert_public" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_insert_public" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Blog Posts
DROP POLICY IF EXISTS "blog_select_public" ON public.blog_posts;
CREATE POLICY "blog_select_public" ON public.blog_posts FOR SELECT TO anon, authenticated USING (is_published OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "blog_admin_write" ON public.blog_posts;
CREATE POLICY "blog_admin_write" ON public.blog_posts FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Testimonials
DROP POLICY IF EXISTS "testimonials_select_public" ON public.testimonials;
CREATE POLICY "testimonials_select_public" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "testimonials_admin_write" ON public.testimonials;
CREATE POLICY "testimonials_admin_write" ON public.testimonials FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- FAQs
DROP POLICY IF EXISTS "faq_select_public" ON public.faqs;
CREATE POLICY "faq_select_public" ON public.faqs FOR SELECT TO anon, authenticated USING (is_published OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "faq_admin_write" ON public.faqs;
CREATE POLICY "faq_admin_write" ON public.faqs FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Activity Log
DROP POLICY IF EXISTS "activity_select_admin" ON public.activity_log;
CREATE POLICY "activity_select_admin" ON public.activity_log FOR SELECT TO authenticated USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "activity_insert_self" ON public.activity_log;
CREATE POLICY "activity_insert_self" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- Notifications
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO public USING (auth.uid() = user_id);

-- Site Settings
DROP POLICY IF EXISTS "site_settings_select_public" ON public.site_settings;
CREATE POLICY "site_settings_select_public" ON public.site_settings FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "site_settings_insert_admin" ON public.site_settings;
CREATE POLICY "site_settings_insert_admin" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "site_settings_update_admin" ON public.site_settings;
CREATE POLICY "site_settings_update_admin" ON public.site_settings FOR UPDATE TO authenticated USING (is_admin(auth.uid()));


-- ============================================================================
-- STORAGE BUCKETS AND POLICIES
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true) ON CONFLICT DO NOTHING;

CREATE POLICY "property_images_read_public" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'property-images');
CREATE POLICY "property_images_upload_own" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "property_images_update_own" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "property_images_delete_own" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "profile_images_read_public" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'profile-images');
CREATE POLICY "profile_images_upload_own" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "profile_images_update_own" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);

-- ============================================================================
-- SEED DATA
-- ============================================================================
INSERT INTO public.subscription_plans (name, slug, description, price, currency, interval, listing_limit, is_active, sort_order, features)
VALUES
  ('Starter', 'starter', 'Perfect for individual agents getting started', 10000, 'NGN', 'monthly', 5, true, 1, ARRAY['List up to 5 properties', 'Merchant dashboard', 'Manage enquiries', 'Basic analytics']),
  ('Professional', 'professional', 'For growing agencies and developers', 25000, 'NGN', 'monthly', 50, true, 2, ARRAY['List up to 50 properties', 'Featured property listings', 'Priority visibility', 'Advanced analytics', 'Enquiry management']),
  ('Enterprise', 'enterprise', 'For large agencies and developers', 50000, 'NGN', 'monthly', NULL, true, 3, ARRAY['Unlimited property listings', 'Multiple agent accounts', 'Priority support', 'Custom branding', 'Advanced management tools'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('brand', '{"site_name":"Tadman Homes and Properties","motto":"Buy, Sell & Rent Premium Properties Worldwide","logo_url":"","favicon_url":""}'::jsonb),
  ('contact', '{"address":"26 Adisa Akintoye Street, Ketu Alapere, Lagos","email":"tadmanhomes@gmail.com","email_secondary":"ralphconsult99@gmail.com","phone":"07031556176","whatsapp":"09117511768","hours":""}'::jsonb),
  ('hero', '{"title":"Buy, Sell & Rent Premium Properties Worldwide","subtitle":"","cta_label":"Find Properties","cta_secondary_label":"List Your Property"}'::jsonb),
  ('footer', '{"about":"","socials":{"facebook":"","instagram":"","linkedin":"","x":"","youtube":"","tiktok":""}}'::jsonb),
  ('about_page', '{"heading":"About Tadman Homes and Properties","body":""}'::jsonb),
  ('property_management_page', '{"heading":"Property Management","body":""}'::jsonb),
  ('legal_team_page', '{"heading":"Legal Team","body":"","cta_label":"Speak With Our Legal Team"}'::jsonb),
  ('contact_page', '{"heading":"Contact Tadman Homes and Properties","body":""}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

On Sat, Aug 8, 2026 at 7:03 AM Zionpraise Oluwaseun <oluwaseunzionpraise@gmail.com> wrote:
-- ============================================================================
-- TADMAN HOMES & PROPERTIES — COMPLETE DATABASE SCHEMA
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS (Aligned with Live Database)
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM ('admin', 'merchant', 'customer', 'guest');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
        CREATE TYPE property_status AS ENUM ('pending', 'approved', 'rejected', 'draft', 'sold', 'rented', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_type') THEN
        CREATE TYPE listing_type AS ENUM ('buy', 'sell', 'rent', 'shortlet');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('pending_approval', 'active', 'expired', 'suspended');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'merchant_status') THEN
        CREATE TYPE merchant_status AS ENUM ('pending_approval', 'active', 'suspended', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');
    END IF;
END $$;

-- Add any missing ENUM values to existing types safely
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'guest';
ALTER TYPE public.merchant_status ADD VALUE IF NOT EXISTS 'pending_approval';
ALTER TYPE public.merchant_status ADD VALUE IF NOT EXISTS 'active';
ALTER TYPE public.subscription_status ADD VALUE IF NOT EXISTS 'pending_approval';

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_id_param 
      AND role = 'admin'::app_role
  );
END;
$$;

-- ============================================================================
-- TABLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text DEFAULT '',
  phone text,
  avatar_url text,
  role app_role DEFAULT 'customer'::app_role,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer'::app_role,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.merchants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  business_name text NOT NULL,
  email text,
  phone text,
  whatsapp_number text,
  address text,
  city text,
  state text,
  country text DEFAULT 'Nigeria',
  website text,
  logo_url text,
  description text,
  status merchant_status DEFAULT 'pending_approval'::merchant_status,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'NGN',
  interval text DEFAULT 'monthly',
  listing_limit integer,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  status subscription_status DEFAULT 'pending_approval'::subscription_status,
  start_date date,
  expiry_date date NOT NULL,
  payment_reference text,
  amount numeric,
  currency text DEFAULT 'NGN',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE,
  title text NOT NULL,
  description text,
  price numeric,
  currency text DEFAULT 'NGN',
  country text DEFAULT 'Nigeria',
  state text,
  city text,
  address text,
  area text,
  property_type text DEFAULT 'Apartment',
  listing_type listing_type DEFAULT 'buy'::listing_type,
  bedrooms integer,
  bathrooms integer,
  toilets integer,
  area_size numeric,
  area_unit text DEFAULT 'sqm',
  amenities text[] DEFAULT '{}',
  featured_image text,
  images text[] DEFAULT '{}',
  status property_status DEFAULT 'draft'::property_status,
  is_featured boolean DEFAULT false,
  views integer DEFAULT 0,
  views_count integer DEFAULT 0,
  merchant_id uuid REFERENCES public.merchants(id) ON DELETE SET NULL,
  agent_id uuid,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  title text,
  bio text,
  photo_url text,
  email text,
  phone text,
  whatsapp text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text,
  phone text,
  subject text,
  message text NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  merchant_id uuid REFERENCES public.merchants(id) ON DELETE SET NULL,
  source text,
  is_read boolean DEFAULT false,
  reply text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.property_management_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  email text,
  phone text,
  property_address text,
  property_type text,
  service text,
  message text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'homepage',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  cover_image text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  author text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name text NOT NULL,
  author_role text,
  content text NOT NULL,
  rating integer DEFAULT 5,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id uuid,
  actor_name text,
  action text NOT NULL,
  entity text,
  entity_id text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  audience text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb,
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_merchant ON public.properties(merchant_id);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON public.merchants(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON public.merchants(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_merchant ON public.subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'customer'::app_role)
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'customer'::app_role)
  )
  ON CONFLICT DO NOTHING;

  IF COALESCE(NEW.raw_user_meta_data->>'role','customer') = 'merchant' THEN
    INSERT INTO public.merchants (user_id, business_name, status)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'business_name', NEW.raw_user_meta_data->>'full_name', ''),
      'pending_approval'::merchant_status
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (ENABLE)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_management_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Dynamic Cleanup of Existing Public Policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Dynamic Cleanup of Existing Storage Policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES (MATCHING LIVE SCHEMA)
-- ============================================================================

-- Profiles
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id) OR is_admin(auth.uid()));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO public USING (auth.uid() = id);

-- User Roles
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR is_admin());

-- Merchants
CREATE POLICY "merchants_select_public" ON public.merchants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "merchants_manage_own" ON public.merchants FOR ALL TO authenticated USING ((user_id = auth.uid()) OR is_admin()) WITH CHECK ((user_id = auth.uid()) OR is_admin());

-- Subscription Plans
CREATE POLICY "plans_select_public" ON public.subscription_plans FOR SELECT TO anon, authenticated USING (is_active OR is_admin());
CREATE POLICY "plans_admin_write" ON public.subscription_plans FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Subscriptions
CREATE POLICY "subscriptions_read_own" ON public.subscriptions FOR SELECT TO public USING ((merchant_id IN (SELECT merchants.id FROM public.merchants WHERE merchants.user_id = auth.uid())) OR is_admin(auth.uid()));
CREATE POLICY "subscriptions_admin_manage" ON public.subscriptions FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Properties
CREATE POLICY "properties_select_public" ON public.properties FOR SELECT TO anon, authenticated USING (status = ANY (ARRAY['approved'::property_status, 'sold'::property_status, 'rented'::property_status]));
CREATE POLICY "properties_select_own" ON public.properties FOR SELECT TO authenticated USING ((owner_id = auth.uid()) OR is_admin());
CREATE POLICY "properties_insert_own" ON public.properties FOR INSERT TO authenticated WITH CHECK ((owner_id = auth.uid()) OR is_admin());
CREATE POLICY "properties_update_own" ON public.properties FOR UPDATE TO authenticated USING ((owner_id = auth.uid()) OR is_admin());
CREATE POLICY "properties_delete_own" ON public.properties FOR DELETE TO authenticated USING ((owner_id = auth.uid()) OR is_admin());

-- Agents
CREATE POLICY "agents_select_public" ON public.agents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "agents_admin_manage" ON public.agents FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Contact Requests
CREATE POLICY "contact_insert_public" ON public.contact_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_admin_manage" ON public.contact_requests FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Property Management Requests
CREATE POLICY "mgmt_insert_public" ON public.property_management_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "mgmt_admin_manage" ON public.property_management_requests FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Favorites
CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Newsletter
CREATE POLICY "newsletter_insert_public" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Blog Posts
CREATE POLICY "blog_select_public" ON public.blog_posts FOR SELECT TO anon, authenticated USING (is_published OR is_admin());
CREATE POLICY "blog_admin_write" ON public.blog_posts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Testimonials
CREATE POLICY "testimonials_select_public" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published OR is_admin());
CREATE POLICY "testimonials_admin_write" ON public.testimonials FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- FAQs
CREATE POLICY "faq_select_public" ON public.faqs FOR SELECT TO anon, authenticated USING (is_published OR is_admin());
CREATE POLICY "faq_admin_write" ON public.faqs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Activity Log
CREATE POLICY "activity_select_admin" ON public.activity_log FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "activity_insert_self" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- Notifications
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO public USING (auth.uid() = user_id);

-- Site Settings
CREATE POLICY "site_settings_select_public" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "site_settings_insert_admin" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role));
CREATE POLICY "site_settings_update_admin" ON public.site_settings FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role));

-- ============================================================================
-- STORAGE BUCKETS AND POLICIES
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true) ON CONFLICT DO NOTHING;

CREATE POLICY "property_images_read_public" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'property-images');
CREATE POLICY "property_images_upload_own" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "property_images_update_own" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "property_images_delete_own" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "profile_images_read_public" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'profile-images');
CREATE POLICY "profile_images_upload_own" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "profile_images_update_own" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);

-- ============================================================================
-- SEED DATA
-- ============================================================================
INSERT INTO public.subscription_plans (name, slug, description, price, currency, interval, listing_limit, is_active, sort_order, features)
VALUES
  ('Starter', 'starter', 'Perfect for individual agents getting started', 10000, 'NGN', 'monthly', 5, true, 1, ARRAY['List up to 5 properties', 'Merchant dashboard', 'Manage enquiries', 'Basic analytics']),
  ('Professional', 'professional', 'For growing agencies and developers', 25000, 'NGN', 'monthly', 50, true, 2, ARRAY['List up to 50 properties', 'Featured property listings', 'Priority visibility', 'Advanced analytics', 'Enquiry management']),
  ('Enterprise', 'enterprise', 'For large agencies and developers', 50000, 'NGN', 'monthly', NULL, true, 3, ARRAY['Unlimited property listings', 'Multiple agent accounts', 'Priority support', 'Custom branding', 'Advanced management tools'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('brand', '{"site_name":"Tadman Homes and Properties","motto":"Buy, Sell & Rent Premium Properties Worldwide","logo_url":"","favicon_url":""}'::jsonb),
  ('contact', '{"address":"26 Adisa Akintoye Street, Ketu Alapere, Lagos","email":"tadmanhomes@gmail.com","email_secondary":"ralphconsult99@gmail.com","phone":"07031556176","whatsapp":"09117511768","hours":""}'::jsonb),
  ('hero', '{"title":"Buy, Sell & Rent Premium Properties Worldwide","subtitle":"","cta_label":"Find Properties","cta_secondary_label":"List Your Property"}'::jsonb),
  ('footer', '{"about":"","socials":{"facebook":"","instagram":"","linkedin":"","x":"","youtube":"","tiktok":""}}'::jsonb),
  ('about_page', '{"heading":"About Tadman Homes and Properties","body":""}'::jsonb),
  ('property_management_page', '{"heading":"Property Management","body":""}'::jsonb),
  ('legal_team_page', '{"heading":"Legal Team","body":"","cta_label":"Speak With Our Legal Team"}'::jsonb),
  ('contact_page', '{"heading":"Contact Tadman Homes and Properties","body":""}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

