import React, { Suspense } from 'react';
import type { Metadata } from "next";
import localFont from 'next/font/local';
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTAButton from "@/components/CTAButton";
import { BASE_URL, BRAND_NAME, BRAND_SLOGAN } from '@/lib/constants';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const sCoreDream = localFont({
  src: [
    { path: '../fonts/SCDream1.otf', weight: '100', style: 'normal' },
    { path: '../fonts/SCDream2.otf', weight: '200', style: 'normal' },
    { path: '../fonts/SCDream3.otf', weight: '300', style: 'normal' },
    { path: '../fonts/SCDream4.otf', weight: '400', style: 'normal' },
    { path: '../fonts/SCDream5.otf', weight: '500', style: 'normal' },
    { path: '../fonts/SCDream6.otf', weight: '600', style: 'normal' },
    { path: '../fonts/SCDream7.otf', weight: '700', style: 'normal' },
    { path: '../fonts/SCDream8.otf', weight: '800', style: 'normal' },
    { path: '../fonts/SCDream9.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-score-dream'
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: `${BRAND_NAME} | ${BRAND_SLOGAN}`,
  description: "의무기록과 약관을 기준으로 보상 쟁점을 객관적으로 분석하는 든든손해사정입니다. 부산 전 지역 교통사고 합의금, 산재 보상금, 보험금 면책/삭감 분쟁 무상 서류 검토.",
  keywords: "든든손해사정, 부산 손해사정사, 부산 교통사고 손해사정, 부산 산재 손해사정, 부산 보험금 부지급, 후유장해 보험금, 손해액 산정",
  verification: {
    google: "deundeunsh_busan_google_verification_placeholder",
    // 네이버 서치어드바이저 소유권 확인 태그 (추후 확정 시 교체)
    other: {
      "naver-site-verification": "deundeunsh_busan_verification_placeholder",
    },
  },
  openGraph: {
    title: `${BRAND_NAME} | 정당한 보상의 기준`,
    description: "의무기록과 약관을 기준으로 보상 쟁점을 철저하게 검토합니다.",
    type: "website",
    locale: "ko_KR",
    siteName: BRAND_NAME,
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} 손해액 정밀 검토`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | ${BRAND_SLOGAN}`,
    description: "보험사 통보 전, 약관 규정과 치료 기록에 맞는 적합한 범위를 점검하세요.",
    images: [`${BASE_URL}/og-image.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className={`${inter.variable} ${sCoreDream.variable} font-sans`}>
        <Header />
        <main>{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <CTAButton variant="sticky" />
      </body>
    </html>
  );
}
