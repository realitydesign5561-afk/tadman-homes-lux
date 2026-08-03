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

  IF COALESCE(NEW.raw_user_meta_data->>'role','customer') = 'merchant' THEN

    INSERT INTO public.merchants (
      user_id,
      business_name
    )
    VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data->>'business_name',
        NEW.raw_user_meta_data->>'full_name',
        ''
      )
    )
    ON CONFLICT (user_id) DO NOTHING;

  END IF;

  RETURN NEW;
END;
$$;
