export interface KeywordItem {
  label: string;
  slug: string;
  category: "부산 지역 상담" | "산재 특화 지역 상담";
  region: string;
  service: string;
  intent: string;
  url: string;
}

// 1. 부산 17개 자치 구·군 전체 목록
export const busanRegions = [
  "부산",
  "해운대",
  "부산진구",
  "동래",
  "남구",
  "북구",
  "사하",
  "사상",
  "금정",
  "연제",
  "수영",
  "기장",
  "강서",
  "영도",
  "서구",
  "동구",
  "중구"
];

// 2. 8가지 기본 보상 서비스 목록
export const basicServices = [
  "손해사정사",
  "손해사정사 상담",
  "교통사고 손해사정사",
  "교통사고 합의금",
  "보험금 부지급",
  "후유장해 보험금",
  "산재 불승인",
  "산재 장해등급"
];

// 3. 중공업 및 물류 지대 등 산재 특화 행정 구역 (8개 지역)
export const industrialRegions = [
  "부산",
  "사하",
  "사상",
  "강서",
  "영도",
  "동구",
  "남구",
  "기장"
];

// 4. 8가지 산재 및 직업병 특화 서비스 목록
export const industrialServices = [
  "산재 손해사정사",
  "산재 치료 종결",
  "직업병 산재",
  "폐암 산재",
  "산재 장해진단서",
  "업무 중 사고 산재",
  "배달 오토바이 사고 산재",
  "택배기사 산재"
];

const generatedKeywords: KeywordItem[] = [];

// 지명 변형 정교화 처리
const getVariantRegion = (region: string): string => {
  // "부산진구"처럼 이미 '구'가 완벽하게 끝나는 경우 그대로 유지
  if (region.endsWith("구") || region.endsWith("군")) {
    return region;
  }
  // "해운대", "동래", "사하" 등 '구'가 탈락한 형태 -> "해운대구", "동래구" 등으로 결합
  if (region === "부산") {
    return "부산";
  }
  if (region === "기장") {
    return "기장군";
  }
  return region + "구";
};

// A. 136개 기본 지역 조합 생성 (17개 지역 * 8개 기본 서비스)
busanRegions.forEach((region) => {
  const variant = getVariantRegion(region);
  basicServices.forEach((service) => {
    const label = `${variant} ${service}`;
    const slug = label.trim().replace(/\s+/g, '-');
    generatedKeywords.push({
      label,
      slug,
      category: "부산 지역 상담",
      region: variant,
      service,
      intent: "지역 상담",
      url: `/issue/${encodeURIComponent(slug)}`
    });
  });
});

// B. 64개 산재 특화 조합 생성 (8개 특화 지역 * 8개 산재 서비스)
industrialRegions.forEach((region) => {
  const variant = getVariantRegion(region);
  industrialServices.forEach((service) => {
    const label = `${variant} ${service}`;
    const slug = label.trim().replace(/\s+/g, '-');
    
    // 기본조합과 중복 제거 방지
    const isDuplicate = generatedKeywords.some(k => k.label === label);
    if (!isDuplicate) {
      generatedKeywords.push({
        label,
        slug,
        category: "산재 특화 지역 상담",
        region: variant,
        service,
        intent: "지역 상담",
        url: `/issue/${encodeURIComponent(slug)}`
      });
    }
  });
});

export const busanKeywordsList = generatedKeywords;
export const totalBusanKeywordsCount = generatedKeywords.length;

export const getAllKeywords = (): KeywordItem[] => {
  return generatedKeywords;
};
