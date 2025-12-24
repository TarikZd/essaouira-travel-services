
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Ensure environment variables are checked in a non-production safe way or just let it fail
if (!supabaseUrl || !supabaseKey) {
    if (typeof window === 'undefined') {
        console.warn('Supabase URL or Key is missing in environment variables.');
    }
}

export const supabase = createClient(supabaseUrl, supabaseKey);
