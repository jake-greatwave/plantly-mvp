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
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="플랜틀리 로고"
              width={100}
              height={33}
              priority
            />
          </Link>
          
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

