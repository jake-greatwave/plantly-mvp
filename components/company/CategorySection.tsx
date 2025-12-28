'use client'

import { useEffect, useState, memo } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelectField } from '@/components/forms/MultiSelectField'
import { UpgradePrompt } from '@/components/ui/upgrade-prompt'
import { getCategories } from '@/lib/actions/categories'
import { INDUSTRIES } from '@/lib/types/company-form.types'
import { getGradeLimits, canAddCategoryTag, getEffectiveLimits, isEnterpriseGrade } from '@/lib/utils/grade-limits'
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
  onUpgradeSuccess?: () => void
  isLoaded?: boolean
}

export const CategorySection = memo(function CategorySection({ data, onFieldChange, onFieldsChange, userGrade = 'basic', isAdmin = false, onUpgradeSuccess, isLoaded = false }: CategorySectionProps) {
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [childCategories, setChildCategories] = useState<Category[]>([])
  const [isLoadingParents, setIsLoadingParents] = useState(true)
  const [isLoadingChildren, setIsLoadingChildren] = useState(false)
  const [loadedParentCategoryId, setLoadedParentCategoryId] = useState<string>('')

  useEffect(() => {
    loadParentCategories()
  }, [])

  useEffect(() => {
    if (!isLoadingParents && parentCategories.length > 0 && data.parent_category && data.parent_category.trim() !== '') {
      if (loadedParentCategoryId !== data.parent_category) {
        const parentExists = parentCategories.some(cat => cat.id === data.parent_category)
        if (parentExists) {
          setIsLoadingChildren(true)
          loadChildCategories(data.parent_category).then(() => {
            setLoadedParentCategoryId(data.parent_category || '')
          })
        }
      }
    } else if (!isLoadingParents && (!data.parent_category || data.parent_category.trim() === '')) {
      if (loadedParentCategoryId !== '') {
        setChildCategories([])
        setIsLoadingChildren(false)
        setLoadedParentCategoryId('')
      }
    }
  }, [parentCategories, isLoadingParents, data.parent_category, loadedParentCategoryId])

  const loadParentCategories = async () => {
    try {
      setIsLoadingParents(true)
      const categories = await getCategories(null)
      setParentCategories(categories)
    } catch (error) {
      console.error('부모 카테고리 로드 오류:', error)
    } finally {
      setIsLoadingParents(false)
    }
  }

  const loadChildCategories = async (parentId: string) => {
    try {
      setIsLoadingChildren(true)
      const categories = await getCategories(parentId)
      setChildCategories(categories)
      return categories
    } catch (error) {
      console.error('자식 카테고리 로드 오류:', error)
      return []
    } finally {
      setIsLoadingChildren(false)
    }
  }

  const categoryIds = data.category_ids || []
  const limits = getEffectiveLimits(userGrade, isAdmin)
  const isEnterprise = isEnterpriseGrade(userGrade)
  const canAddMore = canAddCategoryTag(categoryIds.length, userGrade, isAdmin) || isEnterprise
  const disabledOptions = canAddMore || isAdmin || isEnterprise ? [] : childCategories.map(c => c.id).filter(id => !categoryIds.includes(id))

  const parentCategoryValue = !isLoadingParents && data.parent_category && data.parent_category.trim() !== '' && parentCategories.some(cat => cat.id === data.parent_category) 
    ? data.parent_category 
    : undefined

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">2. 카테고리</h3>
      </div>

      <div className="space-y-2">
        <Label>메가 카테고리 <span className="text-red-500">*</span></Label>
        <Select
          key={`parent-${parentCategories.length}-${parentCategoryValue || 'empty'}`}
          value={parentCategoryValue}
          onValueChange={(value) => onFieldsChange({ parent_category: value, category_ids: [] })}
          disabled={isLoadingParents}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingParents ? "로딩 중..." : "카테고리 선택"} />
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

      {(childCategories.length > 0 || (data.parent_category && isLoadingChildren)) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>세부 공정 태그</Label>
            {!isAdmin && !isEnterprise && userGrade === 'basic' && limits.maxCategoryTags !== Infinity && (
              <span className="text-xs text-gray-500">
                {categoryIds.length}/{limits.maxCategoryTags}개 선택됨
              </span>
            )}
          </div>
          {isLoadingChildren ? (
            <div className="text-sm text-gray-500 py-2">로딩 중...</div>
          ) : (
            <MultiSelectField
              options={childCategories.map(c => ({ value: c.id, label: c.category_name }))}
              value={categoryIds.filter(id => childCategories.some(c => c.id === id))}
              onChange={(value) => onFieldChange('category_ids', value)}
              maxSelections={limits.maxCategoryTags === Infinity ? undefined : limits.maxCategoryTags}
              disabledOptions={disabledOptions}
              key={`multiselect-${childCategories.length}-${categoryIds.join(',')}`}
            />
          )}
          {!canAddMore && !isAdmin && userGrade === 'basic' && (
            <UpgradePrompt feature="세부 공정 태그" onUpgradeSuccess={onUpgradeSuccess} />
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




