-- ============================================================================
-- TADMAN HOMES & PROPERTIES — COMPLETE DATABASE SCHEMA
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM ('admin', 'merchant', 'agent', 'customer');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
        CREATE TYPE property_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'sold', 'rented', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_type') THEN
        CREATE TYPE listing_type AS ENUM ('buy', 'sell', 'rent', 'shortlet');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled', 'pending', 'suspended');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'merchant_status') THEN
        CREATE TYPE merchant_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enquiry_status') THEN
        CREATE TYPE enquiry_status AS ENUM ('new', 'read', 'resolved', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'management_status') THEN
        CREATE TYPE management_status AS ENUM ('new', 'in_progress', 'completed', 'cancelled');
    END IF;
END $$;

-- ============================================================================
-- TABLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text DEFAULT '',
  phone text,
  avatar_url text,
  role app_role DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer',
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
  status merchant_status DEFAULT 'pending',
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
  status subscription_status DEFAULT 'pending',
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
  listing_type listing_type DEFAULT 'buy',
  bedrooms integer,
  bathrooms integer,
  toilets integer,
  area_size numeric,
  area_unit text DEFAULT 'sqm',
  amenities text[] DEFAULT '{}',
  featured_image text,
  images text[] DEFAULT '{}',
  status property_status DEFAULT 'draft',
  is_featured boolean DEFAULT false,
  views integer DEFAULT 0,
  views_count integer DEFAULT 0,
  merchant_id uuid REFERENCES public.merchants(id) ON DELETE SET NULL,
  agent_id uuid,
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
  status enquiry_status DEFAULT 'new',
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
  status management_status DEFAULT 'new',
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
  title text NOT NULL,
  body text,
  audience text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.navigation_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  label text NOT NULL,
  href text NOT NULL,
  parent_id uuid REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
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
CREATE INDEX IF NOT EXISTS idx_properties_country ON public.properties(country);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON public.merchants(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON public.merchants(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_merchant ON public.subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry ON public.subscriptions(expiry_date);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON public.contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_management_requests_status ON public.property_management_requests(status);
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
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role,'customer'::app_role)
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role,'customer'::app_role)
  )
  ON CONFLICT DO NOTHING;

  IF COALESCE(NEW.raw_user_meta_data->>'role','customer') = 'merchant' THEN
    INSERT INTO public.merchants (user_id, business_name, status)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'business_name', NEW.raw_user_meta_data->>'full_name', ''),
      'pending'
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

CREATE OR REPLACE FUNCTION public.expire_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  UPDATE public.subscriptions
  SET status = 'expired', updated_at = now()
  WHERE status = 'active' AND expiry_date < CURRENT_DATE;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_merchant_subscription_status(p_merchant_id uuid)
RETURNS TABLE(has_active boolean, expiry_date date, plan_name text, days_remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE WHEN s.expiry_date >= CURRENT_DATE AND s.status = 'active' THEN true ELSE false END,
    s.expiry_date,
    sp.name,
    (s.expiry_date - CURRENT_DATE)::integer
  FROM public.subscriptions s
  LEFT JOIN public.subscription_plans sp ON sp.id = s.plan_id
  WHERE s.merchant_id = p_merchant_id
    AND s.status = 'active'
  ORDER BY s.expiry_date DESC
  LIMIT 1;
END;
$$;

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
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
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
-- ROW LEVEL SECURITY (POLICIES)
-- ============================================================================

-- Profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- User Roles
CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Merchants
CREATE POLICY "merchants_select_public" ON public.merchants FOR SELECT TO anon, authenticated USING (status = 'approved' OR user_id = auth.uid() OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "merchants_insert_own" ON public.merchants FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "merchants_update_own" ON public.merchants FOR UPDATE TO authenticated USING (user_id = auth.uid() OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "merchants_delete_admin" ON public.merchants FOR DELETE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Subscription Plans
CREATE POLICY "plans_select_public" ON public.subscription_plans FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "plans_insert_admin" ON public.subscription_plans FOR INSERT TO authenticated WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "plans_update_admin" ON public.subscription_plans FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Subscriptions
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT TO authenticated USING (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()) OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "subscriptions_insert_own" ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()) OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Properties
CREATE POLICY "properties_select_public" ON public.properties FOR SELECT TO anon, authenticated USING (status = 'approved' OR merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()) OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "properties_insert_own" ON public.properties FOR INSERT TO authenticated WITH CHECK (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()) OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "properties_update_own" ON public.properties FOR UPDATE TO authenticated USING (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()) OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')) WITH CHECK (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()) OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "properties_delete_own" ON public.properties FOR DELETE TO authenticated USING (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()) OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Agents
CREATE POLICY "agents_select_public" ON public.agents FOR SELECT TO anon, authenticated USING (is_active = true OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "agents_insert_admin" ON public.agents FOR INSERT TO authenticated WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "agents_update_admin" ON public.agents FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "agents_delete_admin" ON public.agents FOR DELETE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Contact Requests
CREATE POLICY "contact_insert_public" ON public.contact_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_select_admin" ON public.contact_requests FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') OR merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()));
CREATE POLICY "contact_update_admin" ON public.contact_requests FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "contact_delete_admin" ON public.contact_requests FOR DELETE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Property Management Requests
CREATE POLICY "mgmt_insert_public" ON public.property_management_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "mgmt_select_admin" ON public.property_management_requests FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "mgmt_update_admin" ON public.property_management_requests FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "mgmt_delete_admin" ON public.property_management_requests FOR DELETE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Favorites
CREATE POLICY "fav_select_own" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "fav_insert_own" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fav_delete_own" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Newsletter
CREATE POLICY "newsletter_insert_public" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "newsletter_select_admin" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Blog Posts
CREATE POLICY "blog_select_public" ON public.blog_posts FOR SELECT TO anon, authenticated USING (is_published = true OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "blog_insert_admin" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "blog_update_admin" ON public.blog_posts FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "blog_delete_admin" ON public.blog_posts FOR DELETE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Testimonials
CREATE POLICY "test_select_public" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published = true OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "test_insert_admin" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "test_update_admin" ON public.testimonials FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "test_delete_admin" ON public.testimonials FOR DELETE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- FAQs
CREATE POLICY "faq_select_public" ON public.faqs FOR SELECT TO anon, authenticated USING (is_published = true OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "faq_insert_admin" ON public.faqs FOR INSERT TO authenticated WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "faq_update_admin" ON public.faqs FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "faq_delete_admin" ON public.faqs FOR DELETE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Activity Log
CREATE POLICY "activity_select_admin" ON public.activity_log FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "activity_insert_auth" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- Notifications
CREATE POLICY "notif_select_auth" ON public.notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "notif_insert_admin" ON public.notifications FOR INSERT TO authenticated WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "notif_update_admin" ON public.notifications FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "notif_delete_admin" ON public.notifications FOR DELETE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Navigation
CREATE POLICY "nav_select_public" ON public.navigation_items FOR SELECT TO anon, authenticated USING (is_active = true OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "nav_insert_admin" ON public.navigation_items FOR INSERT TO authenticated WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "nav_update_admin" ON public.navigation_items FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "nav_delete_admin" ON public.navigation_items FOR DELETE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Site Settings
CREATE POLICY "settings_select_public" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings_insert_admin" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "settings_update_admin" ON public.site_settings FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

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
