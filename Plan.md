# Project Rebuild Plan: Essaouira Travel Services (One-Page Edition)

This plan outlines the roadmap to transform the current multi-page application into a premium, high-conversion **One-Page Website** based on the design analysis from `ONEPAGE.md`, while retaining the robust backend identified in `Project_analysis.md`.

## 1. Project Objectives

- **Convert to SPA**: Consolidate all routes (Home, Services, Destinations, Contact) into a single scrolling page.
- **Premium Aesthetic**: Adopt the Yellow-on-Black theme with Glassmorphism and Lucide iconography.
- **Backend Retention**: Keep the Firebase lead-capture, AI Genkit recommendation engine, and dynamic form logic.
- **SEO Optimization**: Implement the dual-keyword strategy and meta-tagging identified in the design example.

## 2. Technical Architecture Hook

- **Framework**: Next.js 14+ (App Router).
- **Styling**: Tailwind CSS + Custom CSS for "backdrop-blur" and "glassmorphism" utilities.
- **State Management**: React `useTransition` for form submissions and AI loading states.
- **Database**: Firebase Firestore (existing collection structure).
- **Intelligence**: Google Genkit (integrated into the one-page flow).

## 3. One-Page Structural Map

The single `page.tsx` will be divided into the following vertical sections:

1.  **Header/Nav**: Sticky, blurred background with section scrolling links.
2.  **Hero Section**: High-impact visual with the "Taxi Transport Touristique" H1 and primary CTA.
3.  **AI Recommendation Engine**: Integrated interactive search box to suggest services dynamically.
4.  **Services Grid**: Horizontal/Grid display of service cards (Transferts, Excursions, etc.).
5.  **Destinations Gallery**: Image-led routes with "Travel Time" badges and hover-zoom effects.
6.  **Trust/Stats Section**: "Numbers" counter showing years of experience and satisfied clients.
7.  **Contact & Booking**: The Dynamic Zod-validated form with Firestore persistence and WhatsApp hand-off.
8.  **Footer**: Unified credits, quick links, and SEO keyword clusters.

## 4. Implementation Phases

### Phase 1: Core Layout & Design System

- **Colors**: Define `primary` (Yellow-400), `background` (Black), and `card` (Gray-900) in `tailwind.config.ts`.
- **Global Styles**: Implement the smooth scroll behavior and typography (High-contrast headings).
- **Unified Page**: Copy existing backend `actions.ts` logic into the new one-page structure.

### Phase 2: Component Rebuild (Frontend Focus)

- **Navigation**: Build the `fixed top-0` blurred navbar with `lucide-menu` for mobile.
- **Cards & Grids**: Re-style `ServiceCard` and `DestinationCard` to match the rounded-2xl, lift-on-hover design.
- **Dynamic BookingForm**: Adapt the existing `BookingForm.tsx` to sit natively within the `#contact` section without a separate page.

### Phase 3: Intelligence & Personalization

- **AI Integration**: Embed the `RecommendationEngine` component between the Hero and Services sections.
- **Flow**: Ensure `getRecommendations` Server Action correctly updates the scroll-to-view results on the same page.

### Phase 4: Mobile & SEO Finalization

- **Mobile optimization**: Apply the stacking logic and touch-target padding (`py-4`).
- **SEO Injection**: Populate `layout.tsx` with the metadata extracted in `ONEPAGE.md` (Keywords, Descriptions, Alt tags).
- **Images**: Localize and optimize external assets from `taxi-essaouira-transfert.com` and Unsplash.

### Phase 5: Conversion Funnel Validation

- **Database Check**: VerifyFirestore writing via `saveBooking`.
- **WhatsApp Hook**: Test the `whatsappMessage` generator inside `lib/services.ts` to ensure clean hand-offs.
- **Performance**: Audit load times to ensure the one-page weight stays minimal.

## 5. Strategic "Catching" Model

We will maintain the **Double-Channel Capture** strategy:

1.  **Lead entry** -> **Firestore** (Audit Trail).
2.  **Success State** -> **WhatsApp Redirect** (Immediate Booking Conversation).

---

**Reference Documents:**

- Design Source: `ONEPAGE.md`
- Backend Source: `Project_analysis.md`
