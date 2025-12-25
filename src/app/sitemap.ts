
import { MetadataRoute } from 'next';
import { services } from '@/lib/services';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://essaouira-travel.services';

  // 1. Static Services (Ideally these should also come from DB if they are dynamic, 
  // currently reading from static file as per existing code)
  const serviceUrls = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 2. Fetch Dynamic Articles from Supabase
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('is_published', true);

  const articleUrls = (articles || []).map((article) => ({
    url: `${baseUrl}/conseils-voyage/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/conseils-voyage`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...serviceUrls,
    ...articleUrls,
  ];
}
