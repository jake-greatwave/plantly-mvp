'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AccountInfoForm } from './AccountInfoForm'
import { PasswordChangeForm } from './PasswordChangeForm'
import { Separator } from '@/components/ui/separator'

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

export function AccountSettingsContent() {
  const router = useRouter()
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccountInfo = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/account')

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '계정 정보를 불러오는데 실패했습니다.')
      }

      const data = await response.json()

      if (data.success && data.data) {
        setAccountInfo(data.data)
      } else {
        throw new Error('계정 정보를 찾을 수 없습니다.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccountInfo()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={() => router.push('/')} variant="outline">
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">계정 설정</h1>
          <p className="text-gray-600 mt-1">계정 정보를 수정하고 비밀번호를 변경할 수 있습니다.</p>
        </div>

        <div className="space-y-6">
          <AccountInfoForm initialData={accountInfo} onUpdate={fetchAccountInfo} />
          
          <Separator />
          
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  )
}

