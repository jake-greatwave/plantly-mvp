'use client'

import { useEffect, useState, memo } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelectField } from '@/components/forms/MultiSelectField'
import { UpgradePrompt } from '@/components/ui/upgrade-prompt'
import { getCategories } from '@/lib/actions/categories'
import { INDUSTRIES } from '@/lib/types/company-form.types'
import { getGradeLimits, canAddCategoryTag, getEffectiveLimits } from '@/lib/utils/grade-limits'
import type { CompanyFormData } from '@/lib/types/company-form.types'
import type { UserGrade } from '@/lib/types/auth.types'
import type { Database } from '@/lib/types/database.types'

type Category = Database['public']['Tables']['categories']['Row']

interface CategorySectionProps {
  data: Partial<CompanyFormData>
  onFieldChange: (field: keyof CompanyFormData, value: any) => void
  onFieldsChange: (fields: Partial<CompanyFormData>) => void
  userGrade?: UserGrade
  isAdmin?: boolean
}

export const CategorySection = memo(function CategorySection({ data, onFieldChange, onFieldsChange, userGrade = 'basic', isAdmin = false }: CategorySectionProps) {
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [childCategories, setChildCategories] = useState<Category[]>([])

  useEffect(() => {
    loadParentCategories()
  }, [])

  useEffect(() => {
    if (data.parent_category) {
      loadChildCategories(data.parent_category)
    }
  }, [data.parent_category])

  const loadParentCategories = async () => {
    const categories = await getCategories(null)
    setParentCategories(categories)
  }

  const loadChildCategories = async (parentId: string) => {
    const categories = await getCategories(parentId)
    setChildCategories(categories)
  }

  const categoryIds = data.category_ids || []
  const limits = getEffectiveLimits(userGrade, isAdmin)
  const canAddMore = canAddCategoryTag(categoryIds.length, userGrade, isAdmin)
  const disabledOptions = canAddMore || isAdmin ? [] : childCategories.map(c => c.id).filter(id => !categoryIds.includes(id))

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">2. 카테고리</h3>
      </div>

      <div className="space-y-2">
        <Label>메가 카테고리 <span className="text-red-500">*</span></Label>
        <Select
          value={data.parent_category}
          onValueChange={(value) => onFieldsChange({ parent_category: value, category_ids: [] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            {parentCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.category_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {childCategories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>세부 공정 태그</Label>
            {!isAdmin && userGrade === 'basic' && limits.maxCategoryTags !== Infinity && (
              <span className="text-xs text-gray-500">
                {categoryIds.length}/{limits.maxCategoryTags}개 선택됨
              </span>
            )}
          </div>
          <MultiSelectField
            options={childCategories.map(c => ({ value: c.id, label: c.category_name }))}
            value={categoryIds}
            onChange={(value) => onFieldChange('category_ids', value)}
            maxSelections={limits.maxCategoryTags === Infinity ? undefined : limits.maxCategoryTags}
            disabledOptions={disabledOptions}
          />
          {!canAddMore && !isAdmin && userGrade === 'basic' && (
            <UpgradePrompt feature="세부 공정 태그" />
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>주력 산업군</Label>
        <MultiSelectField
          options={INDUSTRIES}
          value={data.industries || []}
          onChange={(value) => onFieldChange('industries', value)}
          columns={3}
        />
      </div>
    </div>
  )
})




