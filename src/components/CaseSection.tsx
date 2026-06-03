"use client";
import React, { useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Quote,
  Car,
  AlertTriangle,
  Bike,
  HardHat,
  ClipboardList,
  Activity,
  Stethoscope,
  Scale,
  HeartPulse,
  Building,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { caseStudies } from '@/lib/caseData';
import { classifyKeyword } from '@/lib/dkiUtils';
import { BRAND_NAME } from '@/lib/constants';

export default function CaseSection({ keyword }: { keyword?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const theme = classifyKeyword(keyword || "");

  // 유입 키워드 분류 테마와 연계된 의뢰 사례 실시간 dynamic sorting 우선순위 정렬
  const sortedCases = React.useMemo(() => {
    if (!keyword) return caseStudies;
    
    return [...caseStudies].sort((a, b) => {
      let aMatch = false;
      let bMatch = false;
      
      if (theme === "traffic") {
        aMatch = ["교통사고", "12대 중과실", "오토바이 사고", "사망·중상해 사고"].includes(a.category);
        bMatch = ["교통사고", "12대 중과실", "오토바이 사고", "사망·중상해 사고"].includes(b.category);
      } else if (theme === "industrial") {
        aMatch = ["산재", "산재 장해", "직업병", "근재·사용자배상", "배상책임"].includes(a.category);
        bMatch = ["산재", "산재 장해", "직업병", "근재·사용자배상", "배상책임"].includes(b.category);
      } else if (theme === "insurance") {
        aMatch = ["보험금 분쟁", "후유장해", "암·질병 보험금", "배상책임"].includes(a.category);
        bMatch = ["보험금 분쟁", "후유장해", "암·질병 보험금", "배상책임"].includes(b.category);
      }
      
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }, [keyword, theme]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "교통사고":
        return <Car className="w-5 h-5 text-brand-gold shrink-0" />;
      case "12대 중과실":
        return <AlertTriangle className="w-5 h-5 text-brand-gold shrink-0" />;
      case "오토바이 사고":
        return <Bike className="w-5 h-5 text-brand-gold shrink-0" />;
      case "산재":
        return <HardHat className="w-5 h-5 text-brand-gold shrink-0" />;
      case "후유장해":
        return <ClipboardList className="w-5 h-5 text-brand-gold shrink-0" />;
      case "보험금 분쟁":
        return <FileText className="w-5 h-5 text-brand-gold shrink-0" />;
      case "산재 장해":
        return <Activity className="w-5 h-5 text-brand-gold shrink-0" />;
      case "직업병":
        return <Stethoscope className="w-5 h-5 text-brand-gold shrink-0" />;
      case "배상책임":
        return <Scale className="w-5 h-5 text-brand-gold shrink-0" />;
      case "암·질병 보험금":
        return <HeartPulse className="w-5 h-5 text-brand-gold shrink-0" />;
      case "근재·사용자배상":
        return <Building className="w-5 h-5 text-brand-gold shrink-0" />;
      case "사망·중상해 사고":
        return <ShieldAlert className="w-5 h-5 text-brand-gold shrink-0" />;
      default:
        return <FileText className="w-5 h-5 text-brand-gold shrink-0" />;
    }
  };

  return (
    <section id="cases" className="py-20 bg-brand-deep text-white relative overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-brand-gold/10 blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      
      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-black mb-6 break-keep leading-tight text-white">
              실제 상담에서 자주 확인하는<br />
              <span className="text-brand-gold">보상 쟁점</span>
            </h2>
            <p className="text-brand-ivory/80 text-base md:text-[17px] leading-relaxed break-keep font-semibold">
              합의금이 적정한지, 산재 불승인 사유가 타당한지, 보험금 감액 근거가 맞는지는<br />
              사건마다 확인해야 할 자료가 다릅니다.<br />
              <strong className="text-brand-gold font-black">{BRAND_NAME}</strong>은 진단서, 치료 기록, 약관, 사고 경위 자료를 기준으로 보상 쟁점을 검토합니다.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs text-white/50 font-bold tracking-wider">사례 더 보기</span>
            <div className="flex gap-2.5">
              <button 
                onClick={() => scroll('left')}
                className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all group active:scale-95 shadow-md"
                aria-label="이전 사례"
              >
                <ChevronLeft className="w-4.5 h-4.5 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all group active:scale-95 shadow-md"
                aria-label="다음 사례"
              >
                <ChevronRight className="w-4.5 h-4.5 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Swipe container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sortedCases.map((item) => (
            <div 
              key={item.id} 
              className="flex-shrink-0 w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
            >
              <div className="bg-brand-primary border border-white/10 rounded-[2.25rem] p-7 md:p-8 text-white h-full flex flex-col shadow-2xl hover:border-brand-gold/30 hover:shadow-brand-gold/5 transition-all duration-300 group">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                    <span className="text-brand-gold font-black text-xs tracking-wider uppercase">{item.category}</span>
                  </div>
                  {getCategoryIcon(item.category)}
                </div>

                <h3 className="text-lg md:text-xl font-black mb-5 break-keep leading-snug text-white/95 group-hover:text-brand-gold transition-colors">
                  {item.title}
                </h3>

                {/* Situation */}
                <div className="relative bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-5 flex-1">
                  <Quote className="absolute top-4 right-4 w-7 h-7 text-white/5 rotate-180 pointer-events-none" />
                  <p className="text-[10px] font-black text-brand-gold uppercase tracking-wider mb-2">의뢰인이 겪은 문제</p>
                  <p className="text-xs leading-relaxed text-brand-ivory/80 break-keep relative z-10 font-semibold">
                    "{item.situation}"
                  </p>
                </div>

                {/* Issues */}
                <div className="mb-6">
                  <p className="text-[10px] font-black text-brand-ivory/30 uppercase tracking-widest mb-2.5">핵심 검토 쟁점</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.keyIssues.map((issue, idx) => (
                      <span key={idx} className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/25 text-brand-lightGold rounded-full text-[10.5px] font-bold shadow-sm">
                        #{issue}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Solution */}
                <div className="mt-auto bg-brand-gold/10 rounded-2xl p-5 border border-brand-gold/20 relative overflow-hidden group-hover:bg-brand-gold/15 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-brand-gold/10">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                    <p className="text-[11px] font-black text-brand-gold uppercase tracking-wider">손해사정 검토 포인트</p>
                  </div>
                  <p className="text-xs text-brand-ivory/95 leading-relaxed break-keep font-semibold">
                    {item.direction}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden justify-center items-center gap-4 mt-6">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center active:scale-95"
            aria-label="이전 사례"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <span className="text-xs text-white/50 font-bold">좌우로 쓸어 넘겨보세요</span>
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center active:scale-95"
            aria-label="다음 사례"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        <p className="mt-6 text-[10px] text-white/20 leading-relaxed text-center break-keep max-w-4xl mx-auto font-medium">
          {keyword ? (
            `※ ${keyword}와 유사한 사건이라도 사고 경위, 진단 내용, 약관, 제출 자료에 따라 검토 방향은 달라질 수 있습니다.`
          ) : (
            "※ 위 사례는 상담 이해를 돕기 위한 예시이며, 실제 검토 결과는 사고 경위, 진단 내용, 약관, 제출 자료에 따라 달라질 수 있습니다."
          )}
        </p>
      </div>
    </section>
  );
}
