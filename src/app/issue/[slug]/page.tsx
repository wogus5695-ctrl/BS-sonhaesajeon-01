import React from "react";
import { Metadata } from "next";
import MainPageContent from "@/components/MainPageContent";
import { commonFaqs } from "@/lib/faqData";
import { classifyKeyword, getDKIContent, getDKIIntentData } from "@/lib/dkiUtils";
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
          url: `${baseUrl}/og-image.png?v=2`,
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
      images: [`${baseUrl}/og-image.png?v=2`],
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
    "image": `${baseUrl}/og-image.png?v=2`,
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
        "name": keyword,
        "item": `${baseUrl}/issue/${encodeURIComponent(params.slug)}`
      }
    ]
  };

  // C. 화면의 FAQ 데이터와 100% 동기화된 FAQPage 스키마 적용
  const pageFaqs = [];
  if (keyword.length > 0) {
    const intentData = getDKIIntentData(keyword);
    let dynamicFaqAnswer = "사고 경위 자료, 진단서, 치료기록, 보험사 안내문, 약관 자료 등이 있으면 검토가 수월합니다. 자료가 부족한 경우에도 현재 상황을 먼저 확인한 뒤 필요한 서류를 안내드립니다.";
    if (intentData.intentGroup === "consultation") {
      dynamicFaqAnswer = "기초 전화 상담을 통해 사고 유형을 파악한 뒤, 보유하신 서류(진단서, 치료 기록 등)를 기반으로 정밀 분석을 진행합니다. 이후 약관 검토와 의견서 작성 등 필요한 절차에 대해 상세히 안내해 드립니다.";
    }
    pageFaqs.push({ q: intentData.faqQuestion, a: dynamicFaqAnswer });
  }
  pageFaqs.push(...commonFaqs);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pageFaqs.map(faq => ({
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
