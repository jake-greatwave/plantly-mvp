import type { LoginRequest, SignUpRequest } from '@/lib/types/auth.types'

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9-]+$/
  return phoneRegex.test(phone)
}

export const validateBusinessNumber = (businessNumber: string): boolean => {
  const cleaned = businessNumber.replace(/-/g, '')
  return cleaned.length === 10
}

export const validateLoginRequest = (data: LoginRequest): string[] => {
  const errors: string[] = []

  if (!data.email) {
    errors.push('이메일을 입력해주세요.')
  } else if (!validateEmail(data.email)) {
    errors.push('올바른 이메일 형식이 아닙니다.')
  }

  if (!data.password) {
    errors.push('비밀번호를 입력해주세요.')
  }

  return errors
}

export const validateSignUpRequest = (data: SignUpRequest): string[] => {
  const errors: string[] = []

  if (!validateEmail(data.email)) {
    errors.push('올바른 이메일 형식이 아닙니다.')
  }

  if (!validatePassword(data.password)) {
    errors.push('비밀번호는 8자 이상이어야 합니다.')
  }

  if (!data.name) {
    errors.push('이름을 입력해주세요.')
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('올바른 연락처 형식이 아닙니다.')
  }

  return errors
}
