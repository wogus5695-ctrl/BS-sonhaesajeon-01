"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  BRAND_NAME, 
  BRAND_SLOGAN,
  REPRESENTATIVE_NAME, 
  BUSINESS_REGISTRATION_NUMBER, 
  OFFICE_ADDRESS, 
  PHONE_NUMBER, 
  CALL_CENTER_HOURS, 
  SERVICE_REGION 
} from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const searchParams = useSearchParams();
  const k = searchParams.get('k');
  let decodedK = "";
  if (k) {
    try {
      decodedK = decodeURIComponent(k);
      if (decodedK.includes('%')) {
        decodedK = decodeURIComponent(decodedK);
      }
    } catch (e) {
      decodedK = k;
    }
  }
  const keyword = decodedK.replace(/-/g, ' ').replace(/[<>]/g, '').trim();

  return (
    <footer className="bg-brand-primary text-white/50 py-20 px-4 border-t border-brand-line/10 relative overflow-hidden">
      {/* Background glowing design orb */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 shrink-0">
                <Image 
                  src="/icon.svg" 
                  alt={`${BRAND_NAME} 로고`}
                  fill
                  className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-xl font-black text-white tracking-tighter">든든<span className="text-brand-gold">손해사정</span></span>
            </Link>
            
            <p className="text-brand-gold/90 text-xs font-black tracking-tight">{BRAND_SLOGAN}</p>
            
            <p className="max-w-xl text-sm leading-relaxed text-brand-ivory/60 break-keep font-medium">
              보험 소비자의 편에 서서 사고자료와 약관 규정 자료를 기준으로 보상 타당성을 철저하게 분석하고 검토합니다. 
              교통사고 장해 감정, 산업재해 최초 기각 불승인 이의신청용 소명 의견서 작성, 각종 중증 질환 보험 청구 거절 다툼 등 객관적 서류 중심의 든든한 조력을 제공합니다.
            </p>
            
            {/* 법적 고지 준수 필터 (금지어 제거 / 허용어 적용) */}
            <div className="bg-white/[0.02] p-5 rounded-2xl border border-brand-line/10 max-w-xl">
              <p className="text-[11px] text-brand-ivory/40 leading-relaxed break-keep font-semibold">
                든든손해사정은 {keyword ? `[${keyword}] 관련 ` : ""}의무 기록 차트 해독, 정밀 치료 판독 소견 검토, 사고 자료를 기준으로 한 손해액 산정 및 확인 업무를 대행합니다. 
                변호사법 제109조를 성실히 준수하여 합의 조정 대행이나 소송의 직접 수행 등 법률 대리에 해당하는 행위는 일절 대리하지 않으며, 필요한 경우 관련 전문가 협업을 안내할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black text-base border-l-2 border-brand-gold pl-3 tracking-tight">상담 센터 안내</h4>
            <ul className="space-y-4 text-sm text-brand-ivory/70">
              <li>
                <span className="block text-[11px] text-white/40 font-bold uppercase tracking-wider mb-1">상담 운영 시간</span> 
                {CALL_CENTER_HOURS}
              </li>
              <li>
                <span className="block text-[11px] text-white/40 font-bold uppercase tracking-wider mb-1">대면 지원 지역</span> 
                <span className="text-brand-gold font-black">{SERVICE_REGION}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-brand-line/10 flex flex-col md:flex-row justify-between gap-6 text-xs text-brand-ivory/30">
          <div className="space-y-2 font-medium">
            <p>© {currentYear} {BRAND_NAME}. All Rights Reserved.</p>
            <p>상호명: {BRAND_NAME} | 대표자: {REPRESENTATIVE_NAME} | 사업자등록번호: {BUSINESS_REGISTRATION_NUMBER}</p>
            <p>주소: {OFFICE_ADDRESS}</p>
          </div>
          <div className="flex gap-6 items-end">
            <span className="hover:text-white/50 cursor-pointer">개인정보처리방침</span>
            <span className="hover:text-white/50 cursor-pointer">이용약관</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
