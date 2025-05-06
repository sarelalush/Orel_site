/*
  # Add Subcategories and Products for Recovery Equipment

  1. New Categories
    - Adding subcategories for recovery equipment
    - Creating proper category hierarchy
  
  2. New Products
    - Adding products with correct category mapping
    - Including detailed descriptions and images
*/

-- Create subcategories for recovery equipment
INSERT INTO categories (name, slug, description) VALUES
  ('מגבהים', 'jacks', 'מגבהי שטח מקצועיים'),
  ('כננות', 'winches', 'כננות חשמליות ומכאניות'),
  ('חבלים', 'ropes', 'חבלי חילוץ וגרירה'),
  ('שאקלים', 'shackles', 'שאקלים מקצועיים לחילוץ'),
  ('רצועות', 'straps', 'רצועות גרירה וחילוץ');

-- Add products for each subcategory
INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'מגבה שטח Hi-Lift X-TREME',
  'hi-lift-x-treme-jack',
  'מגבה שטח מקצועי Hi-Lift X-TREME עם כושר הרמה של 4.5 טון. מיוצר מפלדה מחוסמת, כולל בסיס מוגדל ומנגנון בטיחות משופר.',
  1899,
  id,
  'https://images.unsplash.com/photo-1621252179027-94459d278660',
  20
FROM categories WHERE slug = 'jacks';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'כננת Warn ZEON Platinum 12-S',
  'warn-zeon-platinum-winch',
  'כננת חשמלית מקצועית עם כוח משיכה של 5.4 טון. כוללת שלט אלחוטי, חבל סינטטי, ומערכת קירור משופרת.',
  5499,
  id,
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  15
FROM categories WHERE slug = 'winches';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'חבל חילוץ קינטי Dynamica Pro',
  'dynamica-pro-rope',
  'חבל חילוץ קינטי באורך 9 מטר עם כושר קריעה של 15 טון. מיוצר מחומרים מתקדמים עם יכולת ספיגת זעזועים משופרת.',
  899,
  id,
  'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7',
  30
FROM categories WHERE slug = 'ropes';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'סט שאקלים ARB Premium',
  'arb-premium-shackles',
  'סט שאקלים מקצועי הכולל 4 יחידות בגדלים שונים. מיוצר מפלדה מחוסמת עם ציפוי מיוחד נגד חלודה וקורוזיה.',
  399,
  id,
  'https://images.unsplash.com/photo-1621252179027-94459d278660',
  50
FROM categories WHERE slug = 'shackles';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'רצועת חילוץ ARB Pro Recovery',
  'arb-pro-recovery-strap',
  'רצועת חילוץ מקצועית באורך 9 מטר עם כושר עבודה של 11 טון. כוללת כיסוי מגן ותיק נשיאה.',
  599,
  id,
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  40
FROM categories WHERE slug = 'straps';