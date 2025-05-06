/*
  # Fix Products RLS Policies

  1. Changes
    - Drop existing policies
    - Create new simplified policies for products table
    - Ensure admins have full access
    - Allow public read access

  2. Security
    - Enable RLS on products table
    - Add policy for public read access
    - Add policy for admin management
*/

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Products are readable by everyone" ON products;
  DROP POLICY IF EXISTS "Admins can manage products" ON products;
  DROP POLICY IF EXISTS "Anyone can read products" ON products;
END $$;

-- Create new simplified policies
CREATE POLICY "Allow public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin full access"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;