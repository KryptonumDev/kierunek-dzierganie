# Guest Checkout Implementation Plan for Physical Products - MVP

## Project Overview

**Objective**: Enable users to purchase physical products without creating an account or logging in.

**Scope**: Guest checkout will be limited to physical products only. Courses, bundles, and digital products will continue to require user authentication.

**🚨 CRITICAL CONSTRAINT**: The "Continue as Guest" option should **ONLY** be shown when the cart contains **EXCLUSIVELY** physical products. If the cart contains any courses, bundles, or digital products, guests must be required to create an account or login.

**🇵🇱 LANGUAGE REQUIREMENT**: All user-facing text, messages, buttons, and labels must be written in Polish. This includes error messages, validation text, button labels, and any communication with the user during the guest checkout process.

**MVP Focus**: Minimal viable product - guests can checkout, receive order confirmation email, and complete purchase.

---

## Database Environment Setup

### Supabase Database Configuration

The project uses two Supabase databases:

1. **Production Database**: `Dashboard` (baujxpfhgvzpwyqhylxt)
   - Main database with live data
   - Region: eu-central-1
   - PostgreSQL version: 15.1.1.19
   - Created: 2024-02-21

2. **Development Database**: `kierunek-dzierganie-dev` (fplgqekfscacjbhiwmzd)
   - Development/testing database
   - Region: eu-central-1
   - PostgreSQL version: 17.4.1.049
   - Created: 2025-07-08

### Development Workflow

**⚠️ Important**: All database changes must be tested on the **development database** first before applying to production.

**🚨 CRITICAL**: There is an admin panel in another codebase that connects to the production database. Any breaking changes to the production database could crash the live admin panel. Therefore:

1. **Phase 1**: Test all migrations on `kierunek-dzierganie-dev`
2. **Phase 2**: Validate functionality with development database
3. **Phase 3**: Test admin panel locally connected to development database
4. **Phase 4**: Complete entire feature development and testing (100%)
5. **Phase 5**: Only then apply tested migrations to `Dashboard` production database

**Admin Panel Testing**: The admin panel will be tested locally against the development database to ensure compatibility before any production database changes.

---

## 1. Database Changes (1-2 hours)

### 1.1 Orders Table Modifications

**Changes Required:**

- Make `user_id` field nullable in the `orders` table
- Add new guest-specific fields:
  - `guest_email` (VARCHAR(255), nullable)
  - `guest_order_token` (VARCHAR(255), nullable, unique)
  - `is_guest_order` (BOOLEAN, default: false)

**Migration Script:**

```sql
-- Add new columns for guest orders
ALTER TABLE orders
ADD COLUMN guest_email VARCHAR(255) NULL,
ADD COLUMN guest_order_token VARCHAR(255) NULL,
ADD COLUMN is_guest_order BOOLEAN DEFAULT FALSE;

-- Make user_id nullable
ALTER TABLE orders
MODIFY COLUMN user_id INT NULL;

-- Add unique index for guest order tokens
CREATE UNIQUE INDEX idx_guest_order_token ON orders(guest_order_token);

-- Add index for guest email lookups
CREATE INDEX idx_guest_email ON orders(guest_email);
```

### 1.2 Data Validation Rules

- Either `user_id` OR `guest_email` must be present (not both null)
- If `is_guest_order = true`, then `guest_email` and `guest_order_token` must be present
- If `is_guest_order = false`, then `user_id` must be present

### 1.3 Testing Strategy

1. **First**: Apply migration to `kierunek-dzierganie-dev`
2. **Test**: Verify all constraints and indexes work correctly
3. **Validate**: Test with sample guest and user orders
4. **Production**: Apply to `Dashboard` database only after thorough testing

---

## 2. Frontend Changes (4-6 hours)

### 2.1 Authorization Component Updates

**File**: `src/components/_global/Authorization/*`

**Changes:**

- Add "Continue as Guest" button/option
- Show guest option only when cart contains physical products only
- Implement cart validation to prevent mixed product types for guests

**New Components Needed:**

- `GuestCheckoutOption.tsx`
- `CartValidation.tsx` (utility component)

### 2.2 Checkout Flow Modifications

**Files to Update:**

- Cart components
- Checkout process components
- Payment flow components

**Key Changes:**

- Skip authentication step for guest users
- Modify billing/shipping data collection for guests
- Update form validation for guest checkout
- Add guest email collection as mandatory field
- Display guest checkout limitations clearly

### 2.3 Cart Validation Logic

**Implementation:**

```typescript
const validateGuestCart = (cartItems: CartItem[]) => {
  const hasPhysicalProducts = cartItems.some(
    (item) => item.type === 'physical'
  );
  const hasDigitalProducts = cartItems.some(
    (item) =>
      item.type === 'course' ||
      item.type === 'bundle' ||
      item.type === 'voucher'
  );

  return {
    canCheckoutAsGuest: hasPhysicalProducts && !hasDigitalProducts,
    mixedCart: hasPhysicalProducts && hasDigitalProducts,
  };
};
```

### 2.4 UI/UX Updates

- Add clear messaging about guest checkout limitations
- Update error messages for mixed carts
- Add guest checkout flow indicators

---

## 3. Backend Changes (3-4 hours)

### 3.1 Payment API Updates

**File**: `src/app/api/payment/create/route.ts`

**Changes:**

- Handle `null` user_id for guest orders
- Generate secure guest order tokens
- Skip user-dependent operations for guests
- Update order creation logic

**New Functions:**

```typescript
const generateGuestOrderToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const createGuestOrder = async (orderData: GuestOrderData) => {
  // Implementation for guest order creation
};
```

### 3.2 Order Completion Flow Updates

**Files to Update:**

- Order processing logic
- Email notification system
- Inventory management
- Invoice generation

**Key Changes:**

- Skip virtual wallet operations for guests
- Skip user profile updates for guests
- Ensure affiliate tracking still works for guest orders
- Modified email templates with basic guest order info

---

## 4. Email System Updates (1-2 hours)

### 4.1 Email Template Modifications

**File**: `src/emails/Order/Order.tsx`

**Changes:**

- Add guest order tracking information (order number only)
- Include basic order details
- Add "Create Account" CTA for future convenience
- Display order number prominently

**Note**: Use existing email template, just modify for guest orders

---

## 5. Implementation Phases

### Phase 1: Database & Core Backend (Day 1)

1. **Development Database Setup**:
   - Test migration on `kierunek-dzierganie-dev`
   - Validate constraints and indexes
   - Test with sample data

2. **Core Backend Logic**:
   - Update payment API for guest orders
   - Implement guest order token generation
   - Test order creation flow

### Phase 2: Frontend Integration (Day 2)

1. Authorization component updates
2. Cart validation logic
3. Guest checkout flow implementation

### Phase 3: Testing & Production Deploy (Day 3)

1. End-to-end testing with development database
2. Email template updates
3. Apply migration to production database
4. Final production testing

---

## 6. Technical Dependencies

### 6.1 External Services

- Payment processor compatibility with guest orders
- Email service provider configurations
- Shipping service integrations

### 6.2 Internal Dependencies

- Cart and checkout system updates
- Order management system changes

---

## Features NOT in MVP (Future Enhancements)

### Removed from MVP:

1. **Guest Order Lookup Page** - Not essential for completing purchase
2. **New Email Templates** - Existing template can be modified
3. **Enhanced Email Content** - Basic order confirmation is sufficient
4. **Advanced Security Features** - Basic token generation is sufficient
5. **GDPR Compliance Features** - Can be added later
6. **Account Migration** - Not needed for MVP
7. **Enhanced Guest Features** - Not needed for MVP
8. **Guest Order Status Tracking** - Since logged-in users have this, guests don't need it for MVP

## Conclusion

This MVP focuses on the absolute minimum needed to enable guest checkout for physical products. The goal is to allow guests to complete a purchase and receive a basic order confirmation email.

**Total Estimated Effort**: 8-12 hours over 1-2 development days

---

_Last Updated: [Current Date]_
_Branch: physical-no-account_
_Status: MVP Implementation Plan - Ready for Development_
