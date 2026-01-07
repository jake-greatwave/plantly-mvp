import type { UserGrade } from "@/lib/types/auth.types";

export interface GradeLimits {
  maxCategoryTags: number;
  maxImages: number;
  canUploadImages: boolean;
  canUploadVideo: boolean;
  canCustomizeColor: boolean;
  canBeFeatured: boolean;
  priority: number;
}

export const GRADE_LIMITS: Record<UserGrade, GradeLimits> = {
  basic: {
    maxCategoryTags: 2,
    maxImages: 2,
    canUploadImages: true,
    canUploadVideo: false,
    canCustomizeColor: false,
    canBeFeatured: false,
    priority: 1,
  },
  enterprise: {
    maxCategoryTags: 20,
    maxImages: 10,
    canUploadImages: true,
    canUploadVideo: true,
    canCustomizeColor: true,
    canBeFeatured: true,
    priority: 2,
  },
  enterprise_trial: {
    maxCategoryTags: 20,
    maxImages: 10,
    canUploadImages: true,
    canUploadVideo: true,
    canCustomizeColor: true,
    canBeFeatured: true,
    priority: 2,
  },
};

export function getGradeLimits(grade: UserGrade): GradeLimits {
  return GRADE_LIMITS[grade];
}

export function canAddCategoryTag(
  currentCount: number,
  grade: UserGrade,
  isAdmin: boolean = false
): boolean {
  if (isAdmin) return true;
  const limits = getGradeLimits(grade);
  return currentCount < limits.maxCategoryTags;
}

export function canAddImage(
  currentCount: number,
  grade: UserGrade,
  isAdmin: boolean = false
): boolean {
  if (isAdmin) return true;
  const limits = getGradeLimits(grade);
  if (!limits.canUploadImages) return false;
  return currentCount < limits.maxImages;
}

export function getRemainingCategoryTags(
  currentCount: number,
  grade: UserGrade,
  isAdmin: boolean = false
): number {
  if (isAdmin) return Infinity;
  const limits = getGradeLimits(grade);
  if (limits.maxCategoryTags === Infinity) return Infinity;
  return Math.max(0, limits.maxCategoryTags - currentCount);
}

export function getRemainingImages(
  currentCount: number,
  grade: UserGrade,
  isAdmin: boolean = false
): number {
  if (isAdmin) return Infinity;
  const limits = getGradeLimits(grade);
  if (!limits.canUploadImages) return 0;
  if (limits.maxImages === Infinity) return Infinity;
  return Math.max(0, limits.maxImages - currentCount);
}

export function getEffectiveLimits(
  grade: UserGrade,
  isAdmin: boolean = false
): GradeLimits {
  if (isAdmin) {
    return {
      maxCategoryTags: Infinity,
      maxImages: Infinity,
      canUploadImages: true,
      canUploadVideo: true,
      canCustomizeColor: true,
      canBeFeatured: true,
      priority: 999,
    };
  }
  return getGradeLimits(grade);
}

export function isEnterpriseGrade(grade: UserGrade): boolean {
  return grade === "enterprise" || grade === "enterprise_trial";
}

export function shouldShowUpgradePrompt(
  grade: UserGrade,
  isAdmin: boolean
): boolean {
  if (isAdmin) return false;
  return grade === "basic";
}
