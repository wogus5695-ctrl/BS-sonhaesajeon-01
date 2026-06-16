import { getDKIIntentData } from './dkiUtils';
import { 
  busanRegions,
  basicServices,
  industrialRegions,
  industrialServices,
  noGuRegions
} from './keywordBase';

export {
  busanRegions,
  basicServices,
  industrialRegions,
  industrialServices
};

export interface KeywordItem {
  label: string;
  slug: string;
  category: "부산 지역 상담" | "산재 특화 지역 상담" | "신규 확장 상담";
  region: string;
  service: string;
  intent: string;
  url: string;

  // 신규 추가/확장 필드
  keyword: string;
  subRegion?: string;
  areaType?: "city" | "district" | "lifeArea";
  intentGroup: string;
  h1Text: string;
  heroDescription: string;
  sectionDescription: string;
  faqQuestion: string;
  ctaSentence: string;
  metaTitle: string;
  metaDescription: string;
  addedBatch?: string;
  addedLabel?: string;
  groupLabel?: string;
  isNewKeyword?: boolean;
}

const generatedKeywords: KeywordItem[] = [];

// 지명 변형 정교화 처리
const getVariantRegion = (region: string): string => {
  let result = region;
  if (!region.endsWith("구") && !region.endsWith("군")) {
    if (region === "부산") {
      result = "부산";
    } else if (region === "기장") {
      result = "기장군";
    } else {
      result = region + "구";
    }
  }

  // 남구/북구/서구/동구/중구/강서구 에 대해 "부산 " 접두사 추가
  if (["남구", "북구", "서구", "동구", "중구", "강서구"].includes(result)) {
    return "부산 " + result;
  }
  return result;
};

// 키워드 헬퍼 함수
const buildKeywordItem = (
  variant: string,
  service: string,
  category: "부산 지역 상담" | "산재 특화 지역 상담" | "신규 확장 상담",
  isNew: boolean,
  addedBatch: string,
  addedLabel: string,
  groupLabel: string,
  overrideRegion?: string,
  overrideSubRegion?: string,
  overrideAreaType?: "city" | "district" | "lifeArea"
): KeywordItem => {
  const label = `${variant} ${service}`.trim();
  const slug = label.replace(/\s+/g, '-');
  
  const intentData = getDKIIntentData(label);

  const region = overrideRegion || variant;
  const subRegion = overrideSubRegion || "";
  let areaType: "city" | "district" | "lifeArea" = overrideAreaType || "district";

  if (!overrideAreaType) {
    if (variant === "부산" || ["김해", "양산", "울산", "창원"].includes(variant)) {
      areaType = "city";
    } else {
      areaType = "district";
    }
  }

  return {
    label,
    slug,
    category,
    region,
    service,
    intent: "지역 상담",
    url: `/issue/${encodeURIComponent(slug)}`,

    keyword: label,
    subRegion,
    areaType,
    intentGroup: intentData.intentGroup,
    h1Text: intentData.h1Text,
    heroDescription: intentData.heroDescription,
    sectionDescription: intentData.sectionDescription,
    faqQuestion: intentData.faqQuestion,
    ctaSentence: intentData.ctaSentence,
    metaTitle: intentData.metaTitle,
    metaDescription: intentData.metaDescription,
    addedBatch,
    addedLabel,
    groupLabel,
    isNewKeyword: isNew
  };
};

// A. 기본 지역 조합 생성 (기존 키워드는 addedBatch: "existing", isNewKeyword: false)
busanRegions.forEach((region) => {
  const variants = [getVariantRegion(region)];
  if (noGuRegions.includes(region)) {
    variants.push(region); // '구'/'군'이 생략된 버전 추가
  }

  variants.forEach((variant) => {
    basicServices.forEach((service) => {
      generatedKeywords.push(
        buildKeywordItem(variant, service, "부산 지역 상담", false, "existing", "", "")
      );
    });
  });
});

// B. 산재 특화 조합 생성 (8개 특화 지역 * 8개 산재 서비스)
industrialRegions.forEach((region) => {
  const variants = [getVariantRegion(region)];
  if (noGuRegions.includes(region)) {
    variants.push(region); // '구'/'군'이 생략된 버전 추가
  }

  variants.forEach((variant) => {
    industrialServices.forEach((service) => {
      const label = `${variant} ${service}`;
      // 기본조합과 중복 제거 방지
      const isDuplicate = generatedKeywords.some(k => k.label === label);
      if (!isDuplicate) {
        generatedKeywords.push(
          buildKeywordItem(variant, service, "산재 특화 지역 상담", false, "existing", "", "")
        );
      }
    });
  });
});

// C. 260616 신규 확장 키워드 정의 (부산 문제상황형 51개 키워드만 1차로 추가)
const newBusanKeywords = [
  // 교통사고 계열
  "부산 교통사고 합의금 상담",
  "부산 교통사고 위자료",
  "부산 교통사고 휴업손해",
  "부산 교통사고 향후치료비",
  "부산 교통사고 후유장해",
  "부산 교통사고 보험금 검토",
  "부산 교통사고 피해자 손해사정",
  "부산 교통사고 손해액 산정",

  // 산재 계열
  "부산 산재 심사청구",
  "부산 산재 재심사",
  "부산 산재 재요양",
  "부산 산재 휴업급여",
  "부산 산재 장해급여",
  "부산 산재 평균임금",
  "부산 산재 치료 종결 후 장해",
  "부산 산재 장해진단서 작성",
  "부산 산재 장해진단서 발급",
  "부산 산재 장해등급 재판정",
  "부산 산재 후유장해",

  // 직업병·현장 산재 계열
  "부산 소음성 난청 산재",
  "부산 근골격계 질환 산재",
  "부산 허리디스크 산재",
  "부산 회전근개파열 산재",
  "부산 무릎 산재",
  "부산 조선소 산재",
  "부산 항만 산재",
  "부산 건설현장 산재",
  "부산 제조업 산재",
  "부산 지게차 사고 산재",
  "부산 끼임 사고 산재",
  "부산 추락 사고 산재",

  // 보험금 분쟁 계열
  "부산 보험금 안나옴",
  "부산 보험금 삭감",
  "부산 보험금 감액",
  "부산 보험금 면책",
  "부산 보험금 지급 거절 사유",
  "부산 보험금 부지급 사유",
  "부산 보험금 분쟁",
  "부산 보험사 지급 거절",
  "부산 보험사 면책 통보",
  "부산 고지의무 위반 보험금",

  // 암진단비·질병보험 계열
  "부산 암보험금 거절",
  "부산 암진단비 부지급",
  "부산 암진단비 지급 거절",
  "부산 암진단비 감액",
  "부산 암진단비 면책",
  "부산 암진단비 고지의무",
  "부산 경계성종양 보험금",
  "부산 제자리암 보험금",
  "부산 상피내암 보험금",
  "부산 유사암 진단비"
];

newBusanKeywords.forEach((keyword) => {
  const isDuplicate = generatedKeywords.some(k => k.label === keyword);
  if (!isDuplicate) {
    generatedKeywords.push(
      buildKeywordItem(
        "",
        keyword,
        "신규 확장 상담",
        true,
        "260616",
        "260616 신규 확장 키워드",
        "부산 문제상황형 확장 키워드",
        "부산",
        "",
        "city"
      )
    );
  }
});

export const busanKeywordsList = generatedKeywords;
export const totalBusanKeywordsCount = generatedKeywords.length;

export const getAllKeywords = (): KeywordItem[] => {
  return generatedKeywords;
};
