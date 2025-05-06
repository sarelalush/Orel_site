/*
  # Update Categories Hierarchy

  1. Changes
    - Add parent_id column to categories table
    - Update existing categories with parent-child relationships
    - Update products to reference correct subcategories

  2. Security
    - Maintain existing RLS policies
*/

-- Add parent_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE categories ADD COLUMN parent_id uuid REFERENCES categories(id);
  END IF;
END $$;

-- Create main categories if they don't exist
DO $$ 
DECLARE
  recovery_id uuid;
  wheels_id uuid;
  lights_id uuid;
  exterior_id uuid;
  interior_id uuid;
  watercraft_id uuid;
  bicycle_id uuid;
  oils_id uuid;
  camping_id uuid;
BEGIN
  -- Main categories
  INSERT INTO categories (name, slug, description)
  VALUES 
    ('ציוד חילוץ', 'recovery', 'ציוד חילוץ מקצועי לרכבי שטח')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO recovery_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('צמיגים וגלגלים', 'wheels', 'צמיגים וחישוקים לכל סוגי הרכבים')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO wheels_id;

  -- Update subcategories with parent_id
  UPDATE categories 
  SET parent_id = recovery_id 
  WHERE slug IN ('jacks', 'winches', 'ropes', 'shackles', 'straps');

  UPDATE categories 
  SET parent_id = wheels_id 
  WHERE slug IN ('rims', 'tires');

  -- Update products to reference correct subcategories
  UPDATE products p
  SET category_id = c.id
  FROM categories c
  WHERE c.slug = 'jacks' AND p.name LIKE '%מגבה%';

  UPDATE products p
  SET category_id = c.id
  FROM categories c
  WHERE c.slug = 'winches' AND p.name LIKE '%כננת%';

  UPDATE products p
  SET category_id = c.id
  FROM categories c
  WHERE c.slug = 'ropes' AND p.name LIKE '%חבל%';

  UPDATE products p
  SET category_id = c.id
  FROM categories c
  WHERE c.slug = 'shackles' AND p.name LIKE '%שאקל%';

  UPDATE products p
  SET category_id = c.id
  FROM categories c
  WHERE c.slug = 'straps' AND p.name LIKE '%רצוע%';

  UPDATE products p
  SET category_id = c.id
  FROM categories c
  WHERE c.slug = 'rims' AND p.name LIKE '%חישוק%';

  UPDATE products p
  SET category_id = c.id
  FROM categories c
  WHERE c.slug = 'tires' AND p.name LIKE '%צמיג%';
END $$;