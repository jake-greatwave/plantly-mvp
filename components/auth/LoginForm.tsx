'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import type { LoginRequest } from '@/lib/types/auth.types'
import { validateLoginRequest } from '@/lib/validations/auth.validation'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const loginData: LoginRequest = {
      email,
      password,
      remember,
    }

    const validationErrors = validateLoginRequest(loginData)
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0])
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || '로그인에 실패했습니다.')
        return
      }

      if (data.success) {
        toast.success('로그인에 성공했습니다.')
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      toast.error('서버 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            <Image
              src="/logo.png"
              alt="플랜틀리 로고"
              width={200}
              height={67}
              priority
            />
          </div>
          <h1 className="text-gray-900 mb-1 text-xl font-semibold">로그인</h1>
          <p className="text-gray-600 text-sm">플랜틀리에 오신 것을 환영합니다</p>
        </div>

        <Card className="bg-white rounded-lg border-gray-200 shadow-none">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-gray-900 text-sm">
                  이메일
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@company.com"
                    className="pl-9 py-2 h-auto border-gray-300 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-gray-900 text-sm">
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="pl-9 py-2 h-auto border-gray-300 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(checked) => setRemember(checked as boolean)}
                  />
                  <span className="text-sm text-gray-700">로그인 유지</span>
                </label>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push('/forgot-password')}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                >
                  비밀번호 찾기
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 h-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                아직 회원이 아니신가요?{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push('/signup')}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                >
                  회원가입
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
