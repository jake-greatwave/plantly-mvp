'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { SURVEY_Q1_OPTIONS, SURVEY_Q2_OPTIONS, SURVEY_Q3_OPTIONS } from '@/lib/types/survey.types'
import type { UpgradeSurvey } from '@/lib/types/survey.types'

interface SurveyStatistics {
  total: number
  q1: {
    very_important: number
    normal: number
    not_important: number
  }
  q2: {
    very_cheap: number
    reasonable: number
    somewhat_expensive: number
    too_expensive: number
  }
  q3: {
    basic: number
    standard: number
    premium: number
    enterprise: number
  }
  features: Record<string, number>
  dates: Record<string, number>
}

export function SurveyStatistics() {
  const [surveys, setSurveys] = useState<UpgradeSurvey[]>([])
  const [statistics, setStatistics] = useState<SurveyStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/admin/surveys')
      const data = await response.json()

      if (response.ok) {
        setSurveys(data.surveys)
        setStatistics(data.statistics)
      }
    } catch (error) {
      console.error('Failed to fetch surveys:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">로딩 중...</div>
  }

  if (!statistics) {
    return <div className="p-8">데이터를 불러올 수 없습니다.</div>
  }

  const getQ1Label = (value: string) => {
    return SURVEY_Q1_OPTIONS.find(opt => opt.value === value)?.label || value
  }

  const getQ2Label = (value: string) => {
    return SURVEY_Q2_OPTIONS.find(opt => opt.value === value)?.label || value
  }

  const getQ3Label = (value: string) => {
    return SURVEY_Q3_OPTIONS.find(opt => opt.value === value)?.label || value
  }

  const getPercentage = (count: number, total: number) => {
    if (total === 0) return 0
    return Math.round((count / total) * 100)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설문 통계</h1>
        <p className="text-gray-600 mt-1">업그레이드 설문 응답 통계를 확인할 수 있습니다.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">전체 통계</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
            <div className="text-sm text-gray-600">총 응답 수</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Q1. 기능 중요도
          </h2>
          <div className="space-y-3">
            {SURVEY_Q1_OPTIONS.map((option) => {
              const count = statistics.q1[option.value as keyof typeof statistics.q1]
              const percentage = getPercentage(count, statistics.total)
              return (
                <div key={option.value}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{option.label}</span>
                    <span className="text-sm font-medium">{count}명 ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Q2. 가격 정책 의견
          </h2>
          <div className="space-y-3">
            {SURVEY_Q2_OPTIONS.map((option) => {
              const count = statistics.q2[option.value as keyof typeof statistics.q2]
              const percentage = getPercentage(count, statistics.total)
              return (
                <div key={option.value}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{option.label}</span>
                    <span className="text-sm font-medium">{count}명 ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Q3. 구독 의향 등급
          </h2>
          <div className="space-y-3">
            {SURVEY_Q3_OPTIONS.map((option) => {
              const count = statistics.q3[option.value as keyof typeof statistics.q3]
              const percentage = getPercentage(count, statistics.total)
              return (
                <div key={option.value}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{option.label}</span>
                    <span className="text-sm font-medium">{count}명 ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">기능별 사용 통계</h2>
          <div className="space-y-2">
            {Object.entries(statistics.features).length > 0 ? (
              Object.entries(statistics.features)
                .sort((a, b) => b[1] - a[1])
                .map(([feature, count]) => {
                  const percentage = getPercentage(count, statistics.total)
                  return (
                    <div key={feature}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{feature}</span>
                        <span className="text-sm font-medium">{count}명 ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })
            ) : (
              <div className="text-sm text-gray-500">데이터가 없습니다.</div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">전체 응답 목록</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">날짜</th>
                <th className="text-left p-2">기능</th>
                <th className="text-left p-2">Q1</th>
                <th className="text-left p-2">Q2</th>
                <th className="text-left p-2">Q3</th>
                <th className="text-left p-2">의견</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr key={survey.id} className="border-b">
                  <td className="p-2">
                    {new Date(survey.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="p-2">{survey.feature_used || '-'}</td>
                  <td className="p-2">{getQ1Label(survey.q1_needs)}</td>
                  <td className="p-2">{getQ2Label(survey.q2_price)}</td>
                  <td className="p-2">{getQ3Label(survey.q3_wtp)}</td>
                  <td className="p-2 max-w-xs truncate">{survey.q3_etc || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {surveys.length === 0 && (
            <div className="text-center py-8 text-gray-500">응답 데이터가 없습니다.</div>
          )}
        </div>
      </Card>
    </div>
  )
}


