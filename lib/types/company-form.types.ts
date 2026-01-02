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
  category_ids: string[];
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
  "ISO9001",
  "ISO14001",
  "ISO45001",
  "IATF16949",
  "특허 보유",
  "KC인증",
  "CE인증",
  "UL인증",
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
