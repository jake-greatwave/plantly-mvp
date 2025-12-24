import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { verifyAccessToken } from '@/lib/utils/jwt'
import type { UpgradeSurveyRequest } from '@/lib/types/survey.types'

export async function POST(request: NextRequest) {
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

    const body: UpgradeSurveyRequest = await request.json()

    if (!body.q1_needs || !body.q2_price || !body.q3_wtp) {
      return NextResponse.json(
        { success: false, error: '모든 필수 항목을 입력해주세요.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: currentUser } = await supabase
      .from('users')
      .select('user_grade')
      .eq('id', user.userId)
      .single()

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (currentUser.user_grade === 'enterprise' || currentUser.user_grade === 'enterprise_trial') {
      return NextResponse.json(
        { success: false, error: '이미 Enterprise 등급입니다.' },
        { status: 400 }
      )
    }

    const today = new Date()
    const trialEndDate = new Date(today)
    trialEndDate.setDate(trialEndDate.getDate() + 90)

    const { error: surveyError } = await supabase
      .from('upgrade_surveys')
      .insert({
        user_id: user.userId,
        feature_used: body.feature_used || null,
        q1_needs: body.q1_needs,
        q2_price: body.q2_price,
        q3_wtp: body.q3_wtp,
        q3_etc: body.q3_etc || null,
      })

    if (surveyError) {
      console.error('Survey insert error:', surveyError)
      return NextResponse.json(
        { success: false, error: '설문 결과 저장에 실패했습니다.' },
        { status: 500 }
      )
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        user_grade: 'enterprise_trial',
        trial_end_date: trialEndDate.toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.userId)

    if (updateError) {
      console.error('User update error:', updateError)
      return NextResponse.json(
        { success: false, error: '등급 업데이트에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Enterprise 등급이 적용되었습니다. (3개월 무료)',
      trial_end_date: trialEndDate.toISOString().split('T')[0],
    })
  } catch (error) {
    console.error('Upgrade survey API error:', error)
    return NextResponse.json(
      { success: false, error: '설문 제출 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

