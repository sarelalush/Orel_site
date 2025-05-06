/*
  # Fix Admin Policies

  1. Changes
    - Drop existing admin policies
    - Recreate admin policies for all tables
    
  2. Security
    - Enable admin users to perform all operations on tables
    - Policies check for admin role in JWT token
*/

-- Drop existing policies
DO $$ 
BEGIN
  -- Products policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'products' 
    AND policyname = 'Admins can manage products'
  ) THEN
    DROP POLICY "Admins can manage products" ON products;
  END IF;

  -- Categories policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'categories' 
    AND policyname = 'Admins can manage categories'
  ) THEN
    DROP POLICY "Admins can manage categories" ON categories;
  END IF;

  -- Orders policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'orders' 
    AND policyname = 'Admins can manage all orders'
  ) THEN
    DROP POLICY "Admins can manage all orders" ON orders;
  END IF;

  -- Order items policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'order_items' 
    AND policyname = 'Admins can manage all order items'
  ) THEN
    DROP POLICY "Admins can manage all order items" ON order_items;
  END IF;
END $$;

-- Recreate admin policies
CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage all order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');