/*
  # Add Categories Structure

  1. Schema Changes
    - Add parent_id to categories table
    - Create main categories and subcategories
    - Link subcategories to parent categories

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

-- Create main categories and get their IDs
DO $$ 
DECLARE
  offroad_id uuid;
  road_id uuid;
  atv_id uuid;
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
    ('ציוד חילוץ', 'offroad-recovery', 'ציוד חילוץ לרכבי שטח', offroad_id),
    ('מיגון', 'offroad-protection', 'מיגון לרכבי שטח', offroad_id),
    ('תאורה', 'offroad-lighting', 'פתרונות תאורה', offroad_id),
    ('אבזור חיצוני', 'offroad-exterior', 'אבזור חיצוני לרכבי שטח', offroad_id),
    ('אבזור פנימי', 'offroad-interior', 'אבזור פנימי לרכבי שטח', offroad_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for כביש
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('צמיגים', 'road-tires', 'צמיגים לרכבי כביש', road_id),
    ('חישוקים', 'road-wheels', 'חישוקים לרכבי כביש', road_id),
    ('מערכות שמע', 'road-audio', 'מערכות שמע לרכב', road_id),
    ('אבזור חיצוני', 'road-exterior', 'אבזור חיצוני לרכבי כביש', road_id),
    ('אבזור פנימי', 'road-interior', 'אבזור פנימי לרכבי כביש', road_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for טרקטורונים
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('חלקי מנוע', 'atv-engine', 'חלקי מנוע לטרקטורונים', atv_id),
    ('מערכת פליטה', 'atv-exhaust', 'מערכות פליטה לטרקטורונים', atv_id),
    ('מיגון', 'atv-protection', 'מיגון לטרקטורונים', atv_id),
    ('אבזור', 'atv-accessories', 'אבזור לטרקטורונים', atv_id),
    ('ביגוד מגן', 'atv-gear', 'ביגוד מגן לרוכבים', atv_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for ספורט ימי
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('אופנועי ים', 'marine-jetski', 'ציוד לאופנועי ים', marine_id),
    ('סירות', 'marine-boats', 'ציוד לסירות', marine_id),
    ('ציוד צלילה', 'marine-diving', 'ציוד צלילה', marine_id),
    ('ציוד בטיחות', 'marine-safety', 'ציוד בטיחות ימי', marine_id),
    ('אביזרים', 'marine-accessories', 'אביזרים לספורט ימי', marine_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for אופניים
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('חלקי חילוף', 'bicycle-parts', 'חלקי חילוף לאופניים', bicycle_id),
    ('אביזרים', 'bicycle-accessories', 'אביזרים לאופניים', bicycle_id),
    ('ביגוד', 'bicycle-clothing', 'ביגוד לרכיבה', bicycle_id),
    ('תאורה', 'bicycle-lighting', 'תאורה לאופניים', bicycle_id),
    ('כלי עבודה', 'bicycle-tools', 'כלי עבודה לאופניים', bicycle_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for שמנים ומוספים
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('שמן מנוע', 'oils-engine', 'שמן מנוע', oils_id),
    ('שמן גיר', 'oils-transmission', 'שמן גיר', oils_id),
    ('מוספי דלק', 'oils-fuel', 'מוספי דלק', oils_id),
    ('נוזל קירור', 'oils-coolant', 'נוזל קירור', oils_id),
    ('מוספי שמן', 'oils-additives', 'מוספי שמן', oils_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for קמפינג והנחאות
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('אוהלים', 'camping-tents', 'אוהלים לקמפינג', camping_id),
    ('ציוד בישול', 'camping-cooking', 'ציוד בישול לשטח', camping_id),
    ('ריהוט שטח', 'camping-furniture', 'ריהוט לקמפינג', camping_id),
    ('תאורה', 'camping-lighting', 'תאורה לקמפינג', camping_id),
    ('ציוד שינה', 'camping-sleeping', 'ציוד שינה לקמפינג', camping_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

END $$;

-- Update existing products with new category references
UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'offroad-recovery' AND p.name ILIKE '%חילוץ%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'offroad-protection' AND p.name ILIKE '%מיגון%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'offroad-lighting' AND p.name ILIKE '%תאורה%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'camping-tents' AND p.name ILIKE '%אוהל%';