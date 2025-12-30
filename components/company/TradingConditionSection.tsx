'use client'

import { memo, useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MultiSelectField } from '@/components/forms/MultiSelectField'
import { COUNTRIES } from '@/lib/types/company-form.types'
import type { CompanyFormData } from '@/lib/types/company-form.types'

interface TradingConditionSectionProps {
  data: Partial<CompanyFormData>
  onFieldChange: (field: keyof CompanyFormData, value: any) => void
}

export const TradingConditionSection = memo(function TradingConditionSection({ data, onFieldChange }: TradingConditionSectionProps) {
  const allCountries = data.countries || []
  const selectedFromList = allCountries.filter(country => COUNTRIES.includes(country))
  const customCountries = allCountries.filter(country => !COUNTRIES.includes(country))
  const [customCountryInput, setCustomCountryInput] = useState(customCountries.join(' '))

  useEffect(() => {
    const customCountries = allCountries.filter(country => !COUNTRIES.includes(country))
    setCustomCountryInput(customCountries.join(' '))
  }, [data.countries])

  const handleSelectedCountriesChange = (value: string[]) => {
    const customCountryText = customCountryInput.trim()
    const customCountriesArray = customCountryText ? [customCountryText] : []
    
    onFieldChange('countries', [...value, ...customCountriesArray])
  }

  const handleCustomCountryChange = (value: string) => {
    setCustomCountryInput(value)
    const customCountryText = value.trim()
    const customCountriesArray = customCountryText ? [customCountryText] : []
    
    onFieldChange('countries', [...selectedFromList, ...customCountriesArray])
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">5. 거래 조건</h3>
      </div>

      <div className="space-y-2">
        <Label>대응 가능 국가</Label>
        <MultiSelectField
          options={COUNTRIES}
          value={selectedFromList}
          onChange={handleSelectedCountriesChange}
          columns={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom_country">국가 직접 입력</Label>
        <Input
          id="custom_country"
          value={customCountryInput}
          onChange={(e) => handleCustomCountryChange(e.target.value)}
          placeholder="목록에 없는 국가를 입력하세요"
          className="w-full"
        />
      </div>
    </div>
  )
})






