'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReadOnlyField } from './ReadOnlyField'

interface AccountInfo {
  id: string
  email: string
  name: string
  phone: string | null
  status: string
  user_grade: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

interface AccountInfoFormProps {
  initialData: AccountInfo | null
  onUpdate: () => void
}

export function AccountInfoForm({ initialData, onUpdate }: AccountInfoFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setPhone(initialData.phone || '')
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('이름을 입력해주세요.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || '계정 정보 수정에 실패했습니다.')
        return
      }

      if (data.success) {
        toast.success('계정 정보가 수정되었습니다.')
        onUpdate()
        router.refresh()
      }
    } catch (err) {
      toast.error('서버 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!initialData) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusLabel = (status: string) => {
    return status === 'active' ? '활성' : '비활성'
  }

  const getGradeLabel = (grade: string) => {
    const labels: Record<string, string> = {
      basic: '베이직',
      enterprise: '엔터프라이즈',
      enterprise_trial: '엔터프라이즈 트라이얼',
    }
    return labels[grade] || grade
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>계정 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ReadOnlyField label="이메일" value={initialData.email} />
          <ReadOnlyField label="사용자 등급" value={getGradeLabel(initialData.user_grade)} />
          <ReadOnlyField label="가입일" value={formatDate(initialData.created_at)} />
          <ReadOnlyField label="최종 수정일" value={formatDate(initialData.updated_at)} />

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-gray-900 text-sm">
              이름
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="pl-9 py-2 h-auto border-gray-300 focus-visible:ring-blue-600 focus-visible:border-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-gray-900 text-sm">
              연락처
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="연락처를 입력하세요 (선택사항)"
                className="pl-9 py-2 h-auto border-gray-300 focus-visible:ring-blue-600 focus-visible:border-blue-600"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 h-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

