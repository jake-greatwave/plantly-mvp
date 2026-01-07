import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/utils/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: '기업 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const user = await getCurrentUser()

    // 기업 정보 조회
    const { data: company, error: fetchError } = await supabase
      .from('companies')
      .select('id, user_id, is_verified')
      .eq('id', id)
      .single()

    if (fetchError || !company) {
      return NextResponse.json(
        { success: false, error: '기업 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 본인 기업이거나 비인증 기업은 조회수 증가하지 않음
    if (user && company.user_id === user.userId) {
      return NextResponse.json({
        success: true,
        message: '본인 기업은 조회수가 증가하지 않습니다.',
      })
    }

    if (!company.is_verified) {
      return NextResponse.json({
        success: true,
        message: '비인증 기업은 조회수가 증가하지 않습니다.',
      })
    }

    // 조회수 증가
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .select('view_count')
      .eq('id', id)
      .single()

    if (updateError) {
      throw updateError
    }

    const currentViewCount = updatedCompany?.view_count || 0

    const { error: incrementError } = await supabase
      .from('companies')
      .update({ view_count: currentViewCount + 1 })
      .eq('id', id)

    if (incrementError) {
      throw incrementError
    }

    return NextResponse.json({
      success: true,
      view_count: currentViewCount + 1,
    })
  } catch (error) {
    console.error('View count increment error:', error)
    return NextResponse.json(
      { success: false, error: '조회수 증가에 실패했습니다.' },
      { status: 500 }
    )
  }
}

