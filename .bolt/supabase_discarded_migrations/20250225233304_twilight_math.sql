/*
  # Fix Admin RLS Policies

  1. Changes
    - Drop existing policies
    - Add new policies with correct admin access
    - Use auth.jwt() -> role check for admin verification
    
  2. Security
    - Enable admins to perform all operations on tables
    - Use proper role checks in policies
*/

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Products are readable by everyone" ON products;
  DROP POLICY IF EXISTS "Admins can manage products" ON products;
  DROP POLICY IF EXISTS "Anyone can read products" ON products;
END $$;

-- Create new policies for products
CREATE POLICY "Products are readable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Update RLS settings
ALTER TABLE products ENABLE ROW LEVEL SECURITY;