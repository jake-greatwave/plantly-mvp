'use client'

import { memo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelectField } from '@/components/forms/MultiSelectField'
import { COUNTRIES, PRICING_TYPES } from '@/lib/types/company-form.types'
import type { CompanyFormData } from '@/lib/types/company-form.types'

interface TradingConditionSectionProps {
  data: Partial<CompanyFormData>
  onFieldChange: (field: keyof CompanyFormData, value: any) => void
}

export const TradingConditionSection = memo(function TradingConditionSection({ data, onFieldChange }: TradingConditionSectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">5. 거래 조건</h3>
      </div>

      <div className="space-y-2">
        <Label>대응 가능 국가</Label>
        <MultiSelectField
          options={COUNTRIES}
          value={data.countries || []}
          onChange={(value) => onFieldChange('countries', value)}
          columns={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead_time">예상 리드타임</Label>
        <Input
          id="lead_time"
          value={data.lead_time || ''}
          onChange={(e) => onFieldChange('lead_time', e.target.value)}
          placeholder="예: 발주 후 6주"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="as_info">유지보수 (A/S)</Label>
        <Textarea
          id="as_info"
          value={data.as_info || ''}
          onChange={(e) => onFieldChange('as_info', e.target.value)}
          placeholder="무상 보증 기간 및 긴급 대응 가능 시간"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>견적 산출 방식</Label>
        <Select
          value={data.pricing_type}
          onValueChange={(value) => onFieldChange('pricing_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="견적 방식 선택" />
          </SelectTrigger>
          <SelectContent>
            {PRICING_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
})





