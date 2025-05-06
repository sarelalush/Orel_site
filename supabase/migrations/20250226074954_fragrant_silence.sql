/*
  # Add Products for Each Category

  1. New Products
    - Adding at least one product for each existing category
    - Including detailed descriptions and realistic prices
    - Using high-quality Unsplash images
  
  2. Categories Covered
    - Recovery Equipment (ציוד חילוץ)
    - Wheels & Tires (צמיגים וגלגלים)
    - Lighting (תאורה)
    - Exterior Accessories (אבזור חיצוני)
    - Interior Accessories (אבזור פנימי)
*/

-- Add products for each category
INSERT INTO products (name, slug, description, price, category_id, image_url, stock) 
SELECT
  'ערכת חילוץ מקצועית ARB',
  'arb-recovery-kit',
  'ערכת חילוץ מקצועית מבית ARB הכוללת רצועות חילוץ, שאקלים, כפפות עבודה ותיק נשיאה. מתאימה לכל רכבי השטח ומספקת פתרון מושלם למצבי תקיעה.',
  1499,
  id,
  'https://images.unsplash.com/photo-1621252179027-94459d278660',
  25
FROM categories WHERE slug = 'recovery';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'חישוקי מתכת Method Race Wheels',
  'method-race-wheels',
  'חישוקי מתכת איכותיים מבית Method Race Wheels. עמידים במיוחד, מתאימים לנסיעות שטח מאתגרות ומעניקים מראה מרשים לרכב.',
  3200,
  id,
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537',
  15
FROM categories WHERE slug = 'wheels';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'בר תאורת LED Rigid Industries',
  'rigid-led-light-bar',
  'בר תאורת LED באורך 52 אינץ׳ מבית Rigid Industries. מספק תאורה חזקה במיוחד, אידיאלי לנסיעות לילה ומגיע עם אחריות יצרן מורחבת.',
  2899,
  id,
  'https://images.unsplash.com/photo-1591543620767-582b2469cf5f',
  20
FROM categories WHERE slug = 'lights';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'פגוש קדמי ARB Summit',
  'arb-summit-bumper',
  'פגוש קדמי מחוזק מבית ARB, סדרת Summit. כולל נקודות עגינה לכננת, מתאים להתקנת פנסי דרך ומספק הגנה מקסימלית לחזית הרכב.',
  4500,
  id,
  'https://images.unsplash.com/photo-1669215420018-098507d14861',
  10
FROM categories WHERE slug = 'exterior';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'כיסויי מושבים Neoprene',
  'neoprene-seat-covers',
  'כיסויי מושבים איכותיים מחומר Neoprene. עמידים במים, קלים לניקוי ומספקים הגנה מושלמת למושבי הרכב. מתאימים למגוון דגמי רכבי שטח.',
  899,
  id,
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
  30
FROM categories WHERE slug = 'interior';