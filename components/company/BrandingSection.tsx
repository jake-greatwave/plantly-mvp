'use client'

import { memo, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { ColorPickerField } from '@/components/forms/ColorPickerField'
import { UpgradePrompt } from '@/components/ui/upgrade-prompt'
import { getEffectiveLimits, isEnterpriseGrade } from '@/lib/utils/grade-limits'
import type { CompanyFormData } from '@/lib/types/company-form.types'
import type { UserGrade } from '@/lib/types/auth.types'

const BASIC_COLOR = '#6B7280'

interface BrandingSectionProps {
  data: Partial<CompanyFormData>
  onFieldChange: (field: keyof CompanyFormData, value: any) => void
  userGrade?: UserGrade
  isAdmin?: boolean
  onUpgradeSuccess?: () => void
}

export const BrandingSection = memo(function BrandingSection({ data, onFieldChange, userGrade = 'basic', isAdmin = false, onUpgradeSuccess }: BrandingSectionProps) {
  const limits = getEffectiveLimits(userGrade, isAdmin)
  const canCustomizeColor = limits.canCustomizeColor || isAdmin || isEnterpriseGrade(userGrade)
  const currentColor = data.brand_color || (canCustomizeColor ? '#3B82F6' : BASIC_COLOR)

  useEffect(() => {
    if (!canCustomizeColor && data.brand_color !== BASIC_COLOR) {
      onFieldChange('brand_color', BASIC_COLOR)
    }
  }, [canCustomizeColor, data.brand_color, onFieldChange])

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">6. 브랜딩</h3>
      </div>

      <div className="space-y-2">
        <Label>대표 색상 설정</Label>
        <p className="text-sm text-gray-500 mb-2">
          상세페이지 배경/포인트 컬러로 사용됩니다
        </p>
        {canCustomizeColor ? (
          <ColorPickerField
            value={currentColor}
            onChange={(value) => onFieldChange('brand_color', value)}
          />
        ) : (
          <div className="space-y-2">
            <UpgradePrompt feature="대표 색상 커스터마이징" variant="inline" onUpgradeSuccess={onUpgradeSuccess} />
            <ColorPickerField
              value={BASIC_COLOR}
              onChange={(value) => onFieldChange('brand_color', BASIC_COLOR)}
              disabled={true}
              allowedColors={[BASIC_COLOR]}
            />
          </div>
        )}
      </div>
    </div>
  )
})




