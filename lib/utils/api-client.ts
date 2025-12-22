async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
    return response.ok
  } catch {
    return false
  }
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
  })

  if (response.status === 401) {
    const refreshed = await refreshToken()
    if (refreshed) {
      return fetch(url, {
        ...options,
        credentials: 'include',
      })
    }
  }

  return response
}


