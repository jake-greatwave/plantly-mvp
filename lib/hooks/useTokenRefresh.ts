'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function useTokenRefresh() {
  const isRefreshing = useRef(false)
  const hasRedirected = useRef(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // 로그인/회원가입 페이지에서는 토큰 리프레시를 시도하지 않음
    if (pathname?.startsWith('/login') || pathname?.startsWith('/signup')) {
      return
    }

    const refreshToken = async () => {
      // 이미 리다이렉트가 발생했거나 리프레시 중이면 건너뛰기
      if (isRefreshing.current || hasRedirected.current) {
        return
      }

      // 로그인/회원가입 페이지에서는 토큰 리프레시를 시도하지 않음
      if (pathname?.startsWith('/login') || pathname?.startsWith('/signup')) {
        return
      }

      isRefreshing.current = true

      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          if (response.status === 401 || response.status === 403) {
            // 이미 로그인 페이지에 있으면 리다이렉트하지 않음
            if (pathname?.startsWith('/login') || pathname?.startsWith('/signup')) {
              isRefreshing.current = false
              return
            }

            // 중복 리다이렉트 방지
            if (hasRedirected.current) {
              isRefreshing.current = false
              return
            }

            hasRedirected.current = true
            await fetch('/api/auth/logout', {
              method: 'POST',
              credentials: 'include',
            }).catch(() => {})
            
            router.push('/login')
            return
          }
          console.error('Token refresh failed:', data.error || 'Unknown error')
        }
      } catch (error) {
        console.error('Token refresh error:', error)
        
        // 이미 로그인 페이지에 있으면 리다이렉트하지 않음
        if (pathname?.startsWith('/login') || pathname?.startsWith('/signup')) {
          isRefreshing.current = false
          return
        }

        // 중복 리다이렉트 방지
        if (hasRedirected.current) {
          isRefreshing.current = false
          return
        }

        hasRedirected.current = true
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          }).catch(() => {})
        } catch {}
        
        router.push('/login')
      } finally {
        isRefreshing.current = false
      }
    }

    refreshToken()

    const refreshInterval = setInterval(refreshToken, 13 * 60 * 1000)

    const handleFocus = () => {
      // 로그인/회원가입 페이지에서는 토큰 리프레시를 시도하지 않음
      if (!pathname?.startsWith('/login') && !pathname?.startsWith('/signup')) {
        refreshToken()
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // 로그인/회원가입 페이지에서는 토큰 리프레시를 시도하지 않음
        if (!pathname?.startsWith('/login') && !pathname?.startsWith('/signup')) {
          refreshToken()
        }
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(refreshInterval)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pathname, router])
}

