import { MetadataRoute } from 'next';
import { getDeadlines, getSubjects } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  // Các trang tĩnh công khai
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  // Các trang môn học (SSG)
  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((sub) => ({
    url: `${siteUrl}/subjects/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Toàn bộ deadline công khai (ISR)
  const deadlineRoutes: MetadataRoute.Sitemap = deadlines.map((item) => ({
    url: `${siteUrl}/deadlines/${item.id}`,
    lastModified: new Date(item.createdAt || new Date()),
    changeFrequency: 'hourly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...subjectRoutes, ...deadlineRoutes];
}
