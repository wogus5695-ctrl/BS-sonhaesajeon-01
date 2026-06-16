import { busanRegions } from './keywordBase';

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
    const heroTitle = `<span class="text-white">${matchedRegion}</span> <span class="text-brand-accent font-bold">${service}</span> <span class="text-white">상담이 필요하신가요?</span>`;
    
    // Subtitle 매핑 규정 준수
    let heroSubtitle = "";
    if (type === "traffic") {
      heroSubtitle = `${matchedRegion} 지역의 교통사고 합의금, 후유장해, 과실비율, 향후치료비, 휴업손해 문제를 사고자료와 의무기록을 기준으로 검토합니다.`;
    } else if (type === "insurance") {
      heroSubtitle = `${matchedRegion} 지역의 보험금 부지급, 후유장해 보험금, 보험사 의료자문, 고지의무 위반 문제를 약관과 의무기록, 보험사 안내문을 기준으로 검토합니다.`;
    } else if (type === "industrial") {
      heroSubtitle = `${matchedRegion} 지역의 산재 불승인, 장해등급, 치료 종결, 직업병 산재 문제는 재해경위, 의무기록, 업무관련성 자료를 기준으로 검토합니다.`;
    } else {
      heroSubtitle = `${matchedRegion} 지역의 ${service} 관련 문제는 사고자료, 의무기록, 보험약관, 산재 결정서 등 개별 자료를 기준으로 확인해야 합니다.`;
    }

    // CTA 예시 적용
    const ctaText = `${matchedRegion} ${service} 검토 신청`;
    
    const combined = `${matchedRegion} ${service}`.trim();
    const titleKeyword = combined.endsWith("상담") ? combined : `${combined} 상담`;
    const metaTitle = `${titleKeyword} | 든든손해사정`;
    const metaDesc = `${combined} 관련 보험금, 산재, 후유장해, 교통사고 보상 쟁점을 자료 기준으로 검토합니다.`;

    return { type, heroTitle, heroSubtitle, ctaText, metaTitle, metaDesc };
  }
  
  // 지명 매칭이 안 된 순수 키워드 대상 기본 템플릿
  let heroTitle = `<span class="text-brand-accent font-bold">${k}</span> <span class="text-white">상담이 필요하신가요?</span>`;
  let heroSubtitle = `보상 문제는 사고자료, 의무기록, 보험약관 등 세부적인 개별 자료를 기준으로 검토하고 확인하는 과정이 필요합니다.`;
  let ctaText = "무료 사건 분석 의뢰";

  const titleKeyword = k.endsWith("상담") ? k : `${k} 상담`;
  const metaTitle = `${titleKeyword} | 든든손해사정`;
  const metaDesc = `${k} 관련 보험금, 산재, 후유장해, 교통사고 보상 쟁점을 자료 기준으로 검토합니다.`;

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
  h1Text: string;
  heroDescription: string;
  sectionDescription: string;
  faqQuestion: string;
  ctaSentence: string;
  metaTitle: string;
  metaDescription: string;
}

export const getDKIIntentData = (k: string): DKIIntentData => {
  const keyword = k || "손해액과 보험금 산정";
  const intentGroup = getIntentGroup(keyword);

  let h1Part1 = "";
  let h1Part2 = "";
  let heroDescription = "";
  let sectionDescription = "";
  let faqQuestion = "";
  let ctaSentence = "";

  switch (intentGroup) {
    case "consultant":
      h1Part1 = `${keyword},`;
      h1Part2 = "보험금 검토가 필요하다면";
      heroDescription = `${keyword} 관련 전문 분석 및 의무기록 약관 대조를 통해 보상 가능성을 검토합니다.`;
      sectionDescription = `${keyword} 검토를 진행하기 전, 사건 유형(교통사고·산재·보험금 분쟁)을 분류하여 필요한 자료를 확인해야 합니다.`;
      faqQuestion = `${keyword} 선임 및 상담 시 어떤 자료를 준비해야 하나요?`;
      ctaSentence = `${keyword} 자문이 필요하시다면 보유하신 서류를 바탕으로 가능성을 먼저 확인해보세요.`;
      break;
    case "consultation":
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = `${keyword}을 원하신다면 사고 경위 자료와 의무기록을 바탕으로 정밀 분석을 지원합니다.`;
      sectionDescription = `${keyword}을 신청하시기 전에, 사고 내용과 치료 현황에 따라 준비해야 할 서류가 다를 수 있습니다.`;
      faqQuestion = `${keyword} 진행 시 어떤 서류가 필요한가요?`;
      ctaSentence = `${keyword}에 대해 고민하고 계시다면 현재까지의 치료 및 보상 진행 자료를 기반으로 자문해 드립니다.`;
      break;
    case "traffic":
      h1Part1 = `${keyword},`;
      h1Part2 = "그대로 동의하기 전 검토하세요";
      heroDescription = `${keyword} 산정의 적정성을 사고 경위와 치료 기록을 기준으로 객관적으로 확인합니다.`;
      sectionDescription = `${keyword} 관련 손해액 평가 시에는 휴업손해, 향후치료비, 위자료 등 항목별 산정 기준을 세부 대조해야 합니다.`;
      faqQuestion = `${keyword} 적정성을 평가하기 위해 어떤 자료가 필요한가요?`;
      ctaSentence = `${keyword} 금액의 적정성이 고민되신다면 합의서 서명 전 서류를 기준으로 무료 분석을 요청해보세요.`;
      break;
    case "seriousTraffic":
      h1Part1 = `${keyword} 사고,`;
      h1Part2 = "과실 판단부터 확인하세요";
      heroDescription = `${keyword} 관련 보상 문제를 사고 자료와 의무기록 기준으로 정밀하게 검토합니다.`;
      sectionDescription = `${keyword} 사고의 경우 일반 과실 사고와 달리 형사 합의 및 민사 배상 범위에 대해 면밀한 검토가 필요합니다.`;
      faqQuestion = `${keyword} 사고에 대해 보상을 검토할 때 어떤 서류를 준비해야 하나요?`;
      ctaSentence = `${keyword}에 따른 형사 및 민사 보상 범위가 걱정되신다면 과실 비율과 자료를 기준으로 검토해 드립니다.`;
      break;
    case "industrialAccident":
      h1Part1 = `${keyword},`;
      h1Part2 = "자료 기준으로 다시 확인하세요";
      heroDescription = `${keyword} 관련 구제 방안과 장해등급 판정 가능성을 재해경위서 기준으로 검토합니다.`;
      sectionDescription = `${keyword} 통보나 등급 결정에 대해 이의를 제기하려면 최초 신청 서류와 불승인 처분서를 기준으로 판단해야 합니다.`;
      faqQuestion = `${keyword} 처분을 받은 경우 이의신청을 위해 무엇을 준비해야 하나요?`;
      ctaSentence = `${keyword}으로 장해등급이나 최초 승인 재심사가 필요하시다면 불승인 통보서를 기준으로 검토해보세요.`;
      break;
    case "industrialDisease":
      h1Part1 = `${keyword},`;
      h1Part2 = "업무관련성 검토가 필요하다면";
      heroDescription = `${keyword} 승인을 위한 근무 환경 분석과 의학 자료 대조를 면밀히 분석합니다.`;
      sectionDescription = `${keyword}은 업무와 질병 간의 의학적 인과관계를 입증해야 하므로 의무기록과 현장 자료 분석이 필수적입니다.`;
      faqQuestion = `${keyword} 신청 및 승인을 위해 어떤 인과관계 입증 자료가 필요한가요?`;
      ctaSentence = `${keyword} 인정 기준 및 신청 절차가 막막하시다면 근무 경력과 의무기록 자료로 분석해 드립니다.`;
      break;
    case "document":
      h1Part1 = `${keyword},`;
      h1Part2 = "제출 전 검토가 필요하다면";
      heroDescription = `${keyword} 발급 전 적정 장해율이 소견서에 충분히 반영되었는지 서류를 대조합니다.`;
      sectionDescription = `${keyword} 제출 시 상태보다 낮게 평가된 장해등급을 예방하기 위해 치료 기록과 장해 소견을 사전 분석해야 합니다.`;
      faqQuestion = `${keyword}을 발급받거나 제출하기 전에 확인해야 할 서류는 무엇인가요?`;
      ctaSentence = `${keyword} 발급이나 장해 평가 신청이 조심스러우시다면 사전 진단서 검토를 요청해보세요.`;
      break;
    case "treatmentEnd":
      h1Part1 = `${keyword},`;
      h1Part2 = "종결 전 확인이 필요하다면";
      heroDescription = `${keyword} 이후의 후유장해 평가 및 추가 보상 가능성을 면밀히 확인합니다.`;
      sectionDescription = `${keyword} 결정을 받은 후에도 잔존하는 신체 장해에 대해 약관 및 법령에 따른 추가 보상을 검토할 수 있습니다.`;
      faqQuestion = `${keyword} 결정을 받은 상황에서 추가 보상 검토를 위해 필요한 자료는 무엇인가요?`;
      ctaSentence = `${keyword} 이후 신체 상태에 따른 정당한 장해 보상을 찾고 싶으시다면 관련 서류를 바탕으로 검토해 드립니다.`;
      break;
    case "insuranceDispute":
      h1Part1 = `${keyword},`;
      h1Part2 = "보험사 안내가 맞는지 확인하세요";
      heroDescription = `${keyword} 결정에 대한 약관상 면책 사유의 타당성을 객관적으로 분석합니다.`;
      sectionDescription = `${keyword} 통보를 받은 경우, 보험사의 자체 의료자문이나 조사 결과가 객관적인지 진단서 기준으로 대조해야 합니다.`;
      faqQuestion = `${keyword} 안내를 받았을 때 타당성을 확인하기 위해 필요한 서류는 무엇인가요?`;
      ctaSentence = `${keyword} 통보에 대한 이의제기가 필요하시다면 보험사 안내문과 진단서를 기준으로 검토해보세요.`;
      break;
    case "deliveryAccident":
      h1Part1 = `${keyword},`;
      h1Part2 = "업무 중 사고라면 검토하세요";
      heroDescription = `${keyword} 승인 가능성과 전속성 기준을 업무 관련 증빙 자료로 검토합니다.`;
      sectionDescription = `${keyword}는 계약 관계와 사고 시점의 배차 상태 등에 따라 산재 적용 범위가 달라질 수 있어 확인이 필요합니다.`;
      faqQuestion = `${keyword} 보상 심사를 진행하기 위해 어떤 서류를 검토해야 하나요?`;
      ctaSentence = `${keyword} 적용 가능성과 절차에 대해 의문이 있으시다면 사고 경위서를 기준으로 검토해 드립니다.`;
      break;
    case "workerAccident":
      h1Part1 = `${keyword},`;
      h1Part2 = "업무관련성부터 확인하세요";
      heroDescription = `${keyword} 신청에 필요한 업무 수행 입증 자료와 사고 경위를 검토합니다.`;
      sectionDescription = `${keyword} 관련하여 현장의 끼임, 추락, 지게차 사고 등 업무 중 재해는 장해 판정과 보상 범위 검토가 중요합니다.`;
      faqQuestion = `${keyword} 재해 승인 및 장해 평가를 위해 필요한 서류는 무엇인가요?`;
      ctaSentence = `${keyword} 관련 장해 급여 및 보상 신청이 고민되신다면 사고 자료와 함께 분석을 의뢰해 보세요.`
      break;
    default:
      h1Part1 = `${keyword},`;
      h1Part2 = "서류 기준으로 먼저 확인하세요";
      heroDescription = `${keyword} 관련 보상 쟁점을 사고 자료와 의무기록 기준으로 정밀하게 검토합니다.`;
      sectionDescription = `${keyword} 관련 손해 평가 시에는 치료 내용과 개별 보험 약관 기준을 꼼꼼하게 대조해야 합니다.`;
      faqQuestion = `${keyword} 관련 보상을 검토할 때 어떤 자료가 필요한가요?`;
      ctaSentence = `${keyword} 관련으로 보상 가능성이 궁금하시다면 관련 서류를 바탕으로 검토해 드립니다.`;
      break;
  }

  const h1Text = `${h1Part1}\n${h1Part2}`;
  const titleKeyword = keyword.endsWith("상담") ? keyword : `${keyword} 상담`;
  const metaTitle = `${titleKeyword} | 든든손해사정`;
  const metaDescription = `${keyword} 관련 보험금, 산재, 후유장해, 교통사고 보상 쟁점을 자료 기준으로 검토합니다.`;

  return {
    intentGroup,
    h1Part1,
    h1Part2,
    h1Text,
    heroDescription,
    sectionDescription,
    faqQuestion,
    ctaSentence,
    metaTitle,
    metaDescription
  };
};
