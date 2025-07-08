import './load-environment';
import { logEnvironmentStatus } from './environment-validator';
import { getCurrentEnvironment } from './load-environment';

/**
 * Test Environment Configuration
 *
 * This utility helps test that environment switching is working correctly.
 * Run this to validate your setup after changing APP_ENV.
 *
 * Usage:
 * 1. Set APP_ENV=development in .env.local
 * 2. Run: node -e "require('./src/utils/test-environment.ts').testEnvironment()"
 * 3. Change APP_ENV=production in .env.local
 * 4. Run again to verify switching works
 */

export const testEnvironment = () => {
  console.log('🧪 Testing Environment Configuration');
  console.log('====================================\n');

  // Log current environment status
  const validation = logEnvironmentStatus();

  // Test Supabase configuration
  console.log('📊 Supabase Configuration:');
  console.log(`  URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log(`  Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}`);
  console.log(`  Service Key: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing'}`);

  // Test P24 configuration
  console.log('\n💳 Przelewy24 Configuration:');
  console.log(`  Merchant ID: ${process.env.P24_MERCHANT_ID}`);
  console.log(`  POS ID: ${process.env.P24_POS_ID}`);
  console.log(`  API Key: ${process.env.P24_REST_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`  CRC: ${process.env.P24_CRC ? 'Present' : 'Missing'}`);
  console.log(`  Sandbox Mode: ${process.env.SANDBOX}`);

  // Test environment switching logic
  console.log('\n🔄 Environment Switching Test:');
  const currentEnv = getCurrentEnvironment();
  const expectedSandbox = currentEnv === 'development' ? 'true' : 'false';
  const actualSandbox = process.env.SANDBOX;

  if (actualSandbox === expectedSandbox) {
    console.log(`✅ P24 sandbox mode (${actualSandbox}) matches environment (${currentEnv})`);
  } else {
    console.log(`❌ P24 sandbox mode (${actualSandbox}) doesn't match environment (${currentEnv})`);
    console.log(`   Expected: SANDBOX=${expectedSandbox} for APP_ENV=${currentEnv}`);
  }

  // Test API URLs
  console.log('\n🌐 API URL Configuration:');
  const p24ApiUrl =
    process.env.SANDBOX === 'true' ? 'https://sandbox.przelewy24.pl/api/v1/' : 'https://secure.przelewy24.pl/api/v1/';
  console.log(`  P24 API URL: ${p24ApiUrl}`);

  // Summary
  console.log('\n📋 Test Summary:');
  if (validation.isValid && validation.warnings.length === 0) {
    console.log('✅ All tests passed! Environment switching is working correctly.');
  } else {
    console.log('❌ Issues found. Please review the configuration above.');
  }

  console.log('\n💡 To switch environments:');
  console.log('   1. Change APP_ENV in .env.local');
  console.log('   2. Restart your development server');
  console.log('   3. Run this test again to verify');

  return validation;
};

// Auto-run if called directly (for testing)
if (require.main === module) {
  testEnvironment();
}
