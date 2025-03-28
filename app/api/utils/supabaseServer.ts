import { createClient } from '@supabase/supabase-js';

// Server-side only Supabase client
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: SUPABASE_ANON_KEY');
}

// This client should only be used in API routes, not in client-side code
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
); 