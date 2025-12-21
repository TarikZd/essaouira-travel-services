# SEO Configuration & Strategy

This document outlines the Search Engine Optimization (SEO) strategy, including current keywords, metadata templates, and image alternative texts.

## 1. Global Metadata (Root Layout)

These values define the default appearance of the site on Google and Social Media.

- **Page Title Template:** `%s | Taxi Essaouira`
  - _Usage:_ If a page is named "Transferts", the tab will read "Transferts | Taxi Essaouira".
- **Default Title:** `Taxi Marrakech Essaouira - Transport Touristique & Transfert Aéroport`
- **Meta Description:**
  > "Réservez votre taxi privé entre Marrakech, Essaouira et Agadir. Service de transport touristique confortable, climatisé et disponible 24/7. Transferts aéroport et excursions."
  - _Length:_ ~155 Characters (Optimal for Google Snippets).

### Core Keywords

Current list targeted in `src/app/layout.tsx`:

- Taxi Marrakech Essaouira
- Transport Essaouira
- Taxi Essaouira aeroport
- Transport Marrakech Essaouira
- Taxi Agadir Essaouira
- Taxi de luxe Maroc
- Voyage pas cher
- Excursion Essaouira
- Taxi Airport Transfer

## 2. Service-Specific SEO

Since this is a single-page application (SPA) with anchor links, these "pages" are sections. However, the content within them drives the page's overall ranking.

| Service Name             | URL Slug                     | Key Keywords (Inferred)                                            |
| :----------------------- | :--------------------------- | :----------------------------------------------------------------- |
| **Transferts Privés**    | `#airport-transfers`         | Transfert aéroport, Taxi privé, Navette Marrakech, Chauffeur privé |
| **Cours de Cuisine**     | `#outdoor-cooking-adventure` | Cours cuisine berbère, Cuisine marocaine, Tajine atelier           |
| **Plages Sauvages 4x4**  | `#wild-beaches-excursion`    | Excursion 4x4, Plages sauvages Essaouira, Côte atlantique          |
| **Visite des Souks**     | `#essaouira-souk-tour`       | Visite guidée médina, Guide local Essaouira, Souk tour             |
| **Quad Côtière**         | `#quad-biking-adventure`     | Quad Essaouira, Location quad, Aventure dunes                      |
| **Pêche en Bord de Mer** | `#shore-fishing-essaouira`   | Pêche surfcasting, Pêche Essaouira, Pêcheur local                  |

## 3. Image Alt Texts & Optimizations

Images are mapped in `placeholder-images.json`. The `imageHint` field represents the semantic content and should be used as the **Alt Text** for accessibility and SEO.

### Hero & Branding

- **Hero Background:** "Plage marocaine au coucher du soleil"
- **Logo/Brand:** "Taxi Essaouira Logo"

### Service Images (Alt Text Strategy)

When replacing images, rename your files to match these keywords before uploading (e.g., `taxi-marrakech-van.jpg` instead of `IMG_001.jpg`).

| Image ID            | Used For       | Recommended Alt Text / Content                      |
| :------------------ | :------------- | :-------------------------------------------------- |
| `card-transfers`    | Service Card   | "Van moderne sur route côtière marocaine"           |
| `hero-transfers`    | Service Detail | "Chauffeur privé Mercedes transport touristique"    |
| `card-quad`         | Service Card   | "Quad sur dunes de sable Essaouira"                 |
| `card-souk`         | Service Card   | "Souk marocain épices et artisanat"                 |
| `card-beaches`      | Service Card   | "Plage sauvage 4x4 excursion"                       |
| `card-fishing`      | Service Card   | "Pêcheur surfcasting plage Essaouira"               |
| `gallery-cooking-*` | Gallery        | "Cuisine tajine extérieur", "Repas chez l'habitant" |

## 4. OpenGraph (Social Media)

These settings control how links look when shared on WhatsApp, Facebook, or LinkedIn.

- **OG Title:** `Taxi Marrakech Essaouira - Transport Touristique`
- **OG Description:** "Votre chauffeur privé au Maroc. Transferts aéroports Marrakech, Agadir, Essaouira et excursions touristiques. Réservation en ligne simple et rapide."
- **OG Image:** `https://essaouira-travel.services/images/taxi-marrakech-essaouira-transfert.jpg`
  - _Tip:_ Ensure this generic image is high quality and represents the brand well (e.g., a branded car with a view).
