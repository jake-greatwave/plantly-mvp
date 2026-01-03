"use client";

import { useEffect, useState, memo, useCallback, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelectField } from "@/components/forms/MultiSelectField";
import { UpgradePrompt } from "@/components/ui/upgrade-prompt";
import { getCategories } from "@/lib/actions/categories";
import { INDUSTRIES } from "@/lib/types/company-form.types";
import {
  getGradeLimits,
  canAddCategoryTag,
  getEffectiveLimits,
  isEnterpriseGrade,
} from "@/lib/utils/grade-limits";
import type { CompanyFormData } from "@/lib/types/company-form.types";
import type { UserGrade } from "@/lib/types/auth.types";
import type { Database } from "@/lib/types/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface CategorySectionProps {
  data: Partial<CompanyFormData>;
  onFieldChange: (field: keyof CompanyFormData, value: any) => void;
  onFieldsChange: (fields: Partial<CompanyFormData>) => void;
  userGrade?: UserGrade;
  isAdmin?: boolean;
  onUpgradeSuccess?: () => void;
  isLoaded?: boolean;
}

export const CategorySection = memo(function CategorySection({
  data,
  onFieldChange,
  onFieldsChange,
  userGrade = "basic",
  isAdmin = false,
  onUpgradeSuccess,
  isLoaded = false,
}: CategorySectionProps) {
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [middleCategories, setMiddleCategories] = useState<Category[]>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [isLoadingParents, setIsLoadingParents] = useState(true);
  const [isLoadingMiddle, setIsLoadingMiddle] = useState(false);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [loadedParentCategoryId, setLoadedParentCategoryId] =
    useState<string>("");
  const [loadedMiddleCategoryId, setLoadedMiddleCategoryId] =
    useState<string>("");

  const loadParentCategories = useCallback(async () => {
    try {
      setIsLoadingParents(true);
      const categories = await getCategories(null);
      setParentCategories(categories);
    } catch (error) {
      console.error("대분류 로드 오류:", error);
    } finally {
      setIsLoadingParents(false);
    }
  }, []);

  const loadMiddleCategories = useCallback(async (parentId: string) => {
    try {
      setIsLoadingMiddle(true);
      const categories = await getCategories(parentId);
      setMiddleCategories(categories);
      return categories;
    } catch (error) {
      console.error("중분류 로드 오류:", error);
      return [];
    } finally {
      setIsLoadingMiddle(false);
    }
  }, []);

  const loadChildCategories = useCallback(async (middleId: string) => {
    try {
      setIsLoadingChildren(true);
      const categories = await getCategories(middleId);
      setChildCategories(categories);
      return categories;
    } catch (error) {
      console.error("소분류 로드 오류:", error);
      return [];
    } finally {
      setIsLoadingChildren(false);
    }
  }, []);

  useEffect(() => {
    loadParentCategories();
  }, [loadParentCategories]);

  useEffect(() => {
    if (
      !isLoadingParents &&
      parentCategories.length > 0 &&
      data.parent_category &&
      data.parent_category.trim() !== ""
    ) {
      if (loadedParentCategoryId !== data.parent_category) {
        const parentExists = parentCategories.some(
          (cat) => cat.id === data.parent_category
        );
        if (parentExists) {
          loadMiddleCategories(data.parent_category).then(() => {
            setLoadedParentCategoryId(data.parent_category || "");
            if (data.middle_category) {
              loadChildCategories(data.middle_category).then(() => {
                setLoadedMiddleCategoryId(data.middle_category || "");
              });
            } else {
              setChildCategories([]);
              setLoadedMiddleCategoryId("");
            }
          });
        }
      }
    } else if (
      !isLoadingParents &&
      (!data.parent_category || data.parent_category.trim() === "")
    ) {
      if (loadedParentCategoryId !== "") {
        setMiddleCategories([]);
        setChildCategories([]);
        setIsLoadingMiddle(false);
        setIsLoadingChildren(false);
        setLoadedParentCategoryId("");
        setLoadedMiddleCategoryId("");
      }
    }
  }, [
    isLoadingParents,
    data.parent_category,
    loadedParentCategoryId,
    parentCategories,
    loadMiddleCategories,
    data.middle_category,
    loadChildCategories,
  ]);

  useEffect(() => {
    if (
      !isLoadingMiddle &&
      middleCategories.length > 0 &&
      data.middle_category &&
      data.middle_category.trim() !== ""
    ) {
      if (loadedMiddleCategoryId !== data.middle_category) {
        const middleExists = middleCategories.some(
          (cat) => cat.id === data.middle_category
        );
        if (middleExists) {
          loadChildCategories(data.middle_category).then(() => {
            setLoadedMiddleCategoryId(data.middle_category || "");
          });
        }
      }
    } else if (
      !isLoadingMiddle &&
      (!data.middle_category || data.middle_category.trim() === "")
    ) {
      if (loadedMiddleCategoryId !== "") {
        setChildCategories([]);
        setIsLoadingChildren(false);
        setLoadedMiddleCategoryId("");
      }
    }
  }, [
    isLoadingMiddle,
    data.middle_category,
    loadedMiddleCategoryId,
    middleCategories,
    loadChildCategories,
  ]);

  const categoryIds = useMemo(
    () => data.category_ids || [],
    [data.category_ids]
  );
  const limits = useMemo(
    () => getEffectiveLimits(userGrade, isAdmin),
    [userGrade, isAdmin]
  );
  const isEnterprise = useMemo(() => isEnterpriseGrade(userGrade), [userGrade]);
  const canAddMore = useMemo(
    () =>
      canAddCategoryTag(categoryIds.length, userGrade, isAdmin) || isEnterprise,
    [categoryIds.length, userGrade, isAdmin, isEnterprise]
  );

  const disabledOptions = useMemo(() => {
    return canAddMore || isAdmin || isEnterprise
      ? []
      : childCategories
          .map((c) => c.id)
          .filter((id) => !categoryIds.includes(id));
  }, [canAddMore, isAdmin, isEnterprise, childCategories, categoryIds]);

  const parentCategoryValue = useMemo(() => {
    if (
      isLoadingParents ||
      !data.parent_category ||
      data.parent_category.trim() === ""
    ) {
      return undefined;
    }
    if (parentCategories.length === 0) {
      return undefined;
    }
    const exists = parentCategories.some(
      (cat) => cat.id === data.parent_category
    );
    return exists ? data.parent_category : undefined;
  }, [
    isLoadingParents,
    data.parent_category,
    parentCategories.length,
    parentCategories,
  ]);

  const middleCategoryValue = useMemo(() => {
    if (
      isLoadingMiddle ||
      !data.middle_category ||
      data.middle_category.trim() === ""
    ) {
      return undefined;
    }
    if (middleCategories.length === 0) {
      return undefined;
    }
    const exists = middleCategories.some(
      (cat) => cat.id === data.middle_category
    );
    return exists ? data.middle_category : undefined;
  }, [
    isLoadingMiddle,
    data.middle_category,
    middleCategories.length,
    middleCategories,
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">2. 카테고리</h3>
      </div>

      <div className="space-y-2">
        <Label>
          대분류 <span className="text-red-500">*</span>
        </Label>
        {isLoadingParents ? (
          <div className="text-sm text-gray-500 py-2">로딩 중...</div>
        ) : (
          <Select
            key={`parent-select-${parentCategories.length}-${
              parentCategoryValue || "empty"
            }`}
            value={parentCategoryValue}
            onValueChange={(value) =>
              onFieldsChange({
                parent_category: value,
                middle_category: "",
                category_ids: [],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="대분류 선택" />
            </SelectTrigger>
            <SelectContent>
              {parentCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {(middleCategories.length > 0 ||
        (data.parent_category && isLoadingMiddle)) && (
        <div className="space-y-2">
          <Label>
            중분류 <span className="text-red-500">*</span>
          </Label>
          {isLoadingMiddle ? (
            <div className="text-sm text-gray-500 py-2">로딩 중...</div>
          ) : (
            <Select
              key={`middle-select-${middleCategories.length}-${
                middleCategoryValue || "empty"
              }`}
              value={middleCategoryValue}
              onValueChange={(value) =>
                onFieldsChange({ middle_category: value, category_ids: [] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="중분류 선택" />
              </SelectTrigger>
              <SelectContent>
                {middleCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {(childCategories.length > 0 ||
        (data.middle_category && isLoadingChildren)) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              소분류 (실무 키워드 태그) <span className="text-red-500">*</span>
            </Label>
            {!isAdmin &&
              !isEnterprise &&
              userGrade === "basic" &&
              limits.maxCategoryTags !== Infinity && (
                <span className="text-xs text-gray-500">
                  {categoryIds.length}/{limits.maxCategoryTags}개 선택됨
                </span>
              )}
          </div>
          {isLoadingChildren ? (
            <div className="text-sm text-gray-500 py-2">로딩 중...</div>
          ) : (
            <MultiSelectField
              options={childCategories.map((c) => ({
                value: c.id,
                label: c.category_name,
              }))}
              value={categoryIds.filter((id) =>
                childCategories.some((c) => c.id === id)
              )}
              onChange={(value) => onFieldChange("category_ids", value)}
              maxSelections={
                limits.maxCategoryTags === Infinity
                  ? undefined
                  : limits.maxCategoryTags
              }
              disabledOptions={disabledOptions}
            />
          )}
          {!canAddMore && !isAdmin && userGrade === "basic" && (
            <UpgradePrompt
              feature="소분류 태그"
              upgradeSource="소분류 태그"
              onUpgradeSuccess={onUpgradeSuccess}
            />
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>주력 산업군</Label>
        <MultiSelectField
          options={INDUSTRIES}
          value={data.industries || []}
          onChange={(value) => onFieldChange("industries", value)}
          columns={3}
        />
      </div>
    </div>
  );
});
