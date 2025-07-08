# Environment Setup Guide

## Overview

This project uses a unified environment switching system that allows you to seamlessly switch between development and production environments for both **Supabase** and **Przelewy24** by changing a single environment variable.

## 🎯 How It Works

**Single Variable Control**: Change `APP_ENV` in `.env.local` to switch everything at once:

- `APP_ENV=development` → Development database + P24 sandbox mode
- `APP_ENV=production` → Production database + P24 live mode

## 📁 Environment Files Structure

```
next/
├── .env.local           # Controls switching (APP_ENV only)
├── .env.development     # Development-specific variables
├── .env.production      # Production-specific variables
└── .env.example         # Template with all required variables
```

## 🔧 Environment Variables

### .env.local (Environment Controller)

```bash
# Controls which environment to use
APP_ENV=development  # or 'production'

# Przelewy24 credentials (same for both environments)
P24_MERCHANT_ID=your-merchant-id
P24_POS_ID=your-pos-id
P24_REST_API_KEY=your-api-key
P24_CRC=your-crc-key
```

### .env.development (Development Configuration)

```bash
# Development Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-key

# Przelewy24 Sandbox Mode (Test Payments)
SANDBOX=true
```

### .env.production (Production Configuration)

```bash
# Production Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key

# Przelewy24 Live Mode (Real Payments)
SANDBOX=false
```

## 🔄 Switching Environments

### Development Mode

1. Set `APP_ENV=development` in `.env.local`
2. Restart your development server
3. ✅ Uses development Supabase database
4. ✅ Uses Przelewy24 sandbox (test payments only)
5. ✅ All API calls use test endpoints

### Production Mode

1. Set `APP_ENV=production` in `.env.local`
2. Restart your development server
3. ✅ Uses production Supabase database
4. ✅ Uses Przelewy24 live mode (real payments)
5. ✅ All API calls use production endpoints

## 🧪 Verification

When you start the development server, you should see console logs like:

```
🔧 Database Environment: development
📁 Supabase config loaded from: .env.development
💳 P24 Mode: SANDBOX (Test)
💳 P24 Verification Mode: SANDBOX (Test)
💳 P24 Recreate Mode: SANDBOX (Test)
💳 P24 Verify Mode: SANDBOX (Test)
```

## 🎯 Benefits

1. **Safety**: Development mode = guaranteed test payments only
2. **Consistency**: Same payment flows, just test vs real money
3. **Simplicity**: Single variable controls everything
4. **Team-Friendly**: Easy onboarding and collaboration
5. **Future-Proof**: Supports all future feature development

## 🔧 Technical Implementation

### Files Updated

- ✅ `src/app/api/payment/create/route.ts` - Payment creation with environment loading
- ✅ `src/app/api/payment/complete/verify-transaction.ts` - Transaction verification
- ✅ `src/app/api/payment/recreate/route.ts` - Payment recreation
- ✅ `src/app/api/payment/verify/route.ts` - Payment verification with environment-aware URLs
- ✅ `src/utils/supabase-middleware.ts` - Already configured with environment loading
- ✅ `src/utils/environment-validator.ts` - Environment validation utility

### Environment Loading

All payment-related files now import:

```typescript
import '@/utils/load-environment'; // Load environment configuration
```

This ensures the correct environment variables are loaded before any API calls.

### API URL Switching

The system automatically uses the correct Przelewy24 API URLs:

- **Development**: `https://sandbox.przelewy24.pl/api/v1/`
- **Production**: `https://secure.przelewy24.pl/api/v1/`

## ⚠️ Important Notes

1. **Always Restart**: After changing `APP_ENV`, restart your development server
2. **Verify Environment**: Check console logs to confirm correct environment loading
3. **Test Payments**: Development mode uses sandbox - no real money transactions
4. **Database Safety**: Development uses separate database with test data only

## 🚀 Ready for Guest Checkout

This environment setup provides the foundation for safe development of the guest checkout feature and all future payment-related functionality. You can now develop and test payment flows without any risk to production data or real payment processing.

## 🔄 Next Steps for Guest Checkout

With this environment infrastructure complete, you can now proceed to:

1. **Phase 0.3**: iFirma development environment setup
2. **Phase 0.4**: Email delivery testing setup
3. **Phase 1**: Database schema changes for guest orders
4. **Phase 2**: Frontend implementation for guest checkout

The payment system is now ready for safe guest checkout development! 🎉
