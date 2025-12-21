export type UserStatus = 'active' | 'suspended'

export type UserGrade = 'basic' | 'enterprise'

export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  success: boolean
  message?: string
  user?: {
    id: string
    email: string
    name: string
    status: UserStatus
    user_grade: UserGrade
  }
  error?: string
}

export interface SignUpRequest {
  email: string
  password: string
  name: string
  phone?: string
}

export interface AuthError {
  field?: string
  message: string
}
