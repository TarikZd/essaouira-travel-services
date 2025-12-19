export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Taxi Marrakech Essaouira",
    "image": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2070&auto=format&fit=crop",
    "telephone": "+212 628 438 838",
    "url": "https://essaouira-travel.services",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Essaouira",
      "addressRegion": "Marrakech-Safi",
      "addressCountry": "MA"
    },
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "sameAs": [
      "https://facebook.com/taxiessaouira",
      "https://instagram.com/taxiessaouira"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
