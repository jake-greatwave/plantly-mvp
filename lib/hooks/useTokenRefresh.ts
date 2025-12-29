'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const AUTH_REQUIRED_PATHS = [
  '/companies/register',
  '/companies/edit',
  '/my-company',
  '/admin',
  '/account',
]

function isAuthRequiredPath(pathname: string | null): boolean {
  if (!pathname) return false
  return AUTH_REQUIRED_PATHS.some(path => pathname.startsWith(path))
}

export function useTokenRefresh() {
  const isRefreshing = useRef(false)
  const hasRedirected = useRef(false)
  const pathname = usePathname()
  const router = useRouter()
  const lastRefreshTime = useRef<number>(0)

  const refreshToken = useCallback(async () => {
    if (pathname?.startsWith('/login') || pathname?.startsWith('/signup')) {
      return
    }

    if (isRefreshing.current || hasRedirected.current) {
      return
    }

    const now = Date.now()
    if (now - lastRefreshTime.current < 5000) {
      return
    }

    isRefreshing.current = true
    lastRefreshTime.current = now

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
          if (pathname?.startsWith('/login') || pathname?.startsWith('/signup')) {
            isRefreshing.current = false
            return
          }

          if (hasRedirected.current) {
            isRefreshing.current = false
            return
          }

          if (isAuthRequiredPath(pathname)) {
            hasRedirected.current = true
            await fetch('/api/auth/logout', {
              method: 'POST',
              credentials: 'include',
            }).catch(() => {})
            
            router.push('/login')
          }
          return
        }
        console.error('Token refresh failed:', data.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      
      if (pathname?.startsWith('/login') || pathname?.startsWith('/signup')) {
        isRefreshing.current = false
        return
      }

      if (hasRedirected.current) {
        isRefreshing.current = false
        return
      }

      if (isAuthRequiredPath(pathname)) {
        hasRedirected.current = true
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          }).catch(() => {})
        } catch {}
        
        router.push('/login')
      }
    } finally {
      isRefreshing.current = false
    }
  }, [pathname, router])

  useEffect(() => {
    if (pathname?.startsWith('/login') || pathname?.startsWith('/signup')) {
      return
    }

    refreshToken()

    const refreshInterval = setInterval(refreshToken, 13 * 60 * 1000)

    const handleFocus = () => {
      if (!pathname?.startsWith('/login') && !pathname?.startsWith('/signup')) {
        refreshToken()
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
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
  }, [pathname, refreshToken])
}

