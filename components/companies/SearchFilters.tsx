"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelectField } from "@/components/forms/MultiSelectField";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { getCategories } from "@/lib/actions/categories";
import { getRegions } from "@/lib/actions/regions";
import { INDUSTRIES, COUNTRIES } from "@/lib/types/company-form.types";
import type { Database } from "@/lib/types/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface SearchFiltersProps {
  onFilterChange?: () => void;
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Array<{ id: string; name: string }>>([]);

  const currentSearch = searchParams.get("search") || "";
  const urlParentCategory = searchParams.get("parent_category_id") || "";
  const urlSubCategory = searchParams.get("category_id") || "";
  const urlIndustries = searchParams.get("industries")?.split(",").filter(Boolean) || [];
  const urlCountries = searchParams.get("countries")?.split(",").filter(Boolean) || [];
  const urlIsVerified = searchParams.get("is_verified") === "true";
  const urlIsFeatured = searchParams.get("is_featured") === "true";

  const [parentCategory, setParentCategory] = useState(urlParentCategory);
  const [subCategory, setSubCategory] = useState(urlSubCategory);
  const [industries, setIndustries] = useState<string[]>(urlIndustries);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(urlCountries);
  const [isVerified, setIsVerified] = useState(urlIsVerified);
  const [isFeatured, setIsFeatured] = useState(urlIsFeatured);

  useEffect(() => {
    setParentCategory(urlParentCategory);
    setSubCategory(urlSubCategory);
    setIndustries(urlIndustries);
    setSelectedCountries(urlCountries);
    setIsVerified(urlIsVerified);
    setIsFeatured(urlIsFeatured);
  }, [searchParams]);

  useEffect(() => {
    loadParentCategories();
    loadCountries();
  }, []);

  useEffect(() => {
    if (parentCategory) {
      loadSubCategories(parentCategory);
    } else {
      setSubCategories([]);
    }
  }, [parentCategory]);

  const loadParentCategories = async () => {
    const categories = await getCategories(null);
    setParentCategories(categories || []);
  };

  const loadSubCategories = async (parentId: string) => {
    const categories = await getCategories(parentId);
    setSubCategories(categories || []);
  };

  const loadCountries = async () => {
    const regions = await getRegions("country");
    setCountries(
      (regions || []).map((r) => ({
        id: r.id,
        name: r.region_name,
      }))
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (currentSearch) {
      params.set("search", currentSearch);
    }
    params.set("page", "1");

    if (parentCategory) {
      params.set("parent_category_id", parentCategory);
    }
    if (subCategory) {
      params.set("category_id", subCategory);
    }
    if (industries.length > 0) {
      params.set("industries", industries.join(","));
    }
    if (selectedCountries.length > 0) {
      params.set("countries", selectedCountries.join(","));
    }
    if (isVerified) {
      params.set("is_verified", "true");
    }
    if (isFeatured) {
      params.set("is_featured", "true");
    }

    router.push(`/companies?${params.toString()}`);
    onFilterChange?.();
  };

  const handleParentCategoryChange = (value: string) => {
    setParentCategory(value);
    setSubCategory("");
  };

  const handleSubCategoryChange = (value: string) => {
    setSubCategory(value);
  };

  const handleIndustriesChange = (values: string[]) => {
    setIndustries(values);
  };

  const handleCountriesChange = (values: string[]) => {
    setSelectedCountries(values);
  };

  const handleIsVerifiedChange = (checked: boolean) => {
    setIsVerified(checked);
  };

  const handleIsFeaturedChange = (checked: boolean) => {
    setIsFeatured(checked);
  };

  const clearAllFilters = () => {
    setParentCategory("");
    setSubCategory("");
    setIndustries([]);
    setSelectedCountries([]);
    setIsVerified(false);
    setIsFeatured(false);
  };

  const hasActiveFilters =
    parentCategory ||
    subCategory ||
    industries.length > 0 ||
    selectedCountries.length > 0 ||
    isVerified ||
    isFeatured;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-7 text-xs text-gray-600 hover:text-gray-900"
            >
              <X className="w-3 h-3 mr-1" />
              필터 초기화
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">메가 카테고리</Label>
          <Select
            value={parentCategory || undefined}
            onValueChange={handleParentCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              {parentCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {subCategories.length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs">세부 공정 태그</Label>
            <Select
              value={subCategory || undefined}
              onValueChange={handleSubCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                {subCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1">
          <Label className="text-xs">주력 산업군</Label>
          <MultiSelectField
            options={INDUSTRIES.map((ind) => ({ value: ind, label: ind }))}
            value={industries}
            onChange={handleIndustriesChange}
            columns={2}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">대응 가능 국가</Label>
          <MultiSelectField
            options={COUNTRIES.map((country) => ({ value: country, label: country }))}
            value={selectedCountries}
            onChange={handleCountriesChange}
            columns={2}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">인증 여부</Label>
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="is_verified"
              checked={isVerified}
              onCheckedChange={handleIsVerifiedChange}
            />
            <label
              htmlFor="is_verified"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              인증 기업만
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">추천 여부</Label>
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="is_featured"
              checked={isFeatured}
              onCheckedChange={handleIsFeaturedChange}
            />
            <label
              htmlFor="is_featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              추천 기업만
            </label>
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Button onClick={applyFilters} size="sm" className="bg-blue-600 hover:bg-blue-700">
          검색하기
        </Button>
      </div>
    </div>
  );
}

