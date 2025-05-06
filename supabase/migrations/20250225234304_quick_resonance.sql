/*
  # Fix RLS Policies for Products Table

  1. Changes
    - Drop existing policies
    - Create new simplified policies for products table
    - Ensure proper admin access

  2. Security
    - Public read access for all users
    - Full CRUD access for admin users only
    - Proper role checking using auth.jwt()
*/

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access" ON products;
  DROP POLICY IF EXISTS "Allow admin full access" ON products;
END $$;

-- Create new policies
CREATE POLICY "Public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin full access"
  ON products
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