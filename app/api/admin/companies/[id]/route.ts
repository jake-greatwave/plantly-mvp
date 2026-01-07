import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
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
    const { is_verified, is_spotlight, spotlight_order } = body;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (typeof is_verified === "boolean") {
      updateData.is_verified = is_verified;
    }

    if (typeof is_spotlight === "boolean") {
      updateData.is_spotlight = is_spotlight;
    }

    if (spotlight_order !== undefined) {
      updateData.spotlight_order = spotlight_order === null || spotlight_order === "" ? null : parseInt(spotlight_order, 10);
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("companies")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "기업 정보를 업데이트하는데 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
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
    const supabase = await createClient();

    const { error } = await supabase.from("companies").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: "기업 정보를 삭제하는데 실패했습니다." },
      { status: 500 }
    );
  }
}







