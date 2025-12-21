'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { BasicInfoSection } from './BasicInfoSection'
import { CategorySection } from './CategorySection'
import { TechnicalSpecSection } from './TechnicalSpecSection'
import { ReferenceSection } from './ReferenceSection'
import { TradingConditionSection } from './TradingConditionSection'
import { BrandingSection } from './BrandingSection'
import type { CompanyFormData } from '@/lib/types/company-form.types'

const DEFAULT_FORM_DATA: Partial<CompanyFormData> = {
  brand_color: '#3B82F6',
  category_ids: [],
  industries: [],
  equipment_list: [],
  materials: [],
  certifications: [],
  images: [],
  countries: [],
}

interface CompanyRegisterFormProps {
  companyId?: string
}

export function CompanyRegisterForm({ companyId }: CompanyRegisterFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<CompanyFormData>>(DEFAULT_FORM_DATA)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const basicInfoRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (companyId) {
      loadCompanyData(companyId)
    } else {
      const savedDraft = localStorage.getItem('company_draft')
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft)
          setFormData(parsed)
          toast.info('임시 저장된 데이터를 불러왔습니다')
        } catch {
          toast.error('임시 저장 데이터를 불러오는데 실패했습니다')
        }
      }
      setIsLoaded(true)
    }
  }, [companyId])

  const loadCompanyData = async (id: string) => {
    try {
      const response = await fetch(`/api/companies/${id}`)
      const result = await response.json()

      if (response.ok && result.success) {
        const company = result.data
        const imageUrls = company.company_images?.map((img: any) => img.image_url) || []
        const categoryIds = company.company_categories?.map((cat: any) => cat.category_id) || []
        
        setFormData({
          company_name: company.company_name,
          business_number: company.business_number,
          intro_title: company.intro_title,
          ceo_name: company.ceo_name || '',
          manager_name: company.manager_name || '',
          manager_phone: company.manager_phone || '',
          manager_email: company.manager_email || '',
          website: company.website || '',
          parent_category: company.parent_category || '',
          category_ids: categoryIds,
          industries: company.industries || [],
          equipment_list: company.equipment || [],
          materials: company.materials || [],
          trl_level: company.trl_level || '',
          certifications: company.certifications || [],
          project_title: company.project_title || '',
          achievements: company.achievements || '',
          partners: company.partners || '',
          images: imageUrls,
          video_url: company.video_url || '',
          countries: company.countries || [],
          lead_time: company.lead_time || '',
          as_info: company.as_info || '',
          pricing_type: company.pricing_type || '',
          brand_color: company.brand_color || '#3B82F6',
        })
        toast.success('기업 정보를 불러왔습니다')
      } else {
        toast.error('기업 정보를 불러오는데 실패했습니다')
      }
    } catch {
      toast.error('기업 정보를 불러오는데 실패했습니다')
    } finally {
      setIsLoaded(true)
    }
  }

  const handleFieldChange = useCallback((field: keyof CompanyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleFieldsChange = useCallback((fields: Partial<CompanyFormData>) => {
    setFormData(prev => ({ ...prev, ...fields }))
  }, [])

  const handleTempSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem('company_draft', JSON.stringify(formData))
      toast.success('임시 저장되었습니다')
    } catch {
      toast.error('임시 저장에 실패했습니다')
    } finally {
      setIsSaving(false)
    }
  }

  const validateForm = (): { isValid: boolean; errorField?: string; section?: 'basic' | 'category' } => {
    if (!formData.company_name) {
      return { isValid: false, errorField: '기업명', section: 'basic' }
    }
    if (!formData.business_number) {
      return { isValid: false, errorField: '사업자번호', section: 'basic' }
    }
    if (!formData.ceo_name) {
      return { isValid: false, errorField: '대표자명', section: 'basic' }
    }
    return { isValid: true }
  }

  const scrollToSection = (section: 'basic' | 'category') => {
    const refs = {
      basic: basicInfoRef,
      category: categoryRef,
    }
    
    const targetRef = refs[section]
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        window.scrollBy(0, -100)
      }, 300)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateForm()
    if (!validation.isValid) {
      toast.error(`필수 항목을 입력해주세요: ${validation.errorField}`)
      if (validation.section) {
        scrollToSection(validation.section)
      }
      return
    }

    setIsSaving(true)
    try {
      const url = companyId ? `/api/companies/${companyId}` : '/api/companies'
      const method = companyId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || '저장에 실패했습니다.')
        return
      }

      toast.success(data.message || '기업 정보가 저장되었습니다.')
      localStorage.removeItem('company_draft')
      router.push('/my-company')
      router.refresh()
    } catch {
      toast.error('서버 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault()
    }
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {companyId ? '기업 정보 수정' : '기업 정보 등록'}
        </h1>
        <p className="text-gray-600">
          정확한 정보를 입력하시면 더 많은 고객에게 노출될 수 있습니다
        </p>
      </div>

      <Card className="p-6 space-y-8">
        <div ref={basicInfoRef}>
          <BasicInfoSection data={formData} onFieldChange={handleFieldChange} />
        </div>
        <Separator />
        <div ref={categoryRef}>
          <CategorySection data={formData} onFieldChange={handleFieldChange} onFieldsChange={handleFieldsChange} />
        </div>
        <Separator />
        <TechnicalSpecSection data={formData} onFieldChange={handleFieldChange} />
        <Separator />
        <ReferenceSection data={formData} onFieldChange={handleFieldChange} />
        <Separator />
        <TradingConditionSection data={formData} onFieldChange={handleFieldChange} />
        <Separator />
        <BrandingSection data={formData} onFieldChange={handleFieldChange} />
      </Card>

      <div className="flex gap-3 mt-6 sticky bottom-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleTempSave}
          disabled={isSaving}
          className="flex-1"
        >
          임시 저장
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? (companyId ? '수정 중...' : '등록 중...') : (companyId ? '수정 완료' : '등록 완료')}
        </Button>
      </div>
    </form>
  )
}

