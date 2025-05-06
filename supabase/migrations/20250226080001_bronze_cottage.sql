/*
  # Add Products for Missing Categories

  1. New Categories
    - Adding products for all missing categories from the navbar
    - Ensuring comprehensive coverage of the product catalog
  
  2. Products Added
    - Adding detailed products for each category
    - Including specifications and pricing
*/

-- אבזור פנים
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'ריפודי עור מקצועיים',
  'leather-upholstery',
  'ריפודי עור איכותיים מותאמים אישית לרכב. עמידים בפני שחיקה, קלים לניקוי ומעניקים מראה יוקרתי.',
  2999,
  id,
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
  10
FROM categories WHERE slug = 'upholstery';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'שטיחי גומי WeatherTech',
  'weathertech-mats',
  'סט שטיחי גומי מותאמים מבית WeatherTech. מגנים על רצפת הרכב מפני מים, בוץ ולכלוך.',
  599,
  id,
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
  30
FROM categories WHERE slug = 'mats';

-- אבזור חוץ
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'חישוקי מגנזיום BBS',
  'bbs-rims',
  'סט חישוקי מגנזיום מבית BBS בגודל 18 אינץ׳. קלים במיוחד, חזקים ומעניקים מראה ספורטיבי.',
  7999,
  id,
  'https://images.unsplash.com/photo-1600801072886-91abcabcc64a',
  8
FROM categories WHERE slug = 'rims';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'צמיגי Michelin Pilot Sport 4S',
  'michelin-ps4s',
  'סט צמיגי Michelin Pilot Sport 4S. ביצועים מעולים בכביש רטוב ויבש, אחיזה מקסימלית ונוחות נסיעה.',
  3599,
  id,
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537',
  12
FROM categories WHERE slug = 'tires';

-- חלקי מנוע
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'פילטר אוויר K&N',
  'kn-air-filter',
  'פילטר אוויר מתכוונן מבית K&N. מגביר זרימת אוויר, משפר ביצועים וניתן לניקוי ושימוש חוזר.',
  299,
  id,
  'https://images.unsplash.com/photo-1635764749167-875211901040',
  50
FROM categories WHERE slug = 'filters';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'מצתים NGK Iridium',
  'ngk-iridium-plugs',
  'סט מצתי NGK Iridium. מספקים הצתה מושלמת, חיי שירות ארוכים וחיסכון בדלק.',
  199,
  id,
  'https://images.unsplash.com/photo-1621252179027-94459d278660',
  100
FROM categories WHERE slug = 'spark-plugs';

-- ציוד קמפינג
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'אוהל Coleman Octagon',
  'coleman-octagon-tent',
  'אוהל משפחתי מבית Coleman. קל להקמה, עמיד למים ורוח, מתאים ל-8 אנשים.',
  1499,
  id,
  'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
  15
FROM categories WHERE slug = 'tents';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'שק שינה The North Face',
  'tnf-sleeping-bag',
  'שק שינה איכותי מבית The North Face. מתאים לטמפרטורות עד -10 מעלות, קל משקל ונוח.',
  699,
  id,
  'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
  25
FROM categories WHERE slug = 'sleeping-bags';

-- ציוד הנחאות
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'גריל גז Weber Genesis II',
  'weber-genesis-grill',
  'גריל גז מקצועי מבית Weber. שלושה מבערים, משטח צלייה גדול ומערכת הצתה אלקטרונית.',
  3999,
  id,
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
  10
FROM categories WHERE slug = 'grills';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'סט כיסאות מתקפלים Coleman',
  'coleman-chairs-set',
  'סט 4 כיסאות מתקפלים איכותיים. נוחים, קלים לנשיאה וכוללים תיק נשיאה.',
  499,
  id,
  'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
  30
FROM categories WHERE slug = 'chairs';