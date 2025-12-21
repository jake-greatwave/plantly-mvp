import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createClient } from "@/lib/supabase/server";
import type { LoginRequest, LoginResponse } from "@/lib/types/auth.types";
import { validateLoginRequest } from "@/lib/validations/auth.validation";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/jwt";

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();

    const validationErrors = validateLoginRequest(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: validationErrors[0] },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, password, name, status, user_grade")
      .eq("email", body.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      userData.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    if (userData.status === "suspended") {
      return NextResponse.json(
        {
          success: false,
          error: "정지된 계정입니다. 관리자에게 문의해주세요.",
        },
        { status: 403 }
      );
    }

    const tokenPayload = {
      userId: userData.id,
      email: userData.email,
      name: userData.name,
      userGrade: userData.user_grade,
    };

    const accessToken = await generateAccessToken(tokenPayload);
    const refreshToken = await generateRefreshToken(tokenPayload);

    const response = NextResponse.json<LoginResponse>({
      success: true,
      message: "로그인에 성공했습니다.",
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        status: userData.status,
        user_grade: userData.user_grade,
      },
    });

    const accessTokenMaxAge = 60 * 15;
    const refreshTokenMaxAge = body.remember
      ? 60 * 60 * 24 * 30
      : 60 * 60 * 24 * 7;

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessTokenMaxAge,
      path: "/",
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshTokenMaxAge,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
