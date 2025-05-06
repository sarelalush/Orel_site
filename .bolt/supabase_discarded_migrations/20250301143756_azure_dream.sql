-- Add sample reviews for products
DO $$ 
DECLARE
  test_user_id uuid;
  product_ids uuid[];
  review_count integer;
  review_texts text[] := ARRAY[
    'מוצר מעולה! איכות גבוהה, שירות מצוין ומשלוח מהיר. ממליץ בחום.',
    'מוצר טוב מאוד, יש מקום קטן לשיפור אבל בסך הכל מרוצה.',
    'מוצר סביר, יש מקום לשיפור.',
    'איכות מעולה, מחיר הוגן, משלוח מהיר. בדיוק מה שחיפשתי.',
    'עובד מצוין, ממליץ בחום לכל מי שמחפש מוצר איכותי.',
    'שווה כל שקל! המוצר הגיע באריזה יפה ובמצב מושלם.',
    'מוצר מצוין, עונה על כל הציפיות שלי.',
    'איכות טובה, מחיר הוגן, משלוח מהיר.',
    'מרוצה מאוד מהרכישה, אשמח לקנות עוד מוצרים מהחנות.',
    'המוצר הגיע במצב מצוין, עובד כמו שצריך.'
  ];
BEGIN
  -- Try to get an existing user
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  -- If no user exists, we can't add reviews
  IF test_user_id IS NULL THEN
    RAISE NOTICE 'No users found, skipping review creation';
    RETURN;
  END IF;

  -- Get all product IDs
  SELECT array_agg(id) INTO product_ids FROM products;
  
  -- Skip if no products
  IF product_ids IS NULL OR array_length(product_ids, 1) IS NULL THEN
    RAISE NOTICE 'No products found, skipping review creation';
    RETURN;
  END IF;

  -- Check if we already have reviews
  SELECT COUNT(*) INTO review_count FROM reviews;
  
  -- Only add sample reviews if we don't have any
  IF review_count = 0 THEN
    -- Add reviews for each product
    FOR i IN 1..array_length(product_ids, 1) LOOP
      -- Add a 5-star review (70% chance)
      IF random() < 0.7 THEN
        INSERT INTO reviews (
          user_id, 
          product_id, 
          rating, 
          comment, 
          helpful_count, 
          created_at
        )
        VALUES (
          test_user_id,
          product_ids[i],
          5,
          review_texts[1 + floor(random() * 5)::int],
          floor(random() * 20)::int,
          NOW() - (floor(random() * 30) || ' days')::interval
        )
        ON CONFLICT (user_id, product_id) DO NOTHING;
      END IF;
    END LOOP;
  END IF;
END $$;