/*
  # Update RLS Policies for Admin Access

  1. Changes
    - Add admin policies for products table
    - Add admin policies for categories table
    - Add admin policies for orders table
    - Add admin policies for order items table

  2. Security
    - Enable admin access to manage all tables
    - Maintain existing user policies
*/

-- Add admin policies for products table
CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add admin policies for categories table
CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add admin policies for orders table
CREATE POLICY "Admins can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add admin policies for order items table
CREATE POLICY "Admins can manage all order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');