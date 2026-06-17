
-- Lock down deposits: explicitly deny UPDATE/DELETE for regular users.
-- Admin operations go through service_role which bypasses RLS.
CREATE POLICY "No user updates on deposits"
  ON public.deposits FOR UPDATE TO authenticated
  USING (false) WITH CHECK (false);

CREATE POLICY "No user deletes on deposits"
  ON public.deposits FOR DELETE TO authenticated
  USING (false);

-- Storage: allow users to delete only their own receipt files.
CREATE POLICY "Users can delete own receipt files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
