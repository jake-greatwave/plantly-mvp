'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock, User, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { SignUpRequest } from '@/lib/types/auth.types'
import { validateSignUpRequest } from '@/lib/validations/auth.validation'
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '@/lib/constants/terms'
import { formatPhoneNumber } from '@/lib/utils/format'

export function SignUpForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhoneNumber(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== passwordConfirm) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return
    }

    if (!agreeTerms) {
      toast.error('이용약관에 동의해주세요.')
      return
    }

    if (!agreePrivacy) {
      toast.error('개인정보처리방침에 동의해주세요.')
      return
    }

    const signUpData: SignUpRequest = {
      email,
      password,
      name,
      phone: phone || undefined,
    }

    const validationErrors = validateSignUpRequest(signUpData)
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0])
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || '회원가입에 실패했습니다.')
        return
      }

      if (data.success) {
        toast.success('회원가입이 완료되었습니다. 로그인해주세요.')
        router.push('/login')
      }
    } catch (err) {
      toast.error('서버 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <Image
              src="/logo.svg"
              alt="플랜틀리 로고"
              width={120}
              height={40}
              priority
            />
          </div>
          <h1 className="text-gray-900 mb-1 text-xl font-semibold">회원가입</h1>
          <p className="text-gray-600 text-sm">플랜틀리에 오신 것을 환영합니다</p>
        </div>

        <Card className="bg-white rounded-lg border-gray-200 shadow-none">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-gray-900 text-sm">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름 입력"
                    className="pl-9 py-2 h-auto border-gray-300 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-gray-900 text-sm">
                  이메일 <span className="text-red-500">*</span>
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

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-gray-900 text-sm">
                  연락처
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="010-1234-5678"
                    maxLength={13}
                    className="pl-9 py-2 h-auto border-gray-300 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-gray-900 text-sm">
                  비밀번호 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8자 이상 입력"
                    className="pl-9 py-2 h-auto border-gray-300 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="passwordConfirm" className="text-gray-900 text-sm">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    id="passwordConfirm"
                    type="password"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="비밀번호 재입력"
                    className="pl-9 py-2 h-auto border-gray-300 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-3 space-y-2.5 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    />
                    <span className="text-sm text-gray-700">
                      이용약관 동의 <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="link"
                        className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm"
                      >
                        보기
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>이용약관</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[60vh] pr-4">
                        <div className="whitespace-pre-wrap text-sm text-gray-700">
                          {TERMS_OF_SERVICE}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={agreePrivacy}
                      onCheckedChange={(checked) => setAgreePrivacy(checked as boolean)}
                    />
                    <span className="text-sm text-gray-700">
                      개인정보처리방침 동의 <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="link"
                        className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm"
                      >
                        보기
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>개인정보처리방침</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[60vh] pr-4">
                        <div className="whitespace-pre-wrap text-sm text-gray-700">
                          {PRIVACY_POLICY}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 h-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? '가입 중...' : '회원가입'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push('/login')}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                >
                  로그인
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

