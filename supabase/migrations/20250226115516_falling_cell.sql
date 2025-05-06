-- Drop existing tables and constraints if they exist
DO $$ 
BEGIN
  -- Drop helpful_reviews table and its constraints first (because it references reviews)
  DROP TABLE IF EXISTS helpful_reviews CASCADE;
  
  -- Drop reviews table and its constraints
  DROP TABLE IF EXISTS reviews CASCADE;
END $$;

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Add foreign key constraint to auth.users
ALTER TABLE reviews
ADD CONSTRAINT reviews_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Reviews are readable by everyone"
  ON reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add helpful_reviews table to track which users found which reviews helpful
CREATE TABLE helpful_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, review_id)
);

-- Add foreign key constraint to auth.users for helpful_reviews
ALTER TABLE helpful_reviews
ADD CONSTRAINT helpful_reviews_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE helpful_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their helpful marks"
  ON helpful_reviews
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);