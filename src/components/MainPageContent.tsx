"use client";
import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  Phone,
  FileSearch,
  Scale,
  Users,
  Quote,
  Lightbulb,
  Anchor,
  Ship,
  Building2,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import ContactForm from '@/components/ContactForm';
import CTAButton from '@/components/CTAButton';
import { classifyKeyword, getDKIContent, getProblemSituationsByTheme } from '@/lib/dkiUtils';
import CaseSection from '@/components/CaseSection';
import { commonFaqs } from '@/lib/faqData';
import { getExpertContent } from '@/lib/expertContent';
import { busanRegions } from '@/lib/keywordData';
import { BRAND_NAME, PHONE_NUMBER } from '@/lib/constants';

// --- Data ---
const mainServices = [
  {
    title: "12대 중과실 교통사고",
    desc: "신호위반, 중앙선 침범, 음주운전 등 중과실 사고의 과실과 합의금 적정성을 검토합니다.",
    issues: [
      "사고 경위와 과실 비율",
      "치료 기록과 향후 치료비",
      "합의금·후유장해 보상 범위"
    ],
    tag: "12대 중과실 보상 검토",
    buttonText: "중과실 사고 보상 검토하기",
    icon: FileSearch
  },
  {
    title: "산재 손해사정",
    desc: "산재 승인 여부, 불승인 사유, 장해등급 가능성을 자료 기준으로 검토합니다.",
    issues: [
      "산재 불승인 사유",
      "업무 관련성 판단",
      "장해등급 가능성"
    ],
    tag: "근로자 산재·장해",
    buttonText: "산재 보상 가능성 확인",
    icon: Scale
  },
  {
    title: "보험금 분쟁 손해사정",
    desc: "보험금 부지급, 감액, 면책 통보가 약관상 타당한지 확인합니다.",
    issues: [
      "부지급·면책 사유",
      "고지의무 위반 여부",
      "약관상 지급 기준"
    ],
    tag: "부지급·감액·면책",
    buttonText: "보험금 분쟁 상담하기",
    icon: ShieldCheck
  },
  {
    title: "산업재해·직업병 손해사정",
    desc: "항만, 제조, 건설, 물류 현장의 사고와 직업병 보상 가능성을 검토합니다.",
    issues: [
      "현장 사고와 업무 관련성",
      "소음성 난청·직업병",
      "장해율 및 보상 범위"
    ],
    tag: "현장 사고·직업병",
    buttonText: "산재·직업병 검토하기",
    icon: Building2
  }
];

const processSteps = [
  { step: "01", title: "무상 기초 상담", desc: "사고 경위와 현재 진행 상황을 먼저 확인합니다." },
  { step: "02", title: "자료 확인 및 수집", desc: "진단서, 치료 기록, 보험 안내문 등 필요한 자료를 안내합니다." },
  { step: "03", title: "의무기록 분석", desc: "진단서, 치료 경과, 후유장해 가능성을 검토합니다." },
  { step: "04", title: "약관·지급 기준 검토", desc: "보험 약관과 지급 기준에 맞는지 대조합니다." },
  { step: "05", title: "손해액 산정", desc: "치료비, 휴업손해, 위자료, 장해 항목을 검토합니다." },
  { step: "06", title: "검토 결과 안내", desc: "필요 시 손해사정서 작성 및 제출 방향을 안내합니다." }
];

const SectionTitle = ({ title, sub, label }: { title: string, sub?: string, label?: string }) => (
  <div className="mb-12 md:mb-16 text-center">
    <div className="inline-block px-4 py-1.5 bg-brand-gold/10 text-brand-gold text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
      {label || BRAND_NAME}
    </div>
    <h2 className="text-3xl md:text-5xl font-black text-brand-primary mb-4 break-keep leading-[1.3] md:leading-[1.4]">{title}</h2>
    {sub && <p className="text-brand-muted text-base md:text-lg break-keep max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: sub }} />}
  </div>
);

export default function MainPageContent({ k }: { k?: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [caseCount, setCaseCount] = useState(1124);

  useEffect(() => {
    // Base date: 2026-05-10
    const baseDate = new Date('2026-05-10T00:00:00+09:00');
    const now = new Date();
    const diffTime = now.getTime() - baseDate.getTime();
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    
    setCaseCount(1124 + diffDays);
  }, []);

  // Keyword & Theme Processing
  const rawKeyword = k ? k.replace(/-/g, ' ').replace(/[<>]/g, '').trim() : "";
  const hasKeyword = rawKeyword.length > 0;
  const keyword = hasKeyword ? rawKeyword : "";
  const theme = classifyKeyword(keyword);
  const dki = getDKIContent(keyword, theme);

  const faqs = React.useMemo(() => {
    if (!hasKeyword) return commonFaqs;
    const dynamicFaq = {
      q: `${keyword} 상담은 어떤 자료가 필요할까요?`,
      a: "사고 경위 자료, 진단서, 치료기록, 보험사 안내문, 약관 자료 등이 있으면 검토가 수월합니다. 자료가 부족한 경우에도 현재 상황을 먼저 확인한 뒤 필요한 서류를 안내드립니다."
    };
    return [dynamicFaq, ...commonFaqs];
  }, [hasKeyword, keyword]);

  // 6 situation cards with specific lucide-react icons for visual distinction
  const situationData = [
    { text: "보험사 합의금이 낮게 느껴질 때", theme: "traffic", icon: FileSearch },
    { text: "산재 불승인 통보를 받았을 때", theme: "industrial", icon: Scale },
    { text: "보험금 부지급 사유가 이해되지 않을 때", theme: "insurance", icon: AlertCircle },
    { text: "후유장해 진단·장해율 검토가 필요할 때", theme: "traffic", icon: ShieldCheck },
    { text: "현장 사고가 산재에 해당하는지 애매할 때", theme: "industrial", icon: Building2 },
    { text: "오토바이 사고 보상 범위를 확인하고 싶을 때", theme: "traffic", icon: Users }
  ];

  // Sort them dynamically based on the current theme (DKI dynamic relevance feature)
  const problemSituations = [...situationData].sort((a, b) => {
    if (a.theme === theme && b.theme !== theme) return -1;
    if (a.theme !== theme && b.theme === theme) return 1;
    return 0;
  });

  // Find matched region for badge and trust points
  let matchedRegion = "부산·경남";
  if (hasKeyword) {
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

    for (const r of sortedRegions) {
      if (keyword.startsWith(r)) {
        matchedRegion = r;
        let nextIndex = r.length;
        while (nextIndex < keyword.length && keyword.charAt(nextIndex) === ' ') {
          nextIndex++;
        }
        if (nextIndex < keyword.length) {
          const nextChar = keyword.charAt(nextIndex);
          if (nextChar === '구' || nextChar === '군') {
            matchedRegion += nextChar;
          }
        }
        break;
      }
    }
  }

  return (
    <div className="bg-brand-white text-brand-charcoal">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-brand-primary text-white">
        {/* Background Visual Asset & Blend (Restored to full-screen background with weaker overlays) */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.png" 
            alt="든든손해사정 파트너십 상징 이미지" 
            fill 
            priority
            className="object-cover object-center opacity-90 md:opacity-95"
          />
          {/* Weaker, balanced overlays to let the background handshake image show clearly */}
          <div className="absolute inset-0 bg-[#0A231C]/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A231C]/85 via-[#0A231C]/35 to-[#0A231C]/50 pointer-events-none" />
        </div>
        
        {/* Background Visual Deco Dots */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E6F9F_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          <div className="max-w-[720px] w-full text-center flex flex-col items-center mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 bg-brand-deep/50 backdrop-blur-md border border-brand-gold/30 text-brand-lightGold px-3.5 py-1.5 rounded-full font-bold text-xs md:text-sm tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                {matchedRegion} 손해사정 상담 · 보험금 검토
              </span>
            </div>
            
             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 break-words sm:break-keep leading-tight sm:leading-[1.3] text-white tracking-tight drop-shadow-md max-w-3xl mx-auto text-center">
              {hasKeyword ? (
                <>
                  {keyword},<br />
                  <span className="text-brand-gold">그대로 동의하기 전</span><br />
                  한 번 더 검토하세요
                </>
              ) : (
                <>
                  보험사 제시금,<br />
                  그대로 동의하기 전<br />
                  한 번 더 <span className="text-brand-gold">검토하세요</span>
                </>
              )}
            </h1>

            {hasKeyword ? (
              <p className="text-sm md:text-base lg:text-lg text-white/90 mb-10 leading-relaxed break-keep font-light max-w-xl mx-auto drop-shadow-sm text-center">
                {keyword} 문제는<br />
                재해경위, 의무기록, 약관 등을 기준으로 검토합니다.<br />
                <span className="underline underline-offset-4 decoration-white/50">보험사 안내나 산재 판단에 동의하기 전,</span><br />
                보상 쟁점을 객관적으로 확인해드립니다.
              </p>
            ) : (
              <p className="text-sm md:text-base lg:text-lg text-white/90 mb-10 leading-relaxed break-keep font-light max-w-xl mx-auto drop-shadow-sm text-center">
                교통사고·산재·후유장해·보험금 분쟁 자료를 바탕으로<br className="hidden sm:inline" />
                보상 산정의 적정성을 객관적으로 검토합니다.
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 mb-10 w-full max-w-md mx-auto">
              <a 
                href="#contact" 
                className="px-8 py-4 bg-brand-gold hover:bg-brand-lightGold text-white font-bold text-base rounded-xl shadow-lg shadow-brand-gold/25 active:scale-[0.98] transition-all text-center flex items-center justify-center"
              >
                무료 서류 검토 요청
              </a>
              <a 
                href={`tel:${PHONE_NUMBER}`} 
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-base active:scale-[0.98] transition-all text-center"
              >
                <Phone className="w-4 h-4 text-brand-lightGold shrink-0" />
                <span>전화로 바로 상담</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 border-t border-white/10 w-full max-w-xl mx-auto">
              {[
                "합의 전 검토", 
                "보험금 산정 분석", 
                hasKeyword ? `${matchedRegion} 출장 상담` : "부산·경남 출장 상담"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-white/80 text-sm whitespace-nowrap">
                  <ShieldCheck className="w-4.5 h-4.5 text-brand-gold shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Situation Section */}
      <section className="py-16 md:py-24 bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            label="든든손해사정"
            title="이런 상황이라면, 합의 전 검토가 필요합니다" 
            sub="보험금·합의금·산재 승인 여부는 서류와 약관, 사고 경위에 따라 달라집니다.<br />아래 상황에 해당된다면 손해사정 검토를 먼저 받아보는 것이 좋습니다."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Image Placeholder Area (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative rounded-[2rem] overflow-hidden shadow-xl aspect-[4/3] lg:aspect-auto lg:h-full min-h-[350px] bg-brand-primary group outline outline-1 outline-offset-8 outline-brand-gold/15 hover:outline-brand-gold/30 transition-all duration-500 flex flex-col justify-end p-8">
                {/* Fallback visual background pattern */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
                <div className="absolute inset-0 z-0 opacity-80 group-hover:scale-[1.02] transition-transform duration-700">
                  <Image 
                    src="/analysis-desk.png" 
                    alt="자료 기반 손해사정 검토" 
                    fill 
                    priority
                    className="object-cover"
                  />
                </div>
                {/* Deep navy/forest-green gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A231C] via-[#0A231C]/45 to-transparent z-10 pointer-events-none" />
                
                {/* Overlay Text & Badge */}
                <div className="relative z-20 w-full flex flex-col gap-3">
                  <div>
                    <span className="inline-block px-3.5 py-1.5 bg-brand-gold text-white text-xs font-bold rounded-lg tracking-wider shadow-sm">
                      자료 기반 손해사정 검토
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-bold break-keep leading-relaxed text-brand-ivory drop-shadow-sm">
                    합의 전, 약관과 자료를 기준으로 먼저 확인합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Cards & CTA Area (lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {problemSituations.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <div 
                      key={idx} 
                      className="bg-white border border-brand-gold/20 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-gold/60 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-brand-ivory rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-gold/10 transition-colors">
                          <IconComponent className="w-5.5 h-5.5 text-brand-gold" />
                        </div>
                        <div className="pt-0.5">
                          <p className="text-base font-bold text-brand-primary leading-snug break-keep">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lower CTA */}
              <div className="mt-8 pt-8 border-t border-brand-line flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-sm font-semibold text-brand-charcoal text-center sm:text-left break-keep max-w-md">
                  “위 상황 중 하나라도 해당된다면, 서류를 먼저 확인해보는 것이 안전합니다.”
                </p>
                <a 
                  href="#contact" 
                  className="px-8 py-4 bg-brand-gold hover:bg-brand-lightGold text-white font-bold text-base rounded-xl shadow-lg shadow-brand-gold/20 active:scale-[0.98] transition-all text-center shrink-0 w-full sm:w-auto"
                >
                  내 상황 검토 요청하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Expert Advice Section (DKI 연동) */}
      {hasKeyword && getExpertContent(k || "") && (
        <section className="py-20 bg-brand-ivory/40 border-y border-brand-line">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-white/40 shadow-brand-gold/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <Quote className="w-32 h-32 text-brand-primary rotate-180" />
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold rounded-full text-xs font-bold mb-6">
                  <Lightbulb className="w-4 h-4" /> 전문가 쟁점 가이드
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black text-brand-primary mb-6 break-keep leading-snug">
                  {getExpertContent(k || "")?.deepDiveTitle}
                </h3>
                
                <p className="text-brand-muted text-base md:text-lg mb-8 leading-relaxed break-keep border-l-4 border-brand-gold pl-5">
                  {getExpertContent(k || "")?.summary}
                </p>
                
                <div className="grid gap-3.5 mb-8">
                  {getExpertContent(k || "")?.deepDiveContent.map((text, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-brand-ivory/60 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                      <p className="text-brand-charcoal font-medium text-sm md:text-base leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-brand-primary text-brand-white rounded-2xl text-center">
                  <p className="text-base md:text-lg font-bold break-keep leading-relaxed">
                    "{getExpertContent(k || "")?.keyPoint}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. 합의 전 체크포인트 Section */}
      <section className="py-16 md:py-24 bg-brand-white border-t border-brand-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column - 45% (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <div className="inline-block px-3.5 py-1.5 bg-brand-gold/10 text-brand-gold text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                합의 전 검토 기준
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-brand-primary mb-6 break-keep leading-tight">
                합의서에 서명하기 전,<br className="hidden sm:inline" />
                산정 근거부터 확인하세요
              </h2>
              
              <p className="text-brand-muted text-base md:text-lg mb-8 break-keep leading-relaxed font-light font-medium">
                {hasKeyword ? (
                  <>
                    {keyword}는 사건 유형에 따라 확인해야 할 자료와 판단 기준이 달라집니다.<br />
                    합의서 서명이나 보험사 안내에 동의하기 전, 보유한 서류를 기준으로 먼저 검토하는 것이 안전합니다.
                  </>
                ) : (
                  <>
                    보험사 안내만으로는 치료 기록, 과실 비율, 장해율, 약관상 지급 기준이 충분히 반영되었는지 알기 어렵습니다.<br className="hidden sm:inline" />
                    손해사정 검토는 제시된 금액이 적정한지 자료를 기준으로 확인하는 과정입니다.
                  </>
                )}
              </p>
              
              {/* Checkpoints */}
              <div className="space-y-4 mb-10 w-full">
                {[
                  "제시된 합의금의 산정 근거",
                  "치료 기록과 후유장해 반영 여부",
                  "부지급·감액 사유의 타당성"
                ].map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 py-1">
                    <div className="w-5.5 h-5.5 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                    </div>
                    <span className="text-base font-bold text-brand-primary break-keep">{point}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button & Help Text */}
              <div className="w-full sm:w-auto flex flex-col items-start gap-3">
                <a 
                  href="#contact" 
                  className="px-8 py-4.5 bg-brand-gold hover:bg-brand-lightGold text-white font-bold text-base rounded-xl shadow-lg shadow-brand-gold/20 active:scale-[0.98] transition-all text-center w-full sm:w-auto"
                >
                  내 서류 검토 요청하기
                </a>
                <span className="text-xs text-brand-muted font-medium pl-1 break-keep">
                  ※ 부산·경남 지역 방문 및 비대면 서류 검토 가능
                </span>
              </div>
            </div>
            
            {/* Right Column - 55% (lg:col-span-7) */}
            <div className="lg:col-span-7 w-full flex flex-col justify-center">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-brand-line aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/11] bg-brand-ivory flex items-center justify-center group outline outline-1 outline-offset-8 outline-brand-gold/15 hover:outline-brand-gold/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/20 to-transparent z-10" />
                <div className="absolute inset-0 opacity-90 group-hover:scale-[1.02] transition-transform duration-700 ease-out flex items-center justify-center">
                  <Image
                    src="/consulting-session.jpg"
                    alt="든든손해사정 자료 기반 검토"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="relative z-20 text-white p-8 sm:p-10 mt-auto w-full text-left">
                  <div className="flex items-center gap-2 mb-3.5">
                    <span className="text-xs font-bold tracking-widest text-brand-lightGold uppercase bg-brand-primary/40 px-3 py-1 rounded">
                      DOCUMENT BASED REVIEW
                    </span>
                  </div>
                  <p className="text-lg md:text-xl font-black break-keep leading-snug drop-shadow-md text-brand-ivory">
                    보험금·합의금은 감이 아니라,<br />
                    자료와 약관을 기준으로 검토해야 합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 주요 서비스 4가지 카드 Section */}
      <section className="py-16 md:py-24 bg-brand-ivory border-y border-brand-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            label="검토 분야"
            title="사고 유형별로 필요한 검토가 다릅니다" 
            sub={hasKeyword 
              ? `${keyword}를 포함한 교통사고, 산재, 후유장해, 보험금 분쟁은 각 사건별로 필요한 검토 자료가 다릅니다.<br />내 사건에 맞는 항목을 기준으로 보상 가능성과 산정 기준을 확인합니다.`
              : "교통사고, 산재, 후유장해, 보험금 분쟁은 확인해야 할 자료와 산정 기준이 다릅니다.<br />내 사건에 맞는 항목을 기준으로 보상 가능성을 검토합니다."
            } 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {mainServices.map((service, idx) => {
              const IconComponent = service.icon;
              return (
                <div key={idx} className="bg-white rounded-[2rem] border border-brand-gold/15 shadow-sm hover:shadow-md hover:border-brand-gold/60 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-full">
                  <div className="p-6 sm:p-7.5 flex flex-col h-full justify-between">
                    <div className="text-center flex flex-col items-center">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="inline-block px-2.5 py-1 bg-brand-gold/10 text-brand-gold text-xs font-bold rounded">{service.tag}</span>
                        <div className="w-8 h-8 rounded-lg bg-brand-ivory flex items-center justify-center shrink-0 group-hover:bg-brand-gold/10 transition-colors">
                          <IconComponent className="w-4.5 h-4.5 text-brand-gold" />
                        </div>
                      </div>
                      <h3 className="text-base sm:text-lg font-black mb-3 text-brand-primary leading-tight text-center">{service.title}</h3>
                      <p className="text-xs sm:text-sm text-brand-muted mb-5 leading-relaxed break-keep min-h-[48px] text-center">{service.desc}</p>
                    </div>
                    
                    <div className="space-y-1.5 bg-brand-ivory/40 p-3 sm:p-4 rounded-xl w-full text-left">
                      <p className="text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-1.5">핵심 검토</p>
                      {service.issues.map((issue, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-brand-charcoal">
                          <div className="w-1 h-1 bg-brand-gold rounded-full shrink-0" />
                          <span className="break-keep">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 sm:p-7.5 pt-0 mt-auto">
                    <a 
                      href="#contact" 
                      className="w-full py-3.5 bg-brand-primary hover:bg-brand-gold text-white rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
                    >
                      <span>{service.buttonText}</span> <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. 대표 검토 사례 Section (CaseSection 연동) */}
      <CaseSection keyword={keyword} />

      {/* 7. 투명한 업무 절차 Section */}
      <section className="py-20 md:py-28 bg-brand-ivory border-b border-brand-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            label="든든손해사정"
            title="보험금 검토는 이렇게 진행됩니다" 
            sub="상담부터 검토 결과 안내까지, 필요한 자료와 판단 근거를 단계별로 설명드립니다." 
          />
          
          <div className="relative max-w-5xl mx-auto mt-8">
            {/* Connecting line on desktop */}
            <div className="hidden lg:block absolute top-7 left-[8%] right-[8%] border-t border-dashed border-brand-line z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-12">
              {processSteps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                  {idx < processSteps.length - 1 && (
                    <div className="md:hidden absolute top-14 bottom-[-32px] left-1/2 w-[1px] border-l border-dashed border-brand-line z-0 pointer-events-none" />
                  )}
                  <div className="w-14 h-14 rounded-full bg-brand-white border border-brand-line shadow-sm flex items-center justify-center mb-4 group-hover:border-brand-gold group-hover:-translate-y-0.5 transition-all duration-300 relative z-10">
                    <span className="text-brand-gold font-black text-lg">{step.step}</span>
                  </div>
                  <h4 className="text-base font-bold text-brand-primary mb-2 break-keep">{step.title}</h4>
                  <p className="text-xs text-brand-muted break-keep leading-relaxed px-2 max-w-[280px] md:max-w-none">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="py-20 md:py-28 bg-brand-ivory border-t border-brand-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionTitle 
            title="자주 묻는 질문 (FAQ)" 
            sub="상담 진행 시 의뢰인분들께서 가장 자주 질문하시는 내용을 객관적 기준에 따라 정리해 드립니다."
          />
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-brand-white rounded-xl overflow-hidden border border-brand-line hover:border-brand-gold/50 transition-all group">
                <button 
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <div className="flex items-center gap-3.5 pr-6">
                    <div className="w-7 h-7 rounded-lg bg-brand-gold/10 flex items-center justify-center shrink-0 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                      <span className="text-brand-gold group-hover:text-white font-bold text-sm">Q</span>
                    </div>
                    <span className="text-base font-bold text-brand-primary break-keep">
                      {faq.q}
                    </span>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full bg-brand-ivory flex items-center justify-center transition-all duration-300 shrink-0", 
                    openFaq === idx && "rotate-180 bg-brand-gold text-white"
                  )}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <div className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  openFaq === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-1">
                      <div className="h-[1px] bg-brand-line mb-4" />
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-lg bg-brand-primary/5 flex items-center justify-center shrink-0">
                          <span className="text-brand-primary/40 font-bold text-sm">A</span>
                        </div>
                        <p className="text-brand-muted text-sm leading-[1.7] break-keep pt-0.5">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Contact Section */}
      <section id="contact" className="py-20 md:py-28 bg-brand-primary text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold via-transparent to-transparent scale-150" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-8 break-keep text-brand-white leading-tight">
                합의서에 서명하기 전,<br />
                <span className="text-brand-gold">보상 기준</span>부터<br />
                확인하세요
              </h2>
              <p className="text-white/70 text-base md:text-lg mb-10 leading-relaxed break-keep">
                {hasKeyword ? (
                  `${keyword} 문제로 합의, 부지급, 산재 판단이 고민된다면 보유한 서류 기준으로 먼저 검토를 요청해보세요.`
                ) : (
                  "보험사 안내가 맞는지, 제시된 금액이 적정한지는 진단서·치료기록·약관·사고경위를 함께 봐야 판단할 수 있습니다."
                )}
                <span className="block mt-4 text-brand-gold font-bold text-sm">
                  ※ 부산·경남 전 지역 방문 및 비대면 서류 검토 가능
                </span>
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col justify-between min-h-[100px]">
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-2">검토 기준</p>
                  <p className="text-brand-gold font-bold text-sm md:text-base leading-relaxed break-keep">
                    진단서 · 치료기록 · 약관 · 사고경위
                  </p>
                </div>
                <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col justify-between min-h-[100px]">
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-2">상담 방식</p>
                  <p className="text-brand-gold font-bold text-sm md:text-base leading-relaxed break-keep">
                    전화 · 카카오톡 · 방문 · 비대면 검토
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-brand-white p-8 md:p-10 rounded-2xl shadow-xl text-brand-charcoal">
              <h3 className="text-xl font-black mb-6 text-center text-brand-primary">보상 서류 사전 검토 요청</h3>
              <ContactForm keyword={keyword} />
              <p className="mt-6 text-[10px] text-brand-muted leading-relaxed text-center break-keep">
                든든손해사정은 보험약관, 의무기록, 사고경위 자료를 기준으로 손해액 산정 의견을 검토하는 손해사정 서비스입니다. 법률 자문이나 소송 대리를 수행하지 않으며, 필요한 경우 별도 전문가 연계를 안내드릴 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
