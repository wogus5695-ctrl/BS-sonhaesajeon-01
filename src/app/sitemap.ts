import { MetadataRoute } from 'next';
import { getAllKeywords } from '@/lib/keywordData';
import { BASE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BASE_URL;
  
  // 정적 기본 앵커 경로
  const routes = [
    '',
    '/sitemap-busan',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.9,
  }));

  // 부산 200개 개별 이슈 페이지 정식 URL 등록 (/issue/키워드-slug)
  const keywords = getAllKeywords();
  const keywordRoutes = keywords.map((item) => ({
    url: `${baseUrl}/issue/${encodeURIComponent(item.slug)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8, // 200 OK 직접 노출로 검색 가치가 상승하여 우선순위 높게 책정
  }));

  return [...routes, ...keywordRoutes];
}
