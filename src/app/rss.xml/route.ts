import { getAllKeywords } from '@/lib/keywordData';
import { BASE_URL, BRAND_NAME, BRAND_SLOGAN } from '@/lib/constants';

export async function GET() {
  const baseUrl = BASE_URL;
  const brand = BRAND_NAME;
  const slogan = BRAND_SLOGAN;
  const now = new Date().toUTCString();
  const keywords = getAllKeywords();
  
  // RSS 피드용으로 각 핵심 카테고리별 상위 5개 키워드 추출
  const topKeywords = [
    ...keywords.filter(k => k.category === "부산 지역 상담").slice(0, 10),
    ...keywords.filter(k => k.category === "산재 특화 지역 상담").slice(0, 10)
  ];

  const rssItems = [
    {
      title: `${brand} | ${slogan}`,
      link: baseUrl,
      description: "부산 및 경남 교통사고 합의금, 산재 불승인 재심사 청구, 보험금 부지급 전문 상담. 약관과 의무기록 자료를 기준으로 정밀 분석하고 검토합니다.",
      pubDate: now,
      guid: baseUrl
    },
    ...topKeywords.map(k => ({
      title: `${k.label} 전문 상담 안내 - ${brand}`,
      link: `${baseUrl}/issue/${encodeURIComponent(k.slug)}`,
      description: `${k.label} 관련 손해액 산출, 보험사 부지급 통보 타당성 감정 및 산재 최초 기각 처분 소명 의견서 작성을 자료 기준으로 분석하고 검토합니다.`,
      pubDate: now,
      guid: `${baseUrl}/issue/${encodeURIComponent(k.slug)}`
    }))
  ];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${brand}</title>
    <link>${baseUrl}</link>
    <description>부산 교통사고·산재·보험금 분쟁 전문 손해사정 상담</description>
    <language>ko-kr</language>
    <pubDate>${now}</pubDate>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems.map(item => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
