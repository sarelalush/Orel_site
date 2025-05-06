// This script applies the migration directly using the Supabase REST API
import { supabase } from './supabase';

async function applyMigration() {
  console.log('Applying migration for product options...');
  
  try {
    // Add new columns to products table for optional features
    const addColumnsQuery = `
      ALTER TABLE products ADD COLUMN IF NOT EXISTS has_sizes BOOLEAN DEFAULT false;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS has_colors BOOLEAN DEFAULT false;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS available_sizes TEXT[] DEFAULT '{}';
      ALTER TABLE products ADD COLUMN IF NOT EXISTS available_colors JSONB DEFAULT '[]'::jsonb;
    `;
    
    const { error: columnsError } = await supabase.rpc('execute_sql', { query: addColumnsQuery });
    if (columnsError) {
      console.error('Error adding columns:', columnsError);
      return;
    }
    
    console.log('Columns added successfully');
    
    // Update some existing products to have sizes and colors
    const updateSizesQuery = `
      UPDATE products
      SET 
        has_sizes = true,
        available_sizes = ARRAY['S', 'M', 'L', 'XL', 'XXL']
      WHERE name ILIKE '%ריפוד%' OR name ILIKE '%ביגוד%' OR name ILIKE '%כיסוי%';
    `;
    
    const { error: sizesError } = await supabase.rpc('execute_sql', { query: updateSizesQuery });
    if (sizesError) {
      console.error('Error updating sizes:', sizesError);
      return;
    }
    
    console.log('Sizes updated successfully');
    
    // Update colors
    const updateColorsQuery = `
      UPDATE products
      SET 
        has_colors = true,
        available_colors = '[
          {"name": "black", "label": "שחור", "hex": "#000000"},
          {"name": "red", "label": "אדום", "hex": "#FF0000"},
          {"name": "blue", "label": "כחול", "hex": "#0000FF"}
        ]'::jsonb
      WHERE name ILIKE '%צבע%' OR name ILIKE '%ריפוד%' OR name ILIKE '%כיסוי%';
    `;
    
    const { error: colorsError } = await supabase.rpc('execute_sql', { query: updateColorsQuery });
    if (colorsError) {
      console.error('Error updating colors:', colorsError);
      return;
    }
    
    console.log('Colors updated successfully');
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

export default applyMigration;