ALTER TABLE public.product_categories
  ADD COLUMN IF NOT EXISTS group_name text NOT NULL DEFAULT 'Hardware';

UPDATE public.product_categories
SET group_name = 'Software'
WHERE slug IN ('software','vms','networking');