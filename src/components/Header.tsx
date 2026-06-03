"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import CTAButton from './CTAButton';
import { BRAND_NAME, BRAND_SLOGAN } from '@/lib/constants';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '진행 절차', href: '#process' },
    { name: '주요 사례', href: '#cases' },
    { name: '자주 묻는 질문', href: '#faq' },
    { name: '상담 의뢰서', href: '#contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300 py-3.5",
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-md border-b border-brand-line" : "bg-brand-primary/40 backdrop-blur-sm border-b border-white/5"
    )}>
      <div className="section-container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 shrink-0 transition-all duration-300 group-hover:rotate-3 shadow-md shadow-brand-gold/15 group-hover:shadow-brand-gold/25">
            <Image 
              src="/icon.svg" 
              alt={`${BRAND_NAME} 로고`}
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col -space-y-0.5">
            <span className={cn(
              "text-[9px] font-bold tracking-tight transition-colors duration-300",
              isScrolled ? "text-brand-muted" : "text-brand-ivory/70"
            )}>{BRAND_SLOGAN}</span>
            <span className={cn(
              "text-xl font-black tracking-tighter transition-colors duration-300",
              isScrolled ? "text-brand-primary" : "text-white"
            )}>든든<span className="text-brand-gold">손해사정</span></span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "font-black transition-all text-sm hover:text-brand-gold relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-gold after:transition-all hover:after:w-full",
                isScrolled ? "text-brand-primary/80" : "text-white/80"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            <CTAButton text="상담 문의" className="px-5 py-2.5 rounded-xl text-xs font-black shadow-md" />
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className={cn(
            "lg:hidden p-2 rounded-xl transition-colors",
            isScrolled ? "text-brand-primary hover:bg-slate-100" : "text-white hover:bg-white/10"
          )}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 열기"
        >
          {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={cn(
        "fixed inset-0 top-[67px] bg-brand-primary/98 backdrop-blur-lg z-40 lg:hidden transition-all duration-500 ease-in-out flex flex-col justify-between pb-24 border-t border-white/5",
        isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        <nav className="flex flex-col items-center gap-7 pt-16 px-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-xl font-black text-white hover:text-brand-gold transition-colors tracking-tight"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-8 w-full max-w-xs space-y-4">
            <CTAButton className="w-full py-4 rounded-xl shadow-lg" onClick={() => setIsMenuOpen(false)} />
          </div>
        </nav>
        
        <div className="text-center px-6">
          <p className="text-[11px] text-white/30 font-bold">{BRAND_SLOGAN}</p>
          <p className="text-sm text-white/50 font-black mt-1">{BRAND_NAME} 부산</p>
        </div>
      </div>
    </header>
  );
}
