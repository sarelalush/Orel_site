/*
  # Fix RLS Policies for Products and Admin Access

  1. Changes
    - Drop all existing product policies
    - Create simplified but comprehensive policies
    - Add proper admin access controls
  
  2. Security
    - Enable RLS on products table
    - Allow public read access
    - Grant full access to admin users
*/

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public read access" ON products;
  DROP POLICY IF EXISTS "Admin full access" ON products;
  DROP POLICY IF EXISTS "Admin insert access" ON products;
  DROP POLICY IF EXISTS "Admin update access" ON products;
  DROP POLICY IF EXISTS "Admin delete access" ON products;
END $$;

-- Create new simplified policies
CREATE POLICY "Enable read access for all users"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Enable all access for admin users"
  ON products
  FOR ALL
  TO authenticated
  USING (
    CASE 
      WHEN auth.jwt() ->> 'role' = 'admin' THEN true
      ELSE false
    END
  )
  WITH CHECK (
    CASE 
      WHEN auth.jwt() ->> 'role' = 'admin' THEN true
      ELSE false
    END
  );

-- Storage policies
CREATE POLICY "Enable read access for product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Enable upload access for admin users"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'products' AND
    auth.jwt() ->> 'role' = 'admin'
  );

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;