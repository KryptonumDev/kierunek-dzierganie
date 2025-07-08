import './load-environment'; // Load environment configuration
import { createClient as createAdminClient } from '@supabase/supabase-js';

export function createClient() {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
