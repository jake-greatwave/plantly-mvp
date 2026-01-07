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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { UpgradePrompt } from "@/components/ui/upgrade-prompt";
import { getCategories, getCategoriesByIds } from "@/lib/actions/categories";
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
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [selectedMiddleId, setSelectedMiddleId] = useState<string>("");
  const [categoryMap, setCategoryMap] = useState<Map<string, Category>>(new Map());
  const [isCustomCategoryEnabled, setIsCustomCategoryEnabled] = useState<boolean>(false);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>("");

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
      
      setCategoryMap((prevMap) => {
        const newMap = new Map(prevMap);
        categories.forEach((cat) => {
          newMap.set(cat.id, cat);
        });
        return newMap;
      });
      
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
    if (data.category_ids && data.category_ids.length > 0) {
      const loadCategoryNames = async () => {
        try {
          const categories = await getCategoriesByIds(data.category_ids || []);
          const newMap = new Map<string, Category>();
          categories.forEach((cat) => {
            newMap.set(cat.id, cat);
          });
          setCategoryMap((prevMap) => {
            const mergedMap = new Map(prevMap);
            newMap.forEach((value, key) => {
              mergedMap.set(key, value);
            });
            return mergedMap;
          });
        } catch (error) {
          console.error("카테고리 이름 로드 오류:", error);
        }
      };
      loadCategoryNames();
    }
  }, [data.category_ids]);

  useEffect(() => {
    if (data.custom_categories && data.custom_categories.length > 0) {
      setIsCustomCategoryEnabled(true);
    }
  }, [data.custom_categories]);

  useEffect(() => {
    if (selectedParentId) {
      loadMiddleCategories(selectedParentId);
    } else {
      setMiddleCategories([]);
      setSelectedMiddleId("");
    }
  }, [selectedParentId, loadMiddleCategories]);

  useEffect(() => {
    if (selectedMiddleId) {
      loadChildCategories(selectedMiddleId);
    } else {
      setChildCategories([]);
    }
  }, [selectedMiddleId, loadChildCategories]);

  const categoryIds = useMemo(
    () => data.category_ids || [],
    [data.category_ids]
  );

  const customCategories = useMemo(
    () => data.custom_categories || [],
    [data.custom_categories]
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

  const selectedCategories = useMemo(() => {
    const regularCategories = categoryIds
      .map((id) => {
        const category = categoryMap.get(id);
        return category ? { id, name: category.category_name, isCustom: false } : null;
      })
      .filter((cat): cat is { id: string; name: string; isCustom: boolean } => cat !== null);
    
    const customCategoriesList = customCategories.map((name, index) => ({
      id: `custom-${index}-${name}`,
      name,
      isCustom: true,
    }));

    return [...regularCategories, ...customCategoriesList];
  }, [categoryIds, categoryMap, customCategories]);

  const handleChildCategoryToggle = useCallback(
    (categoryId: string) => {
      if (categoryIds.includes(categoryId)) {
        onFieldChange(
          "category_ids",
          categoryIds.filter((id) => id !== categoryId)
        );
      } else {
        if (
          !canAddMore &&
          !isAdmin &&
          userGrade === "basic" &&
          categoryIds.length >= limits.maxCategoryTags
        ) {
          return;
        }
        onFieldChange("category_ids", [...categoryIds, categoryId]);
      }
    },
    [categoryIds, canAddMore, isAdmin, userGrade, limits.maxCategoryTags, onFieldChange]
  );

  const handleRemoveCategory = useCallback(
    (categoryId: string) => {
      if (categoryId.startsWith("custom-")) {
        const index = parseInt(categoryId.split("-")[1] || "0", 10);
        const newCustomCategories = customCategories.filter((_, i) => i !== index);
        onFieldChange("custom_categories", newCustomCategories);
      } else {
        onFieldChange(
          "category_ids",
          categoryIds.filter((id) => id !== categoryId)
        );
      }
    },
    [categoryIds, customCategories, onFieldChange]
  );

  const isChildCategoryDisabled = useCallback(
    (categoryId: string) => {
      if (categoryIds.includes(categoryId)) return false;
      if (canAddMore || isAdmin || isEnterprise) return false;
      return categoryIds.length + customCategories.length >= limits.maxCategoryTags;
    },
    [categoryIds, customCategories, canAddMore, isAdmin, isEnterprise, limits.maxCategoryTags]
  );

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">2. 카테고리</h3>
      </div>

      <div className="space-y-2">
        <Label>
          대분류
        </Label>
        {isLoadingParents ? (
          <div className="text-sm text-gray-500 py-2">로딩 중...</div>
        ) : (
          <Select
            value={selectedParentId}
            onValueChange={(value) => {
              setSelectedParentId(value);
              setSelectedMiddleId("");
            }}
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

      {selectedParentId && (middleCategories.length > 0 || isLoadingMiddle) && (
        <div className="space-y-2">
          <Label>
            중분류
          </Label>
          {isLoadingMiddle ? (
            <div className="text-sm text-gray-500 py-2">로딩 중...</div>
          ) : (
            <Select
              value={selectedMiddleId}
              onValueChange={(value) => {
                setSelectedMiddleId(value);
              }}
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

      {selectedMiddleId && (childCategories.length > 0 || isLoadingChildren) && (
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
                  {categoryIds.length + customCategories.length}/{limits.maxCategoryTags}개 선택됨
                </span>
              )}
          </div>
          {isLoadingChildren ? (
            <div className="text-sm text-gray-500 py-2">로딩 중...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-gray-200 rounded-lg p-4">
              {childCategories.map((category) => {
                const isChecked = categoryIds.includes(category.id);
                const isDisabled = isChildCategoryDisabled(category.id);

                return (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={isChecked}
                      onCheckedChange={() => handleChildCategoryToggle(category.id)}
                      disabled={isDisabled}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className={`text-sm font-normal flex-1 ${
                        isDisabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      {category.category_name}
                    </Label>
                  </div>
                );
              })}
              <div className="flex items-center space-x-2 col-span-full pt-2 border-t border-gray-200">
                <Checkbox
                  id="custom-category-checkbox"
                  checked={isCustomCategoryEnabled}
                  onCheckedChange={(checked) => {
                    setIsCustomCategoryEnabled(checked === true);
                    if (!checked) {
                      setCustomCategoryInput("");
                    }
                  }}
                  disabled={
                    !canAddMore &&
                    !isAdmin &&
                    userGrade === "basic" &&
                    categoryIds.length + customCategories.length >= limits.maxCategoryTags
                  }
                />
                <Label
                  htmlFor="custom-category-checkbox"
                  className="text-sm font-normal flex-1 cursor-pointer"
                >
                  기타: 직접입력
                </Label>
              </div>
              {isCustomCategoryEnabled && (
                <div className="col-span-full flex gap-1.5">
                  <Input
                    type="text"
                    placeholder="소분류를 직접 입력하세요"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customCategoryInput.trim()) {
                        e.preventDefault();
                        const trimmed = customCategoryInput.trim();
                        if (!customCategories.includes(trimmed)) {
                          if (
                            canAddMore ||
                            isAdmin ||
                            isEnterprise ||
                            categoryIds.length + customCategories.length < limits.maxCategoryTags
                          ) {
                            onFieldChange("custom_categories", [...customCategories, trimmed]);
                            setCustomCategoryInput("");
                          }
                        }
                      }
                    }}
                    className="flex-1 h-8 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customCategoryInput.trim()) {
                        const trimmed = customCategoryInput.trim();
                        if (!customCategories.includes(trimmed)) {
                          if (
                            canAddMore ||
                            isAdmin ||
                            isEnterprise ||
                            categoryIds.length + customCategories.length < limits.maxCategoryTags
                          ) {
                            onFieldChange("custom_categories", [...customCategories, trimmed]);
                            setCustomCategoryInput("");
                          }
                        }
                      }
                    }}
                    disabled={
                      !customCategoryInput.trim() ||
                      customCategories.includes(customCategoryInput.trim()) ||
                      (!canAddMore &&
                        !isAdmin &&
                        userGrade === "basic" &&
                        categoryIds.length + customCategories.length >= limits.maxCategoryTags)
                    }
                    className="px-2.5 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    추가
                  </button>
                </div>
              )}
            </div>
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

      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm">선택한 소분류</Label>
          <div className="flex flex-wrap gap-1.5 p-2.5 border border-gray-200 rounded-lg bg-gray-50">
            {selectedCategories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="bg-blue-100 text-blue-800 px-2 py-1 text-xs flex items-center gap-1.5"
              >
                <span>{category.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(category.id)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  aria-label={`${category.name} 제거`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>주력 산업군</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {INDUSTRIES.map((industry, index) => {
            const isChecked = (data.industries || []).includes(industry);
            return (
              <div key={`industry-${index}-${industry}`} className="flex items-center space-x-2">
                <Checkbox
                  id={`industry-${index}-${industry}`}
                  checked={isChecked}
                  onCheckedChange={() => {
                    const current = data.industries || [];
                    if (isChecked) {
                      onFieldChange(
                        "industries",
                        current.filter((v) => v !== industry)
                      );
                    } else {
                      onFieldChange("industries", [...current, industry]);
                    }
                  }}
                />
                <Label
                  htmlFor={`industry-${index}-${industry}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {industry}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
