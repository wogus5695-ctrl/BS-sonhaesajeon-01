import { Metadata } from "next";
import SitemapContent from "./SitemapContent";
import { BASE_URL, BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `교통사고·산재·보험금 손해사정 상담 키워드 안내 | ${BRAND_NAME}`,
  description: "부산 전 지역 교통사고 합의금, 후유장해 보험금, 보험금 부지급, 산재 최초 불승인 이의신청 등 손해사정 상담이 필요한 주요 키워드를 확인하고 든든손해사정 무상 서류 검토 안내를 받을 수 있습니다.",
  openGraph: {
    title: `교통사고·산재·보험금 손해사정 상담 키워드 안내 | ${BRAND_NAME}`,
    description: "교통사고, 산재, 보험금 부지급 관련 부산 지역 전문 손해사정 상담 키워드 리스트.",
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/sitemap-busan`,
  }
};

export default function Page() {
  return <SitemapContent />;
}
