import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client only for auth
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Auth functions that must run client-side
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { error: new Error('שם משתמש או סיסמה שגויים') };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in signIn:', error);
    return { error: new Error('שגיאה בהתחברות') };
  }
};

export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'user'
        }
      }
    });

    if (error) {
      return { error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in signUp:', error);
    return { error: new Error('שגיאה בהרשמה') };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Get current session token for API requests
export const getAuthToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session.access_token;
};

// User management functions
export const updateUserMetadata = async (userId: string, metadata: any) => {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: metadata }
    );

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return { error };
  }
};

export const updateUserRole = async (userId: string, isAdmin: boolean) => {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        user_metadata: { 
          role: isAdmin ? 'admin' : 'user' 
        }
      }
    );

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { error };
  }
};

// RLS Policy management
export const applyRLSPolicies = async () => {
  try {
    // Drop existing policies
    await supabase.rpc('execute_sql', {
      query: `
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
      `
    });

    // Create new policies
    await supabase.rpc('execute_sql', {
      query: `
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
        NOTIFY pgrst, 'reload schema';
      `
    });

    return { error: null };
  } catch (error) {
    console.error('Error applying RLS policies:', error);
    return { error };
  }
};