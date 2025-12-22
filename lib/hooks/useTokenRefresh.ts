'use client'

import { useEffect, useRef } from 'react'

export function useTokenRefresh() {
  const isRefreshing = useRef(false)

  useEffect(() => {
    const refreshToken = async () => {
      if (isRefreshing.current) {
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
            await fetch('/api/auth/logout', {
              method: 'POST',
              credentials: 'include',
            }).catch(() => {})
            window.location.href = '/login'
            return
          }
          console.error('Token refresh failed:', data.error || 'Unknown error')
        }
      } catch (error) {
        console.error('Token refresh error:', error)
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          }).catch(() => {})
        } catch {}
        window.location.href = '/login'
      } finally {
        isRefreshing.current = false
      }
    }

    refreshToken()

    const refreshInterval = setInterval(refreshToken, 13 * 60 * 1000)

    const handleFocus = () => {
      refreshToken()
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshToken()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(refreshInterval)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
}

