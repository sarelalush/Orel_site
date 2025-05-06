/*
  # Add More Products for Each Category

  1. New Products
    - Adding products for each subcategory
    - Including detailed descriptions and realistic prices
    - Using high-quality Unsplash images
  
  2. Categories Covered
    - Recovery Equipment (מגבהים, כננות, חבלים, שאקלים)
    - Wheels & Tires (חישוקים, צמיגים)
    - Lighting (לדים, פנסי דרך, בר תאורה)
    - Exterior (פגושים, מיגון)
    - Interior (ריפודים, אביזרים)
*/

-- מגבהים וציוד חילוץ
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'מגבה Hi-Lift XT-485 48 אינץ׳',
  'hi-lift-xt-485',
  'מגבה שטח מקצועי Hi-Lift באורך 48 אינץ׳, דגם XT-485. כושר הרמה של 3 טון, מבנה מחוזק במיוחד עם ציפוי שחור נגד חלודה. כולל מערכת בטיחות כפולה ומתאים לכל רכבי השטח.',
  1299,
  id,
  'https://images.unsplash.com/photo-1621252179027-94459d278660',
  20
FROM categories WHERE slug = 'recovery';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'כננת חשמלית Warn VR EVO 10-S',
  'warn-vr-evo-10s',
  'כננת חשמלית מקצועית מבית Warn, דגם VR EVO 10-S. כוח משיכה של 4.5 טון, מנוע 12V חזק במיוחד, כולל חבל סינטטי וצג דיגיטלי.',
  3999,
  id,
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  15
FROM categories WHERE slug = 'recovery';

-- צמיגים וחישוקים
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'צמיגי BF Goodrich KM3 35 אינץ׳',
  'bf-goodrich-km3-35',
  'סט צמיגי שטח BF Goodrich Mud-Terrain T/A KM3 בגודל 35 אינץ׳. מספקים אחיזה מעולה בכל תנאי שטח, עמידות גבוהה ורמת רעש נמוכה על הכביש.',
  4800,
  id,
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537',
  12
FROM categories WHERE slug = 'wheels';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'חישוקי KMC XD Series',
  'kmc-xd-series',
  'סט חישוקי אלומיניום KMC XD Series בגודל 17 אינץ׳. עיצוב ייחודי, חוזק מרבי ומשקל נמוך. מתאימים במיוחד לרכבי שטח ופנאי.',
  3600,
  id,
  'https://images.unsplash.com/photo-1600801072886-91abcabcc64a',
  10
FROM categories WHERE slug = 'wheels';

-- תאורה
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'פנסי LED Rigid Industries D-Series PRO',
  'rigid-d-series-pro',
  'זוג פנסי LED מקצועיים מסדרת D-Series PRO של Rigid Industries. עוצמת הארה של 15,000 לומן, זווית תאורה רחבה ואטימות מלאה למים.',
  1899,
  id,
  'https://images.unsplash.com/photo-1591543620767-582b2469cf5f',
  25
FROM categories WHERE slug = 'lights';

-- אבזור חיצוני
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'מיגון גחון ARB מאלומיניום',
  'arb-skid-plate',
  'מיגון גחון מאלומיניום מבית ARB. מספק הגנה מקסימלית לחלקים החיוניים של הרכב, קל משקל וחזק במיוחד. כולל פתחי שירות לטיפולים.',
  2499,
  id,
  'https://images.unsplash.com/photo-1669215420018-098507d14861',
  15
FROM categories WHERE slug = 'exterior';

-- אבזור פנימי
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'קונסולה מרכזית ARB לאחסון',
  'arb-center-console',
  'קונסולה מרכזית מבית ARB עם תא קירור מובנה. מיוצרת מחומרים איכותיים, כוללת מקומות אחסון מרובים ומערכת קירור 12V.',
  1299,
  id,
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
  20
FROM categories WHERE slug = 'interior';