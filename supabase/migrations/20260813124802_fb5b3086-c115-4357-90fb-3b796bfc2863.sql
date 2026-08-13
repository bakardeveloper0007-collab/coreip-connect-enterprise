-- Super admins can grant/revoke roles
GRANT INSERT, DELETE ON public.user_roles TO authenticated;

CREATE POLICY "roles super admin insert" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "roles super admin delete" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Never allow removing the final super_admin
CREATE OR REPLACE FUNCTION public.protect_last_super_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role = 'super_admin'
     AND (SELECT count(*) FROM public.user_roles WHERE role = 'super_admin') <= 1 THEN
    RAISE EXCEPTION 'At least one Super Admin must remain';
  END IF;
  RETURN OLD;
END; $$;

CREATE TRIGGER t_protect_last_super_admin
  BEFORE DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.protect_last_super_admin();

-- Staff directory for the admin Users screen
CREATE OR REPLACE FUNCTION public.list_staff_accounts()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz,
  roles app_role[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.email, p.full_name, p.avatar_url, p.created_at,
         COALESCE(ARRAY(SELECT ur.role FROM public.user_roles ur WHERE ur.user_id = p.id ORDER BY ur.role), '{}'::app_role[])
    FROM public.profiles p
   WHERE public.has_role(auth.uid(), 'super_admin')
   ORDER BY p.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.list_staff_accounts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_staff_accounts() TO authenticated;