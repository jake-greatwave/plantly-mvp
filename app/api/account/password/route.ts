import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt'
import { verifyAccessToken } from '@/lib/utils/jwt'
import { createClient } from '@/lib/supabase/server'
import { validatePassword } from '@/lib/validations/auth.validation'

const SALT_ROUNDS = 10

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const user = await verifyAccessToken(accessToken)

    if (!user) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: '현재 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!newPassword) {
      return NextResponse.json(
        { success: false, error: '새 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!validatePassword(newPassword)) {
      return NextResponse.json(
        { success: false, error: '비밀번호는 8자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('password')
      .eq('id', user.userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      userData.password
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: '현재 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.userId)

    if (updateError) {
      console.error('Password update error:', updateError)
      return NextResponse.json(
        { success: false, error: '비밀번호 변경에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '비밀번호가 변경되었습니다.',
    })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

