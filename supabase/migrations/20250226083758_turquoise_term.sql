/*
  # Update Products Categories

  1. Changes
    - Add new products to camping subcategories
    - Update existing products to correct subcategories
    - Fix category relationships

  2. Structure
    - Main categories (e.g., קמפינג והנחאות)
    - Subcategories (e.g., אוהלים, ציוד בישול)
    - Products properly linked to subcategories

  3. Security
    - Maintain existing RLS policies
*/

-- Get camping category ID
DO $$ 
DECLARE
  camping_id uuid;
  tents_id uuid;
  cooking_id uuid;
  furniture_id uuid;
  lighting_id uuid;
  sleeping_id uuid;
BEGIN
  -- Get main camping category
  SELECT id INTO camping_id FROM categories WHERE slug = 'camping';

  -- Create or update camping subcategories
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('אוהלים', 'tents', 'אוהלים לקמפינג', camping_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO tents_id;

  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('ציוד בישול', 'cooking', 'ציוד בישול לשטח', camping_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO cooking_id;

  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('ריהוט שטח', 'furniture', 'ריהוט לקמפינג', camping_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO furniture_id;

  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('תאורה', 'camping-lights', 'תאורה לקמפינג', camping_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO lighting_id;

  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('ציוד שינה', 'sleeping', 'ציוד שינה לקמפינג', camping_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO sleeping_id;

  -- Update existing products to correct subcategories
  UPDATE products 
  SET category_id = tents_id 
  WHERE name ILIKE '%אוהל%';

  UPDATE products 
  SET category_id = cooking_id 
  WHERE name ILIKE '%גריל%' OR name ILIKE '%בישול%';

  UPDATE products 
  SET category_id = furniture_id 
  WHERE name ILIKE '%כיסא%' OR name ILIKE '%שולחן%';

  UPDATE products 
  SET category_id = lighting_id 
  WHERE name ILIKE '%תאורה%' AND name ILIKE '%קמפינג%';

  UPDATE products 
  SET category_id = sleeping_id 
  WHERE name ILIKE '%שק שינה%' OR name ILIKE '%מזרן%';

  -- Add new sample products for each subcategory
  -- אוהלים
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('אוהל Coleman Montana 8', 
     'coleman-montana-8', 
     'אוהל משפחתי גדול ל-8 אנשים. קל להקמה, עמיד למים ורוח, כולל חלונות גדולים ואוורור מעולה.',
     1499,
     tents_id,
     'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
     15);

  -- ציוד בישול
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('סט בישול שטח MSR', 
     'msr-cooking-set', 
     'סט כלי בישול מקצועי לשטח הכולל סירים, מחבת, וכלי הגשה. קל משקל ועמיד.',
     399,
     cooking_id,
     'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
     25);

  -- ריהוט שטח
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('שולחן מתקפל Helinox', 
     'helinox-table', 
     'שולחן שטח מתקפל קל משקל. יציב, קל לנשיאה ומתאים לקמפינג.',
     299,
     furniture_id,
     'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
     30);

  -- תאורה
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('פנס קמפינג נטען LED', 
     'led-camping-lantern', 
     'פנס קמפינג עוצמתי עם סוללה נטענת. מספק תאורה חזקה עד 72 שעות.',
     199,
     lighting_id,
     'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
     40);

  -- ציוד שינה
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('שק שינה The North Face Eco Trail', 
     'tnf-eco-trail-sleeping-bag', 
     'שק שינה איכותי מבית The North Face. מתאים לטמפרטורות עד -5 מעלות.',
     599,
     sleeping_id,
     'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
     20);

END $$;