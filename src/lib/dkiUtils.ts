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
  if (["교통사고", "합의금", "과실비율", "향후치료비", "휴업손해", "오토바이 사고", "이륜차", "골절 합의금", "디스크 합의금", "12대 중과실", "중과실"].some(key => kw.includes(key))) {
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
  const noGuRegions = ["해운대", "동래", "사하", "사상", "금정", "연제", "수영", "기장", "영도"];
  const regions: string[] = [];
  
  busanRegions.forEach(r => {
    if (r === "부산") {
      regions.push("부산");
      return;
    }
    let mapped = r;
    if (!r.endsWith("구") && !r.endsWith("군")) {
      mapped = r + "구";
    }
    if (["남구", "북구", "서구", "동구", "중구", "강서구"].includes(mapped)) {
      regions.push("부산 " + mapped);
    } else {
      regions.push(mapped);
    }

    // "해운대" 등 '구'/'군' 생략 키워드 매칭 지원을 위해 추가 등록
    if (noGuRegions.includes(r)) {
      regions.push(r);
    }
  });

  const sortedRegions = regions.sort((a, b) => b.length - a.length);

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
    
    const combined = `${matchedRegion} ${service}`.trim();
    const titleKeyword = combined.endsWith("상담") ? combined : `${combined} 상담`;
    const metaTitle = `${titleKeyword} - ${brand}`;

    let metaDesc = "";
    if (type === "traffic") {
      metaDesc = `${combined} 관련 상담이 필요하다면 교통사고 합의금, 후유장해, 과실비율, 향후치료비 등 보상 문제를 블랙박스·진단서·치료기록 기준으로 검토하세요.`;
    } else if (type === "insurance") {
      metaDesc = `${combined} 관련 상담이 필요하다면 보험사 제시금, 보험금 부지급, 고지의무 위반, 의료자문 문제를 약관·진단서·치료기록 기준으로 검토하세요.`;
    } else if (type === "industrial") {
      metaDesc = `${combined} 관련 상담이 필요하다면 산재 불승인, 장해등급, 직업병, 치료 종결 문제를 재해경위서·진단서·의무기록 기준으로 검토하세요.`;
    } else {
      metaDesc = `${combined} 관련 상담이 필요하다면 보험사 제시금, 산재 불승인, 후유장해, 보험금 부지급 문제를 진단서·치료기록·약관·사고경위 기준으로 검토하세요.`;
    }

    return { type, heroTitle, heroSubtitle, ctaText, metaTitle, metaDesc };
  }
  
  // 지명 매칭이 안 된 순수 키워드 대상 기본 템플릿
  let heroTitle = `<span class="text-brand-accent underline decoration-brand-accent decoration-2 underline-offset-8 font-bold">${k}</span> <span class="text-white">상담이 필요하신가요?</span>`;
  let heroSubtitle = `보상 문제는 사고자료, 의무기록, 보험약관 등 세부적인 개별 자료를 기준으로 검토하고 확인하는 과정이 필요합니다.`;
  let ctaText = "무료 사건 분석 의뢰";

  const titleKeyword = k.endsWith("상담") ? k : `${k} 상담`;
  let metaTitle = `${titleKeyword} - ${brand}`;

  let metaDesc = "";
  if (type === "traffic") {
    metaDesc = `${k} 관련 상담이 필요하다면 교통사고 합의금, 후유장해, 과실비율, 향후치료비 등 보상 문제를 블랙박스·진단서·치료기록 기준으로 검토하세요.`;
  } else if (type === "insurance") {
    metaDesc = `${k} 관련 상담이 필요하다면 보험사 제시금, 보험금 부지급, 고지의무 위반, 의료자문 문제를 약관·진단서·치료기록 기준으로 검토하세요.`;
  } else if (type === "industrial") {
    metaDesc = `${k} 관련 상담이 필요하다면 산재 불승인, 장해등급, 직업병, 치료 종결 문제를 재해경위서·진단서·의무기록 기준으로 검토하세요.`;
  } else {
    metaDesc = `${k} 관련 상담이 필요하다면 보험사 제시금, 산재 불승인, 후유장해, 보험금 부지급 문제를 진단서·치료기록·약관·사고경위 기준으로 검토하세요.`;
  }

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

export const getIntentGroup = (k: string): string => {
  const kw = k.toLowerCase();
  
  if (kw.includes("배달 오토바이 사고 산재")) {
    return "deliveryAccident";
  }
  if (kw.includes("택배기사 산재") || kw.includes("업무 중 사고 산재")) {
    return "workerAccident";
  }
  if (kw.includes("직업병 산재") || kw.includes("폐암 산재")) {
    return "industrialDisease";
  }
  if (kw.includes("산재 불승인") || kw.includes("산재 장해등급") || kw.includes("산재 손해사정사")) {
    return "industrialAccident";
  }
  if (
    kw.includes("보험금 부지급") || 
    kw.includes("후유장해 보험금") || 
    kw.includes("보험금 지급 거절") || 
    kw.includes("암진단비 거절") || 
    kw.includes("암진단비 손해사정사")
  ) {
    return "insuranceDispute";
  }
  if (kw.includes("치료 종결")) {
    return "treatmentEnd";
  }
  if (kw.includes("장해진단서")) {
    return "document";
  }
  if (kw.includes("12대 중과실")) {
    return "seriousTraffic";
  }
  if (kw.includes("손해사정사 상담")) {
    return "consultation";
  }
  if (kw.includes("손해사정사")) {
    return "consultant";
  }
  if (kw.includes("교통사고") || kw.includes("합의금")) {
    return "traffic";
  }
  
  return "general";
};

export interface DKIIntentData {
  intentGroup: string;
  h1Part1: string;
  h1Part2: string;
  heroDescription: string;
  sectionDescription: string;
  faqQuestion: string;
  ctaSentence: string;
}

export const getDKIIntentData = (k: string): DKIIntentData => {
  const keyword = k || "손해액과 보험금 산정";
  const intentGroup = getIntentGroup(keyword);

  let h1Part1 = `${keyword},`;
  let h1Part2 = "서류 기준으로 먼저 확인하세요";
  let heroDescription = "보험금, 산재, 후유장해, 교통사고 합의금 관련 자료를 기준으로 검토합니다.";
  let sectionDescription = `${keyword} 관련 보상은 사건 유형에 따라 확인해야 할 자료와 판단 기준이 달라집니다.`;
  let faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
  let ctaSentence = `${keyword} 관련 상담이 필요하다면 현재 보유한 서류를 기준으로 먼저 검토를 요청해보세요.`;

  switch (intentGroup) {
    case "consultant":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = "보험금, 산재, 후유장해, 교통사고 합의금 관련 자료를 기준으로 검토합니다.";
      sectionDescription = `${keyword} 관련 검토를 찾고 계신다면, 먼저 내 사건이 교통사고·산재·후유장해·보험금 분쟁 중 어디에 해당하는지 확인하는 것이 중요합니다.`;
      faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
      ctaSentence = `${keyword} 관련 상담이 필요하다면 보유한 서류 기준으로 먼저 검토를 요청해보세요.`;
      break;
    case "consultation":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = "보험금, 산재, 후유장해, 교통사고 합의금 관련 자료를 기준으로 검토합니다.";
      sectionDescription = `${keyword} 관련 상담은 사고 유형에 따라 필요한 자료와 검토 기준이 달라집니다.`;
      faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
      ctaSentence = `${keyword} 관련 상담이 필요하다면 현재 보유한 서류부터 확인해보세요.`;
      break;
    case "traffic":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = "사고 경위, 과실 비율, 치료 기록, 합의금 산정 기준을 함께 확인합니다.";
      sectionDescription = `${keyword} 관련 보상은 사건 유형과 치료 경과에 따라 검토해야 할 손해 항목이 달라집니다.`;
      faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
      ctaSentence = `${keyword} 관련 합의금 적정성이 고민된다면 합의 전 서류 검토를 요청해보세요.`;
      break;
    case "seriousTraffic":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = "사고 경위, 과실 비율, 치료 기록, 합의금 산정 기준을 함께 확인합니다.";
      sectionDescription = `${keyword} 문제는 일반 교통사고보다 과실 판단과 보상 범위 확인이 더 중요할 수 있습니다.`;
      faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
      ctaSentence = `${keyword} 관련으로 합의금이나 과실 비율이 고민된다면 먼저 자료를 기준으로 검토해보세요.`;
      break;
    case "industrialAccident":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = "사고 경위, 업무 수행 여부, 치료 기록, 산재 신청 자료를 기준으로 검토합니다.";
      sectionDescription = `${keyword} 관련 보상은 제출 자료와 판단 기준에 따라 검토 방향이 달라질 수 있습니다.`;
      faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
      ctaSentence = `${keyword} 관련으로 고민 중이라면 보유한 산재 자료를 기준으로 먼저 검토해보세요.`;
      break;
    case "industrialDisease":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = "사고 경위, 업무 수행 여부, 치료 기록, 산재 신청 자료를 기준으로 검토합니다.";
      sectionDescription = `${keyword} 관련 보상은 질병명만으로 판단하기 어렵고, 근무 환경과 의학자료를 함께 확인해야 합니다.`;
      faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
      ctaSentence = `${keyword} 관련 인정 가능성이 고민된다면 관련 자료를 기준으로 먼저 검토를 요청해보세요.`;
      break;
    case "document":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = "사고 경위, 과실 비율, 치료 기록, 합의금 산정 기준을 함께 확인합니다.";
      sectionDescription = `${keyword} 관련 서류는 장해등급 판단에 영향을 줄 수 있으므로 제출 전 기록과 상태가 충분히 반영되었는지 확인하는 것이 중요합니다.`;
      faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
      ctaSentence = `${keyword} 관련 서류 제출이 고민된다면 치료 기록과 현재 상태를 기준으로 먼저 확인해보세요.`;
      break;
    case "treatmentEnd":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = "사고 경위, 과실 비율, 치료 기록, 합의금 산정 기준을 함께 확인합니다.";
      sectionDescription = `${keyword} 관련 보상은 종결 이후 장해등급이나 추가 보상 가능성이 달라질 수 있으므로 자료 검토가 필요할 수 있습니다.`;
      faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
      ctaSentence = `${keyword} 관련 안내를 받았다면 치료 기록과 현재 증상을 기준으로 먼저 검토해보세요.`;
      break;
    case "insuranceDispute":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = "보험사 안내문, 약관, 진단서, 고지의무 관련 자료를 기준으로 부지급 사유를 검토합니다.";
      sectionDescription = `${keyword} 관련 분쟁은 약관과 제출 자료에 따라 지급 가능성과 검토 방향이 달라질 수 있습니다.`;
      faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
      ctaSentence = `${keyword} 관련 부지급이나 감액 안내를 받았다면 먼저 약관과 자료를 기준으로 확인해보세요.`;
      break;
    case "deliveryAccident":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = "사고 경위, 업무 수행 여부, 치료 기록, 산재 신청 자료를 기준으로 검토합니다.";
      sectionDescription = `${keyword} 문제는 근무 형태와 사고 발생 시점에 따라 업무관련성 판단이 달라질 수 있습니다.`;
      faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
      ctaSentence = `${keyword} 관련 산재 여부가 고민된다면 사고 경위와 치료 기록을 기준으로 먼저 검토해보세요.`;
      break;
    case "workerAccident":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = "사고 경위, 업무 수행 여부, 치료 기록, 산재 신청 자료를 기준으로 검토합니다.";
      sectionDescription = `${keyword} 문제는 사고 시점과 업무 수행 과정이 중요하므로 관련 자료를 함께 확인해야 합니다.`;
      faqQuestion = `${keyword} 상담에는 어떤 자료가 필요할까요?`;
      ctaSentence = `${keyword} 관련 인정 가능성이 고민된다면 사고 경위와 근무 자료를 기준으로 먼저 검토해보세요.`;
      break;
  }

  return {
    intentGroup,
    h1Part1,
    h1Part2,
    heroDescription,
    sectionDescription,
    faqQuestion,
    ctaSentence
  };
};
