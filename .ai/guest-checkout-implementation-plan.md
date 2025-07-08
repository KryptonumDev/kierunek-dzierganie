# Guest Checkout Implementation Plan for Physical Products

## Project Overview

**Objective**: Enable users to purchase physical products without creating an account or logging in.

**Scope**: Guest checkout will be limited to physical products only. Courses, bundles, and digital products will continue to require user authentication.

---

## 0. Pre-Implementation: Setup Permanent Development Environment

This is the most critical first step and a long-term investment in development infrastructure. A complete, isolated development environment must be established to protect production data and services. This environment will be reusable for all future development work, not just guest checkout implementation.

**Strategic Goals:**

- Create a permanent, reusable development environment
- Enable safe development and testing of all future features
- Maintain production-level functionality in sandbox mode
- Support multiple developers working simultaneously
- Provide consistent development experience across all projects

### 0.1 Development Database (Supabase Development Project)

- **Reason**: To prevent any risk to live production data while developing and testing schema changes, new features, and database migrations.
- **Action**: Create a dedicated Supabase development project that mirrors production structure but with test data.
- **Reusability**: This database will serve all future feature development, A/B testing, and experimentation.
- **Setup**:
  - Create new Supabase project: `kierunek-dzierganie-dev`
  - Import production schema structure
  - Populate with realistic test data
  - Configure automatic schema sync from production (when needed)

### 0.2 Payment Gateway (Przelewy24 Development Account)

- **Reason**: To simulate the entire payment lifecycle (success, failure, chargebacks) without processing real money for any future payment-related features.
- **Action**: Obtain dedicated development/sandbox API keys and maintain them long-term.
- **Reusability**: Support testing of new payment features, subscription models, refund processes, etc.
- **Setup**:
  - Dedicated P24 sandbox account for the project
  - Test card/bank details documentation
  - Webhook endpoint configuration for development

### 0.3 Invoicing Service (iFirma Development Environment)

- **Reason**: To avoid generating real, legally-binding invoices during development of any order/billing related features.
- **Action**: Configure dedicated test account or sandbox environment with iFirma.
- **Reusability**: Support development of new billing features, subscription invoicing, tax calculations, etc.
- **Setup**:
  - Separate iFirma test account with dedicated API keys
  - Test invoice templates and configurations
  - Isolated accounting environment

### 0.4 Email Delivery (Development Email Infrastructure)

- **Reason**: To intercept, view, and debug test emails for any feature that sends communications.
- **Action**: Set up permanent email testing infrastructure.
- **Reusability**: Support testing of new email campaigns, transactional emails, newsletters, etc.
- **Setup**:
  - Dedicated Resend development project OR
  - Mailtrap/Ethereal permanent account
  - Email template testing environment
  - Delivery testing and debugging tools

### 0.5 Shipping Provider APIs (Development Integration)

- **Reason**: To test shipping-related features without incurring costs or affecting real logistics.
- **Action**: Establish permanent sandbox relationships with shipping providers.
- **Reusability**: Support development of new shipping methods, international shipping, subscription deliveries, etc.
- **Setup**:
  - Apaczka development account for InPost integration
  - Other carrier sandbox accounts (DPD, UPS, etc.)
  - Rate calculation testing
  - Label generation testing

### 0.6 Marketing Automation (Development Marketing Stack)

- **Reason**: To prevent test data from polluting production marketing campaigns and analytics.
- **Action**: Create isolated marketing automation environment.
- **Reusability**: Support testing of new automation workflows, segmentation, A/B testing, etc.
- **Setup**:
  - Dedicated MailerLite development account OR isolated test groups
  - Google Analytics 4 development property
  - Meta Pixel test environment
  - Marketing automation workflow testing

### 0.7 Content Management (Development CMS Setup)

- **Reason**: To test content-related features and schema changes without affecting live content.
- **Action**: Configure development-friendly CMS environment.
- **Reusability**: Support testing of new content types, page layouts, content workflows, etc.
- **Setup**:
  - Sanity development dataset OR separate development project
  - Content migration and sync tools
  - Preview and staging environment integration

### 0.8 Development Environment Documentation & Maintenance

- **Purpose**: Ensure the development environment remains useful and up-to-date for future work.
- **Components**:
  - Environment setup documentation
  - Credential management and rotation
  - Data refresh and sync procedures
  - Testing protocols and best practices
  - Onboarding guide for new developers

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

---

## 2. Frontend Changes (6-8 hours)

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

### 2.3 Guest Order Lookup Page

**New Page**: `/guest-order-lookup`

**Features:**

- Order lookup by email and order number
- Display order status and details
- Download invoices/receipts
- No login required

**Components:**

- `GuestOrderLookup.tsx`
- `GuestOrderDetails.tsx`

### 2.4 Cart Validation Logic

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

### 2.5 UI/UX Updates

- Add clear messaging about guest checkout limitations
- Display "Create account to save this order" option post-purchase
- Update error messages for mixed carts
- Add guest checkout flow indicators

---

## 3. Backend Changes (5-7 hours)

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

### 3.2 Guest Order Lookup API

**New Endpoint**: `/api/orders/guest-lookup`

**Method**: POST
**Parameters:**

- `email`: Guest email address
- `orderNumber`: Order ID or token

**Response:**

- Order details (sanitized)
- Order status
- Tracking information
- Download links

### 3.3 Order Completion Flow Updates

**Files to Update:**

- Order processing logic
- Email notification system
- Inventory management
- Invoice generation

**Key Changes:**

- Skip virtual wallet operations for guests
- Skip user profile updates for guests
- Modified email templates with guest order tracking info
- Ensure affiliate tracking still works for guest orders

### 3.4 Security Measures

**Guest Order Token Security:**

- Use cryptographically secure random tokens
- Implement rate limiting for guest order lookups
- Add email verification for sensitive operations
- Time-limited access tokens (optional)

---

## 4. Email System Updates (2-3 hours)

### 4.1 Email Template Modifications

**File**: `src/emails/Order/Order.tsx`

**Changes:**

- Add guest order tracking information
- Include order lookup instructions
- Add "Create Account" CTA for future convenience
- Display order token/number prominently

### 4.2 New Email Templates

**Templates Needed:**

- Guest order confirmation
- Guest order status updates
- Guest order lookup instructions

### 4.3 Email Content Updates

**Additional Information for Guests:**

- How to track order status
- Order lookup page URL
- Account creation benefits
- Contact information for support

---

## 5. Security & Privacy Considerations (2-3 hours)

### 5.1 Data Protection

- Implement data retention policies for guest orders
- Ensure GDPR compliance for guest data
- Secure guest order token generation
- Rate limiting for guest order lookups

### 5.2 Access Control

- Guests can only access their own orders
- Implement secure order lookup verification
- Prevent enumeration attacks on order tokens
- Add CAPTCHA for multiple failed lookup attempts

### 5.3 Privacy Features

- Option to delete guest order data
- Clear privacy policy for guest checkout
- Minimal data collection for guests
- Secure handling of guest email addresses

---

## 6. Implementation Phases

### Phase 0: Permanent Development Environment Setup (Day 0)

**Strategic Implementation - One-time setup with long-term benefits**

1.  **Environment Infrastructure Setup**:
    - Set up all required development environments as detailed in Section 0
    - Create comprehensive documentation for future use
    - Establish credential management and security protocols
2.  **Configuration Management**:
    - Create `.env.development` template with all required variables
    - Update development setup to point to all sandbox services
    - Create environment switching documentation
    - Set up automated environment health checks
3.  **Developer Onboarding**:
    - Create setup guide for new developers
    - Document testing procedures and best practices
    - Establish data refresh and sync procedures
4.  **Branch Management**:
    - ✅ Branch `physical-no-account` already created
    - Configure branch protection rules for development environment
    - Set up CI/CD pipeline for development environment testing

**Note**: This phase represents a significant investment in development infrastructure that will pay dividends for all future feature development, not just guest checkout.

### Phase 1: Database & Core Backend (Day 1)

1.  Database schema updates
2.  Core order creation logic for guests
3.  Basic guest order lookup API

### Phase 2: Frontend Integration (Day 2)

1. Authorization component updates
2. Cart validation logic
3. Guest checkout flow implementation
4. Guest order lookup page

### Phase 3: Testing & Refinement (Day 3)

1. End-to-end testing of guest checkout
2. Security testing
3. Email template updates
4. Error handling and edge cases
5. Performance optimization

---

## 7. Development Environment Management & Reusability

### 7.1 Environment Configuration Files

**Structure for Multiple Environments**:

```
next/
├── .env.example              # Template with all required variables
├── .env.local               # Local development (gitignored)
├── .env.development         # Shared development environment
├── .env.staging             # Staging environment (if needed)
└── .env.production          # Production environment
```

**Environment Variables Management**:

- Use descriptive naming conventions
- Document all variables in `.env.example`
- Implement environment validation on startup
- Create environment health check endpoints

### 7.2 Development Data Management

**Database Management**:

- Regular production schema imports to development
- Anonymized test data generation scripts
- Database seeding for common test scenarios
- Migration testing procedures

**Test Data Categories**:

- User accounts (guest and registered)
- Product catalog (physical, digital, bundles)
- Orders (various states and types)
- Payment scenarios (success, failure, pending)
- Shipping configurations
- Discount and coupon scenarios

### 7.3 Testing Infrastructure

**Automated Testing Support**:

- Integration tests using development environment
- End-to-end testing with sandbox services
- Performance testing with realistic data loads
- Security testing with isolated environments

**Feature Development Workflow**:

1. Create feature branch from `main`
2. Use development environment for implementation
3. Test with sandbox services
4. Peer review with development environment demos
5. Merge to `main` after testing

### 7.4 Environment Maintenance Procedures

**Regular Maintenance Tasks**:

- Monthly credential rotation
- Quarterly service health checks
- Semi-annual data refresh from production
- Annual security audit of development services

**Documentation Maintenance**:

- Keep setup guides updated
- Document new service integrations
- Maintain troubleshooting guides
- Update onboarding procedures

### 7.5 Future Feature Development Guidelines

**Using the Development Environment**:

- Always start new features in development environment
- Test all external service integrations thoroughly
- Validate email templates and communications
- Verify payment flows end-to-end
- Test shipping calculations and logistics
- Validate marketing automation workflows

**Best Practices for Reusability**:

- Document any new service integrations
- Add new environment variables to templates
- Update health check procedures
- Maintain test data scenarios for new features
- Share learnings and gotchas with the team

---

## 8. Future Enhancements

### 8.1 Account Migration

- Allow guests to claim orders when creating accounts
- Merge guest order history with new accounts
- Preserve order tracking and downloads

### 8.2 Enhanced Guest Features

- Guest order history (session-based)
- Save shipping addresses (browser storage)
- Guest order notifications (SMS/WhatsApp)

### 8.3 Business Logic Extensions

- Guest loyalty program participation
- Limited virtual wallet for guests
- Guest-specific promotions

---

## 9. Success Metrics

### 9.1 Conversion Metrics

- Increase in physical product conversion rates
- Reduction in cart abandonment
- Guest vs. registered user conversion comparison

### 9.2 User Experience Metrics

- Time to complete checkout (guest vs. registered)
- Error rates during checkout
- Customer support tickets related to guest orders

### 9.3 Business Metrics

- Revenue impact from guest checkouts
- New account creation rates post-guest purchase
- Customer retention rates

---

## 10. Risk Mitigation

### 10.1 Technical Risks

- **Risk**: Database performance with nullable user_id
- **Mitigation**: Proper indexing and query optimization

- **Risk**: Security vulnerabilities in guest order lookup
- **Mitigation**: Thorough security testing and rate limiting

### 10.2 Business Risks

- **Risk**: Reduced account creation rates
- **Mitigation**: Strong post-purchase account creation incentives

- **Risk**: Increased support overhead for guest orders
- **Mitigation**: Clear self-service options and documentation

---

## 11. Technical Dependencies

### 11.1 External Services

- Payment processor compatibility with guest orders
- Email service provider configurations
- Analytics tracking for guest users
- Shipping service integrations

### 11.2 Internal Dependencies

- User authentication system modifications
- Cart and checkout system updates
- Order management system changes
- Customer support tool updates

---

## Conclusion

This implementation plan provides a comprehensive roadmap for adding guest checkout functionality to physical products. The phased approach ensures systematic development and testing while maintaining system stability and security.

**Next Steps:**

1. Review and approve this implementation plan
2. Set up development environment on `physical-no-account` branch
3. Begin Phase 1 implementation
4. Regular progress reviews and adjustments as needed

**Total Estimated Effort**:

- **Phase 0 (Development Environment)**: 8-12 hours (one-time investment)
- **Guest Checkout Implementation**: 16-24 hours over 2-3 development days
- **Total**: 24-36 hours with significant long-term benefits

---

_Last Updated: [Current Date]_
_Branch: physical-no-account_
_Status: Implementation Plan - Ready for Development_
