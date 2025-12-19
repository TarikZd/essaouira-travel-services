import { MetadataRoute } from 'next';
import { services } from '@/lib/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://essaouira-travel.services';

  const serviceUrls = services.map((service) => ({
    url: `${baseUrl}/#${service.slug}`, // Since it's a one-page app, we anchor to the slug
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...serviceUrls,
  ];
}
