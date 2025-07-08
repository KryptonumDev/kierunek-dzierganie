// Next.js Environment Loader for Supabase Config
// This file handles loading the correct Supabase credentials based on APP_ENV
import { config } from 'dotenv';
import { join } from 'path';

// Load base .env.local first (for APP_ENV and other variables)
config({ path: join(process.cwd(), '.env.local') });

const appEnv = process.env.APP_ENV || 'development';

// Load environment-specific Supabase config (with override)
config({ path: join(process.cwd(), `.env.${appEnv}`), override: true });

// Log which environment we're using
if (typeof window === 'undefined') {
  console.log(`🔧 Database Environment: ${appEnv}`);
  console.log(`📁 Supabase config loaded from: .env.${appEnv}`);
}

// Helper to get the current environment
export const getCurrentEnvironment = () => appEnv;

// Helper to check if we're in development
export const isDevelopmentDatabase = () => appEnv === 'development';
