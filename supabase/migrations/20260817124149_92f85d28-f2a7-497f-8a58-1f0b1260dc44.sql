ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS datasheet_access text NOT NULL DEFAULT 'public';

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_datasheet_access_check;
ALTER TABLE public.products
  ADD CONSTRAINT products_datasheet_access_check CHECK (datasheet_access IN ('public','gated'));

CREATE TABLE IF NOT EXISTS public.datasheet_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  product_name text,
  name text,
  company text,
  phone text,
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS datasheet_requests_email_idx ON public.datasheet_requests (email, created_at DESC);

GRANT SELECT ON public.datasheet_requests TO authenticated;
GRANT ALL ON public.datasheet_requests TO service_role;

ALTER TABLE public.datasheet_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lead managers can view datasheet requests" ON public.datasheet_requests;
CREATE POLICY "Lead managers can view datasheet requests"
  ON public.datasheet_requests FOR SELECT TO authenticated
  USING (public.can_manage_leads(auth.uid()));