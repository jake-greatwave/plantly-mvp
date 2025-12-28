import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, name, phone, status, user_grade, is_admin, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "사용자 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}






