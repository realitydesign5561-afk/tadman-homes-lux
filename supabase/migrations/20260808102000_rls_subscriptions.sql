-- Migration: RLS & subscription helpers for Tadman Homes
-- Adds helper functions, indexes, subscription management helpers and replaces mismatched RLS policies

-- 1) Remove Nigeria defaults to support worldwide listings/merchants
ALTER TABLE public.merchants ALTER COLUMN country DROP DEFAULT;
ALTER TABLE public.properties ALTER COLUMN country DROP DEFAULT;

-- 2) Helper: return current merchant id for the authenticated user
CREATE OR REPLACE FUNCTION public.current_merchant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT id FROM public.merchants WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 3) Helper: check if current authenticated user is an approved merchant with active subscription
CREATE OR REPLACE FUNCTION public.is_active_merchant()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.merchants m
    JOIN public.subscriptions s ON s.merchant_id = m.id
    WHERE m.user_id = auth.uid()
      AND m.status = 'approved'
      AND s.status = 'active'
      AND s.expiry_date >= now()::date
    LIMIT 1
  );
$$;

-- 4) Helper: list subscriptions expiring soon (for scheduled jobs / emails)
CREATE OR REPLACE FUNCTION public.subscriptions_expiring_soon(days_before integer DEFAULT 3)
RETURNS TABLE(merchant_id uuid, subscription_id uuid, expiry_date date, email text) AS $$
  SELECT m.id, s.id, s.expiry_date, m.email
  FROM public.subscriptions s
  JOIN public.merchants m ON m.id = s.merchant_id
  WHERE s.status = 'active'
    AND s.expiry_date = (now()::date + (days_before || ' days')::interval)::date;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 5) Helper: mark expired subscriptions (to be called by a scheduled job)
CREATE OR REPLACE FUNCTION public.mark_expired_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.subscriptions
  SET status = 'expired', updated_at = now()
  WHERE status = 'active' AND expiry_date < now()::date;
END;
$$;

-- 6) Add indexes to improve lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry_date ON public.subscriptions(expiry_date);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties( lower(property_type) );
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_merchant_id ON public.properties(merchant_id);

-- 7) Recreate/fix RLS policies for properties, merchants, subscriptions, contact_requests to align with schema
-- Drop known policies that may reference old columns
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'properties' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.properties', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'merchants' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.merchants', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscriptions' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.subscriptions', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_requests' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.contact_requests', r.policyname);
  END LOOP;
END$$;

-- Properties: public can read only approved/published properties
CREATE POLICY "public reads published properties" ON public.properties
  FOR SELECT TO anon, authenticated
  USING (status IN ('approved','sold','rented'));

-- Properties: merchants (authenticated) can read their own properties, admins can read all
CREATE POLICY "merchant reads own properties" ON public.properties
  FOR SELECT TO authenticated
  USING ((merchant_id IS NOT NULL AND merchant_id = public.current_merchant_id()) OR public.is_admin());

-- Properties: merchants may insert properties only for their merchant account and only if active; admins can also insert
CREATE POLICY "merchant inserts properties" ON public.properties
  FOR INSERT TO authenticated
  WITH CHECK ((merchant_id = public.current_merchant_id() AND public.is_active_merchant()) OR public.is_admin());

-- Properties: merchants may update/delete only their own properties; admins may update/delete all
CREATE POLICY "merchant updates properties" ON public.properties
  FOR UPDATE TO authenticated
  USING ((merchant_id = public.current_merchant_id()) OR public.is_admin())
  WITH CHECK ((merchant_id = public.current_merchant_id()) OR public.is_admin());

CREATE POLICY "merchant deletes properties" ON public.properties
  FOR DELETE TO authenticated
  USING ((merchant_id = public.current_merchant_id()) OR public.is_admin());

-- Merchants: read allowed to anyone (public) but management restricted
CREATE POLICY "anyone reads merchants" ON public.merchants
  FOR SELECT TO anon, authenticated
  USING (true);

-- Merchants: updates allowed to owner (but not to set status to 'approved' or 'suspended') or admin
CREATE POLICY "merchant manages own record" ON public.merchants
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK ((user_id = auth.uid() AND (status <> 'approved' AND status <> 'suspended')) OR public.is_admin());

-- Merchants: inserts should not be permitted by regular users (merchant rows must be created server-side after payment)
CREATE POLICY "admins insert merchants only" ON public.merchants
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- Subscriptions: merchants can read their own subscriptions; admins can manage all
CREATE POLICY "merchant reads own subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated
  USING ((merchant_id IS NOT NULL AND merchant_id = public.current_merchant_id()) OR public.is_admin());

-- Subscriptions: inserts/updates/deletes should be restricted to admins or service-role (service-role bypasses RLS)
CREATE POLICY "admins manage subscriptions" ON public.subscriptions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Contact requests: anyone can insert enquiries; admins can read/manage
CREATE POLICY "anyone submits enquiry" ON public.contact_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admins read enquiries" ON public.contact_requests
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "admins manage enquiries" ON public.contact_requests
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8) Ensure subscriptions.plan_id has index
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON public.subscriptions(plan_id);

-- 9) Safe guard: ensure no existing public triggers auto-creating merchants on signup remain
-- (the handle_new_user function should not insert merchants; if present this migration does not attempt to drop user-owned functions)

-- Done.
