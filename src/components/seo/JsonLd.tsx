export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Taxi Marrakech Essaouira",
    "image": "https://res.cloudinary.com/doy1q2tfm/image/upload/v1766384357/taxi-marrakech-essaouira-transfert_anisai.jpg",
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
