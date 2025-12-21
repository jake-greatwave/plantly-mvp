'use client'

import { useEffect } from 'react'

export function useTokenRefresh() {
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })

        if (!response.ok) {
          console.error('Token refresh failed')
        }
      } catch (error) {
        console.error('Token refresh error:', error)
      }
    }, 14 * 60 * 1000)

    return () => clearInterval(refreshInterval)
  }, [])
}

