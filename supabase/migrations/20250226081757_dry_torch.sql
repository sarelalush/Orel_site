/*
  # Add subcategories support

  1. Changes
    - Updates existing categories to have proper parent-child relationships
    - Adds missing subcategories
    - Updates product references to point to correct subcategories

  2. Structure
    - Main categories (e.g., 'צמיגים וגלגלים')
      - Subcategories (e.g., 'צמיגי קיץ', 'צמיגי חורף')

  3. Security
    - Maintains existing RLS policies
*/

-- Create main categories and get their IDs
DO $$ 
DECLARE
  tires_id uuid;
  recovery_id uuid;
  lights_id uuid;
  exterior_id uuid;
  interior_id uuid;
  engine_id uuid;
  camping_id uuid;
  outdoor_id uuid;
BEGIN
  -- Main categories
  INSERT INTO categories (name, slug, description)
  VALUES 
    ('צמיגים וגלגלים', 'tires-and-wheels', 'צמיגים וחישוקים לכל סוגי הרכבים')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO tires_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('ציוד חילוץ', 'recovery', 'ציוד חילוץ מקצועי לרכבי שטח')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO recovery_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('תאורה', 'lighting', 'פתרונות תאורה מתקדמים')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO lights_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('אבזור חיצוני', 'exterior', 'אבזור חיצוני לרכב')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO exterior_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('אבזור פנימי', 'interior', 'אבזור פנימי לרכב')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO interior_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('חלקי מנוע', 'engine', 'חלקי מנוע ומערכות')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO engine_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('ציוד קמפינג', 'camping', 'ציוד קמפינג מקצועי')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO camping_id;

  INSERT INTO categories (name, slug, description)
  VALUES 
    ('ציוד הנחאות', 'outdoor', 'ציוד הנחאות ופנאי')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO outdoor_id;

  -- Create subcategories for צמיגים וגלגלים
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('צמיגי קיץ', 'summer', 'צמיגים לעונת הקיץ', tires_id),
    ('צמיגי חורף', 'winter', 'צמיגים לעונת החורף', tires_id),
    ('צמיגי כל העונות', 'all-season', 'צמיגים לכל עונות השנה', tires_id),
    ('צמיגי שטח', 'off-road', 'צמיגים לרכבי שטח', tires_id),
    ('חישוקים', 'rims', 'חישוקי מתכת ואלומיניום', tires_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for ציוד חילוץ
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('מגבהים', 'jacks', 'מגבהי שטח מקצועיים', recovery_id),
    ('כננות', 'winches', 'כננות חשמליות ומכאניות', recovery_id),
    ('חבלים', 'ropes', 'חבלי חילוץ וגרירה', recovery_id),
    ('שאקלים', 'shackles', 'שאקלים מקצועיים', recovery_id),
    ('רצועות', 'straps', 'רצועות גרירה וחילוץ', recovery_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for תאורה
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('פנסי LED', 'led', 'תאורת LED מתקדמת', lights_id),
    ('פנסי דרך', 'driving', 'פנסי דרך מקצועיים', lights_id),
    ('פנסי ערפל', 'fog', 'פנסי ערפל', lights_id),
    ('בר תאורה', 'light-bars', 'בר תאורה לרכב', lights_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for אבזור חיצוני
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('פגושים', 'bumpers', 'פגושים מחוזקים', exterior_id),
    ('מיגון גחון', 'skid-plates', 'מיגון גחון לרכב', exterior_id),
    ('גגונים', 'roof-racks', 'גגונים ומערכות נשיאה', exterior_id),
    ('ספוילרים', 'spoilers', 'ספוילרים ועיצוב חיצוני', exterior_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for אבזור פנימי
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('ריפודים', 'upholstery', 'ריפודי מושבים', interior_id),
    ('שטיחים', 'mats', 'שטיחים לרכב', interior_id),
    ('כיסויי הגה', 'steering-covers', 'כיסויי הגה', interior_id),
    ('קונסולות', 'consoles', 'קונסולות ואחסון', interior_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for חלקי מנוע
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('פילטרים', 'filters', 'פילטרים למנוע', engine_id),
    ('מצתים', 'spark-plugs', 'מצתים למנוע', engine_id),
    ('רצועות', 'belts', 'רצועות מנוע', engine_id),
    ('אטמים', 'seals', 'אטמים למנוע', engine_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for ציוד קמפינג
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('אוהלים', 'tents', 'אוהלים לקמפינג', camping_id),
    ('שקי שינה', 'sleeping-bags', 'שקי שינה', camping_id),
    ('מחצלות', 'camping-mats', 'מחצלות לקמפינג', camping_id),
    ('תאורה', 'camping-lights', 'תאורה לקמפינג', camping_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create subcategories for ציוד הנחאות
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('גרילים', 'grills', 'גרילים לבישול', outdoor_id),
    ('כיסאות', 'chairs', 'כיסאות שטח', outdoor_id),
    ('שולחנות', 'tables', 'שולחנות מתקפלים', outdoor_id),
    ('צידניות', 'coolers', 'צידניות ואחסון קר', outdoor_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

END $$;

-- Update products to reference correct subcategories
UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'jacks' AND p.name ILIKE '%מגבה%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'winches' AND p.name ILIKE '%כננת%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'ropes' AND p.name ILIKE '%חבל%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'shackles' AND p.name ILIKE '%שאקל%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'straps' AND p.name ILIKE '%רצוע%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'rims' AND p.name ILIKE '%חישוק%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'tires' AND p.name ILIKE '%צמיג%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'led' AND p.name ILIKE '%LED%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'bumpers' AND p.name ILIKE '%פגוש%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'upholstery' AND p.name ILIKE '%ריפוד%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'mats' AND p.name ILIKE '%שטיח%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'filters' AND p.name ILIKE '%פילטר%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'spark-plugs' AND p.name ILIKE '%מצת%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'tents' AND p.name ILIKE '%אוהל%';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = 'grills' AND p.name ILIKE '%גריל%';