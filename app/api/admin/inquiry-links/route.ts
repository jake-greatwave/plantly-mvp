import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { verifyAccessToken } from "@/lib/utils/jwt";

export async function GET() {
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

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    const { data: links, error } = await supabase
      .from("inquiry_links")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Inquiry links fetch error:", error);
      return NextResponse.json(
        { success: false, error: "문의하기 링크를 불러오는데 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      links: links || [],
    });
  } catch (error) {
    console.error("Inquiry links fetch error:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
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

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { success: false, error: "URL을 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: link, error } = await supabase
      .from("inquiry_links")
      .insert({
        url: url.trim(),
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Inquiry link create error:", error);
      return NextResponse.json(
        { success: false, error: "문의하기 링크 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      link,
    });
  } catch (error) {
    console.error("Inquiry link create error:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
