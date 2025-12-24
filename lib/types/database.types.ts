export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          name: string;
          phone: string | null;
          status: "active" | "suspended";
          user_grade: "basic" | "enterprise" | "enterprise_trial";
          is_admin: boolean;
          trial_end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          name: string;
          phone?: string | null;
          status?: "active" | "suspended";
          user_grade?: "basic" | "enterprise" | "enterprise_trial";
          is_admin?: boolean;
          trial_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string;
          name?: string;
          phone?: string | null;
          status?: "active" | "suspended";
          user_grade?: "basic" | "enterprise" | "enterprise_trial";
          is_admin?: boolean;
          trial_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      upgrade_surveys: {
        Row: {
          id: string;
          user_id: string;
          feature_used: string | null;
          q1_needs: "very_important" | "normal" | "not_important";
          q2_price: "very_cheap" | "reasonable" | "somewhat_expensive" | "too_expensive";
          q3_wtp: "basic" | "standard" | "premium" | "enterprise";
          q3_etc: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          feature_used?: string | null;
          q1_needs: "very_important" | "normal" | "not_important";
          q2_price: "very_cheap" | "reasonable" | "somewhat_expensive" | "too_expensive";
          q3_wtp: "basic" | "standard" | "premium" | "enterprise";
          q3_etc?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          feature_used?: string | null;
          q1_needs?: "very_important" | "normal" | "not_important";
          q2_price?: "very_cheap" | "reasonable" | "somewhat_expensive" | "too_expensive";
          q3_wtp?: "basic" | "standard" | "premium" | "enterprise";
          q3_etc?: string | null;
          created_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          user_id: string;
          business_number: string;
          company_name: string;
          ceo_name: string;
          establishment_date: string | null;
          postcode: string | null;
          address: string | null;
          address_detail: string | null;
          manager_name: string | null;
          manager_position: string | null;
          manager_phone: string | null;
          manager_email: string | null;
          website: string | null;
          logo_url: string | null;
          intro_title: string | null;
          intro_content: string | null;
          equipment: Json | null;
          materials: Json | null;
          trl_level: string | null;
          certifications: Json | null;
          industries: Json | null;
          project_title: string | null;
          achievements: string | null;
          partners: string | null;
          video_url: string | null;
          lead_time: string | null;
          as_info: string | null;
          pricing_type: string | null;
          brand_color: string | null;
          is_verified: boolean;
          is_featured: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_number: string;
          company_name: string;
          ceo_name: string;
          establishment_date?: string | null;
          postcode?: string | null;
          address?: string | null;
          address_detail?: string | null;
          manager_name?: string | null;
          manager_position?: string | null;
          manager_phone?: string | null;
          manager_email?: string | null;
          website?: string | null;
          logo_url?: string | null;
          intro_title?: string | null;
          intro_content?: string | null;
          equipment?: Json | null;
          materials?: Json | null;
          trl_level?: string | null;
          certifications?: Json | null;
          industries?: Json | null;
          project_title?: string | null;
          achievements?: string | null;
          partners?: string | null;
          video_url?: string | null;
          lead_time?: string | null;
          as_info?: string | null;
          pricing_type?: string | null;
          brand_color?: string | null;
          is_verified?: boolean;
          is_featured?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_number?: string;
          company_name?: string;
          ceo_name?: string;
          establishment_date?: string | null;
          postcode?: string | null;
          address?: string | null;
          address_detail?: string | null;
          manager_name?: string | null;
          manager_position?: string | null;
          manager_phone?: string | null;
          manager_email?: string | null;
          website?: string | null;
          logo_url?: string | null;
          intro_title?: string | null;
          intro_content?: string | null;
          equipment?: Json | null;
          materials?: Json | null;
          trl_level?: string | null;
          certifications?: Json | null;
          industries?: Json | null;
          project_title?: string | null;
          achievements?: string | null;
          partners?: string | null;
          video_url?: string | null;
          lead_time?: string | null;
          as_info?: string | null;
          pricing_type?: string | null;
          brand_color?: string | null;
          is_verified?: boolean;
          is_featured?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          category_name: string;
          category_code: string;
          icon_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id?: string | null;
          category_name: string;
          category_code: string;
          icon_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string | null;
          category_name?: string;
          category_code?: string;
          icon_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      company_categories: {
        Row: {
          id: string;
          company_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          category_id?: string;
          created_at?: string;
        };
      };
      regions: {
        Row: {
          id: string;
          region_type: "location" | "country";
          region_name: string;
          region_code: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          region_type: "location" | "country";
          region_name: string;
          region_code: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          region_type?: "location" | "country";
          region_name?: string;
          region_code?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      company_regions: {
        Row: {
          id: string;
          company_id: string;
          region_id: string;
          region_type: "location" | "country";
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          region_id: string;
          region_type: "location" | "country";
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          region_id?: string;
          region_type?: "location" | "country";
          created_at?: string;
        };
      };
      company_images: {
        Row: {
          id: string;
          company_id: string;
          image_url: string;
          image_type: "main" | "portfolio" | "facility" | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          image_url: string;
          image_type?: "main" | "portfolio" | "facility" | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          image_url?: string;
          image_type?: "main" | "portfolio" | "facility" | null;
          display_order?: number;
          created_at?: string;
        };
      };
      company_tags: {
        Row: {
          id: string;
          company_id: string;
          tag_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          tag_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          tag_name?: string;
          created_at?: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          company_id: string;
          user_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          content: string;
          status: "pending" | "replied" | "closed";
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          content: string;
          status?: "pending" | "replied" | "closed";
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          user_id?: string | null;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          content?: string;
          status?: "pending" | "replied" | "closed";
          created_at?: string;
        };
      };
      admin_logs: {
        Row: {
          id: string;
          admin_id: string;
          action_type: string;
          target_type: string | null;
          target_id: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action_type: string;
          target_type?: string | null;
          target_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          action_type?: string;
          target_type?: string | null;
          target_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
