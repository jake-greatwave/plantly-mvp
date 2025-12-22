import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/lib/utils/jwt'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: '리프레시 토큰이 없습니다.' },
        { status: 401 }
      )
    }

    const payload = await verifyRefreshToken(refreshToken)

    if (!payload) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 리프레시 토큰입니다.' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, name, status, user_grade, is_admin')
      .eq('id', payload.userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (userData.status === 'suspended') {
      return NextResponse.json(
        { success: false, error: '정지된 계정입니다.' },
        { status: 403 }
      )
    }

    const tokenPayload = {
      userId: userData.id,
      email: userData.email,
      name: userData.name,
      userGrade: userData.user_grade,
      isAdmin: userData.is_admin || false,
    }

    const newAccessToken = await generateAccessToken(tokenPayload)
    const newRefreshToken = await generateRefreshToken(tokenPayload)

    const response = NextResponse.json({
      success: true,
      message: '토큰이 갱신되었습니다.',
    })

    response.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : undefined,
    })

    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : undefined,
    })

    return response
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { success: false, error: '토큰 갱신 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

