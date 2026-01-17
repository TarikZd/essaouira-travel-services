# 📋 Essaouira Travel Services - Development Tasks

**Last Updated**: 2026-01-17  
**Project Status**: Production Ready (Pending Security Fixes)

---

## 🚨 URGENT - Security Fixes (Do Immediately)

### Task 1: Secure PayPal Credentials

**Priority**: CRITICAL 🔴  
**Estimated Time**: 30 minutes  
**Status**: ✅ COMPLETED (2026-01-17)

**Steps**:

- [x] Log into PayPal Developer Dashboard
- [x] Generate new API credentials (Client ID + Secret)
- [x] Add `PAYPAL_SECRET_KEY` to Cloudflare Pages Environment Variables (NOT in `.env`)
- [x] Update `NEXT_PUBLIC_PAYPAL_CLIENT_ID` in `.env` with new Client ID
- [x] Verify `.env` is in `.gitignore` ✅ Confirmed on line 28
- [ ] **OPTIONAL**: Clean git history to remove old .env commits (keys already rotated, low priority)
- [x] Test booking flow with new credentials

**Notes**:

- ✅ Credentials rotated on 2026-01-17
- ✅ `.env` is properly in `.gitignore`
- ⚠️ Old credentials exist in git history (commits from Dec 2025) but are now invalid
- 📝 Recommended: Clean git history when convenient using `git filter-repo --path .env --invert-paths`

---

## 🔒 HIGH Priority - Database Security

### Task 2: Implement Proper RLS Policies

**Priority**: HIGH 🟠  
**Estimated Time**: 2 hours  
**Status**: ⬜ To Do

**Current Issue**: All tables have permissive "Enable for everyone" policies.

**Implementation Plan**:

```sql
-- 1. Plan for authentication (if adding user accounts later)
-- For now, keep current policies for anonymous bookings

-- 2. Add service role policies for admin operations
CREATE POLICY "Service role full access" ON bookings
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- 3. Restrict blocked_dates writes to admin only
DROP POLICY IF EXISTS "Everyone can read blocked dates" ON blocked_dates;
CREATE POLICY "Public read blocked dates" ON blocked_dates
  FOR SELECT USING (true);
CREATE POLICY "Admin insert blocked dates" ON blocked_dates
  FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');
```

**Files to Update**:

- `supabase/schema.sql`

---

### Task 3: Add Database Indexes for Performance

**Priority**: MEDIUM 🟡  
**Estimated Time**: 15 minutes  
**Status**: ✅ COMPLETED (2026-01-17)

**SQL to Execute**:

```sql
-- Improve booking query performance
CREATE INDEX IF NOT EXISTS idx_bookings_service_date
  ON bookings(service_id, activity_date);

CREATE INDEX IF NOT EXISTS idx_bookings_customer
  ON bookings(customer_id);

CREATE INDEX IF NOT EXISTS idx_bookings_status
  ON bookings(status) WHERE status IN ('pending_payment', 'confirmed');

-- Speed up payment lookups
CREATE INDEX IF NOT EXISTS idx_payments_booking
  ON payments(booking_id);

CREATE INDEX IF NOT EXISTS idx_payments_transaction
  ON payments(transaction_id) WHERE transaction_id IS NOT NULL;
```

**Files to Update**:

- `supabase/schema.sql` (or create new migration file)

---

## 🎛️ ADMIN DASHBOARD (Separate Project)

> **Note**: The admin dashboard will be built as a **separate Next.js project** on a different domain (e.g., `admin.essaouira-adventures.com` or similar). This separation provides:
>
> - Better security (no admin code in public codebase)
> - Independent deployment pipeline
> - Focused development environment
> - Easier access control

### Admin Dashboard Features (To Be Built Separately)

**Project Setup**:

- Separate Git repository
- Independent Cloudflare Pages deployment
- Supabase client with **Service Role Key** (server-side only)
- Protected by authentication (NextAuth, Clerk, or similar)

**Core Features**:

1. **Dashboard Home** - Key metrics, revenue summary, upcoming bookings
2. **Bookings Management** - View, filter, search, update status, export to CSV
3. **Calendar Management** - Block/unblock dates, view capacity, manage availability
4. **Email Management** - Send confirmation emails, payment reminders, day-before notifications
5. **Customer Management** - View customer list, booking history, notes
6. **Analytics & Reporting** - Revenue charts, booking trends, popular services
7. **Reviews Moderation** - Approve/reject customer reviews

**Tech Stack**:

- Next.js 14+ (App Router)
- Supabase (with service role access)
- shadcn/ui components
- Email service (Resend or SendGrid)
- Authentication provider

**Deployment**:

- Separate Cloudflare Pages project
- Environment variables for service role key
- Custom domain with SSL

---

## 🎨 FRONTEND Enhancements (This Project)

### Task 4: Add Error Boundaries

**Priority**: MEDIUM 🟡  
**Estimated Time**: 1 hour  
**Status**: ✅ COMPLETED (2026-01-17)

**Implementation**:

```tsx
// src/components/ErrorBoundary.tsx
"use client";

import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

**Files to Create**:

- `src/components/ErrorBoundary.tsx`
- `src/components/ErrorPage.tsx`

**Files to Update**:

- `src/app/services/[slug]/page.tsx` (wrap BookingForm)
- `src/app/layout.tsx` (global boundary)

---

### Task 5: Add Booking Reference Numbers

**Priority**: MEDIUM 🟡  
**Estimated Time**: 2 hours  
**Status**: ✅ COMPLETED (2026-01-17)

**Requirements**:

- Generate human-friendly booking reference (e.g., `ESS-2024-001234`)
- Show reference number immediately after booking
- Include in confirmation emails
- Allow customers to search by reference

**Implementation**:

```typescript
// src/lib/booking-reference.ts
export function generateBookingReference(bookingId: string): string {
  const year = new Date().getFullYear();
  const shortId = bookingId.substring(0, 8).toUpperCase();
  return `ESS-${year}-${shortId}`;
}
```

**Database Changes**:

```sql
ALTER TABLE bookings ADD COLUMN reference_number TEXT UNIQUE;
CREATE INDEX idx_bookings_reference ON bookings(reference_number);
```

**Files to Update**:

- `src/components/services/BookingForm.tsx` (display reference after save)
- `supabase/schema.sql`

---

### Task 6: Customer Booking Lookup & Cancellation

**Priority**: HIGH 🟠  
**Estimated Time**: 3 hours  
**Status**: ✅ COMPLETED (2026-01-17)

**Requirements**:
Allow customers to self-service their bookings on the home page.

**Features**:

- [ ] Search by booking reference number
- [ ] Display booking details (service, date, status, participants)
- [ ] Show payment status
- [ ] Request cancellation (sends to database with status change)
- [ ] Email confirmation of cancellation request
- [ ] Secure access (require email verification)

**UI Components**:

- Search input with reference number validation
- Booking details card
- Cancellation request button with confirmation modal
- Status badges (Confirmed, Pending, Cancelled)

**Implementation**:

```typescript
// API endpoint: /api/bookings/lookup
- Input: reference_number, email
- Output: booking details if email matches
- Security: Rate limiting, email verification

// Cancellation flow:
1. User enters reference + email
2. System verifies match
3. Display booking details
4. User clicks "Request Cancellation"
5. Confirmation modal
6. Update status to 'cancellation_requested'
7. Send notification to admin
```

**Files to Create**:

- `src/components/booking/BookingLookup.tsx`
- `src/components/booking/BookingDetails.tsx`
- `src/components/booking/CancellationModal.tsx`
- `src/app/api/bookings/lookup/route.ts`
- `src/app/api/bookings/cancel/route.ts`

**Database Changes**:

```sql
-- Add cancellation_requested status
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending_payment', 'confirmed', 'cancellation_requested', 'cancelled', 'completed', 'refunded'));
```

---

### Task 12: Improve Calendar Caching

**Priority**: LOW 🟢  
**Estimated Time**: 1 hour  
**Status**: ⬜ To Do

**Current Issue**: Calendar availability is fetched on every component mount.

**Solution**: Add 5-minute cache with localStorage.

```typescript
const CACHE_KEY = "calendar_availability";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

useEffect(() => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      setUnavailableDates(data.unavailable);
      setCapacityMap(data.capacity);
      return;
    }
  }

  fetchAvailability().then((result) => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: result,
        timestamp: Date.now(),
      }),
    );
  });
}, [service.slug]);
```

**Files to Update**:

- `src/components/services/BookingForm.tsx`

---

## 🔄 REFACTORING & Technical Debt

### Task 13: Remove `any` Types

**Priority**: LOW 🟢  
**Estimated Time**: 3 hours  
**Status**: ⬜ To Do

**Files to Review**:

- `src/components/services/BookingForm.tsx` (many `data as any`)
- `src/app/services/[slug]/page.tsx` (`serviceForForm: any`)

**Create Proper Types**:

```typescript
// src/types/booking.ts
export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  date: Date;
  time?: string;
  adults?: number;
  children?: number;
  participants?: number;
  dishPreference?: string;
  pastryPreference?: string;
  packageType?: string;
  specialRequests?: string;
}
```

---

### Task 14: Implement Reviews System

**Priority**: LOW 🟢  
**Estimated Time**: 4 hours  
**Status**: ⬜ To Do

**Current Status**: `reviews` table exists but no UI.

**Features to Add**:

- [ ] Customer review form (after booking completion)
- [ ] Admin approval interface
- [ ] Display approved reviews on service pages
- [ ] Star rating display
- [ ] Review moderation

**Files to Create**:

- `src/components/services/ReviewForm.tsx`
- `src/components/services/ReviewsList.tsx`
- `src/app/api/reviews/route.ts`
- `src/app/admin/reviews/page.tsx`

---

## 📊 TESTING

### Task 15: Add Unit Tests

**Priority**: MEDIUM 🟡  
**Estimated Time**: 8 hours  
**Status**: ⬜ To Do

**Test Coverage Goals**:

- [ ] Form validation logic (Zod schemas)
- [ ] Date formatting utilities
- [ ] Booking reference generation
- [ ] Email template rendering
- [ ] Calendar availability calculation

**Setup**:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Files to Create**:

- `vitest.config.ts`
- `src/__tests__/BookingForm.test.tsx`
- `src/__tests__/services.test.ts`
- `src/__tests__/utils.test.ts`

---

### Task 16: End-to-End Testing

**Priority**: LOW 🟢  
**Estimated Time**: 6 hours  
**Status**: ⬜ To Do

**Test Scenarios**:

- [ ] Complete booking flow (Cash)
- [ ] Complete booking flow (PayPal)
- [ ] Calendar date blocking
- [ ] Form validation errors
- [ ] Payment failure handling

**Setup with Playwright**:

```bash
npm install -D @playwright/test
npx playwright install
```

---

## 🚀 DEPLOYMENT & DevOps

### Task 17: Set Up Staging Environment

**Priority**: MEDIUM 🟡  
**Estimated Time**: 2 hours  
**Status**: ⬜ To Do

**Requirements**:

- [ ] Create staging branch
- [ ] Set up staging Cloudflare Pages deployment
- [ ] Create staging Supabase project
- [ ] Use staging PayPal sandbox

**Benefits**:

- Test changes before production
- Safe environment for client demos
- Ability to rollback deployments

---

### Task 18: Implement Monitoring & Logging

**Priority**: MEDIUM 🟡  
**Estimated Time**: 3 hours  
**Status**: ⬜ To Do

**Tools**:

- [ ] Sentry for error tracking
- [ ] LogRocket for session replay
- [ ] Vercel Analytics (or similar)

**Setup**:

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**Alerts to Configure**:

- Payment failures
- Booking save errors
- Form submission errors
- API endpoint failures

---

## 📱 MOBILE & UX

### Task 19: Mobile App (Progressive Web App)

**Priority**: LOW 🟢  
**Estimated Time**: 4 hours  
**Status**: ⬜ To Do

**Requirements**:

- [ ] Add PWA manifest
- [ ] Service worker for offline support
- [ ] Install prompt
- [ ] Push notifications for booking confirmations

**Files to Create**:

- `public/manifest.json`
- `src/service-worker.js`

---

## 🎯 IMMEDIATE NEXT STEPS (This Week)

**Monday**:

1. ✅ Fix PayPal credentials (Task 1) - CRITICAL
2. ⬜ Add database indexes (Task 3)

**Tuesday-Wednesday**: 3. ⬜ Create admin dashboard foundation (Task 4) 4. ⬜ Build bookings management interface (Task 5)

**Thursday-Friday**: 5. ⬜ Implement calendar management (Task 6) 6. ⬜ Set up email service (Task 7 - Part 1)

**Next Week**: 7. ⬜ Complete email templates (Task 7 - Part 2) 8. ⬜ Add customer management (Task 8)

---

## 📈 PROGRESS TRACKING

**Tasks Completed (This Project)**: 5 / 14  
**Progress**: ████░░░░░░ 36%

**By Priority**:

- 🔴 Critical: 1 / 1 ✅ COMPLETE
- 🟠 High: 1 / 1 ✅ COMPLETE
- 🟡 Medium: 3 / 7
- 🟢 Low: 0 / 5

**Admin Dashboard**: To be built as separate project (7 features planned)

---

## 💡 NOTES

- All admin features should be built with mobile-responsive design
- Use consistent shadcn/ui components throughout
- Maintain TypeScript strict mode
- Document all API endpoints with JSDoc
- Keep security as top priority for all features

---

**Last Review Date**: 2026-01-17  
**Reviewed By**: Development Team  
**Next Review**: After Task 7 completion
