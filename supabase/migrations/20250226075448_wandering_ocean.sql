/*
  # Add Products for Empty Categories

  1. New Products
    - Adding products for each empty category and subcategory
    - Including detailed descriptions and realistic prices
    - Using high-quality Unsplash images
  
  2. Categories Covered
    - ספורט ימי (אופנועי ים, סירות)
    - אופניים (חלקים, אביזרים)
    - שמנים ומוספים (שמנים, מוספים)
    - קמפינג והנחאות (ציוד קמפינג, ציוד הנחאות)
*/

-- ספורט ימי - אופנועי ים
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'מצוף הצלה מקצועי SeaDoo',
  'seadoo-life-vest',
  'מצוף הצלה מקצועי מבית SeaDoo. עומד בתקני בטיחות מחמירים, נוח ללבישה ומתאים לכל פעילויות הספורט הימי.',
  399,
  id,
  'https://images.unsplash.com/photo-1532467411038-57680e3dc0f1',
  30
FROM categories WHERE slug = 'watercraft';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'כיסוי לאופנוע ים SeaDoo',
  'seadoo-cover',
  'כיסוי איכותי לאופנוע ים מבית SeaDoo. מגן מפני שמש, אבק ומים, קל להתקנה ועמיד לאורך זמן.',
  599,
  id,
  'https://images.unsplash.com/photo-1472289065668-ce650ac443d2',
  20
FROM categories WHERE slug = 'watercraft';

-- אופניים - חלקים
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'שרשרת Shimano XT M8100',
  'shimano-xt-chain',
  'שרשרת אופניים מקצועית מסדרת XT של Shimano. מתאימה ל-12 הילוכים, עמידה במיוחד ומספקת העברת הילוכים חלקה.',
  249,
  id,
  'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7',
  50
FROM categories WHERE slug = 'bicycle';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'צמיגי Maxxis Minion DHF 29',
  'maxxis-minion-tires',
  'זוג צמיגי שטח Maxxis Minion DHF בקוטר 29 אינץ׳. מספקים אחיזה מעולה בכל תנאי שטח ועמידים בפני תקרים.',
  499,
  id,
  'https://images.unsplash.com/photo-1565537222174-2a43937c5472',
  30
FROM categories WHERE slug = 'bicycle';

-- שמנים ומוספים
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'שמן מנוע Motul 8100 X-cess 5W40',
  'motul-engine-oil',
  'שמן מנוע סינתטי מלא 5W40 מבית Motul. מתאים למנועי בנזין ודיזל מודרניים, מספק הגנה מקסימלית ומאריך את חיי המנוע.',
  299,
  id,
  'https://images.unsplash.com/photo-1635764749167-875211901040',
  100
FROM categories WHERE slug = 'oils';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'מוסף דלק Liqui Moly',
  'liqui-moly-additive',
  'מוסף דלק מקצועי מבית Liqui Moly. מנקה את מערכת הדלק, משפר ביצועים ומפחית תצרוכת דלק.',
  89,
  id,
  'https://images.unsplash.com/photo-1621252179027-94459d278660',
  150
FROM categories WHERE slug = 'additives';

-- קמפינג והנחאות
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'אוהל Coleman Darwin 4 Plus',
  'coleman-tent',
  'אוהל איכותי ל-4 אנשים מבית Coleman. קל להקמה, עמיד למים ורוח, כולל אוורור מעולה וכיסים לאחסון.',
  799,
  id,
  'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
  25
FROM categories WHERE slug = 'camping';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'גריל גז Weber Q2200',
  'weber-grill',
  'גריל גז נייד מבית Weber. קל לנשיאה, מספק חום אחיד, קל לניקוי ומתאים במיוחד לקמפינג ופיקניקים.',
  1299,
  id,
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
  15
FROM categories WHERE slug = 'outdoor';