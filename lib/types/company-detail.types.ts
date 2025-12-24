import type { Database } from "./database.types";

export type CompanyDetail = Database["public"]["Tables"]["companies"]["Row"] & {
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
      parent_id: string | null;
      category_name: string;
    } | null;
  }>;
  company_regions?: Array<{
    region_id: string;
    regions: {
      id: string;
      region_name: string;
      region_type: "location" | "country";
    } | null;
  }>;
  company_tags?: Array<{
    id: string;
    tag_name: string;
  }>;
};



