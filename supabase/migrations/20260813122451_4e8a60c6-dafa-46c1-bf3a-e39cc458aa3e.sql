CREATE POLICY "media read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "media insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.can_manage_content(auth.uid()));
CREATE POLICY "media update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.can_manage_content(auth.uid()));
CREATE POLICY "media delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.can_manage_content(auth.uid()));