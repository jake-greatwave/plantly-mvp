'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface NavigationProps {
  isLoggedIn: boolean
  userName?: string
}

export function Navigation({ isLoggedIn, userName }: NavigationProps) {
  const router = useRouter()

  const handleRegisterClick = () => {
    if (!isLoggedIn) {
      toast.error('로그인이 필요합니다.')
      router.push('/login')
      return
    }
    router.push('/companies/register')
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        toast.success('로그아웃되었습니다.')
        router.push('/login')
        router.refresh()
      }
    } catch {
      toast.error('로그아웃 중 오류가 발생했습니다.')
    }
  }

  return (
    <nav className="flex items-center gap-3">
      <Button
        onClick={handleRegisterClick}
        variant="outline"
        className="border-blue-600 text-blue-600 hover:bg-blue-50"
      >
        기업정보 등록
      </Button>

      {isLoggedIn && (
        <Button asChild variant="ghost">
          <Link href="/my-company">우리 기업</Link>
        </Button>
      )}
      
      {isLoggedIn ? (
        <div className="flex items-center gap-3">
          {userName && (
            <span className="text-sm text-gray-700">{userName}님</span>
          )}
          <Button
            onClick={handleLogout}
            variant="ghost"
          >
            로그아웃
          </Button>
        </div>
      ) : (
        <Button asChild>
          <Link href="/login">로그인</Link>
        </Button>
      )}
    </nav>
  )
}

