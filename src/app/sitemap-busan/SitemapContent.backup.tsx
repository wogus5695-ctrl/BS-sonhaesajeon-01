"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, Filter, Info, ChevronDown, MapPin, Building, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getAllKeywords, 
  KeywordItem,
  busanRegions
} from '@/lib/keywordData';
import { BRAND_NAME } from '@/lib/constants';

export default function SitemapContent() {
  const [activeCategory, setActiveCategory] = useState<"전체" | "부산 지역 상담" | "산재 특화 지역 상담">("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [openRegion, setOpenRegion] = useState<string | null>(null); // 접힘/펼침 UI 상태

  const allKeywords = getAllKeywords();

  // A. 부산 전체 대표 키워드 상단 노출용 추출 ("부산" 지명으로 생성된 16개 핵심 키워드)
  const topKeywords = useMemo(() => {
    return allKeywords.filter(k => k.region === "부산");
  }, [allKeywords]);

  // B. 구·군 단위 키워드 추출 ("부산"을 제외한 16개 행정 구역)
  const districtKeywords = useMemo(() => {
    return allKeywords.filter(k => k.region !== "부산");
  }, [allKeywords]);

  // 지역 구/군별 키워드 그룹핑
  const groupedByRegion = useMemo(() => {
    const grouped: Record<string, KeywordItem[]> = {};
    districtKeywords.forEach(item => {
      if (!grouped[item.region]) {
        grouped[item.region] = [];
      }
      grouped[item.region].push(item);
    });
    return grouped;
  }, [districtKeywords]);

  const regionsList = useMemo(() => Object.keys(groupedByRegion), [groupedByRegion]);

  // 카테고리/검색 필터 적용
  const filteredTopKeywords = useMemo(() => {
    return topKeywords.filter(item => {
      const matchCategory = activeCategory === "전체" || item.category === activeCategory;
      const matchSearch = item.label.includes(searchQuery) || item.service.includes(searchQuery);
      return matchCategory && matchSearch;
    });
  }, [topKeywords, activeCategory, searchQuery]);

  const toggleRegion = (region: string) => {
    setOpenRegion(openRegion === region ? null : region);
  };

  return (
    <div className="bg-brand-ivory min-h-screen text-brand-primary">
      {/* 1. Hero Section (H1 하나만 사용 규정 준수) */}
      <section className="pt-32 pb-16 bg-brand-primary text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-3/4 w-80 h-80 rounded-full bg-brand-gold/10 blur-[100px] pointer-events-none -translate-y-1/2" />
        
        <div className="section-container relative z-10 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-black mb-8 break-keep leading-tight tracking-tight">
            부산 손해사정 상담 키워드 안내
          </h1>
          <p className="text-brand-ivory/70 text-sm md:text-base leading-relaxed break-keep mb-10 font-semibold">
            부산 지역의 교통사고 합의금, 산재 불승인, 보험금 부지급, 후유장해 보험금 등 손해사정 상담이 필요한 상황별 키워드를 확인할 수 있습니다. 각 키워드를 선택하면 해당 상황에 맞는 상담 안내 페이지로 이동합니다.
          </p>
          
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            <input 
              type="text" 
              placeholder="골절, 장해등급, 산재 불승인 등 찾고 계신 보상 키워드를 검색하세요."
              className="w-full bg-white/10 border border-white/15 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:bg-white/20 focus:border-brand-gold transition-all text-white placeholder:text-white/30 text-xs font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 2. Category Tabs */}
      <section className="py-5 border-b border-brand-line sticky top-[72px] bg-white/95 backdrop-blur-md z-30 shadow-sm">
        <div className="section-container overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            <span className="flex items-center gap-2 text-xs font-black text-brand-primary mr-4 bg-brand-ivory px-3.5 py-2 rounded-xl shrink-0 border border-brand-line">
              <Filter className="w-4 h-4 text-brand-gold" /> 카테고리 필터
            </span>
            {(["전체", "부산 지역 상담", "산재 특화 지역 상담"] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 hover:-translate-y-0.5 active:scale-95",
                  activeCategory === cat 
                    ? "bg-brand-gold text-white shadow-md shadow-brand-gold/15" 
                    : "bg-brand-ivory text-brand-muted hover:bg-brand-line/60"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Top Keywords Section (부산 전체 대표 키워드 상단 노출) */}
      <section className="py-16">
        <div className="section-container max-w-5xl">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-black text-brand-primary mb-3 flex items-center gap-2.5">
              <Building className="w-5 h-5 text-brand-gold" />
              부산 광역 대표 상담 키워드
            </h2>
            <p className="text-brand-muted text-xs md:text-sm leading-relaxed font-semibold">
              부산광역시 전역을 아우르는 대표적인 손해사정 상담 쟁점 키워드 리스트입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredTopKeywords.map((item) => (
              <Link 
                key={item.slug} 
                href={item.url}
                className="group p-4 bg-white border border-brand-line rounded-2xl hover:border-brand-gold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-between shadow-sm"
              >
                <span className="text-[13.5px] font-black text-brand-primary group-hover:text-brand-gold transition-colors truncate pr-2">
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4 text-brand-line group-hover:text-brand-gold group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
            {filteredTopKeywords.length === 0 && (
              <div className="col-span-full py-8 text-center text-xs text-brand-muted font-bold">
                상단 카테고리 필터 혹은 검색어 조건에 부합하는 대표 키워드가 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Collapsible Districts Section (구·군 단위 키워드 접힘/펼침 UI로 정리) */}
      <section className="py-12 bg-white border-t border-brand-line">
        <div className="section-container max-w-5xl">
          <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-black text-brand-primary mb-3 flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-brand-gold animate-bounce" />
              부산 구·군 단위 보상 키워드 (접힘/펼침)
            </h2>
            <p className="text-brand-muted text-xs md:text-sm leading-relaxed font-semibold">
              부산의 16개 행정 구/군별 맞춤형 세부 키워드 목록입니다. 각 구/군 카드를 선택(클릭)하여 펼치시면 상세한 링크 리스트가 노출됩니다.
            </p>
          </div>

          <div className="space-y-4">
            {regionsList.map(regionName => {
              const items = groupedByRegion[regionName].filter(item => {
                const matchCategory = activeCategory === "전체" || item.category === activeCategory;
                const matchSearch = item.label.includes(searchQuery) || item.service.includes(searchQuery);
                return matchCategory && matchSearch;
              });

              // 만약 검색결과가 없는 지역 카드라면 화면에 굳이 노출하지 않음
              if (items.length === 0) return null;

              const isOpen = openRegion === regionName;

              return (
                <div 
                  key={regionName} 
                  className="bg-brand-ivory border border-brand-line rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                >
                  <button
                    onClick={() => toggleRegion(regionName)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-brand-line/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                      <span className="text-[15px] font-black text-brand-primary">{regionName} 지역 보상 키워드</span>
                      <span className="text-[10px] font-bold bg-brand-primary/5 text-brand-primary/60 px-2 py-0.5 rounded-full border border-brand-line">
                        {items.length}개 키워드
                      </span>
                    </div>
                    <div className={cn(
                      "w-7 h-7 rounded-full bg-white flex items-center justify-center border border-brand-line text-brand-primary transition-all duration-300",
                      isOpen && "rotate-180 bg-brand-gold text-white border-brand-gold"
                    )}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <div className={cn(
                    "grid transition-all duration-300 ease-in-out bg-white",
                    isOpen ? "grid-rows-[1fr] opacity-100 border-t border-brand-line" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  )}>
                    <div className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2.5">
                          {items.map(item => (
                            <Link
                              key={item.slug}
                              href={item.url}
                              className="text-xs font-black bg-brand-ivory border border-brand-line/60 text-brand-muted hover:border-brand-gold hover:text-brand-gold hover:bg-white px-3.5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1 hover:-translate-y-0.5 active:scale-95"
                            >
                              {item.label}
                              <ChevronRight className="w-3 h-3 text-brand-line shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-24 bg-brand-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold via-transparent to-transparent scale-150" />
        </div>
        <div className="section-container text-center relative z-10 max-w-2xl">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-6 break-keep leading-tight">
            개별 자료를 기준으로 정교하게 분석합니다
          </h2>
          <p className="text-brand-ivory/60 text-xs md:text-sm mb-12 max-w-xl mx-auto break-keep leading-relaxed font-semibold">
            사고 경위 자료, 신체 장해 진단서, 개별 약관 면책 규정을 객관적으로 대조해야 합당한 보상이 실현됩니다. 든든손해사정이 동행하겠습니다.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/#contact" 
              className="bg-brand-gold text-white text-base px-12 py-5 rounded-2xl font-black shadow-lg shadow-brand-gold/10 hover:bg-brand-gold/90 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
            >
              무상 분석 자문 신청
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
