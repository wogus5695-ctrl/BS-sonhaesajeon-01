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

// C. 260616 신규 확장 키워드 정의
const newBasicServicesList = [
  "손해사정사", "손해사정사 상담", "교통사고 손해사정사", "교통사고 합의금", "보험금 부지급", "후유장해 보험금", "산재 불승인", "산재 장해등급", "12대 중과실",
  "보험금 지급 거절", "암진단비 거절", "암진단비 손해사정사", "12대 중과실 합의금",
  "위자료", "휴업손해", "향후치료비", "교통사고", "보험금 안나옴", "보험금 삭감", "보험금 감액"
];

const newIndustrialServicesList = [
  "산재 손해사정사", "산재 치료 종결", "직업병 산재", "폐암 산재", "산재 장해진단서", "업무 중 사고 산재", "배달 오토바이 사고 산재", "택배기사 산재",
  "산재 심사청구", "산재 재심사", "산재 휴업급여", "산재 장해급여", "소음성 난청 산재", "근골격계 질환 산재", "조선소 산재", "항만 산재", "제조업 산재",
  "건설현장 산재", "지게차 사고 산재", "끼임 사고 산재", "추락 사고 산재"
];

const allNewServices = [...newBasicServicesList, ...newIndustrialServicesList];

// 1. 부산 문제상황형 (기존에 없던 신규 21개 서비스들만 매핑하여 중복 방지)
const existingAllServices = [...basicServices, ...industrialServices];
const newOnlyServices = allNewServices.filter(s => !existingAllServices.includes(s));

newOnlyServices.forEach((service) => {
  generatedKeywords.push(
    buildKeywordItem("부산", service, "신규 확장 상담", true, "260616", "2026년 6월 16일 추가", "부산 문제상황형")
  );
});

// 2. 신규 확장 지역들 정의 (김해, 양산, 울산, 창원, 생활권 권역)
interface NewRegionConfig {
  variant: string;
  groupLabel: string;
  region: string;
  subRegion?: string;
  areaType: "city" | "district" | "lifeArea";
}

const newRegionConfigs: NewRegionConfig[] = [
  // 김해
  { variant: "김해", groupLabel: "김해", region: "김해", areaType: "city" },
  // 양산
  { variant: "양산", groupLabel: "양산", region: "양산", areaType: "city" },
  // 울산
  { variant: "울산", groupLabel: "울산", region: "울산", areaType: "city" },
  { variant: "울산 남구", groupLabel: "울산", region: "울산", subRegion: "남구", areaType: "district" },
  { variant: "울산 북구", groupLabel: "울산", region: "울산", subRegion: "북구", areaType: "district" },
  { variant: "울산 중구", groupLabel: "울산", region: "울산", subRegion: "중구", areaType: "district" },
  { variant: "울산 동구", groupLabel: "울산", region: "울산", subRegion: "동구", areaType: "district" },
  { variant: "울산 울주군", groupLabel: "울산", region: "울산", subRegion: "울주군", areaType: "district" },
  // 창원
  { variant: "창원", groupLabel: "창원", region: "창원", areaType: "city" },
  { variant: "창원 성산구", groupLabel: "창원", region: "창원", subRegion: "성산구", areaType: "district" },
  { variant: "창원 의창구", groupLabel: "창원", region: "창원", subRegion: "의창구", areaType: "district" },
  { variant: "창원 마산합포구", groupLabel: "창원", region: "창원", subRegion: "마산합포구", areaType: "district" },
  { variant: "창원 마산회원구", groupLabel: "창원", region: "창원", subRegion: "마산회원구", areaType: "district" },
  { variant: "창원 진해구", groupLabel: "창원", region: "창원", subRegion: "진해구", areaType: "district" },
  // 생활권 권역
  { variant: "서김해", groupLabel: "생활권 권역", region: "김해", subRegion: "서김해", areaType: "lifeArea" },
  { variant: "동김해", groupLabel: "생활권 권역", region: "김해", subRegion: "동김해", areaType: "lifeArea" },
  { variant: "물금", groupLabel: "생활권 권역", region: "양산", subRegion: "물금", areaType: "lifeArea" },
  { variant: "웅상", groupLabel: "생활권 권역", region: "양산", subRegion: "웅상", areaType: "lifeArea" }
];

newRegionConfigs.forEach((config) => {
  allNewServices.forEach((service) => {
    const label = `${config.variant} ${service}`;
    const isDuplicate = generatedKeywords.some(k => k.label === label);
    if (!isDuplicate) {
      generatedKeywords.push(
        buildKeywordItem(
          config.variant,
          service,
          "신규 확장 상담",
          true,
          "260616",
          "2026년 6월 16일 추가",
          config.groupLabel,
          config.region,
          config.subRegion,
          config.areaType
        )
      );
    }
  });
});

export const busanKeywordsList = generatedKeywords;
export const totalBusanKeywordsCount = generatedKeywords.length;

export const getAllKeywords = (): KeywordItem[] => {
  return generatedKeywords;
};
