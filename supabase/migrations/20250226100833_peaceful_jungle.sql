/*
  # Add Reviews System

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `product_id` (uuid, references products)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `helpful_count` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `reviews` table
    - Add policies for authenticated users to:
      - Read all reviews
      - Create reviews for products
      - Update helpful count on their own reviews
*/

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

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

CREATE POLICY "Users can update helpful count"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add helpful_reviews table to track which users found which reviews helpful
CREATE TABLE helpful_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, review_id)
);

-- Enable RLS
ALTER TABLE helpful_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their helpful marks"
  ON helpful_reviews
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);