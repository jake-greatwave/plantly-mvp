import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { verifyAccessToken } from '@/lib/utils/jwt'

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

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch my companies error:', error)
      return NextResponse.json(
        { success: false, error: '기업 정보 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    })
  } catch (error) {
    console.error('Fetch my companies error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}




