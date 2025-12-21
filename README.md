# Taxi & Travel Services - Project Documentation

## 🤖 Context for AI Assistants

**Project Type:** Next.js 14 Single-Page Application (Landing Page + Booking System).
**Primary Goal:** Conversion (Booking Travel Services).
**Key Mechanism:** Users browse services -> Click Book -> Fill Form -> Data sent to WhatsApp (URL scheme) and Firebase.

## �️ Tech Stack & Conventions

- **Framework:** Next.js 14 (App Router).
- **Styling:** Tailwind CSS (Mobile-first).
  - _Convention:_ Use `hsl(var(--param))` for colors defined in `globals.css`.
  - _Font:_ `font-headline` (Outfit) for headings, `font-body` (Inter) for text.
- **Components:** Shadcn/ui (radix-ui primitives).
- **Icons:** `lucide-react`.
- **Forms:** `react-hook-form` + `zod` schema validation.
- **Data:** Static arrays in `src/lib/` acting as a "pseudo-database".

## 📂 Architecture Overview

### 1. Data Layer (`src/lib/`)

The application uses static files to manage "dynamic" content to keep deployment simple.

- **[CRITICAL] `services.ts`**: The Source of Truth.
  - Contains the `services` array.
  - Defines: Pricing, Features, Description, and **Form Fields**.
  - _Action:_ To modify a service product, EDIT THIS FILE.
  - _Action:_ To change booking form inputs, edit `getFieldsForService` or component booking fields here.
- **`metrics.ts`**:
  - Calculates "Live Stats" (Trips, Reviews) based on an anchor date.
  - _Logic:_ `Anchor + (CurrentDate - AnchorDate) * DailyRate`.
- **`placeholder-images.json`**:
  - Maps logical IDs (e.g., `card-transfers`) to physical paths or URLs.
  - _Usage:_ Used by `ServiceCard` and `Hero` to render images.

### 2. UI Components (`src/components/`)

- **`landing/`**: Sections of the one-page scroll (Hero, Stats, Reviews, Destinations).
- **`services/`**:
  - `ServiceCard.tsx`: Generic card renderer.
  - `BookingForm.tsx`: **Complex Component**. Dynamically renders inputs based on the Zod schema provided by the selected Service in `services.ts`. Handles the WhatsApp redirect logic.
- **`layout/`**: Header (Navigation) and Footer (Contact Info, Socials).

### 3. Routing (`src/app/`)

- `page.tsx`: The main orchestrator. Imports sections.
- `layout.tsx`: Defines Global Fonts, Metadata, and Providers (Toaster, Analytics).
- `api/ai/`: Route handler for OpenAI integration (Itinerary generation).

## 🔄 Key Workflows

### Adding a New Service

1.  Open `src/lib/services.ts`.
2.  Add a new object to the `services` array (follow `Service` type).
3.  Define images in `src/lib/placeholder-images.json` (optional, can use direct paths).
4.  The internal logic `sort((a,b) => ...)` determines display order.

### Changing Contact Info (Global)

- **Display:** `src/components/layout/Footer.tsx`.
- **Functionality:** `whatsappNumber` in `src/lib/services.ts` (controls where the message is sent).

## 📚 Documentation Map

Refer to these files for non-coding tasks:

- [**Instructions.md**](./Instructions.md): Deployment and Config guide for humans.
- [**Information_Needed.md**](./Information_Needed.md): Data gathering form.
- [**SEO.md**](./SEO.md): Keyword strategy.

## 🚀 Quick Commands

```bash
npm install       # Install
npm run dev       # Local server
npm run build     # Production build
```
