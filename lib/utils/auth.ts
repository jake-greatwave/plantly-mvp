import { cookies } from 'next/headers'
import { verifyAccessToken } from './jwt'

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return null
    }

    const user = await verifyAccessToken(accessToken)
    return user
  } catch {
    return null
  }
}

