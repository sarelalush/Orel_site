/*
  # Fix Admin Access and RLS Policies

  1. Changes
    - Drop existing policies
    - Create new comprehensive policies for admin access
    - Add proper user management policies
  
  2. Security
    - Enable RLS on all tables
    - Grant full access to admin users
    - Maintain public read access where needed
*/

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public read access" ON products;
  DROP POLICY IF EXISTS "Admin insert access" ON products;
  DROP POLICY IF EXISTS "Admin update access" ON products;
  DROP POLICY IF EXISTS "Admin delete access" ON products;
  DROP POLICY IF EXISTS "Admin storage access" ON storage.objects;
END $$;

-- Create new policies for products
CREATE POLICY "Public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin full access"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create policies for user management
CREATE POLICY "Admin can manage users"
  ON auth.users
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Storage policies
CREATE POLICY "Public read storage"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'products');

CREATE POLICY "Admin storage full access"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;