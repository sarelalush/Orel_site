/*
  # Add Products for Offroad Categories

  1. New Products
    - Adding products for each offroad subcategory
    - Including detailed descriptions and realistic prices
    - Using high-quality Unsplash images
  
  2. Categories Covered
    - מגבהים
    - כננות
    - חבלים
    - שאקלים
    - רצועות
*/

-- מגבהים
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'מגבה שטח Pro Comp X9000',
  'pro-comp-x9000-jack',
  'מגבה שטח מקצועי Pro Comp X9000 עם כושר הרמה של 4 טון. כולל בסיס מוגדל ליציבות מקסימלית ומנגנון נעילה כפול לבטיחות מירבית.',
  1599,
  id,
  'https://images.unsplash.com/photo-1621252179027-94459d278660',
  25
FROM categories WHERE slug = 'recovery';

-- כננות
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'כננת חשמלית Warn Zeon 12-S',
  'warn-zeon-12s-winch',
  'כננת חשמלית מקצועית Warn Zeon 12-S עם כוח משיכה של 5.4 טון. כוללת שלט אלחוטי, חבל סינטטי ומערכת בקרת טמפרטורה.',
  4999,
  id,
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  15
FROM categories WHERE slug = 'recovery';

-- חבלים
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'חבל חילוץ סינטטי Dynamica',
  'dynamica-recovery-rope',
  'חבל חילוץ סינטטי באורך 9 מטר עם כושר קריעה של 14 טון. קל משקל, צף על מים ובטוח לשימוש.',
  699,
  id,
  'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7',
  40
FROM categories WHERE slug = 'recovery';

-- שאקלים
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'סט שאקלים ARB מקצועי',
  'arb-shackles-set',
  'סט שאקלים מקצועי מבית ARB הכולל 4 שאקלים בגדלים שונים. מיוצר מפלדה מחוסמת עם ציפוי נגד חלודה.',
  299,
  id,
  'https://images.unsplash.com/photo-1621252179027-94459d278660',
  60
FROM categories WHERE slug = 'recovery';

-- רצועות
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'רצועת גרירה ARB Snatch Strap',
  'arb-snatch-strap',
  'רצועת גרירה אלסטית באורך 9 מטר עם כושר עבודה של 8 טון. מיוצרת מניילון איכותי עם 20% יכולת מתיחה.',
  449,
  id,
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  45
FROM categories WHERE slug = 'recovery';