
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // We don't throw an error immediately during build, but we log a warning.
  // This allows the build to pass even if the key is missing in some environments (like client-side).
  if (typeof window === 'undefined') {
    // Only warn on server-side where this key is expected
    if (!supabaseServiceRoleKey) console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY is missing.');
  }
}

// Create a Supabase client with the SERVICE ROLE key
// IMPORTANT: This client has FULL ACCESS to your database (bypasses RLS).
// It should ONLY be used in server-side API routes or Server Actions.
// NEVER import this file in a client-side component.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
