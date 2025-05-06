-- Create marine categories
DO $$ 
DECLARE
  marine_id uuid;
BEGIN
  -- Get marine category ID
  SELECT id INTO marine_id FROM categories WHERE slug = 'marine';

  -- Create jet ski subcategories
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('חלקי חילוף לאופנועי ים', 'jet-ski-parts', 'חלקי חילוף לאופנועי ים', marine_id),
    ('אביזרים לאופנועי ים', 'jet-ski-accessories', 'אביזרים לאופנועי ים', marine_id),
    ('כיסויים לאופנועי ים', 'jet-ski-covers', 'כיסויים לאופנועי ים', marine_id),
    ('ציוד בטיחות לאופנועי ים', 'jet-ski-safety', 'ציוד בטיחות לאופנועי ים', marine_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Create boat subcategories
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('חלקי חילוף לסירות', 'boat-parts', 'חלקי חילוף לסירות', marine_id),
    ('אביזרים לסירות', 'boat-accessories', 'אביזרים לסירות', marine_id),
    ('ציוד עגינה', 'boat-docking', 'ציוד עגינה לסירות', marine_id),
    ('אלקטרוניקה ימית', 'boat-electronics', 'אלקטרוניקה לסירות', marine_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

END $$;