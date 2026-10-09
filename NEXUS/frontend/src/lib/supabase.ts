import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project.supabase.co') &&
  supabaseAnonKey !== 'your-supabase-anon-key'
);

if (!isConfigured) {
  console.warn(
    '[NEXUS] Supabase credentials not configured. Running in demo mode.\n' +
    'Copy frontend/.env.example to frontend/.env.local and add your Supabase config.'
  );
}

export const supabase = createClient(supabaseUrl || 'https://example.supabase.co', supabaseAnonKey || 'public-anon-key');
