import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/utils/jwt'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
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

    const supabase = await createClient()

    const { data: userData, error } = await supabase
      .from('users')
      .select('id, email, name, phone, status, user_grade, is_admin, created_at, updated_at')
      .eq('id', user.userId)
      .single()

    if (error || !userData) {
      return NextResponse.json(
        { success: false, error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        status: userData.status,
        user_grade: userData.user_grade,
        is_admin: userData.is_admin,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      },
    })
  } catch (error) {
    console.error('Get account info error:', error)
    return NextResponse.json(
      { success: false, error: '사용자 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

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
    const { name, phone } = body

    const updates: Record<string, unknown> = {}
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: '이름은 필수 항목입니다.' },
          { status: 400 }
        )
      }
      updates.name = name.trim()
    }

    if (phone !== undefined) {
      if (phone === null || phone === '') {
        updates.phone = null
      } else if (typeof phone === 'string') {
        const phoneRegex = /^[0-9-]+$/
        if (!phoneRegex.test(phone)) {
          return NextResponse.json(
            { success: false, error: '올바른 연락처 형식이 아닙니다.' },
            { status: 400 }
          )
        }
        updates.phone = phone.trim()
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: '수정할 정보가 없습니다.' },
        { status: 400 }
      )
    }

    updates.updated_at = new Date().toISOString()

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.userId)
      .select('id, email, name, phone, status, user_grade, is_admin, created_at, updated_at')
      .single()

    if (error) {
      console.error('Update account error:', error)
      return NextResponse.json(
        { success: false, error: '계정 정보 수정에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '계정 정보가 수정되었습니다.',
      data,
    })
  } catch (error) {
    console.error('Update account error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

