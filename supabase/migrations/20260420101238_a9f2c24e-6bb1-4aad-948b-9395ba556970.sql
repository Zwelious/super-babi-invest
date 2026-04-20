CREATE POLICY "Users can update own receipts"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'receipts' AND (storage.foldername(name))[1] = (auth.uid())::text)
WITH CHECK (bucket_id = 'receipts' AND (storage.foldername(name))[1] = (auth.uid())::text);