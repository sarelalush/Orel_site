/*
  # Update Categories Structure

  1. Changes
    - Restructure categories to match navbar layout
    - Add parent-child relationships
    - Update product categorization

  2. New Structure
    - Main categories (שטח, כביש, טרקטורונים וכו')
    - Subcategories for each main category
    - Products properly categorized under subcategories

  3. Security
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

-- Create main categories and get their IDs
DO $$ 
DECLARE
  offroad_id uuid;
  road_id uuid;
  atv_id uuid;
  tires_id uuid;
  marine_id uuid;
  bicycle_id uuid;
  oils_id uuid;
  camping_id uuid;
BEGIN
  -- Main categories
  INSERT INTO categories (name, slug, description)
  VALUES 
    ('שטח', 'offroad', 'ציוד ואביזרים לרכבי שטח')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO offroad_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('כביש', 'road', 'ציוד ואביזרים לרכבי כביש')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO road_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('טרקטורונים ו-SBS', 'atv', 'ציוד לטרקטורונים ורכבי שטח')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO atv_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('צמיגים', 'tires', 'צמיגים וגלגלים')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO tires_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('ספורט ימי', 'marine', 'ציוד לספורט ימי')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO marine_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('אופניים', 'bicycle', 'ציוד ואביזרים לאופניים')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO bicycle_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('שמנים ומוספים', 'oils', 'שמנים ומוספים לרכב')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO oils_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('קמפינג והנחאות', 'camping', 'ציוד קמפינג והנחאות')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO camping_id;

  -- Create subcategories for שטח
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('ציוד חילוץ', 'recovery-gear', 'ציוד חילוץ לרכבי שטח', offroad_id),
    ('אבזור חיצוני', 'exterior-offroad', 'אבזור חיצוני לרכבי שטח', offroad_id),
    ('תאורה', 'lighting-offroad', 'פתרונות תאורה', offroad_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for כביש
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('אבזור פנים', 'interior-road', 'אבזור פנימי לרכב', road_id),
    ('אבזור חוץ', 'exterior-road', 'אבזור חיצוני לרכב', road_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for טרקטורונים
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('חלקי מנוע', 'engine-parts', 'חלקי מנוע לטרקטורונים', atv_id),
    ('אבזור', 'accessories-atv', 'אבזור לטרקטורונים', atv_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for צמיגים
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('All Terrain', 'all-terrain', 'צמיגי שטח All Terrain', tires_id),
    ('Mud Terrain', 'mud-terrain', 'צמיגי שטח Mud Terrain', tires_id),
    ('צמיגי חול', 'sand-tires', 'צמיגים לנהיגה בחול', tires_id),
    ('צמיגי סלעים', 'rock-tires', 'צמיגים לנהיגה בסלעים', tires_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for ספורט ימי
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('אופנועי ים', 'jet-ski', 'ציוד לאופנועי ים', marine_id),
    ('סירות', 'boats', 'ציוד לסירות', marine_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for אופניים
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('חלקים', 'bike-parts', 'חלקי חילוף לאופניים', bicycle_id),
    ('אביזרים', 'bike-accessories', 'אביזרים לאופניים', bicycle_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for שמנים ומוספים
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('שמנים', 'oils-types', 'סוגי שמנים', oils_id),
    ('מוספים', 'additives', 'מוספים לרכב', oils_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for קמפינג
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('ציוד קמפינג', 'camping-gear', 'ציוד לקמפינג', camping_id),
    ('ציוד הנחאות', 'outdoor-gear', 'ציוד להנחאות', camping_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

END $$;

-- Update existing products with new category references
UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'recovery-gear' AND p.name ILIKE '%חילוץ%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'exterior-offroad' AND p.name ILIKE '%פגוש%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'lighting-offroad' AND p.name ILIKE '%תאורה%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'interior-road' AND p.name ILIKE '%ריפוד%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'all-terrain' AND p.name ILIKE '%BF Goodrich%';