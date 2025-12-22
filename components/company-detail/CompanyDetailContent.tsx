import { CompanyHero } from "./CompanyHero";
import { CompanyInfo } from "./CompanyInfo";
import { CompanyPortfolio } from "./CompanyPortfolio";
import { CompanyTechnical } from "./CompanyTechnical";
import { CompanyProjects } from "./CompanyProjects";
import { CompanyContact } from "./CompanyContact";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { getGradientBackground } from "@/lib/utils/color";
import type { CompanyDetail } from "@/lib/types/company-detail.types";

interface CompanyDetailContentProps {
  companyId: string;
}

async function fetchCompany(id: string): Promise<CompanyDetail | null> {
  try {
    const supabase = await createClient();
    const user = await getCurrentUser();

    const baseQuery = supabase
      .from("companies")
      .select(`
        id,
        user_id,
        company_name,
        business_number,
        ceo_name,
        establishment_date,
        postcode,
        address,
        address_detail,
        manager_name,
        manager_position,
        manager_phone,
        manager_email,
        website,
        logo_url,
        intro_title,
        intro_content,
        equipment,
        materials,
        trl_level,
        certifications,
        industries,
        project_title,
        achievements,
        partners,
        video_url,
        lead_time,
        as_info,
        pricing_type,
        brand_color,
        is_verified,
        is_featured,
        view_count,
        created_at,
        updated_at,
        company_images(id, image_url, image_type, display_order),
        company_categories(category_id, categories(id, parent_id, category_name)),
        company_regions(region_id, regions(id, region_name, region_type)),
        company_tags(id, tag_name)
      `)
      .eq("id", id);

    const { data, error } = await baseQuery.single();

    if (error || !data) {
      return null;
    }

    if (user && data.user_id === user.userId) {
      await supabase
        .from("companies")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", id);
      return data as unknown as CompanyDetail;
    }

    if (!data.is_verified) {
      return null;
    }

    const viewCount = data.view_count || 0;
    await supabase
      .from("companies")
      .update({ view_count: viewCount + 1 })
      .eq("id", id);

    return data as unknown as CompanyDetail;
  } catch {
    return null;
  }
}

export async function CompanyDetailContent({
  companyId,
}: CompanyDetailContentProps) {
  const company = await fetchCompany(companyId);

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            기업 정보를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600">
            요청하신 기업 정보가 존재하지 않거나 비공개 상태입니다.
          </p>
        </div>
      </div>
    );
  }

  const brandColor = company.brand_color || "#3B82F6";
  const gradientBackground = getGradientBackground(brandColor);

  return (
    <div className="min-h-screen" style={{ background: gradientBackground }}>
      <CompanyHero company={company} brandColor={brandColor} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CompanyPortfolio company={company} />
            <CompanyTechnical company={company} brandColor={brandColor} />
            <CompanyProjects company={company} brandColor={brandColor} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <CompanyInfo company={company} brandColor={brandColor} />
              <CompanyContact company={company} brandColor={brandColor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

