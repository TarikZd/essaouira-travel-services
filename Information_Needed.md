# Information Needed for Website Customization

Welcome! This document outlines all the information you need to provide to customize this "Taxi & Travel Services" website template for your own business.

## 1. Brand Identity

- **Website Name (Text Logo):**
  - **Part 1 (White):** \***\*\_\_\_\_\*\*** (Current: "TAXI")
  - **Part 2 (Colored):** \***\*\_\_\_\_\*\*** (Current: "ESSAOUIRA")
- **Tagline:** \***\*\_\_\_\_\*\*** (Current: "Votre partenaire de confiance pour tous vos déplacements...")
- **Primary Color (CSS Variable):** \***\*\_\_\_\_\*\*** (Current: Yellow/Gold. Edit in `src/app/globals.css` under `--primary` and `--primary-foreground`)
- **Font Family:** (Defined in `src/app/layout.tsx` imports)

## 2. Business Logic & Initial Stats

- **Anchor Date:** \***\*\_\_\_\_\*\*** (The date your business started or the baseline date for stats)
- **Initial Trips Count:** \***\*\_\_\_\_\*\*** (e.g., 7438)
- **Initial Reviews Count:** \***\*\_\_\_\_\*\*** (e.g., 1783)
  - _Note:_ These values are used in `src/lib/metrics.ts` to calculate the "dynamic" counters shown on the homepage.

## 3. Contact Information

This information appears in the Header, Footer, and Booking Forms.

- **Display Phone Number:** \***\*\_\_\_\_\*\*** (Format: +212 6XX XXX XXX)
- **WhatsApp Phone Number:** \***\*\_\_\_\_\*\*** (Format: 2126XXXXXXX - No spaces, no +)
- **Email Address:** \***\*\_\_\_\_\*\*** (e.g., contact@yourdomain.com)
- **Physical Address:** \***\*\_\_\_\_\*\*** (e.g., Quartier Industriel, Essaouira)

## 3. Domain & SEO

- **Domain Name:** \***\*\_\_\_\_\*\*** (e.g., https://transport-maroc.com)
- **Page Title (Default):** \***\*\_\_\_\_\*\*** (Current: "Taxi Marrakech Essaouira - Transport Touristique...")
- **Page Title Template:** \***\*\_\_\_\_\*\*** (Current: "%s | Taxi Essaouira")
- **Meta Description:** \***\*\_\_\_\_\*\*** (150-160 chars summary of your business)
- **Keywords:** \***\*\_\_\_\_\*\*** (Comma separated list of search terms)

## 4. Social Media

Provide links to your profiles (leave empty if not applicable).

- **Facebook:** \***\*\_\_\_\_\*\***
- **Instagram:** \***\*\_\_\_\_\*\***
- **TikTok:** \***\*\_\_\_\_\*\*** (Need to add icon if used)
- **TripAdvisor:** \***\*\_\_\_\_\*\***

## 5. Services & Pricing

For each service you offer (Transfer, Activity, Tour), define:

- **Service Name:**
- **Base Price:**
- **Price Unit:** (per person / per group)
- **Description:**
- **WhatsApp Message Template:** (What you want to see when they book)

## 6. Images & Assets

You must provide/replace these specific files in `public/images/`:

- **Branding:**
  - `src/app/icon.png` (Site Favicon/App Icon)
  - `public/images/brand-icon.png` (Small logo used in Reviews section)
  - `public/images/Paiment-Securise-Avec.png` (Payment badges/footer image)
- **Destinations:**
  - `marrakech-transfer.jpg`
  - `agadir-transfer.jpg`
  - `casablanca-transfer.jpg`
  - `transport-aeroport-confort.jpg`
- **General:**
  - `taxi-marrakech-essaouira-transfert.jpg` (Used for Social Media Sharing / OpenGraph)
  - `chauffeur-prive-mercedes-maroc.jpg` (Used in Hero/Home if hardcoded)

## 7. Technical Configuration & API Keys

- **OpenAI API Key:** \***\*\_\_\_\_\*\*** (Required for AI Recommendations. Format: `sk-...`)
- **Google Analytics ID:** \***\*\_\_\_\_\*\*** (Optional. Format: `G-XXXXXXX`)
- **Firebase Config:** (Required for Booking Database)
  - API Key:
  - Auth Domain:
  - Project ID:
  - Storage Bucket:
  - Messaging Sender ID:
  - App ID:
