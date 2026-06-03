import React from "react";
import { Metadata } from "next";
import MainPageContent from "@/components/MainPageContent";
import { commonFaqs } from "@/lib/faqData";
import { classifyKeyword, getDKIContent } from "@/lib/dkiUtils";
import { 
  BASE_URL, 
  BRAND_NAME, 
  OFFICE_ADDRESS, 
  OFFICE_POSTAL_CODE, 
  OFFICE_LATITUDE, 
  OFFICE_LONGITUDE, 
  PHONE_NUMBER 
} from "@/lib/constants";

interface PageProps {
  params: { slug: string };
}

// A. 200 OK 직접 렌더링에 맞는 고유 메타데이터 빌더 (크롤러의 정식 수집 색인 허용)
export function generateMetadata({ params }: PageProps): Metadata {
  const baseUrl = BASE_URL;
  const brand = "부산 손해사정";

  let decodedSlug = "";
  try {
    decodedSlug = decodeURIComponent(params.slug);
    if (decodedSlug.includes('%')) {
      decodedSlug = decodeURIComponent(decodedSlug);
    }
  } catch (e) {
    decodedSlug = params.slug;
  }

  const keyword = decodedSlug.replace(/-/g, ' ').replace(/[<>]/g, '').trim();
  const type = classifyKeyword(keyword);
  const dki = getDKIContent(keyword, type);

  // 고유 URL 가리키는 Canonical 및 robots: 'index,follow' 주입
  return {
    metadataBase: new URL(baseUrl),
    title: dki.metaTitle,
    description: dki.metaDesc,
    alternates: {
      canonical: `${baseUrl}/issue/${encodeURIComponent(params.slug)}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: dki.metaTitle,
      description: dki.metaDesc,
      type: "article",
      url: `${baseUrl}/issue/${encodeURIComponent(params.slug)}`,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${brand} 전문가 상담`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dki.metaTitle,
      description: dki.metaDesc,
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default function Page({ params }: PageProps) {
  const baseUrl = BASE_URL;
  
  let decodedSlug = "";
  try {
    decodedSlug = decodeURIComponent(params.slug);
    if (decodedSlug.includes('%')) {
      decodedSlug = decodeURIComponent(decodedSlug);
    }
  } catch (e) {
    decodedSlug = params.slug;
  }

  const keyword = decodedSlug.replace(/-/g, ' ').replace(/[<>]/g, '').trim();

  // A. Local Business 스키마
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": BRAND_NAME,
    "image": `${baseUrl}/og-image.png`,
    "@id": baseUrl,
    "url": baseUrl,
    "telephone": PHONE_NUMBER,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": OFFICE_ADDRESS,
      "addressLocality": "부산·경남",
      "postalCode": OFFICE_POSTAL_CODE,
      "addressCountry": "KR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": OFFICE_LATITUDE,
      "longitude": OFFICE_LONGITUDE
    }
  };

  // B. 브레드크롬 스키마
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "부산 키워드 허브",
        "item": `${baseUrl}/sitemap-busan`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": keyword,
        "item": `${baseUrl}/issue/${encodeURIComponent(params.slug)}`
      }
    ]
  };

  // C. 화면의 FAQ 데이터와 100% 동기화된 FAQPage 스키마 적용
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": commonFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MainPageContent k={keyword} />
    </>
  );
}
