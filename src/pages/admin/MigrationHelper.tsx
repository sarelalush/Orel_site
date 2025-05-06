import React, { useState } from 'react';
import { supabase, executeSql, refreshSchemaCache, ensureProductColumns, createExecuteSqlFunction, applyRLSPolicies } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function MigrationHelper() {
  const [loading, setLoading] = useState(false);
  const [functionCreated, setFunctionCreated] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [rlsPoliciesApplied, setRlsPoliciesApplied] = useState(false);
  const { showNotification } = useNotification();

  const createExecuteSqlFunctionHandler = async () => {
    setLoading(true);
    try {
      // SQL to create the execute_sql function
      const createFunctionSql = `
        -- Create the execute_sql function
        CREATE OR REPLACE FUNCTION public.execute_sql(query text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE query;
        END;
        $$;

        -- Grant execute permission to authenticated users
        GRANT EXECUTE ON FUNCTION public.execute_sql TO authenticated;

        -- Force schema cache refresh
        NOTIFY pgrst, 'reload schema';
      `;
      
      const { error } = await executeSql(createFunctionSql);
      
      if (error) throw error;
      
      setFunctionCreated(true);
      showNotification('success', 'הפונקציה נוצרה בהצלחה!');
    } catch (error) {
      console.error('Failed to create function:', error);
      showNotification('error', 'שגיאה ביצירת הפונקציה. נסה להשתמש בממשק הניהול של Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const runMigration = async () => {
    setLoading(true);
    try {
      // First create the execute_sql function if it doesn't exist
      await createExecuteSqlFunction();
      
      // Ensure product columns exist
      const { error } = await ensureProductColumns();
      
      if (error) throw error;
      
      // Update some existing products to have sizes and colors
      try {
        // Try updating sizes
        await executeSql(`
          UPDATE products
          SET 
            has_sizes = true,
            available_sizes = '["S", "M", "L", "XL", "XXL"]'::jsonb
          WHERE name ILIKE '%ריפוד%' OR name ILIKE '%ביגוד%' OR name ILIKE '%כיסוי%';
        `);
        
        // Try updating colors
        await executeSql(`
          UPDATE products
          SET 
            has_colors = true,
            available_colors = '[
              {"name": "black", "label": "שחור", "hex": "#000000"},
              {"name": "red", "label": "אדום", "hex": "#FF0000"},
              {"name": "blue", "label": "כחול", "hex": "#0000FF"}
            ]'::jsonb
          WHERE name ILIKE '%צבע%' OR name ILIKE '%ריפוד%' OR name ILIKE '%כיסוי%';
        `);
      } catch (updateError) {
        console.warn('Error updating product data:', updateError);
        // Continue anyway, the columns were created successfully
      }
      
      // Refresh the schema cache
      await refreshSchemaCache();
      
      setMigrationComplete(true);
      showNotification('success', 'המיגרציה הושלמה בהצלחה!');
    } catch (error) {
      console.error('Migration failed:', error);
      showNotification('error', 'שגיאה בביצוע המיגרציה. נסה להשתמש בממשק הניהול של Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const applyRLSPoliciesHandler = async () => {
    setLoading(true);
    try {
      await applyRLSPolicies();
      setRlsPoliciesApplied(true);
      showNotification('success', 'מדיניות RLS הוחלה בהצלחה!');
    } catch (error) {
      console.error('Failed to apply RLS policies:', error);
      showNotification('error', 'שגיאה בהחלת מדיניות RLS. נסה להשתמש בממשק הניהול של Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const manualMigration = () => {
    // Create a new migration file
    const migrationContent = `
-- Add new columns to products table for optional features
ALTER TABLE products ADD COLUMN IF NOT EXISTS has_sizes BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS has_colors BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_sizes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_colors JSONB DEFAULT '[]'::jsonb;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';

-- Update some existing products to have sizes and colors
UPDATE products
SET 
  has_sizes = true,
  available_sizes = '["S", "M", "L", "XL", "XXL"]'::jsonb
WHERE name ILIKE '%ריפוד%' OR name ILIKE '%ביגוד%' OR name ILIKE '%כיסוי%';

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

    // Create a blob and download link
    const blob = new Blob([migrationContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_options_migration.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showNotification('info', 'קובץ המיגרציה הורד. העלה אותו לממשק הניהול של Supabase.');
  };

  const manualRLSPolicies = () => {
    // Create a new migration file for RLS policies
    const rlsPoliciesContent = `
-- Drop existing policies on products table
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Admin insert access" ON products;
DROP POLICY IF EXISTS "Admin update access" ON products;
DROP POLICY IF EXISTS "Admin delete access" ON products;
DROP POLICY IF EXISTS "Admin full access" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable all access for admin users" ON products;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow admin full access" ON products;

-- Create new simplified policies
CREATE POLICY "Public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Create a policy for admin users to have full access
CREATE POLICY "Admin full access"
  ON products
  USING (
    -- For SELECT, UPDATE, DELETE operations
    (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  )
  WITH CHECK (
    -- For INSERT, UPDATE operations
    (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  );

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';
    `;

    // Create a blob and download link
    const blob = new Blob([rlsPoliciesContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fix_rls_policies.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showNotification('info', 'קובץ מדיניות RLS הורד. העלה אותו לממשק הניהול של Supabase.');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">כלי עזר למיגרציה</h1>
      
      <div className="space-y-6">
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-lg font-semibold mb-2 text-yellow-800">הודעה חשובה</h2>
          <p className="mb-4 text-yellow-700">
            כלי המיגרציה דורש הרשאות מיוחדות שאינן זמינות בסביבת הפיתוח הנוכחית.
            אנו מציעים שתי אפשרויות להשלמת המיגרציה:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700 mb-4">
            <li>הורד את קובץ המיגרציה והעלה אותו לממשק הניהול של Supabase</li>
            <li>הוסף את העמודות ידנית דרך ממשק ה-SQL של Supabase</li>
          </ol>
          <div className="flex gap-2">
            <button
              onClick={manualMigration}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              הורד קובץ מיגרציה
            </button>
            <button
              onClick={manualRLSPolicies}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              הורד קובץ מדיניות RLS
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">יצירת פונקציית SQL</h2>
          <p className="mb-4 text-gray-600">יצירת פונקציה שמאפשרת הרצת שאילתות SQL מהאפליקציה</p>
          <button
            onClick={createExecuteSqlFunctionHandler}
            disabled={loading || functionCreated}
            className={`px-4 py-2 rounded-lg transition-colors ${
              functionCreated 
                ? 'bg-green-500 text-white' 
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {loading ? <LoadingSpinner /> : functionCreated ? 'הפונקציה נוצרה בהצלחה ✓' : 'צור פונקציה'}
          </button>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">הוספת עמודות למוצרים</h2>
          <p className="mb-4 text-gray-600">הוספת עמודות למידות וצבעים בטבלת המוצרים</p>
          <button
            onClick={runMigration}
            disabled={loading || migrationComplete}
            className={`px-4 py-2 rounded-lg transition-colors ${
              migrationComplete 
                ? 'bg-green-500 text-white' 
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {loading ? <LoadingSpinner /> : migrationComplete ? 'המיגרציה הושלמה בהצלחה ✓' : 'הרץ מיגרציה'}
          </button>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">תיקון מדיניות RLS</h2>
          <p className="mb-4 text-gray-600">תיקון מדיניות RLS כדי לאפשר למנהלים לערוך מוצרים</p>
          <button
            onClick={applyRLSPoliciesHandler}
            disabled={loading || rlsPoliciesApplied}
            className={`px-4 py-2 rounded-lg transition-colors ${
              rlsPoliciesApplied 
                ? 'bg-green-500 text-white' 
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {loading ? <LoadingSpinner /> : rlsPoliciesApplied ? 'מדיניות RLS הוחלה בהצלחה ✓' : 'החל מדיניות RLS'}
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">מה המיגרציה הזו עושה?</h3>
          <ul className="list-disc list-inside space-y-2 text-blue-700">
            <li>מוסיפה עמודות חדשות לטבלת המוצרים:</li>
            <ul className="list-circle list-inside ml-6 text-blue-600">
              <li><code>has_sizes</code> - האם למוצר יש מידות</li>
              <li><code>has_colors</code> - האם למוצר יש צבעים</li>
              <li><code>available_sizes</code> - מערך JSON של מידות זמינות</li>
              <li><code>available_colors</code> - מערך JSON של צבעים זמינים</li>
            </ul>
            <li>מעדכנת מוצרים קיימים עם מידות וצבעים לדוגמה</li>
            <li>מאפשרת למנהל להוסיף מידות וצבעים למוצרים</li>
            <li>מתקנת את מדיניות RLS כדי לאפשר למנהלים לערוך מוצרים</li>
          </ul>
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold mb-2 text-green-800">הוראות ידניות לביצוע המיגרציה</h3>
          <ol className="list-decimal list-inside space-y-2 text-green-700">
            <li>היכנס לממשק הניהול של Supabase</li>
            <li>לחץ על לשונית "SQL Editor"</li>
            <li>צור שאילתה חדשה</li>
            <li>העתק והדבק את הקוד הבא:</li>
          </ol>
          <div className="bg-white p-4 rounded-lg mt-4 overflow-x-auto">
            <pre className="text-sm text-gray-800">
{`-- Drop existing policies on products table
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Admin insert access" ON products;
DROP POLICY IF EXISTS "Admin update access" ON products;
DROP POLICY IF EXISTS "Admin delete access" ON products;
DROP POLICY IF EXISTS "Admin full access" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable all access for admin users" ON products;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow admin full access" ON products;

-- Create new simplified policies
CREATE POLICY "Public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Create a policy for admin users to have full access
CREATE POLICY "Admin full access"
  ON products
  USING (
    -- For SELECT, UPDATE, DELETE operations
    (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  )
  WITH CHECK (
    -- For INSERT, UPDATE operations
    (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin')
  );

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';`}
            </pre>
          </div>
          <p className="mt-4 text-green-700">לחץ על "Run" כדי להריץ את השאילתה ולהשלים את המיגרציה.</p>
        </div>
      </div>
    </div>
  );
}