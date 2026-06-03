import { Metadata } from "next";
import MainPageContent from "@/components/MainPageContent";
import { commonFaqs } from "@/lib/faqData";
import { 
  BASE_URL, 
  BRAND_NAME, 
  BRAND_SLOGAN, 
  OFFICE_ADDRESS, 
  OFFICE_POSTAL_CODE, 
  OFFICE_LATITUDE, 
  OFFICE_LONGITUDE, 
  PHONE_NUMBER 
} from "@/lib/constants";

interface PageProps {
  searchParams: { k?: string };
}

// 홈 메인페이지의 고유 SEO 메타데이터 선언 (키워드 유입에 맞춰 동적 메타데이터 적용)
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const k = searchParams.k;
  let decodedK = "";
  if (k) {
    try {
      decodedK = decodeURIComponent(k);
      if (decodedK.includes('%')) {
        decodedK = decodeURIComponent(decodedK);
      }
    } catch (e) {
      decodedK = k;
    }
  }
  const keyword = decodedK.replace(/-/g, ' ').replace(/[<>]/g, '').trim();

  const title = keyword 
    ? `${keyword} 상담 | 부산 손해사정` 
    : `부산 손해사정 | ${BRAND_SLOGAN}`;

  const description = keyword
    ? `${keyword} 관련 합의금, 산재, 후유장해, 보험금 분쟁 자료를 기준으로 손해사정 검토를 지원합니다.`
    : "부산 및 경남 교통사고 합의금 적정액 산정, 최초 산재 기각 불승인 이의신청, 보험금 면책 및 과소 삭감 지급 분쟁을 사고자료와 약관을 기준으로 검토합니다.";

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    alternates: {
      canonical: BASE_URL,
    },
    openGraph: {
      title: keyword ? `${keyword} 상담 | 부산 손해사정 전문 상담` : `부산 손해사정 | 부산 손해사정 전문 상담`,
      description: keyword ? `${keyword} 관련 합의금, 산재, 후유장해, 보험금 분쟁 자료를 기준으로 손해사정 검토를 지원합니다.` : "보험사 출신 전문가가 의무기록과 개별자료를 기준으로 철저하게 분석하고 확인해 드립니다.",
      type: "website",
      url: BASE_URL,
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "부산 맞춤형 손해사정 상담",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default function Page({ searchParams }: PageProps) {
  const baseUrl = BASE_URL;
  const k = searchParams.k;
  
  let decodedK = "";
  if (k) {
    try {
      decodedK = decodeURIComponent(k);
      if (decodedK.includes('%')) {
        decodedK = decodeURIComponent(decodedK);
      }
    } catch (e) {
      decodedK = k;
    }
  }
  const keyword = decodedK.replace(/-/g, ' ').replace(/[<>]/g, '').trim();
  
  // A. Local Business JSON-LD 구조화 데이터 적용
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
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  // B. BreadcrumbList JSON-LD 구조화 데이터 적용
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": baseUrl
      }
    ]
  };

  // C. FAQPage JSON-LD 구조화 데이터 적용 (화면 FAQ와 100% 동일 사양)
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
