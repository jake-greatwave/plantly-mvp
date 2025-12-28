export interface AdminCompany {
  id: string;
  company_name: string;
  business_number: string;
  ceo_name: string;
  address: string | null;
  address_detail: string | null;
  logo_url: string | null;
  intro_title: string | null;
  industries: any;
  is_verified: boolean;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  company_images?: Array<{
    id: string;
    image_url: string;
    image_type: "main" | "portfolio" | "facility" | null;
    display_order: number;
  }>;
  company_categories?: Array<{
    category_id: string;
    categories: {
      id: string;
      category_name: string;
    } | null;
  }>;
}






