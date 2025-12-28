import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { createClient } from "@/lib/supabase/server";

const ITEMS_PER_PAGE = 12;

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE), 10);
    const isVerified = searchParams.get("is_verified");

    const supabase = await createClient();

    let query = supabase
      .from("companies")
      .select(
        `
        id,
        company_name,
        business_number,
        ceo_name,
        address,
        address_detail,
        logo_url,
        intro_title,
        industries,
        is_verified,
        is_featured,
        view_count,
        created_at,
        updated_at,
        company_images(id, image_url, image_type, display_order),
        company_categories(category_id, categories(id, category_name))
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (isVerified !== null && isVerified !== undefined) {
      query = query.eq("is_verified", isVerified === "true");
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

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
      { error: "기업 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}






