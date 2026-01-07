'use client'

import { memo } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TagInput } from '@/components/forms/TagInput'
import { MultiSelectField } from '@/components/forms/MultiSelectField'
import { TRL_LEVELS, CERTIFICATIONS } from '@/lib/types/company-form.types'
import type { CompanyFormData } from '@/lib/types/company-form.types'

interface TechnicalSpecSectionProps {
  data: Partial<CompanyFormData>
  onFieldChange: (field: keyof CompanyFormData, value: any) => void
}

export const TechnicalSpecSection = memo(function TechnicalSpecSection({ data, onFieldChange }: TechnicalSpecSectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">3. 기술 사양</h3>
      </div>

      <div className="space-y-2">
        <Label>보유 설비 현황</Label>
        <TagInput
          value={data.equipment_list || []}
          onChange={(value) => onFieldChange('equipment_list', value)}
          placeholder="예: 5축 가공기 2대 (Enter로 추가)"
        />
      </div>

      <div className="space-y-2">
        <Label>대응 가능 소재</Label>
        <TagInput
          value={data.materials || []}
          onChange={(value) => onFieldChange('materials', value)}
          placeholder="예: PP, PA66, 스틸 (Enter로 추가)"
        />
      </div>

      <div className="space-y-2">
        <Label>기술 성숙도 (TRL)</Label>
        <Select
          value={data.trl_level}
          onValueChange={(value) => onFieldChange('trl_level', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="기술 성숙도 선택" />
          </SelectTrigger>
          <SelectContent>
            {TRL_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>인증 현황</Label>
        <MultiSelectField
          options={CERTIFICATIONS}
          value={data.certifications || []}
          onChange={(value) => onFieldChange('certifications', value)}
          columns={2}
        />
      </div>
    </div>
  )
})







