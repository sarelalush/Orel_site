/*
  # Update Camping Categories and Products

  1. Changes
    - Updates the camping category structure
    - Adds new camping products with correct categorization
    - Ensures proper parent-child relationships

  2. Categories Structure
    - קמפינג והנחאות (Main)
      - אוהלים
      - ציוד בישול
      - ריהוט שטח
      - תאורה
      - ציוד שינה
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
    ('אוהלים', 'camping-tents', 'אוהלים לקמפינג', camping_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO tents_id;

  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('ציוד בישול', 'camping-cooking', 'ציוד בישול לשטח', camping_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO cooking_id;

  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('ריהוט שטח', 'camping-furniture', 'ריהוט לקמפינג', camping_id)
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
    ('ציוד שינה', 'camping-sleeping', 'ציוד שינה לקמפינג', camping_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO sleeping_id;

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
     15)
  ON CONFLICT (slug) DO NOTHING;

  -- ציוד בישול
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('סט בישול שטח MSR', 
     'msr-cooking-set', 
     'סט כלי בישול מקצועי לשטח הכולל סירים, מחבת, וכלי הגשה. קל משקל ועמיד.',
     399,
     cooking_id,
     'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
     25)
  ON CONFLICT (slug) DO NOTHING;

  -- ריהוט שטח
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('שולחן מתקפל Helinox', 
     'helinox-table', 
     'שולחן שטח מתקפל קל משקל. יציב, קל לנשיאה ומתאים לקמפינג.',
     299,
     furniture_id,
     'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
     30)
  ON CONFLICT (slug) DO NOTHING;

  -- תאורה
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('פנס קמפינג נטען LED', 
     'led-camping-lantern', 
     'פנס קמפינג עוצמתי עם סוללה נטענת. מספק תאורה חזקה עד 72 שעות.',
     199,
     lighting_id,
     'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
     40)
  ON CONFLICT (slug) DO NOTHING;

  -- ציוד שינה
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('שק שינה The North Face Eco Trail', 
     'tnf-eco-trail-sleeping-bag', 
     'שק שינה איכותי מבית The North Face. מתאים לטמפרטורות עד -5 מעלות.',
     599,
     sleeping_id,
     'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
     20)
  ON CONFLICT (slug) DO NOTHING;

END $$;