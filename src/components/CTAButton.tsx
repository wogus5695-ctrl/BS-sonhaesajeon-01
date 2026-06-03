import { Phone, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PHONE_NUMBER } from '@/lib/constants';

interface CTAButtonProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'sticky';
  text?: string;
  phone?: string;
  onClick?: () => void;
}

export default function CTAButton({ 
  className, 
  variant = 'primary', 
  text = '무료 전화상담 신청',
  phone = PHONE_NUMBER,
  onClick
}: CTAButtonProps) {
  if (variant === 'sticky') {
    return (
      <div className="fixed bottom-0 left-0 z-50 w-full flex bg-white border-t border-brand-line md:hidden animate-fade-up shadow-[0_-8px_25px_rgba(15,39,66,0.1)]">
        <a 
          href={`tel:${phone}`}
          className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 bg-white text-brand-primary active:bg-brand-ivory transition-colors border-r border-brand-line"
        >
          <Phone className="w-5 h-5 text-brand-gold animate-pulse" />
          <span className="text-[11px] font-black tracking-tight">전화 상담</span>
        </a>
        <a 
          href="#contact"
          className="flex-[1.6] flex items-center justify-center gap-2 py-4 bg-brand-gold text-white font-black text-lg active:bg-brand-gold/90 transition-all shadow-inner"
        >
          <FileText className="w-5 h-5" />
          사전 분석 접수
        </a>
      </div>
    );
  }

  const baseStyles = variant === 'primary' 
    ? 'bg-brand-gold hover:bg-brand-gold/90 text-white font-black text-center inline-flex items-center justify-center rounded-xl shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300' 
    : 'border-2 border-brand-gold text-brand-gold hover:bg-brand-gold/5 font-black text-center inline-flex items-center justify-center rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300';

  return (
    <a 
      href={`tel:${phone}`}
      className={cn(baseStyles, "gap-2.5", className)}
      onClick={onClick}
    >
      <Phone className="w-4 h-4" />
      {text}
    </a>
  );
}
