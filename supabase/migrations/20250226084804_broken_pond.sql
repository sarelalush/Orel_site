/*
  # הוספת תתי קטגוריות לתאורה

  1. קטגוריות חדשות
    - לדים
    - פנסי דרך
    - פנסי ערפל
    - בר תאורה
    - קיט קסנון

  2. שינויים
    - הוספת parent_id לקטגוריות חדשות
    - עדכון מוצרים קיימים לקטגוריות החדשות
*/

-- Get lighting category ID
DO $$ 
DECLARE
  lighting_id uuid;
  led_id uuid;
  driving_id uuid;
  fog_id uuid;
  light_bars_id uuid;
  xenon_id uuid;
BEGIN
  -- Get main lighting category
  SELECT id INTO lighting_id FROM categories WHERE slug = 'lighting';

  -- Create or update lighting subcategories
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('לדים', 'led', 'פנסי LED מקצועיים', lighting_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO led_id;

  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('פנסי דרך', 'driving', 'פנסי דרך מקצועיים', lighting_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO driving_id;

  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('פנסי ערפל', 'fog', 'פנסי ערפל איכותיים', lighting_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO fog_id;

  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('בר תאורה', 'light-bars', 'בר תאורה מקצועי', lighting_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO light_bars_id;

  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('קיט קסנון', 'xenon', 'קיט קסנון איכותי', lighting_id)
  ON CONFLICT (slug) 
  DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO xenon_id;

  -- Add sample products for each subcategory
  -- לדים
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('פנסי LED Rigid Industries', 
     'rigid-led-lights', 
     'זוג פנסי LED מקצועיים מבית Rigid Industries. עוצמת הארה של 15,000 לומן ואטימות מלאה למים.',
     1899,
     led_id,
     'https://images.unsplash.com/photo-1591543620767-582b2469cf5f',
     25);

  -- פנסי דרך
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('פנסי דרך PIAA LP570', 
     'piaa-lp570', 
     'זוג פנסי דרך מקצועיים מבית PIAA. מספקים אלומת אור ארוכה וממוקדת.',
     1299,
     driving_id,
     'https://images.unsplash.com/photo-1591543620767-582b2469cf5f',
     20);

  -- פנסי ערפל
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('פנסי ערפל HELLA', 
     'hella-fog-lights', 
     'זוג פנסי ערפל איכותיים מבית HELLA. מספקים ראות מעולה בתנאי ערפל וגשם.',
     899,
     fog_id,
     'https://images.unsplash.com/photo-1591543620767-582b2469cf5f',
     30);

  -- בר תאורה
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('בר תאורת LED Rigid 50"', 
     'rigid-50-light-bar', 
     'בר תאורת LED באורך 50 אינץ׳ מבית Rigid. מספק תאורה חזקה במיוחד עם אחריות יצרן.',
     2999,
     light_bars_id,
     'https://images.unsplash.com/photo-1591543620767-582b2469cf5f',
     15);

  -- קיט קסנון
  INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
  VALUES 
    ('קיט קסנון OSRAM', 
     'osram-xenon-kit', 
     'קיט קסנון מקצועי מבית OSRAM. כולל נורות, בלסטים ואחריות יצרן.',
     799,
     xenon_id,
     'https://images.unsplash.com/photo-1591543620767-582b2469cf5f',
     40);

END $$;