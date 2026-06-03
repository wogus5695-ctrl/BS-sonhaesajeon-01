"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Phone, Check, ShieldAlert } from 'lucide-react';
import { GOOGLE_SCRIPT_URL, PHONE_NUMBER } from '@/lib/constants';

const documentOptions = [
  "진단서",
  "치료기록",
  "보험사 안내문",
  "교통사고 사실확인원",
  "산재 관련 서류",
  "아직 준비 전"
];

export default function ContactForm({ keyword }: { keyword?: string }) {
  const currentKeyword = keyword || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    region: '',
    accidentType: '교통사고',
    status: '보험사 합의 제안 전',
    documents: [] as string[],
    content: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleDocumentChange = (doc: string) => {
    setFormData(prev => {
      const documents = prev.documents.includes(doc)
        ? prev.documents.filter(d => d !== doc)
        : [...prev.documents, doc];
      return { ...prev, documents };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.content) {
      alert('성함, 연락처, 세부 문의내용은 필수 기입 사항입니다.');
      return;
    }

    if (!formData.consent) {
      alert('개인정보 활용 동의서에 체크를 완료해 주십시오.');
      return;
    }

    setIsSubmitting(true);

    // Append documents info to content to ensure it is logged regardless of Google Sheet column structure
    const docsString = formData.documents.length > 0 ? `[보유서류: ${formData.documents.join(', ')}] ` : '[보유서류: 아직 준비 전] ';
    const enrichedContent = docsString + formData.content;

    const submissionData = {
      name: formData.name,
      phone: formData.phone,
      region: formData.region,
      accidentType: formData.accidentType,
      status: formData.status,
      content: enrichedContent,
      documents: formData.documents.join(', '),
      consent: formData.consent,
      currentKeyword,
      submittedAt: new Date().toLocaleString('ko-KR'),
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      alert('보상 서류 검토 요청이 완료되었습니다. 확인 후 담당 손해사정사가 빠르게 유선으로 연락해 검토 방향을 공유해 드리겠습니다.');
      
      setFormData({
        name: '',
        phone: '',
        region: '',
        accidentType: '교통사고',
        status: '보험사 합의 제안 전',
        documents: [],
        content: '',
        consent: false
      });
    } catch (error) {
      console.error('API 송출 중 오류:', error);
      alert('데이터 전송 도중 일시적인 오류가 발생했습니다. 대표번호로 유선 연락 주시면 즉시 서류 검토를 진행해 드리겠습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-brand-primary">
      {/* 1 & 2. 성함 & 연락처 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-black text-brand-primary mb-1.5 flex items-center gap-1">
            <span>성함</span>
            <span className="text-red-500 font-bold">*</span>
            <span className="text-[10px] text-brand-muted font-normal">(필수)</span>
          </label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력해주세요"
            required
            className="w-full px-4 py-3.5 bg-brand-ivory/50 border border-brand-line rounded-xl focus:outline-none focus:border-brand-deep focus:bg-white transition-all text-xs font-bold"
          />
        </div>
        <div>
          <label className="block text-[13px] font-black text-brand-primary mb-1.5 flex items-center gap-1">
            <span>연락처</span>
            <span className="text-red-500 font-bold">*</span>
            <span className="text-[10px] text-brand-muted font-normal">(필수)</span>
          </label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="010-0000-0000"
            required
            className="w-full px-4 py-3.5 bg-brand-ivory/50 border border-brand-line rounded-xl focus:outline-none focus:border-brand-deep focus:bg-white transition-all text-xs font-bold"
          />
        </div>
      </div>

      {/* 3 & 4. 사고/보험 유형 & 현재 진행 상황 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-black text-brand-primary mb-1.5 flex items-center gap-1">
            <span>사고/보험 유형</span>
            <span className="text-red-500 font-bold">*</span>
            <span className="text-[10px] text-brand-muted font-normal">(필수)</span>
          </label>
          <div className="relative">
            <select 
              name="accidentType"
              value={formData.accidentType}
              onChange={handleChange}
              className="w-full pl-4 pr-10 py-3.5 bg-brand-ivory/50 border border-brand-line rounded-xl focus:outline-none focus:border-brand-deep focus:bg-white transition-all text-xs font-bold appearance-none cursor-pointer"
            >
              <option value="교통사고">교통사고</option>
              <option value="12대 중과실 교통사고">12대 중과실 교통사고</option>
              <option value="산재 불승인">산재 불승인</option>
              <option value="산재 장해등급">산재 장해등급</option>
              <option value="후유장해">후유장해</option>
              <option value="보험금 부지급·감액">보험금 부지급·감액</option>
              <option value="오토바이 사고">오토바이 사고</option>
              <option value="질병·암 보험금">질병·암 보험금</option>
              <option value="기타">기타</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-brand-muted text-[10px]">
              ▼
            </div>
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-black text-brand-primary mb-1.5 flex items-center gap-1">
            <span>현재 진행 상황</span>
            <span className="text-red-500 font-bold">*</span>
            <span className="text-[10px] text-brand-muted font-normal">(필수)</span>
          </label>
          <div className="relative">
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full pl-4 pr-10 py-3.5 bg-brand-ivory/50 border border-brand-line rounded-xl focus:outline-none focus:border-brand-deep focus:bg-white transition-all text-xs font-bold appearance-none cursor-pointer"
            >
              <option value="보험사 합의 제안 전">보험사 합의 제안 전</option>
              <option value="보험사 합의 제안 받음">보험사 합의 제안 받음</option>
              <option value="합의 전 검토 필요">합의 전 검토 필요</option>
              <option value="보험금 부지급·감액 통보">보험금 부지급·감액 통보</option>
              <option value="산재 불승인 통보">산재 불승인 통보</option>
              <option value="치료 중">치료 중</option>
              <option value="치료 종결 후 장해 검토">치료 종결 후 장해 검토</option>
              <option value="기타">기타</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-brand-muted text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* 5. 보유 서류 (선택) - Checklist 2 columns on desktop, 1 column on mobile */}
      <div>
        <label className="block text-[13px] font-black text-brand-primary mb-2 flex items-center gap-1">
          <span>보유 서류</span>
          <span className="text-[10px] text-brand-muted font-normal">(선택 · 다중 선택 가능)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-brand-ivory/30 p-4 rounded-xl border border-brand-line/50">
          {documentOptions.map((doc, idx) => {
            const isChecked = formData.documents.includes(doc);
            return (
              <div 
                key={idx} 
                onClick={() => handleDocumentChange(doc)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all select-none text-xs font-bold",
                  isChecked 
                    ? "bg-brand-primary text-white border-brand-primary" 
                    : "bg-white border-brand-line text-brand-primary hover:bg-brand-ivory/50"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center transition-all",
                  isChecked ? "bg-brand-gold border-brand-gold text-brand-primary" : "border-brand-line bg-white"
                )}>
                  {isChecked && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                </div>
                <span>{doc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. 거주 지역 (선택) */}
      <div>
        <label className="block text-[13px] font-black text-brand-primary mb-1.5 flex items-center gap-1">
          <span>거주 지역</span>
          <span className="text-[10px] text-brand-muted font-normal">(선택)</span>
        </label>
        <input 
          type="text" 
          name="region"
          value={formData.region}
          onChange={handleChange}
          placeholder="예: 부산 해운대구, 경남 김해시 등"
          className="w-full px-4 py-3.5 bg-brand-ivory/50 border border-brand-line rounded-xl focus:outline-none focus:border-brand-deep focus:bg-white transition-all text-xs font-bold"
        />
      </div>

      {/* 7. 의뢰 내용 (필수) */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-[13px] font-black text-brand-primary flex items-center gap-1">
            <span>의뢰 내용</span>
            <span className="text-red-500 font-bold">*</span>
            <span className="text-[10px] text-brand-muted font-normal">(필수)</span>
          </label>
        </div>
        <textarea 
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={4}
          placeholder={`의뢰 내용을 입력해주세요.
예: 보험사에서 합의금을 제안받았는데 적정한지 궁금합니다.
예: 산재 불승인 통보를 받았고 재검토가 가능한지 알고 싶습니다.
예: 치료 후 통증이 남아 후유장해 보상 검토가 필요합니다.`}
          required
          className="w-full px-4 py-3.5 bg-brand-ivory/50 border border-brand-line rounded-xl focus:outline-none focus:border-brand-deep focus:bg-white transition-all text-xs font-bold resize-none leading-relaxed"
        ></textarea>
      </div>

      {/* 8. 개인정보 동의 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="privacy" 
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              required
              className="w-4 h-4 accent-brand-primary cursor-pointer" 
            />
            <label htmlFor="privacy" className="text-xs font-bold text-brand-primary cursor-pointer select-none">
              개인정보 수집 및 상담 이용 동의 (필수)
            </label>
          </div>
          <button 
            type="button" 
            onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
            className="text-[11px] text-brand-muted underline hover:text-brand-primary font-bold"
          >
            약관보기
          </button>
        </div>
        
        {isPrivacyOpen && (
          <div className="p-4 bg-brand-ivory border border-brand-line rounded-xl text-[10px] text-brand-muted leading-relaxed space-y-1 font-semibold">
            <p>1. 개인정보 수집 목적: 성명, 연락처, 지역 등의 상담 정보 전송 및 보상 서류 검토 분석 연계</p>
            <p>2. 보존 및 소멸 기간: 사전 자료 분석 상담 완료일로부터 3개월 후 자동 소멸 파기 처리</p>
            <p>3. 거부 권리: 동의를 거부하실 수 있으나, 거부 시 든든손해사정의 무상 자문 검토가 어려울 수 있습니다.</p>
          </div>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3 pt-2">
        <button 
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full py-4 bg-brand-primary border border-transparent hover:bg-brand-deep hover:border-brand-gold hover:text-brand-lightGold text-white font-black text-base rounded-xl transition-all shadow-md active:scale-95",
            isSubmitting ? "bg-slate-300 cursor-not-allowed text-white/50 border-transparent hover:text-white/50 hover:bg-slate-300 hover:border-transparent" : "shadow-brand-primary/10"
          )}
        >
          {isSubmitting ? "보상 서류 검토 요청 중..." : "보상 서류 검토 요청하기"}
        </button>

        <a 
          href={`tel:${PHONE_NUMBER}`} 
          className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-brand-primary text-brand-primary font-black text-base rounded-xl hover:bg-brand-primary/5 transition-all active:scale-95"
        >
          <Phone className="w-4 h-4 text-brand-gold" /> 전화로 바로 상담하기
        </a>
      </div>
    </form>
  );
}
