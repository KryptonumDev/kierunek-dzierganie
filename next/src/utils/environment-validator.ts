import './load-environment';
import { getCurrentEnvironment, isDevelopmentDatabase } from './load-environment';

export const validateEnvironmentConfig = () => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Get current environment
  const appEnv = getCurrentEnvironment();
  const isDev = isDevelopmentDatabase();

  // Validate Supabase config
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    errors.push('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  // Validate P24 config
  if (!process.env.P24_MERCHANT_ID) {
    errors.push('Missing P24_MERCHANT_ID');
  }
  if (!process.env.P24_POS_ID) {
    errors.push('Missing P24_POS_ID');
  }
  if (!process.env.P24_REST_API_KEY) {
    errors.push('Missing P24_REST_API_KEY');
  }
  if (!process.env.P24_CRC) {
    errors.push('Missing P24_CRC');
  }

  // Validate SANDBOX variable exists
  if (process.env.SANDBOX === undefined) {
    errors.push('Missing SANDBOX environment variable');
  }

  // Validate environment consistency
  const isP24Sandbox = process.env.SANDBOX === 'true';

  if (appEnv === 'development' && !isP24Sandbox) {
    warnings.push('Development environment should typically use P24 sandbox mode');
  }
  if (appEnv === 'production' && isP24Sandbox) {
    warnings.push('Production environment should typically use P24 live mode');
  }

  // Check database environment consistency
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const isDevelopmentDb = supabaseUrl.includes('-dev') || supabaseUrl.includes('development');

  if (appEnv === 'development' && !isDevelopmentDb) {
    warnings.push('Development APP_ENV but using production-like Supabase URL');
  }
  if (appEnv === 'production' && isDevelopmentDb) {
    warnings.push('Production APP_ENV but using development-like Supabase URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config: {
      appEnv,
      isDevelopmentDatabase: isDev,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      p24SandboxMode: isP24Sandbox,
      p24MerchantId: process.env.P24_MERCHANT_ID,
    },
  };
};

// Helper function to log environment status
export const logEnvironmentStatus = () => {
  const validation = validateEnvironmentConfig();

  console.log('🔧 Environment Configuration Status:');
  console.log('=====================================');
  console.log(`APP_ENV: ${validation.config.appEnv}`);
  console.log(`Database: ${validation.config.isDevelopmentDatabase ? 'Development' : 'Production'}`);
  console.log(`P24 Mode: ${validation.config.p24SandboxMode ? 'SANDBOX (Test)' : 'LIVE (Real)'}`);
  console.log(`Supabase URL: ${validation.config.supabaseUrl}`);
  console.log(`P24 Merchant: ${validation.config.p24MerchantId}`);

  if (validation.errors.length > 0) {
    console.log('\n❌ Configuration Errors:');
    validation.errors.forEach((error) => console.log(`  - ${error}`));
  }

  if (validation.warnings.length > 0) {
    console.log('\n⚠️  Configuration Warnings:');
    validation.warnings.forEach((warning) => console.log(`  - ${warning}`));
  }

  if (validation.isValid && validation.warnings.length === 0) {
    console.log('\n✅ Environment configuration is valid!');
  }

  console.log('=====================================\n');

  return validation;
};
