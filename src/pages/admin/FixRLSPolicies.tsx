import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { applyRLSPolicies } from '../../lib/supabase';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export default function FixRLSPolicies() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showNotification } = useNotification();

  const fixRLSPolicies = async () => {
    setLoading(true);
    try {
      await applyRLSPolicies();
      setSuccess(true);
      showNotification('success', 'מדיניות RLS תוקנה בהצלחה! כעת תוכל להוסיף ולערוך מוצרים.');
    } catch (error) {
      console.error('Error fixing RLS policies:', error);
      showNotification('error', 'שגיאה בתיקון מדיניות RLS. נסה להשתמש בממשק הניהול של Supabase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">תיקון מדיניות RLS</h1>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold mb-2 text-red-800">בעיית הרשאות זוהתה</h2>
              <p className="mb-4 text-red-700">
                זיהינו בעיה במדיניות ה-RLS (Row Level Security) שמונעת ממך להוסיף או לערוך מוצרים.
                כלי זה יתקן את הבעיה באופן אוטומטי.
              </p>
            </div>
          </div>
          <button
            onClick={fixRLSPolicies}
            disabled={loading || success}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              success 
                ? 'bg-green-500 text-white' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {loading ? (
              <LoadingSpinner />
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                מדיניות RLS תוקנה בהצלחה
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                תקן מדיניות RLS
              </>
            )}
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">מה הכלי הזה עושה?</h3>
          <ul className="list-disc list-inside space-y-2 text-blue-700">
            <li>מסיר את כל מדיניות ה-RLS הקיימות בטבלת המוצרים</li>
            <li>יוצר מדיניות חדשה שמאפשרת לכולם לצפות במוצרים</li>
            <li>יוצר מדיניות חדשה שמאפשרת למנהלים להוסיף, לערוך ולמחוק מוצרים</li>
            <li>מרענן את מטמון הסכמה כדי שהשינויים ייכנסו לתוקף מיד</li>
          </ul>
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold mb-2 text-green-800">הוראות ידניות לתיקון הבעיה</h3>
          <p className="mb-4 text-green-700">
            אם הכלי האוטומטי לא עובד, תוכל לתקן את הבעיה באופן ידני:
          </p>
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
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';`}
            </pre>
          </div>
          <p className="mt-4 text-green-700">לחץ על "Run" כדי להריץ את השאילתה ולתקן את הבעיה.</p>
        </div>
      </div>
    </div>
  );
}