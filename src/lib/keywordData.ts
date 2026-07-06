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
  category: "부산 지역 상담" | "산재 특화 지역 상담" | "신규 확장 상담" | "경남 지역 상담";
  region: string;
  regionDisplay?: string;
  service: string;
  intent: string;
  url: string;

  // 신규 추가/확장 필드
  keyword: string;
  subRegion?: string;
  areaType?: "city" | "county" | "district" | "lifeArea";
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
  category: "부산 지역 상담" | "산재 특화 지역 상담" | "신규 확장 상담" | "경남 지역 상담",
  isNew: boolean,
  addedBatch: string,
  addedLabel: string,
  groupLabel: string,
  overrideRegion?: string,
  overrideSubRegion?: string,
  overrideAreaType?: "city" | "county" | "district" | "lifeArea",
  overrideRegionDisplay?: string
): KeywordItem => {
  const label = `${variant} ${service}`.trim();
  const slug = label.replace(/\s+/g, '-');
  
  const intentData = getDKIIntentData(label);

  const region = overrideRegion || variant;
  const regionDisplay = overrideRegionDisplay || region;
  const subRegion = overrideSubRegion || "";
  let areaType: "city" | "county" | "district" | "lifeArea" = overrideAreaType || "district";

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
    regionDisplay,
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

// D. 260616 경남권 신규 확장 키워드 정의 (데이터 구조 및 hub 페이지 표시 테스트용 샘플 키워드)
const newGyeongnamKeywordsData = [
  {
    variant: "김해",
    service: "손해사정사",
    groupLabel: "경남 시·군 대표 키워드",
    overrideRegion: "김해",
    overrideRegionDisplay: "김해",
    overrideSubRegion: "",
    overrideAreaType: "city" as const
  },
  {
    variant: "창원 성산구",
    service: "손해사정사",
    groupLabel: "창원 행정구 키워드",
    overrideRegion: "창원",
    overrideRegionDisplay: "창원 성산구",
    overrideSubRegion: "창원 성산구",
    overrideAreaType: "district" as const
  },
  {
    variant: "창원",
    service: "산재 불승인",
    groupLabel: "경남 산업·산재 특화 키워드",
    overrideRegion: "창원",
    overrideRegionDisplay: "창원",
    overrideSubRegion: "",
    overrideAreaType: "city" as const
  },
  {
    variant: "장유",
    service: "교통사고 합의금",
    groupLabel: "경남 생활권 테스트 키워드",
    overrideRegion: "김해",
    overrideRegionDisplay: "장유",
    overrideSubRegion: "장유",
    overrideAreaType: "lifeArea" as const
  }
];

newGyeongnamKeywordsData.forEach((item) => {
  const isDuplicate = generatedKeywords.some(k => k.label === `${item.variant} ${item.service}`.trim());
  if (!isDuplicate) {
    generatedKeywords.push(
      buildKeywordItem(
        item.variant,
        item.service,
        "경남 지역 상담",
        true,
        "260616-gyeongnam",
        "260616 경남권 신규 확장 키워드",
        item.groupLabel,
        item.overrideRegion,
        item.overrideSubRegion,
        item.overrideAreaType,
        item.overrideRegionDisplay
      )
    );
  }
});

// E. 경남 시·군 대표 키워드 대량 자동 생성 (시/군 포함형 & 제외형 조합)
const gyeongnamCities = [
  { name: "창원", display: "창원", fullDisplay: "창원시" },
  { name: "김해", display: "김해", fullDisplay: "김해시" },
  { name: "양산", display: "양산", fullDisplay: "양산시" },
  { name: "진주", display: "진주", fullDisplay: "진주시" },
  { name: "거제", display: "거제", fullDisplay: "거제시" },
  { name: "통영", display: "통영", fullDisplay: "통영시" },
  { name: "사천", display: "사천", fullDisplay: "사천시" },
  { name: "밀양", display: "밀양", fullDisplay: "밀양시" }
];

const gyeongnamCounties = [
  { name: "함안", display: "함안", fullDisplay: "함안군" },
  { name: "거창", display: "거창", fullDisplay: "거창군" },
  { name: "창녕", display: "창녕", fullDisplay: "창녕군" },
  { name: "고성", display: "경남 고성", fullDisplay: "고성군" },
  { name: "하동", display: "하동", fullDisplay: "하동군" },
  { name: "합천", display: "합천", fullDisplay: "합천군" },
  { name: "남해", display: "남해", fullDisplay: "남해군" },
  { name: "함양", display: "함양", fullDisplay: "함양군" },
  { name: "산청", display: "산청", fullDisplay: "산청군" },
  { name: "의령", display: "의령", fullDisplay: "의령군" }
];

const gyeongnamServices = [
  "손해사정사",
  "손해사정사 상담",
  "교통사고 손해사정사",
  "교통사고 합의금",
  "보험금 부지급",
  "후유장해 보험금",
  "산재 불승인",
  "산재 장해등급",
  "12대 중과실",
  "보험금 지급 거절",
  "암진단비 거절",
  "암진단비 손해사정사",
  "12대 중과실 합의금"
];

// 1. 시 단위 키워드 생성
gyeongnamCities.forEach((city) => {
  const displays = [city.display, city.fullDisplay];
  displays.forEach((disp) => {
    gyeongnamServices.forEach((service) => {
      const isDuplicate = generatedKeywords.some(k => k.label === `${disp} ${service}`.trim());
      if (!isDuplicate) {
        generatedKeywords.push(
          buildKeywordItem(
            disp,
            service,
            "경남 지역 상담",
            true,
            "260616-gyeongnam",
            "260616 경남권 신규 확장 키워드",
            "경남 시·군 대표 키워드",
            city.name,
            "",
            "city",
            disp
          )
        );
      }
    });
  });
});

// 2. 군 단위 키워드 생성
gyeongnamCounties.forEach((county) => {
  const displays = [county.display, county.fullDisplay];
  displays.forEach((disp) => {
    gyeongnamServices.forEach((service) => {
      const isDuplicate = generatedKeywords.some(k => k.label === `${disp} ${service}`.trim());
      if (!isDuplicate) {
        generatedKeywords.push(
          buildKeywordItem(
            disp,
            service,
            "경남 지역 상담",
            true,
            "260616-gyeongnam",
            "260616 경남권 신규 확장 키워드",
            "경남 시·군 대표 키워드",
            county.name,
            "",
            "county",
            disp
          )
        );
      }
    });
  });
});

// F. 경남 1순위 지역의 산재·산업 특화 키워드 대량 자동 생성
const gyeongnamFirstTierRegions = [
  {
    name: "창원",
    display: "창원",
    fullDisplay: "창원시",
    additional: ["제조업 산재", "공장 산재", "지게차 사고 산재", "끼임 사고 산재", "추락 사고 산재"]
  },
  {
    name: "김해",
    display: "김해",
    fullDisplay: "김해시",
    additional: ["제조업 산재", "공장 산재", "지게차 사고 산재", "끼임 사고 산재"]
  },
  {
    name: "양산",
    display: "양산",
    fullDisplay: "양산시",
    additional: ["제조업 산재", "물류센터 산재", "지게차 사고 산재", "업무 중 사고 산재"]
  },
  {
    name: "진주",
    display: "진주",
    fullDisplay: "진주시",
    additional: ["업무 중 사고 산재", "건설현장 산재", "지게차 사고 산재"]
  },
  {
    name: "거제",
    display: "거제",
    fullDisplay: "거제시",
    additional: ["조선소 산재", "조선업 산재", "직업병 산재", "폐암 산재", "소음성 난청 산재"]
  }
];

const gyeongnamBasicSpecialized = [
  "산재 손해사정사",
  "산재 치료 종결",
  "직업병 산재",
  "폐암 산재",
  "산재 장해진단서",
  "업무 중 사고 산재",
  "배달 오토바이 사고 산재",
  "택배기사 산재"
];

gyeongnamFirstTierRegions.forEach((regionObj) => {
  const displays = [regionObj.display, regionObj.fullDisplay];
  displays.forEach((disp) => {
    // 1. 기본 산재·산업 특화 8개 키워드 적용
    gyeongnamBasicSpecialized.forEach((service) => {
      const isDuplicate = generatedKeywords.some(k => k.label === `${disp} ${service}`.trim());
      if (!isDuplicate) {
        generatedKeywords.push(
          buildKeywordItem(
            disp,
            service,
            "경남 지역 상담",
            true,
            "260616-gyeongnam",
            "260616 경남권 신규 확장 키워드",
            "경남 산업·산재 특화 키워드",
            regionObj.name,
            "",
            "city",
            disp
          )
        );
      }
    });

    // 2. 추가 산업 키워드 선별 적용
    regionObj.additional.forEach((service) => {
      const isDuplicate = generatedKeywords.some(k => k.label === `${disp} ${service}`.trim());
      if (!isDuplicate) {
        generatedKeywords.push(
          buildKeywordItem(
            disp,
            service,
            "경남 지역 상담",
            true,
            "260616-gyeongnam",
            "260616 경남권 신규 확장 키워드",
            "경남 산업·산재 특화 키워드",
            regionObj.name,
            "",
            "city",
            disp
          )
        );
      }
    });
  });
});

// G. 창원 행정구 단위 키워드 대량 자동 생성
const changwonDistricts = [
  { subRegion: "의창구", display: "창원 의창구" },
  { subRegion: "성산구", display: "창원 성산구" },
  { subRegion: "마산합포구", display: "창원 마산합포구" },
  { subRegion: "마산회원구", display: "창원 마산회원구" },
  { subRegion: "진해구", display: "창원 진해구" }
];

changwonDistricts.forEach((dist) => {
  gyeongnamServices.forEach((service) => {
    const isDuplicate = generatedKeywords.some(k => k.label === `${dist.display} ${service}`.trim());
    if (!isDuplicate) {
      generatedKeywords.push(
        buildKeywordItem(
          dist.display,
          service,
          "경남 지역 상담",
          true,
          "260616-gyeongnam",
          "260616 경남권 신규 확장 키워드",
          "창원 행정구 키워드",
          "창원",
          dist.subRegion,
          "district",
          dist.display
        )
      );
    }
  });
});

// H. 경남 생활권 테스트 키워드 대량 자동 생성 (5개 핵심 보상 키워드 조합)
const gyeongnamLifeAreas = [
  { name: "김해", display: "서김해", subRegion: "서김해" },
  { name: "김해", display: "동김해", subRegion: "동김해" },
  { name: "김해", display: "장유", subRegion: "장유" },
  { name: "김해", display: "진영", subRegion: "진영" },
  { name: "양산", display: "물금", subRegion: "물금" },
  { name: "양산", display: "웅상", subRegion: "웅상" },
  { name: "양산", display: "덕계", subRegion: "덕계" },
  { name: "양산", display: "서창", subRegion: "서창" },
  { name: "창원", display: "마산", subRegion: "마산" },
  { name: "창원", display: "진해", subRegion: "진해" },
  { name: "거제", display: "고현", subRegion: "고현" },
  { name: "거제", display: "옥포", subRegion: "옥포" },
  { name: "거제", display: "장평", subRegion: "장평" },
  { name: "진주", display: "진주혁신도시", subRegion: "진주혁신도시" },
  { name: "사천", display: "삼천포", subRegion: "삼천포" },
  { name: "함안", display: "칠원", subRegion: "칠원" },
  { name: "창녕", display: "남지", subRegion: "남지" }
];

const gyeongnamLifeServices = [
  "손해사정사",
  "산재 손해사정사",
  "산재 불승인",
  "교통사고 합의금",
  "보험금 부지급"
];

gyeongnamLifeAreas.forEach((area) => {
  gyeongnamLifeServices.forEach((service) => {
    const isDuplicate = generatedKeywords.some(k => k.label === `${area.display} ${service}`.trim());
    if (!isDuplicate) {
      generatedKeywords.push(
        buildKeywordItem(
          area.display,
          service,
          "경남 지역 상담",
          true,
          "260616-gyeongnam",
          "260616 경남권 신규 확장 키워드",
          "경남 생활권 테스트 키워드",
          area.name,
          area.subRegion,
          "lifeArea",
          area.display
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
