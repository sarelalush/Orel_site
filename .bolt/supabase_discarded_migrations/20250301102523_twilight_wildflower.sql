/*
  # Fix Categories RLS Policies

  1. New Policies
    - Add public read access policy for categories
    - Add admin full access policy for categories
  
  2. Security
    - Enable RLS on categories table
    - Ensure admin users can manage categories
*/

-- Drop existing policies on categories table
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Categories are readable by everyone" ON categories;
  DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
END $$;

-- Create new simplified policies
CREATE POLICY "Categories are readable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Create a policy for admin users to have full access
CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Ensure RLS is enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';