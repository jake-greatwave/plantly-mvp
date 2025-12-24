import type { UserStatus, UserGrade } from './auth.types'

export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  status: UserStatus
  user_grade: UserGrade
  created_at: string
  updated_at: string
}

export interface UserWithCompany extends User {
  company?: {
    id: string
    company_name: string
    is_verified: boolean
    is_featured: boolean
  }
}

export interface UpdateUserRequest {
  name?: string
  phone?: string
}

export interface UpgradeGradeRequest {
  target_grade: UserGrade
}






