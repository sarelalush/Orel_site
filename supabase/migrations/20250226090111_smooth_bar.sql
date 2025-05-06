-- Reset categories structure
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

  -- Create subcategories for each main category
  -- שטח
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('ציוד חילוץ', 'recovery', 'ציוד חילוץ לרכבי שטח', offroad_id),
    ('אבזור חיצוני', 'exterior-offroad', 'אבזור חיצוני לרכבי שטח', offroad_id),
    ('תאורה', 'lighting-offroad', 'פתרונות תאורה', offroad_id),
    ('מיגון', 'protection-offroad', 'מיגון לרכבי שטח', offroad_id),
    ('אבזור פנימי', 'interior-offroad', 'אבזור פנימי לרכבי שטח', offroad_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- כביש
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('אבזור פנים', 'interior-road', 'אבזור פנימי לרכב', road_id),
    ('אבזור חוץ', 'exterior-road', 'אבזור חיצוני לרכב', road_id),
    ('צמיגים', 'tires-road', 'צמיגים לרכבי כביש', road_id),
    ('חישוקים', 'wheels-road', 'חישוקים לרכבי כביש', road_id),
    ('מערכות שמע', 'audio-road', 'מערכות שמע לרכב', road_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- טרקטורונים
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('חלקי מנוע', 'engine-atv', 'חלקי מנוע לטרקטורונים', atv_id),
    ('אבזור', 'accessories-atv', 'אבזור לטרקטורונים', atv_id),
    ('מיגון', 'protection-atv', 'מיגון לטרקטורונים', atv_id),
    ('צמיגים', 'tires-atv', 'צמיגים לטרקטורונים', atv_id),
    ('ביגוד מגן', 'gear-atv', 'ביגוד מגן לרוכבים', atv_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- ספורט ימי
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('אופנועי ים', 'jet-ski', 'ציוד לאופנועי ים', marine_id),
    ('סירות', 'boats', 'ציוד לסירות', marine_id),
    ('ציוד צלילה', 'diving', 'ציוד צלילה', marine_id),
    ('ציוד בטיחות', 'safety-marine', 'ציוד בטיחות ימי', marine_id),
    ('אביזרים', 'accessories-marine', 'אביזרים לספורט ימי', marine_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- אופניים
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('חלקי חילוף', 'parts-bicycle', 'חלקי חילוף לאופניים', bicycle_id),
    ('אביזרים', 'accessories-bicycle', 'אביזרים לאופניים', bicycle_id),
    ('ביגוד', 'clothing-bicycle', 'ביגוד לרכיבה', bicycle_id),
    ('תאורה', 'lighting-bicycle', 'תאורה לאופניים', bicycle_id),
    ('כלי עבודה', 'tools-bicycle', 'כלי עבודה לאופניים', bicycle_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- שמנים ומוספים
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('שמן מנוע', 'engine-oil', 'שמן מנוע', oils_id),
    ('שמן גיר', 'transmission-oil', 'שמן גיר', oils_id),
    ('מוספי דלק', 'fuel-additives', 'מוספי דלק', oils_id),
    ('נוזל קירור', 'coolant', 'נוזל קירור', oils_id),
    ('מוספי שמן', 'oil-additives', 'מוספי שמן', oils_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- קמפינג והנחאות
  INSERT INTO categories (name, slug, description, parent_id)
  VALUES 
    ('אוהלים', 'tents', 'אוהלים לקמפינג', camping_id),
    ('ציוד בישול', 'cooking', 'ציוד בישול לשטח', camping_id),
    ('ריהוט שטח', 'furniture', 'ריהוט לקמפינג', camping_id),
    ('תאורה', 'lighting-camping', 'תאורה לקמפינג', camping_id),
    ('ציוד שינה', 'sleeping', 'ציוד שינה לקמפינג', camping_id)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

END $$;