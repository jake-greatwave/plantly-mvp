export interface CompanyFormData {
  main_image: string;
  company_name: string;
  business_number: string;
  intro_title: string;
  ceo_name: string;
  manager_name: string;
  manager_phone: string;
  manager_email: string;
  website: string;
  postcode: string;
  address: string;
  address_detail: string;

  parent_category: string;
  middle_category: string;
  category_ids: string[];
  custom_categories: string[];
  industries: string[];

  equipment_list: string[];
  materials: string[];
  trl_level: string;
  certifications: string[];

  project_title: string;
  achievements: string;
  partners: string;
  images: string[];
  video_url: string;

  countries: string[];
  lead_time: string;
  as_info: string;
  pricing_type: string;

  brand_color: string;
  content: string;
}

export const TRL_LEVELS = [
  { value: "prototype", label: "프로토타입" },
  { value: "mass_production", label: "양산 적용 가능" },
  { value: "global_standard", label: "글로벌 표준" },
];

export const PRICING_TYPES = [
  { value: "fixed", label: "고정 단가제" },
  { value: "consultation", label: "상담 후 결정" },
  { value: "project_based", label: "프로젝트별 상이" },
];

export const CERTIFICATIONS = [
  "ISO 9001 (품질경영)",
  "ISO 14001 (환경경영)",
  "ISO 45001 (안전보건)",
  "IATF 16949 (자동차 품질경영)",
  "자동차 OEM 품질 기준 대응 또는 SQ 인증",
  "KC 인증 대응",
  "CE 인증 대응",
  "UL 인증 대응",
  "클린 환경·청정 공정 요구사항 대응 가능",
  "특허 보유",
];

export const COUNTRIES = [
  "한국",
  "중국",
  "일본",
  "미국",
  "인도",
  "베트남",
  "태국",
  "인도네시아",
  "멕시코",
  "독일",
];

export const INDUSTRIES = [
  "자동차",
  "반도체",
  "이차전지",
  "디스플레이",
  "식품",
  "가전",
  "의료기기",
  "화학",
  "철강",
  "기계",
];
