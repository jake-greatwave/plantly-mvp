'use client'

import { memo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { formatBusinessNumber } from '@/lib/utils/format'
import { AddressInput } from '@/components/forms/AddressInput'
import { toast } from 'sonner'
import type { CompanyFormData } from '@/lib/types/company-form.types'

interface BasicInfoSectionProps {
  data: Partial<CompanyFormData>
  onFieldChange: (field: keyof CompanyFormData, value: any) => void
  onVerificationChange?: (isVerified: boolean) => void
}

export const BasicInfoSection = memo(function BasicInfoSection({ data, onFieldChange, onVerificationChange }: BasicInfoSectionProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')

  const handleBusinessNumberChange = (value: string) => {
    const formatted = formatBusinessNumber(value)
    onFieldChange('business_number', formatted)
    setVerificationStatus('idle')
  }

  const handlePhoneChange = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    onFieldChange('manager_phone', numbers)
  }

  const handleVerifyBusinessNumber = async () => {
    const businessNumber = data.business_number
    if (!businessNumber) {
      toast.error('사업자등록번호를 입력해주세요.')
      return
    }

    const cleanedNumber = businessNumber.replace(/-/g, '')
    if (cleanedNumber.length !== 10) {
      toast.error('사업자등록번호는 10자리 숫자여야 합니다.')
      return
    }

    setIsVerifying(true)
    setVerificationStatus('idle')

    try {
      const response = await fetch('/api/business/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessNumber: cleanedNumber,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setVerificationStatus('valid')
        toast.success('유효한 사업자등록번호입니다.')
        onVerificationChange?.(true)
      } else {
        setVerificationStatus('invalid')
        toast.error(result.error || '사업자등록번호 검증에 실패했습니다.')
        onVerificationChange?.(false)
      }
    } catch (error) {
      setVerificationStatus('invalid')
      toast.error('사업자등록번호 검증 중 오류가 발생했습니다.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">1. 기본 정보</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">
            기업명 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="company_name"
            value={data.company_name || ''}
            onChange={(e) => onFieldChange('company_name', e.target.value)}
            placeholder="국문/영문 정식 명칭"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_number">
            사업자번호 <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="business_number"
              value={data.business_number || ''}
              onChange={(e) => handleBusinessNumberChange(e.target.value)}
              onBlur={handleVerifyBusinessNumber}
              placeholder="000-00-00000"
              maxLength={12}
              required
              className={`flex-1 ${
                verificationStatus === 'valid'
                  ? 'border-green-500'
                  : verificationStatus === 'invalid'
                  ? 'border-red-500'
                  : ''
              }`}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleVerifyBusinessNumber}
              disabled={isVerifying || !data.business_number}
              className="shrink-0"
            >
              {isVerifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : verificationStatus === 'valid' ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : verificationStatus === 'invalid' ? (
                <XCircle className="w-4 h-4 text-red-600" />
              ) : (
                '확인'
              )}
            </Button>
          </div>
          {verificationStatus === 'invalid' && (
            <p className="text-xs text-red-500">유효하지 않은 사업자등록번호입니다.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="intro_title">한 줄 요약</Label>
        <Input
          id="intro_title"
          value={data.intro_title || ''}
          onChange={(e) => onFieldChange('intro_title', e.target.value.slice(0, 30))}
          placeholder="예: 자동차 부품 생산기술 및 자동화 라인 구축 전문"
          maxLength={30}
        />
        <p className="text-xs text-gray-500">{data.intro_title?.length || 0}/30자</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ceo_name">
            대표자명 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ceo_name"
            value={data.ceo_name || ''}
            onChange={(e) => onFieldChange('ceo_name', e.target.value)}
            placeholder="대표자 성함"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager_name">담당자명</Label>
          <Input
            id="manager_name"
            value={data.manager_name || ''}
            onChange={(e) => onFieldChange('manager_name', e.target.value)}
            placeholder="실무 담당자 성함"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manager_phone">연락처</Label>
          <Input
            id="manager_phone"
            value={data.manager_phone || ''}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="01012345678"
            maxLength={11}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager_email">이메일</Label>
          <Input
            id="manager_email"
            type="email"
            value={data.manager_email || ''}
            onChange={(e) => onFieldChange('manager_email', e.target.value)}
            placeholder="contact@company.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">기업 홈페이지</Label>
        <Input
          id="website"
          type="url"
          value={data.website || ''}
          onChange={(e) => onFieldChange('website', e.target.value)}
          placeholder="https://www.company.com"
        />
      </div>

      <AddressInput
        value={{
          postcode: data.postcode,
          address: data.address,
          addressDetail: data.address_detail,
        }}
        onChange={(value) => {
          onFieldChange('postcode', value.postcode)
          onFieldChange('address', value.address)
          onFieldChange('address_detail', value.addressDetail)
        }}
        required
        postcodeLabel="우편번호"
        addressLabel="주소"
        addressDetailLabel="상세주소"
      />
    </div>
  )
})

