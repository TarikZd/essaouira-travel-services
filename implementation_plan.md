# Implementation Plan - High-Conversion Ad Funnel (Simple & Fast)

This plan focuses on building a **Lean, High-Speed Landing Page System** designed for **Paid Traffic (Google/Meta Ads)**. The goal is maximum conversion with minimum complexity.

## Phase 1: The "Thin" Core (Cloudflare & Supabase)

**Goal:** A lightning-fast, crash-proof infrastructure that loads instantly for ad clicks (Better Ad Quality Score).

- [ ] **Weight Loss Audit**:
  - **Remove** `sharp` and unused libs to stay under Cloudflare 3MiB limit.
  - Setup **Cloudinary** for auto-optimized images.
- [ ] **Simple Backend (Supabase)**:
  - `leads` table: To capture every booking intent immediately.
  - `services` table: To manage pricing/details for the Landing Pages without deploying code.
  - **No User Auth**: Guest checkout only. Simple is better.

## Phase 2: The "Ad Landing Page" Template

**Goal:** A single, reusable page structure optimized for converting cold traffic.

- [ ] **Create `MasterLandingPage` Component**:
  - **Hero**: High-impact Video/Image + Direct "Get Price" form.
  - **Trust Bar**: "Verified", "5-Star" badges immediately visible.
  - **Streamlined Body**: Why Us -> Fleet/Experience Photos -> Reviews -> Final CTA.
  - **Sticky Mobile Button**: Always visible "Book Now".
- [ ] **Variations**:
  - `/transfer-essaouira` (Targeting: "Taxi Marrakech Essaouira").
  - `/cooking-class` (Targeting: "Things to do in Essaouira").

## Phase 3: Frictionless Payment (PayPal)

**Goal:** Capture the money without scaring the user.

- [ ] **Smart Deposit**:
  - Implement a simple "Pay 10% Deposit" option via **PayPal Smart Buttons**.
  - Logic: "Reserve for just €5 now, pay the rest later." High conversion for ad traffic.
- [ ] **Technical**:
  - Client-side PayPal integration (lazy loaded) to keep page speed high.

## Phase 4: Conversion Tracking (Crucial for Ads)

**Goal:** Feed Google/Meta algorithms with data to lower CPC.

- [ ] **Server-Side Tracking**:
  - When a booking hits Supabase, use a **Webhook** (or n8n) to send a "Purchase" event back to Meta CAPI/Google Ads API.
  - This ensures 100% accurate tracking (bypassing ad blockers).

## Phase 5: Launch Ready

- [ ] **Speed Test**: Ensure LCP (Largest Contentful Paint) is < 2.5s.
- [ ] **Form Test**: Verify leads are saved even if the user drops off at payment.
