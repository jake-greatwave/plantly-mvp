import Link from 'next/link'
import Image from 'next/image'
import { headers } from 'next/headers'
import { Navigation } from './Navigation'
import { getCurrentUser } from '@/lib/utils/auth'

export async function Header() {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
  
  if (isAuthPage) {
    return null
  }

  const user = await getCurrentUser()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 gap-2">
          {/* 모바일: 로고 가운데 정렬 (절대 위치), 데스크톱: 왼쪽 */}
          <Link 
            href="/" 
            className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex items-center shrink-0 z-10"
          >
            <Image
              src="/logo.png"
              alt="플랜틀리 로고"
              width={180}
              height={60}
              priority
              className="w-auto h-20 md:h-auto md:w-[180px]"
            />
          </Link>
          
          {/* 모바일: 왼쪽 공간 (햄버거 버튼용), 데스크톱: 숨김 */}
          <div className="md:hidden w-10" />
          
          <Navigation 
            isLoggedIn={!!user} 
            userName={user?.name}
            isAdmin={user?.isAdmin || false}
          />
        </div>
      </div>
    </header>
  )
}

