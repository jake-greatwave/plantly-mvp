import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const body = await request.json();
    const { is_admin, status, user_grade } = body;

    const updates: Record<string, unknown> = {};
    if (typeof is_admin === "boolean") {
      updates.is_admin = is_admin;
    }
    if (status === "active" || status === "suspended") {
      updates.status = status;
    }
    if (user_grade === "basic" || user_grade === "enterprise" || user_grade === "enterprise_trial") {
      updates.user_grade = user_grade;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "업데이트할 필드가 없습니다." },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "사용자 정보 업데이트에 실패했습니다." },
      { status: 500 }
    );
  }
}

