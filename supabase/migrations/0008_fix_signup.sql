-- Fix signup trigger and automatic profile creation

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role,'customer'::app_role)=
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

  IF COALESCE(NEW.raw_user_meta_data->>'role','customer') = 'merchant' THEN

      INSERT INTO public.merchants (
          user_id,
          business_name,
          email
      )
      VALUES (
          NEW.id,
          COALESCE(
              NEW.raw_user_meta_data->>'business_name',
              NEW.raw_user_meta_data->>'full_name',
              ''
          ),
          NEW.email
      )
      ON CONFLICT DO NOTHING;

  END IF;

  RETURN NEW;

END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
