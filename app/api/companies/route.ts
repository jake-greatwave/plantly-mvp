import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/utils/jwt";

const ITEMS_PER_PAGE = 12;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE), 10);
    const categoryId = searchParams.get("category_id");
    const regionId = searchParams.get("region_id");
    const isVerified = searchParams.get("is_verified");
    const isFeatured = searchParams.get("is_featured");

    const supabase = await createClient();

    let companyIds: string[] | null = null;

    if (categoryId) {
      const { data: categoryData } = await supabase
        .from("company_categories")
        .select("company_id")
        .eq("category_id", categoryId);

      if (categoryData && categoryData.length > 0) {
        companyIds = categoryData.map((item) => item.company_id);
      } else {
        return NextResponse.json({
          companies: [],
          pagination: {
            page: 1,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        });
      }
    }

    if (regionId && companyIds === null) {
      const { data: regionData } = await supabase
        .from("company_regions")
        .select("company_id")
        .eq("region_id", regionId);

      if (regionData && regionData.length > 0) {
        companyIds = regionData.map((item) => item.company_id);
      } else {
        return NextResponse.json({
          companies: [],
          pagination: {
            page: 1,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        });
      }
    } else if (regionId && companyIds) {
      const { data: regionData } = await supabase
        .from("company_regions")
        .select("company_id")
        .eq("region_id", regionId)
        .in("company_id", companyIds);

      if (regionData && regionData.length > 0) {
        companyIds = regionData.map((item) => item.company_id);
      } else {
        return NextResponse.json({
          companies: [],
          pagination: {
            page: 1,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        });
      }
    }

    let query = supabase
      .from("companies")
      .select(
        `
        *,
        company_categories(
          category_id,
          categories(*)
        ),
        company_regions(
          region_id,
          regions(*)
        ),
        company_images(*),
        company_tags(*)
      `,
        { count: "exact" }
      )
      .eq("is_verified", true);

    if (companyIds) {
      query = query.in("id", companyIds);
    }

    if (search) {
      query = query.or(
        `company_name.ilike.%${search}%,intro_title.ilike.%${search}%,intro_content.ilike.%${search}%`
      );
    }

    if (isVerified === "true") {
      query = query.eq("is_verified", true);
    }

    if (isFeatured === "true") {
      query = query.eq("is_featured", true);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      companies: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const user = await verifyAccessToken(accessToken);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 토큰입니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const supabase = await createClient();

    const { data: company, error } = await supabase
      .from("companies")
      .insert({
        user_id: user.userId,
        company_name: body.company_name,
        business_number: body.business_number,
        intro_title: body.intro_title,
        ceo_name: body.ceo_name,
        manager_name: body.manager_name,
        manager_phone: body.manager_phone,
        manager_email: body.manager_email,
        website: body.website,
        equipment: body.equipment_list,
        materials: body.materials,
        trl_level: body.trl_level,
        certifications: body.certifications,
        industries: body.industries,
        project_title: body.project_title,
        achievements: body.achievements,
        partners: body.partners,
        video_url: body.video_url,
        lead_time: body.lead_time,
        as_info: body.as_info,
        pricing_type: body.pricing_type,
        brand_color: body.brand_color,
        is_verified: false,
        is_featured: false,
        view_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Company create error:", error);
      return NextResponse.json(
        { success: false, error: "기업 정보 등록에 실패했습니다." },
        { status: 500 }
      );
    }

    const companyId = company.id;

    if (body.images && body.images.length > 0) {
      const imageInserts = body.images.map((url: string, index: number) => ({
        company_id: companyId,
        image_url: url,
        image_type: "portfolio" as const,
        display_order: index,
      }));

      await supabase.from("company_images").insert(imageInserts);
    }

    const categoryIds: string[] = [];

    if (body.parent_category) {
      categoryIds.push(body.parent_category);
    }

    if (body.category_ids && body.category_ids.length > 0) {
      categoryIds.push(...body.category_ids);
    }

    if (categoryIds.length > 0) {
      const categoryInserts = categoryIds.map((catId: string) => ({
        company_id: companyId,
        category_id: catId,
      }));

      await supabase.from("company_categories").insert(categoryInserts);
    }

    if (body.countries && body.countries.length > 0) {
      const { data: regions } = await supabase
        .from("regions")
        .select("id, region_name")
        .eq("region_type", "country")
        .in("region_name", body.countries);

      if (regions && regions.length > 0) {
        const regionMap = new Map(
          regions.map((r) => [r.region_name, r.id])
        );

        const countryInserts = body.countries
          .filter((country: string) => regionMap.has(country))
          .map((country: string) => ({
            company_id: companyId,
            region_id: regionMap.get(country),
            region_type: "country" as const,
          }));

        if (countryInserts.length > 0) {
          await supabase.from("company_regions").insert(countryInserts);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "기업 정보가 등록되었습니다.",
      data: company,
    });
  } catch (error) {
    console.error("Company create error:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
