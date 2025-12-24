# Implementation Plan - SEO Autopilot with Supabase & n8n

This plan outlines the steps to transform the Essaouira Travel Services website into a dynamic, SEO-optimized platform powered by Supabase and n8n.

## Phase 1: Infrastructure Setup (Supabase)

- [ ] **Install Dependencies**: Install `@supabase/supabase-js`.
- [ ] **Environment Configuration**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env`.
- [ ] **Database Schema**: Create SQL migration script for:
  - `services`: To store service details (pricing, features, etc).
  - `articles`: To store SEO content/guides.
  - `leads`: To store booking inquiries.
- [ ] **Client Setup**: Create `src/lib/supabase.ts` for the client instance.
- [ ] **Seed Data**: migrate existing static `services.ts` data into the Supabase `services` table.

## Phase 2: Page Architecture (Next.js)

- [ ] **Service Page Template (`/services/[slug]`)**:
  - Create dynamic route `src/app/services/[slug]/page.tsx`.
  - Implement fetching logic from Supabase `services` table.
  - Design the layout (Hero, Features, Pricing, Booking Form integration).
- [ ] **Knowledge Hub (`/conseils-voyage`)**:
  - Create index page `src/app/conseils-voyage/page.tsx` (Grid of articles).
  - Create article page `src/app/conseils-voyage/[slug]/page.tsx`.
  - Implement "Markdown Renderer" for article content.
- [ ] **Booking Integration**:
  - Update `BookingForm` component to submit to Supabase `leads` table instead of just console/email.

## Phase 3: Automation Preparation (n8n Guidelines)

- [ ] **API Access**: Ensure RLS (Row Level Security) policies allow n8n (via service role or API) to write to `articles` and `services`.
- [ ] **Documentation**: Create a brief guide on the expected JSON structure for n8n to push to `articles`.

## Phase 4: Clean Up

- [ ] Remove old static data files once migration is verified.
- [ ] Verify SEO metadata generation for dynamic pages.
