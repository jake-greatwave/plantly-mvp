import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: link, error } = await supabase
      .from("inquiry_links")
      .select("url")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // 링크가 없어도 에러로 처리하지 않음
      if (error.code === "PGRST116") {
        return NextResponse.json({
          success: true,
          url: null,
        });
      }
      console.error("Inquiry link fetch error:", error);
      return NextResponse.json(
        { success: false, error: "문의하기 링크를 불러오는데 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: link?.url || null,
    });
  } catch (error) {
    console.error("Inquiry link fetch error:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
