import { BRAND_NAME } from './constants';
import { busanRegions } from './keywordData';

export type DKIType = 
  | "traffic"       // 교통사고 관련 (교통사고 합의금, 교통사고 손해사정사, 후유장해 보험금 등)
  | "insurance"     // 보험금 분쟁 관련 (보험금 부지급, 고지의무, 암보험금 등)
  | "industrial"    // 산재 관련 (산재 불승인, 산재 장해등급, 직업병 등)
  | "general";      // 일반/기타

export interface DKIContent {
  type: DKIType;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  metaTitle: string;
  metaDesc: string;
}

export const classifyKeyword = (k: string): DKIType => {
  const kw = k.toLowerCase();
  
  // 1. 산재 관련 분류
  if (["산재", "직업병", "폐암", "장해등급", "치료 종결", "업무 중 사고", "배달 오토바이", "택배기사"].some(key => kw.includes(key))) {
    return "industrial";
  }
  
  // 2. 교통사고 관련 분류
  if (["교통사고", "합의금", "과실비율", "향후치료비", "휴업손해", "오토바이 사고", "이륜차", "골절 합의금", "디스크 합의금"].some(key => kw.includes(key))) {
    return "traffic";
  }

  // 3. 보험 분쟁 관련 분류
  if (["보험금", "부지급", "거절", "의료자문", "현장조사", "고지의무", "알릴의무", "계약해지", "부담보", "암진단비", "유사암", "경계성종양"].some(key => kw.includes(key))) {
    return "insurance";
  }

  // 4. 후유장해 일반 분류
  if (["후유장해", "장해보험금", "장해진단서"].some(key => kw.includes(key))) {
    return "traffic"; // 후유장해는 통상 교통/상해와 인과가 많아 교통 유형 자막을 제공하거나 개별 매칭
  }

  return "general";
};

export const getDKIContent = (keyword: string, type: DKIType): DKIContent => {
  const k = keyword || "손해액과 보험금 산정";
  const brand = "부산 손해사정";

  // 지명 결합 매칭 분석 (가장 긴 명칭 순서대로 대조)
  const sortedRegions = [...busanRegions].map(r => {
    if (r === "부산") return "부산";
    if (r === "기장") return "기장군";
    let mapped = r;
    if (!r.endsWith("구") && !r.endsWith("군")) {
      mapped = r + "구";
    }
    if (["남구", "북구", "서구", "동구", "중구", "강서구"].includes(mapped)) {
      return "부산 " + mapped;
    }
    return mapped;
  }).sort((a, b) => b.length - a.length);

  let matchedRegion = "";
  for (const r of sortedRegions) {
    if (k.startsWith(r)) {
      matchedRegion = r;
      break;
    }
  }

  // 매칭된 지역 지명이 있는 경우
  if (matchedRegion) {
    let matchEndIndex = matchedRegion.length;
    let nextIndex = matchedRegion.length;
    while (nextIndex < k.length && k.charAt(nextIndex) === ' ') {
      nextIndex++;
    }
    // "해운대" 매칭 시 뒤에 "구"가 붙어있으면 "해운대구" 결합 보정
    if (nextIndex < k.length) {
      const nextChar = k.charAt(nextIndex);
      if (nextChar === '구' || nextChar === '군') {
        matchedRegion += nextChar;
        matchEndIndex = nextIndex + 1;
      }
    }

    const service = k.substring(matchEndIndex).trim();
    
    // H1 예시: {지역명} {서비스명} 상담이 필요하신가요?
    const heroTitle = `<span class="text-white">${matchedRegion}</span> <span class="text-brand-accent underline decoration-brand-accent decoration-2 underline-offset-8 font-bold">${service}</span> <span class="text-white">상담이 필요하신가요?</span>`;
    
    // Subtitle 매핑 규정 준수
    let heroSubtitle = "";
    if (type === "traffic") {
      // 교통사고 유형 subtitle 예시 적용
      heroSubtitle = `${matchedRegion} 지역의 교통사고 합의금, 후유장해, 과실비율, 향후치료비, 휴업손해 문제를 사고자료와 의무기록을 기준으로 검토합니다.`;
    } else if (type === "insurance") {
      // 보험금 분쟁 유형 subtitle 예시 적용
      heroSubtitle = `${matchedRegion} 지역의 보험금 부지급, 후유장해 보험금, 보험사 의료자문, 고지의무 위반 문제를 약관과 의무기록, 보험사 안내문을 기준으로 검토합니다.`;
    } else if (type === "industrial") {
      // 산재 유형 subtitle 예시 적용
      heroSubtitle = `${matchedRegion} 지역의 산재 불승인, 장해등급, 치료 종결, 직업병 산재 문제는 재해경위, 의무기록, 업무관련성 자료를 기준으로 검토합니다.`;
    } else {
      // 기본/기타 유형 subtitle 예시 적용
      heroSubtitle = `${matchedRegion} 지역의 ${service} 관련 문제는 사고자료, 의무기록, 보험약관, 산재 결정서 등 개별 자료를 기준으로 확인해야 합니다.`;
    }

    // CTA 예시 적용
    const ctaText = `${matchedRegion} ${service} 검토 신청`;
    
    const metaTitle = `${matchedRegion} ${service} 상담 - ${brand}`;
    const metaDesc = `${matchedRegion} 지역 ${service} 관련 보상 쟁점에 대해 약관과 의무 기록 등 개별 자료를 기준으로 분석하고 검토합니다.`;

    return { type, heroTitle, heroSubtitle, ctaText, metaTitle, metaDesc };
  }
  
  // 지명 매칭이 안 된 순수 키워드 대상 기본 템플릿
  let heroTitle = `<span class="text-brand-accent underline decoration-brand-accent decoration-2 underline-offset-8 font-bold">${k}</span> <span class="text-white">상담이 필요하신가요?</span>`;
  let heroSubtitle = `보상 문제는 사고자료, 의무기록, 보험약관 등 세부적인 개별 자료를 기준으로 검토하고 확인하는 과정이 필요합니다.`;
  let ctaText = "무료 사건 분석 의뢰";
  let metaTitle = `${k} 상담 - ${brand}`;
  let metaDesc = `${k} 보상 관련 쟁점에 대해 약관 규정과 치료 기록 자료를 기준으로 철저하게 분석하고 확인합니다.`;

  return { type, heroTitle, heroSubtitle, ctaText, metaTitle, metaDesc };
};

// 동적 키워드 분류 테마와 연계된 화면 문제 상황 카드 자동 정렬
export const getProblemSituationsByTheme = (type: DKIType) => {
  const allSituations = [
    { text: "교통사고 합의금이 적정한지 궁금한 경우", theme: "traffic" },
    { text: "산재 불승인 후 재검토가 필요한 경우", theme: "industrial" },
    { text: "보험금 부지급 사유가 납득되지 않는 경우", theme: "insurance" },
    { text: "후유장해 보험금 검토가 필요한 경우", theme: "traffic" },
    { text: "항만·물류·건설·제조 현장 산재가 의심되는 경우", theme: "industrial" },
    { text: "오토바이 사고 손해배상 검토가 필요한 경우", theme: "traffic" }
  ];

  let theme: string = "general";
  if (type === "traffic") theme = "traffic";
  if (type === "industrial") theme = "industrial";
  if (type === "insurance") theme = "insurance";

  if (theme === "general") return allSituations;

  return [...allSituations].sort((a, b) => {
    if (a.theme === theme && b.theme !== theme) return -1;
    if (a.theme !== theme && b.theme === theme) return 1;
    return 0;
  });
};
