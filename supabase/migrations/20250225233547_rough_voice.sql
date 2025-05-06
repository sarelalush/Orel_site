/*
  # Create Storage Bucket for Products

  1. New Storage Bucket
    - Creates a new public storage bucket for product images
    - Name: 'products'
    - Public access enabled
    - File size limit: 5MB
    - Allowed mime types: image/*
*/

-- Enable storage by creating the storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Create the storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public read access
CREATE POLICY "Public Access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'products');

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- Create policy to allow file owners to update and delete their files
CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (auth.uid() = owner);