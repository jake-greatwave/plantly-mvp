"use client";

import { memo, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelectField } from "@/components/forms/MultiSelectField";
import { COUNTRIES } from "@/lib/types/company-form.types";
import { X, Plus } from "lucide-react";
import type { CompanyFormData } from "@/lib/types/company-form.types";

interface TradingConditionSectionProps {
  data: Partial<CompanyFormData>;
  onFieldChange: (field: keyof CompanyFormData, value: any) => void;
}

export const TradingConditionSection = memo(function TradingConditionSection({
  data,
  onFieldChange,
}: TradingConditionSectionProps) {
  const allCountries = data.countries || [];
  const selectedFromList = allCountries.filter((country) =>
    COUNTRIES.includes(country)
  );
  const customCountries = allCountries.filter(
    (country) => !COUNTRIES.includes(country)
  );
  const [isCustomCountryEnabled, setIsCustomCountryEnabled] = useState<boolean>(
    customCountries.length > 0
  );
  const [customCountryInput, setCustomCountryInput] = useState<string>("");
  const [isComposing, setIsComposing] = useState<boolean>(false);

  useEffect(() => {
    const customCountries = allCountries.filter(
      (country) => !COUNTRIES.includes(country)
    );
    setIsCustomCountryEnabled(customCountries.length > 0);
    setCustomCountryInput("");
  }, [data.countries]);

  const handleSelectedCountriesChange = (value: string[]) => {
    onFieldChange("countries", [...value, ...customCountries]);
  };

  const handleRemoveCountry = (countryToRemove: string) => {
    const newCountries = allCountries.filter(
      (country) => country !== countryToRemove
    );
    onFieldChange("countries", newCountries);
  };

  const handleAddCustomCountry = () => {
    if (
      customCountryInput.trim() &&
      !customCountries.includes(customCountryInput.trim())
    ) {
      onFieldChange("countries", [...allCountries, customCountryInput.trim()]);
      setCustomCountryInput("");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">5. 대응 가능 국가</h3>
      </div>

      <div className="space-y-2">
        <Label>대응 가능 국가</Label>
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <MultiSelectField
            options={COUNTRIES}
            value={selectedFromList}
            onChange={handleSelectedCountriesChange}
            columns={3}
          />
          <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
            <Checkbox
              id="custom-country-checkbox"
              checked={isCustomCountryEnabled}
              onCheckedChange={(checked) => {
                setIsCustomCountryEnabled(checked === true);
                if (!checked) {
                  setCustomCountryInput("");
                  // 직접입력한 국가들 제거
                  const newCountries = allCountries.filter((country) =>
                    COUNTRIES.includes(country)
                  );
                  onFieldChange("countries", newCountries);
                }
              }}
            />
            <Label
              htmlFor="custom-country-checkbox"
              className="text-sm font-normal flex-1 cursor-pointer"
            >
              기타: 직접입력
            </Label>
          </div>
          {isCustomCountryEnabled && (
            <div className="flex gap-1.5">
              <Input
                type="text"
                placeholder="국가를 직접 입력하세요"
                value={customCountryInput}
                onChange={(e) => setCustomCountryInput(e.target.value)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !isComposing &&
                    customCountryInput.trim()
                  ) {
                    e.preventDefault();
                    handleAddCustomCountry();
                  }
                }}
                className="flex-1 h-8 text-sm"
              />
              <button
                type="button"
                onClick={handleAddCustomCountry}
                disabled={
                  !customCountryInput.trim() ||
                  customCountries.includes(customCountryInput.trim())
                }
                className="px-2.5 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                추가
              </button>
            </div>
          )}
        </div>
      </div>

      {allCountries.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm">선택한 국가</Label>
          <div className="flex flex-wrap gap-1.5 p-2.5 border border-gray-200 rounded-lg bg-gray-50">
            {allCountries.map((country) => (
              <Badge
                key={country}
                variant="secondary"
                className="bg-blue-100 text-blue-800 px-2 py-1 text-xs flex items-center gap-1.5"
              >
                <span>{country}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCountry(country)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  aria-label={`${country} 제거`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
