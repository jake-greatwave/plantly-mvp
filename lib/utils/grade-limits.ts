import type { UserGrade } from '@/lib/types/auth.types'

export interface GradeLimits {
  maxImages: number
  maxTags: number
  canBeFeatured: boolean
  priority: number
}

export const GRADE_LIMITS: Record<UserGrade, GradeLimits> = {
  basic: {
    maxImages: 3,
    maxTags: 3,
    canBeFeatured: false,
    priority: 1,
  },
  enterprise: {
    maxImages: 10,
    maxTags: Infinity,
    canBeFeatured: true,
    priority: 2,
  },
}

export function getGradeLimits(grade: UserGrade): GradeLimits {
  return GRADE_LIMITS[grade]
}

export function canAddImage(currentCount: number, grade: UserGrade): boolean {
  const limits = getGradeLimits(grade)
  return currentCount < limits.maxImages
}

export function canAddTag(currentCount: number, grade: UserGrade): boolean {
  const limits = getGradeLimits(grade)
  return currentCount < limits.maxTags
}

export function getRemainingImages(currentCount: number, grade: UserGrade): number {
  const limits = getGradeLimits(grade)
  return Math.max(0, limits.maxImages - currentCount)
}

export function getRemainingTags(currentCount: number, grade: UserGrade): number {
  const limits = getGradeLimits(grade)
  if (limits.maxTags === Infinity) return Infinity
  return Math.max(0, limits.maxTags - currentCount)
}




