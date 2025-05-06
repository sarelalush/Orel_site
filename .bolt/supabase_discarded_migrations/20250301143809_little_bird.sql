-- Create product_images table
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access"
  ON product_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin full access"
  ON product_images
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add index for faster lookups
CREATE INDEX product_images_product_id_idx ON product_images(product_id);

-- Migrate existing product images
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, image_url, 0
FROM products
WHERE image_url IS NOT NULL AND image_url != '';

-- Add images array column to products for caching
ALTER TABLE products ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;

-- Create function to update product images cache
CREATE OR REPLACE FUNCTION update_product_images_cache()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the images cache in the products table
  UPDATE products
  SET images = (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', id,
        'image_url', image_url,
        'sort_order', sort_order
      )
      ORDER BY sort_order
    )
    FROM product_images
    WHERE product_id = NEW.product_id
  )
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update cache on image changes
CREATE TRIGGER update_product_images_cache_trigger
AFTER INSERT OR UPDATE OR DELETE ON product_images
FOR EACH ROW
EXECUTE FUNCTION update_product_images_cache();

-- Update all products' image cache
UPDATE products p
SET images = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', pi.id,
      'image_url', pi.image_url,
      'sort_order', pi.sort_order
    )
    ORDER BY pi.sort_order
  )
  FROM product_images pi
  WHERE pi.product_id = p.id
);