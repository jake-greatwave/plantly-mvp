export type SurveyQ1Needs = 'very_important' | 'normal' | 'not_important'

export type SurveyQ2Price = 'very_cheap' | 'reasonable' | 'somewhat_expensive' | 'too_expensive'

export type SurveyQ3WTP = 'basic' | 'standard' | 'premium' | 'enterprise'

export interface UpgradeSurvey {
  id: string
  user_id: string
  feature_used: string | null
  q1_needs: SurveyQ1Needs
  q2_price: SurveyQ2Price
  q3_wtp: SurveyQ3WTP
  q3_etc: string | null
  created_at: string
}

export interface UpgradeSurveyRequest {
  feature_used?: string
  q1_needs: SurveyQ1Needs
  q2_price: SurveyQ2Price
  q3_wtp: SurveyQ3WTP
  q3_etc?: string
}

export interface UpgradeSurveyResponse {
  success: boolean
  message?: string
  error?: string
  trial_end_date?: string
}

export const SURVEY_Q1_OPTIONS: Array<{ value: SurveyQ1Needs; label: string }> = [
  { value: 'very_important', label: '매우 중요' },
  { value: 'normal', label: '보통' },
  { value: 'not_important', label: '중요하지 않음' },
]

export const SURVEY_Q2_OPTIONS: Array<{ value: SurveyQ2Price; label: string }> = [
  { value: 'very_cheap', label: '매우 저렴하다' },
  { value: 'reasonable', label: '적당하다' },
  { value: 'somewhat_expensive', label: '조금 비싸다' },
  { value: 'too_expensive', label: '너무 비싸다' },
]

export const SURVEY_Q3_OPTIONS: Array<{ value: SurveyQ3WTP; label: string }> = [
  { value: 'basic', label: 'Basic' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Enterprise' },
]

