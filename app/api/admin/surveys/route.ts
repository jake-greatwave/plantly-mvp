import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/utils/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    const supabase = await createClient()

    const { data: surveys, error } = await supabase
      .from('upgrade_surveys')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    const totalCount = surveys?.length || 0

    const q1Stats = {
      very_important: surveys?.filter(s => s.q1_needs === 'very_important').length || 0,
      normal: surveys?.filter(s => s.q1_needs === 'normal').length || 0,
      not_important: surveys?.filter(s => s.q1_needs === 'not_important').length || 0,
    }

    const q2Stats = {
      very_cheap: surveys?.filter(s => s.q2_price === 'very_cheap').length || 0,
      reasonable: surveys?.filter(s => s.q2_price === 'reasonable').length || 0,
      somewhat_expensive: surveys?.filter(s => s.q2_price === 'somewhat_expensive').length || 0,
      too_expensive: surveys?.filter(s => s.q2_price === 'too_expensive').length || 0,
    }

    const q3Stats = {
      basic: surveys?.filter(s => s.q3_wtp === 'basic').length || 0,
      standard: surveys?.filter(s => s.q3_wtp === 'standard').length || 0,
      premium: surveys?.filter(s => s.q3_wtp === 'premium').length || 0,
      enterprise: surveys?.filter(s => s.q3_wtp === 'enterprise').length || 0,
    }

    const featureStats: Record<string, number> = {}
    const upgradeSourceStats: Record<string, number> = {}
    surveys?.forEach(survey => {
      if (survey.feature_used) {
        featureStats[survey.feature_used] = (featureStats[survey.feature_used] || 0) + 1
      }
      const source = survey.upgrade_source || survey.feature_used
      if (source) {
        upgradeSourceStats[source] = (upgradeSourceStats[source] || 0) + 1
      }
    })

    const dateStats: Record<string, number> = {}
    surveys?.forEach(survey => {
      const date = new Date(survey.created_at).toISOString().split('T')[0]
      dateStats[date] = (dateStats[date] || 0) + 1
    })

    return NextResponse.json({
      surveys: surveys || [],
      statistics: {
        total: totalCount,
        q1: q1Stats,
        q2: q2Stats,
        q3: q3Stats,
        features: featureStats,
        upgradeSources: upgradeSourceStats,
        dates: dateStats,
      },
    })
  } catch (error) {
    console.error('Error fetching surveys:', error)
    return NextResponse.json(
      { error: '설문 데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}



