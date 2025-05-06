/*
  # Fix Admin RLS Policies

  1. Changes
    - Drop existing policies
    - Create new simplified policies for admin access
    - Add storage policies for admin users
  
  2. Security
    - Enable RLS on all tables
    - Grant full access to admin users
    - Maintain public read access where needed
*/

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public read access" ON products;
  DROP POLICY IF EXISTS "Admin full access" ON products;
END $$;

-- Create new policies for products
CREATE POLICY "Public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin insert access"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admin update access"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admin delete access"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Storage policies for admin users
CREATE POLICY "Admin storage access"
  ON storage.objects
  FOR ALL 
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;