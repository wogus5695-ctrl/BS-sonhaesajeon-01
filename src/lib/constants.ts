/**
 * 든든손해사정(부산) 홈페이지 프로젝트 전역 상수
 * 
 * 1번과 2번에 지칭된 고객 정보 및 DB 연동 주소입니다.
 * 향후 정보가 확정되면 이 파일의 값만 알맞게 교체하시면 사이트 전반 및 구조화 데이터(SEO)에 일괄 반영됩니다.
 */

// 1. 브랜드 및 서비스 기본 정보
export const BRAND_NAME = "든든손해사정";
export const BRAND_SLOGAN = "부산 교통사고·산재·보험금 손해사정 상담";
export const BRAND_CORP_NAME = "든든손해사정법인 부산지사"; 

// 2. 메인 카피 및 서브 카피 (지정된 카피 준수)
export const MAIN_HERO_COPY = `부산 교통사고·산재·보험금 문제,
자료와 기준으로 든든하게 검토합니다.`;

export const SUB_HERO_COPY = `합의금이 적정한지, 산재 불승인 사유를 다시 확인할 수 있는지,
보험금 부지급 사유가 타당한지 사고자료와 의무기록을 기준으로 검토합니다.`;

// 3. 연락처 및 상담 시간
export const PHONE_NUMBER = "010-4667-5568"; 
export const CALL_CENTER_HOURS = "평일 09:00 - 18:00 (주말/공휴일 휴무)";
export const SERVICE_REGION = "부산 및 경남 전 지역 방문 상담 지원";

// 4. 사업자 정보 및 주소 (부산 지역성 반영 및 연제구청/시청 근처 가상 매핑)
export const REPRESENTATIVE_NAME = "김재현"; 
export const BUSINESS_REGISTRATION_NUMBER = "405-15-02677"; 
export const OFFICE_ADDRESS = "부산광역시 연제구 중앙대로 1001"; // 부산 연제구 임시 주소

// 5. 지도 매핑 및 ProfessionalService JSON-LD 위경도 좌표 (부산 중심 좌표)
export const OFFICE_LATITUDE = 35.1796;
export const OFFICE_LONGITUDE = 129.0756;
export const OFFICE_POSTAL_CODE = "47545";

// 6. 도메인 설정 (Canonical 및 Sitemap.xml 배포 주소)
export const BASE_URL = "https://www.bssonhaesajeon.co.kr"; 

// 7. 구글 스프레드시트 연동 접수처 API URL
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzURn6G0gd2FrfOiOF--VCgwz-h_J6q6e1HDviPCnbsUDSFt5-Y-7xcboUCafOdpx3Z/exec";

// 8. 구글 스프레드시트 검증용 SECRET_TOKEN (사용자가 Apps Script에 설정한 토큰값으로 변경하여 사용)
export const SECRET_TOKEN = "YOUR_SECRET_TOKEN";
