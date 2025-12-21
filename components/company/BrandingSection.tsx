'use client'

import { memo } from 'react'
import { Label } from '@/components/ui/label'
import { ColorPickerField } from '@/components/forms/ColorPickerField'
import type { CompanyFormData } from '@/lib/types/company-form.types'

interface BrandingSectionProps {
  data: Partial<CompanyFormData>
  onFieldChange: (field: keyof CompanyFormData, value: any) => void
}

export const BrandingSection = memo(function BrandingSection({ data, onFieldChange }: BrandingSectionProps) {
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
        <ColorPickerField
          value={data.brand_color || '#3B82F6'}
          onChange={(value) => onFieldChange('brand_color', value)}
        />
      </div>
    </div>
  )
})

