CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role,'customer'::app_role)
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (
    user_id,
    role
  )
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role,'customer'::app_role)
  )
  ON CONFLICT DO NOTHING;

  /*
    Merchant creation moved to server-side webhook after successful payment.
    This prevents unauthorized merchant records being created on simple signup.
  */

  RETURN NEW;
END;
$$;
