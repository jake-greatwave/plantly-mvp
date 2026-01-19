import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { verifyAccessToken } from "@/lib/utils/jwt";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
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
    const { url, is_active } = body;

    const supabase = await createClient();

    const updateData: { url?: string; is_active?: boolean } = {};

    if (url !== undefined) {
      if (typeof url !== "string" || !url.trim()) {
        return NextResponse.json(
          { success: false, error: "유효한 URL을 입력해주세요." },
          { status: 400 }
        );
      }
      updateData.url = url.trim();
    }

    if (is_active !== undefined) {
      if (typeof is_active !== "boolean") {
        return NextResponse.json(
          { success: false, error: "유효하지 않은 활성화 상태입니다." },
          { status: 400 }
        );
      }
      updateData.is_active = is_active;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "수정할 데이터가 없습니다." },
        { status: 400 }
      );
    }

    const { data: link, error } = await supabase
      .from("inquiry_links")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Inquiry link update error:", error);
      return NextResponse.json(
        { success: false, error: "문의하기 링크 수정에 실패했습니다." },
        { status: 500 }
      );
    }

    if (!link) {
      return NextResponse.json(
        { success: false, error: "문의하기 링크를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      link,
    });
  } catch (error) {
    console.error("Inquiry link update error:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
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

    const { error } = await supabase
      .from("inquiry_links")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Inquiry link delete error:", error);
      return NextResponse.json(
        { success: false, error: "문의하기 링크 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "문의하기 링크가 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Inquiry link delete error:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
