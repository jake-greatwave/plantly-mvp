'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { MainImageSection } from './MainImageSection'
import { BasicInfoSection } from './BasicInfoSection'
import { CategorySection } from './CategorySection'
import { TechnicalSpecSection } from './TechnicalSpecSection'
import { ReferenceSection } from './ReferenceSection'
import { TradingConditionSection } from './TradingConditionSection'
import { BrandingSection } from './BrandingSection'
import { ContentSection } from './ContentSection'
import type { CompanyFormData } from '@/lib/types/company-form.types'

const DEFAULT_FORM_DATA: Partial<CompanyFormData> = {
  main_image: '',
  brand_color: '#3B82F6',
  parent_category: '',
  middle_category: '',
  category_ids: [],
  industries: [],
  equipment_list: [],
  materials: [],
  certifications: [],
  images: [],
  countries: [],
  pricing_type: '',
  content: '',
}

interface CompanyRegisterFormProps {
  companyId?: string
  isAdmin?: boolean
  userGrade?: 'basic' | 'enterprise' | 'enterprise_trial'
}

export function CompanyRegisterForm({ companyId, isAdmin: initialIsAdmin = false, userGrade: initialUserGrade = 'basic' }: CompanyRegisterFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<CompanyFormData>>(DEFAULT_FORM_DATA)
  const formDataRef = useRef<Partial<CompanyFormData>>(DEFAULT_FORM_DATA)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isBusinessNumberVerified, setIsBusinessNumberVerified] = useState(false)
  const [userGrade, setUserGrade] = useState<'basic' | 'enterprise' | 'enterprise_trial'>(initialUserGrade as 'basic' | 'enterprise' | 'enterprise_trial')
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin)
  
  const basicInfoRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  const refreshUserInfo = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          const newGrade = data.user.userGrade as 'basic' | 'enterprise' | 'enterprise_trial'
          setUserGrade(newGrade || 'basic')
          setIsAdmin(data.user.isAdmin || false)
        }
      }
    } catch (error) {
      console.error('Failed to refresh user info:', error)
    }
  }

  useEffect(() => {
    if (companyId) {
      loadCompanyData(companyId)
    } else {
      const savedDraft = localStorage.getItem('company_draft')
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft)
          const normalizedData = {
            ...DEFAULT_FORM_DATA,
            ...parsed,
            parent_category: parsed.parent_category ? String(parsed.parent_category) : '',
            middle_category: parsed.middle_category ? String(parsed.middle_category) : '',
            category_ids: Array.isArray(parsed.category_ids) ? parsed.category_ids.map(String) : [],
            pricing_type: parsed.pricing_type ? String(parsed.pricing_type) : '',
          }
          setFormData(normalizedData)
          formDataRef.current = normalizedData
          toast.info('임시 저장된 데이터를 불러왔습니다')
        } catch (error) {
          console.error('임시 저장 데이터 불러오기 오류:', error)
          toast.error('임시 저장 데이터를 불러오는데 실패했습니다')
        }
      }
      setIsLoaded(true)
    }
  }, [companyId])

  useEffect(() => {
    setUserGrade(initialUserGrade as 'basic' | 'enterprise' | 'enterprise_trial')
    setIsAdmin(initialIsAdmin)
  }, [initialUserGrade, initialIsAdmin])


  const loadCompanyData = async (id: string) => {
    try {
      const response = await fetch(`/api/companies/${id}`)
      const result = await response.json()

      if (response.ok && result.success) {
        const company = result.data
        const mainImage = company.company_images?.find((img: any) => img.image_type === 'main')?.image_url || ''
        const imageUrls = company.company_images?.filter((img: any) => img.image_type !== 'main').map((img: any) => img.image_url) || []
        
        const parentCategory = company.company_categories?.find(
          (cc: any) => cc.categories?.parent_id === null
        )?.category_id
        
        const middleCategory = company.company_categories?.find(
          (cc: any) => cc.categories?.parent_id === parentCategory
        )?.category_id
        
        const subCategoryIds = company.company_categories
          ?.filter((cc: any) => {
            const parentId = cc.categories?.parent_id
            return parentId && parentId !== parentCategory && parentId === middleCategory
          })
          .map((cc: any) => cc.category_id) || []
        
        const fullAddress = company.address || ''
        const addressDetail = company.address_detail || ''
        
        let mainAddress = fullAddress
        if (addressDetail && fullAddress.includes(addressDetail)) {
          mainAddress = fullAddress.replace(addressDetail, '').trim()
        }

        const loadedData = {
          main_image: mainImage,
          company_name: company.company_name,
          business_number: company.business_number,
          intro_title: company.intro_title,
          ceo_name: company.ceo_name || '',
          manager_name: company.manager_name || '',
          manager_phone: company.manager_phone || '',
          manager_email: company.manager_email || '',
          website: company.website || '',
          postcode: company.postcode || '',
          address: mainAddress,
          address_detail: addressDetail,
          parent_category: parentCategory || '',
          middle_category: middleCategory || '',
          category_ids: subCategoryIds,
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
          content: company.content || '',
        }
        setFormData(loadedData)
        formDataRef.current = loadedData
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
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      formDataRef.current = updated
      return updated
    })
    if (field === 'business_number') {
      setIsBusinessNumberVerified(false)
    }
  }, [])

  const handleFieldsChange = useCallback((fields: Partial<CompanyFormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...fields }
      formDataRef.current = updated
      return updated
    })
  }, [])

  const handleTempSave = () => {
    setIsSaving(true)
    setFormData(currentData => {
      const dataToSave = { ...currentData }
      try {
        localStorage.setItem('company_draft', JSON.stringify(dataToSave))
        formDataRef.current = dataToSave
        toast.success('임시 저장되었습니다')
      } catch (error) {
        console.error('임시 저장 오류:', error)
        toast.error('임시 저장에 실패했습니다')
      }
      setIsSaving(false)
      return currentData
    })
  }

  const validateForm = (): { isValid: boolean; errorField?: string; section?: 'basic' | 'category' } => {
    if (!formData.main_image) {
      return { isValid: false, errorField: '대표 이미지', section: 'basic' }
    }
    if (!formData.company_name) {
      return { isValid: false, errorField: '기업명', section: 'basic' }
    }
    if (!formData.business_number) {
      return { isValid: false, errorField: '사업자번호', section: 'basic' }
    }
    if (!formData.ceo_name) {
      return { isValid: false, errorField: '대표자명', section: 'basic' }
    }
    if (!formData.address) {
      return { isValid: false, errorField: '주소', section: 'basic' }
    }
    if (!formData.address_detail) {
      return { isValid: false, errorField: '상세주소', section: 'basic' }
    }
    if (!formData.parent_category) {
      return { isValid: false, errorField: '대분류', section: 'category' }
    }
    if (!formData.middle_category) {
      return { isValid: false, errorField: '중분류', section: 'category' }
    }
    if (!formData.category_ids || formData.category_ids.length === 0) {
      return { isValid: false, errorField: '소분류', section: 'category' }
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

    if (!companyId && formData.business_number) {
      const cleanedNumber = formData.business_number.replace(/-/g, '')
      if (cleanedNumber.length === 10 && /^\d{10}$/.test(cleanedNumber)) {
        try {
          const verifyResponse = await fetch('/api/business/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              businessNumber: cleanedNumber,
            }),
          })

          const verifyResult = await verifyResponse.json()

          if (!verifyResult.success) {
            toast.error(verifyResult.error || '사업자등록번호 검증에 실패했습니다. 유효한 사업자등록번호를 입력해주세요.')
            if (basicInfoRef.current) {
              basicInfoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setTimeout(() => {
                window.scrollBy(0, -100)
              }, 300)
            }
            return
          }
        } catch (error) {
          console.error('Business verification error:', error)
          toast.error('사업자등록번호 검증 중 오류가 발생했습니다.')
          return
        }
      } else {
        toast.error('사업자등록번호는 10자리 숫자여야 합니다.')
        if (basicInfoRef.current) {
          basicInfoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => {
            window.scrollBy(0, -100)
          }, 300)
        }
        return
      }
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
        
        if (data.error?.includes('사업자등록번호')) {
          if (basicInfoRef.current) {
            basicInfoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setTimeout(() => {
              window.scrollBy(0, -100)
            }, 300)
          }
        }
        
        return
      }

      toast.success(data.message || '기업 정보가 저장되었습니다.')
      localStorage.removeItem('company_draft')
      router.push(isAdmin ? '/admin/companies' : '/my-company')
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
          <BasicInfoSection data={formData} onFieldChange={handleFieldChange} onVerificationChange={setIsBusinessNumberVerified} />
        </div>
        <Separator />
        <MainImageSection data={formData} onFieldChange={handleFieldChange} />
        <Separator />
        <div ref={categoryRef}>
          <CategorySection 
            data={formData} 
            onFieldChange={handleFieldChange} 
            onFieldsChange={handleFieldsChange} 
            userGrade={userGrade} 
            isAdmin={isAdmin}
            onUpgradeSuccess={refreshUserInfo}
            isLoaded={isLoaded}
          />
        </div>
        <Separator />
        <TechnicalSpecSection data={formData} onFieldChange={handleFieldChange} />
        <Separator />
        <ReferenceSection 
          data={formData} 
          onFieldChange={handleFieldChange} 
          userGrade={userGrade} 
          isAdmin={isAdmin}
          onUpgradeSuccess={refreshUserInfo}
        />
        <Separator />
        <TradingConditionSection data={formData} onFieldChange={handleFieldChange} />
        <Separator />
        <BrandingSection 
          data={formData} 
          onFieldChange={handleFieldChange} 
          userGrade={userGrade} 
          isAdmin={isAdmin}
          onUpgradeSuccess={refreshUserInfo}
        />
        <Separator />
        <ContentSection data={formData} onFieldChange={handleFieldChange} />
      </Card>

      <div className="flex gap-3 mt-6 sticky bottom-4 bg-white p-4 rounded-lg border border-gray-200 shadow-lg z-10">
        {!isAdmin && (
          <Button
            type="button"
            variant="outline"
            onClick={handleTempSave}
            disabled={isSaving}
            className="flex-1"
          >
            임시 저장
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSaving}
          className={isAdmin ? "w-full bg-blue-600 hover:bg-blue-700" : "flex-1 bg-blue-600 hover:bg-blue-700"}
        >
          {isSaving ? (companyId ? '수정 중...' : '등록 중...') : (companyId ? '수정 완료' : '등록 완료')}
        </Button>
      </div>
    </form>
  )
}

