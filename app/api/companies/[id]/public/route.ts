import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("companies")
      .select(`
        id,
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
      .eq("id", id)
      .eq("is_verified", true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "기업 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    await supabase
      .from("companies")
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Company fetch error:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

