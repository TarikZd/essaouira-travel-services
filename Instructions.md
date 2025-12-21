# Website Customization Instructions

This guide explains how to apply the information from `Information_Needed.md` to the codebase.

## Prerequisites

- Node.js installed.
- Code Editor (VS Code recommended).

## Step-by-Step Configuration

### 1. Global Contact Info Update

The fastest way to update phone numbers and emails is using "Find and Replace" in your editor.

- **Phone (Display):** Search for `+212 690 606 068` and replace with your display number.
- **Phone (WhatsApp):** Search for `212690606068` and replace with your raw number.
- **Email:** Search for `adiltaxipro@gmail.com` and replace with your email.
- **Files to check:**
  - `src/components/layout/Footer.tsx`
  - `src/components/landing/Hero.tsx`
  - `src/lib/services.ts` (Crucial for booking redirection)

### 2. Branding (Logo & Name)

- **Logo Text:**
  - Open `src/components/layout/Header.tsx`
  - Open `src/components/layout/Footer.tsx`
  - Look for `TAXI` and `ESSAOUIRA` spans and update the text.
- **Images:**
  - Replace `public/images/brand-icon.png` (if exists) or add your logo.
  - Replace `src/app/icon.png` with your own favicon (Use a PNG generator for best results).

### 3. SEO, Domain & Metadata

- **Layout:** Open `src/app/layout.tsx`.
  - Update `metadataBase` with your `new URL`.
  - Update `title`, `description`, `keywords`.
  - Update `openGraph` and `twitter` sections.
- **Sitemap & Robots:**
  - Open `src/app/sitemap.ts` and update `baseUrl`.
  - Open `src/app/robots.ts` and update `sitemap` URL.

### 4. Visual Theme

- **Colors:** Open `src/app/globals.css`.
  - Find the `:root` section.
  - Update `--primary` with your brand color (HSL format).
  - Update `--primary-foreground` if needed (text color on primary button).

### 5. Business Stats (Dynamic Counters)

- Open `src/lib/metrics.ts`.
- This file calculates the "Trips" and "Reviews" counters based on time.
- Update:
  - `ANCHOR_DATE`: The starting date.
  - `ANCHOR_TRIPS`: How many trips you want to start with.
  - `ANCHOR_REVIEWS`: How many reviews you want to start with.

### 6. Services & Pricing

- Open `src/lib/services.ts`.
- This file contains the "Database" of your services.
- Edit the `services` array:
  - `pricing`: Update `amount`.
  - `name` & `description`: Update text.
  - `whatsappNumber`: Ensure this is updated (covered in step 1).
  - `whatsappMessage`: You can customize the text sent to WhatsApp here.

### 7. Social Media Links

- Open `src/components/layout/Footer.tsx`.
- Find the `socialLinks` array at the top.
- Update the `url` property for Facebook/Instagram.

### 8. Images

- Images are stored in `public/images/`.
- Mappings are defined in `src/lib/placeholder-images.json` (or directly in `services.ts` depending on implementation).
- **To change an image:**
  1.  Upload your new image to `public/images/`.
  2.  Open `src/lib/placeholder-images.json` AND/OR `src/lib/services.ts` and update the path (e.g., `/images/my-new-photo.jpg`).

### 9. External Platforms Setup & Cloudflare

#### OpenAI (Required for AI Recommendations)

1.  Go to [platform.openai.com](https://platform.openai.com/).
2.  Sign up/Log in and create a new **API Key**.
3.  **Important:** You must add credit to your account (minimum $5) for the API to work.
4.  Copy the key (starts with `sk-...`).

#### Vercel (Hosting & Environment Variables)

1.  When deploying to Vercel, go to **Settings > Environment Variables**.
2.  Add a new variable:
    - **Key:** `OPENAI_API_KEY`
    - **Value:** Paste your key from step 1.
3.  Add Firebase variables if using Firebase (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`).

#### Cloudflare (DNS & Speed)

1.  If you bought your domain (e.g., Namecheap), change the Nameservers to Cloudflare's.
2.  In Cloudflare, point your **A Record** to Vercel's IP (`76.76.21.21`) or use CNAME (`cname.vercel-dns.com`).
3.  Enable **SSL/TLS** to "Full".

### 10. Legal Pages (Privacy Policy)

- **Important:** This template does not include a pre-written Privacy Policy.
- You must create a page at `src/app/privacy/page.tsx` or link to an external policy in `src/components/layout/Footer.tsx`.
- Replace the `#` or placeholder link in the Footer with your real policy URL.

### 11. Deployment

1.  Run `npm run build` locally to verify everything works.
2.  Push your code to GitHub.
3.  Import the project in Vercel.
4.  Add the Environment Variables defined above.
5.  Click **Deploy**.
