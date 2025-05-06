/*
  # Seed Initial Data
  
  1. Categories
    - Add main product categories
  
  2. Products
    - Add sample products for each category
*/

-- Seed Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('ציוד חילוץ', 'recovery', 'ציוד חילוץ מקצועי לרכבי שטח', 'https://images.unsplash.com/photo-1621252179027-94459d278660'),
  ('צמיגים וגלגלים', 'wheels', 'צמיגים וחישוקים לכל סוגי הרכבים', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537'),
  ('תאורה', 'lights', 'פתרונות תאורה מתקדמים לרכב', 'https://images.unsplash.com/photo-1591543620767-582b2469cf5f'),
  ('אבזור חיצוני', 'exterior', 'אביזרי חוץ ומיגון לרכב', 'https://images.unsplash.com/photo-1669215420018-098507d14861'),
  ('אבזור פנימי', 'interior', 'אביזרי פנים ונוחות', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c');

-- Seed Products
INSERT INTO products (name, slug, description, price, category_id, image_url, stock) 
SELECT
  'מגבה שטח הידראולי Hi-Lift',
  'hi-lift-jack',
  'מגבה שטח מקצועי עם כושר הרמה של 3 טון, מתאים לכל סוגי רכבי השטח. כולל מערכת בטיחות כפולה ומבנה מחוזק במיוחד.',
  899,
  id,
  'https://images.unsplash.com/photo-1621252179027-94459d278660',
  50
FROM categories WHERE slug = 'recovery';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'סט צמיגי שטח BF Goodrich',
  'bf-goodrich-tires',
  'צמיגי שטח איכותיים לאחיזה מקסימלית בכל תנאי שטח. מתאימים במיוחד לנהיגת שטח מאתגרת ומספקים ביצועים מעולים גם בכביש.',
  2499,
  id,
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537',
  30
FROM categories WHERE slug = 'wheels';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'פנסי LED מקצועיים לשטח',
  'led-lights',
  'סט פנסי LED חזקים במיוחד עם 50,000 לומן לראות מושלמת בלילה. כולל מערכת הגנה מפני מים ואבק IP68.',
  799,
  id,
  'https://images.unsplash.com/photo-1591543620767-582b2469cf5f',
  100
FROM categories WHERE slug = 'lights';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock)
SELECT
  'גגון אלומיניום מודולרי',
  'aluminum-roof-rack',
  'גגון אלומיניום קל משקל וחזק במיוחד. מתאים להתקנת ציוד, אוהל גג ומערכות נוספות. כולל מסילות צד מתכווננות.',
  1899,
  id,
  'https://images.unsplash.com/photo-1669215420018-098507d14861',
  25
FROM categories WHERE slug = 'exterior';