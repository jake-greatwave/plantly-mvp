"use client";

import { memo, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { FileUploadField } from "@/components/forms/FileUploadField";
import { UpgradePrompt } from "@/components/ui/upgrade-prompt";
import { getEffectiveLimits } from "@/lib/utils/grade-limits";
import type { CompanyFormData } from "@/lib/types/company-form.types";
import type { UserGrade } from "@/lib/types/auth.types";

interface DetailImageSectionProps {
  data: Partial<CompanyFormData>;
  onFieldChange: (field: keyof CompanyFormData, value: any) => void;
  userGrade?: UserGrade;
  isAdmin?: boolean;
  onUpgradeSuccess?: () => void;
}

export const DetailImageSection = memo(function DetailImageSection({
  data,
  onFieldChange,
  userGrade = "basic",
  isAdmin = false,
  onUpgradeSuccess,
}: DetailImageSectionProps) {
  const limits = getEffectiveLimits(userGrade, isAdmin);
  const currentImageCount = (data.images || []).length;
  const isBasicGrade = userGrade === "basic" && !isAdmin;
  const freeImageLimit = 1;
  const canUploadMore =
    isAdmin || userGrade === "enterprise" || userGrade === "enterprise_trial";
  const needsUpgrade = isBasicGrade && currentImageCount >= freeImageLimit;

  const maxFiles = useMemo(() => {
    if (isAdmin) return Infinity;
    if (canUploadMore) return limits.maxImages;
    return freeImageLimit;
  }, [isAdmin, canUploadMore, limits.maxImages]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">9. 상세페이지 등록</h3>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">[안내 가이드]</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            네이버나 쿠팡에서 물건을 살 때, 아래로 쭉 내려보며 읽던 긴 설명
            이미지를 보신 적 있나요? 그게 바로 '상세페이지'입니다.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            우리 회사의 기술력, 보유 설비, 공정 과정을 담은 '온라인용
            카탈로그'라고 생각하시면 됩니다.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            고객은 사장님을 만나기 전에 이 상세페이지를 보고 기술력을
            판단합니다. 가지고 계신 회사 소개서(PDF)나 카탈로그를 이미지로
            변환해서 올려주셔도 좋습니다.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>이미지 업로드</Label>
        {needsUpgrade ? (
          <>
            <FileUploadField
              value={data.images || []}
              onChange={(value) => onFieldChange("images", value)}
              maxFiles={freeImageLimit}
              disabled={true}
            />
            <UpgradePrompt
              feature="상세 이미지"
              upgradeSource="상세 이미지"
              variant="inline"
              onUpgradeSuccess={onUpgradeSuccess}
            >
              상세페이지 이미지는 기본 1개 (세로 최대 5,000px) 가능하며,
              <br />
              추가 등록 또는 세로 길이 연장은 Enterprise 등급 업그레이드를 통해
              가능합니다.
            </UpgradePrompt>
          </>
        ) : (
          <>
            <FileUploadField
              value={data.images || []}
              onChange={(value) => onFieldChange("images", value)}
              maxFiles={maxFiles}
            />
            {isBasicGrade && (
              <UpgradePrompt
                feature="상세 이미지"
                upgradeSource="상세 이미지"
                variant="inline"
                onUpgradeSuccess={onUpgradeSuccess}
              >
                상세페이지 이미지는 기본 1개 (세로 최대 5,000px) 가능하며,
                <br />
                추가 등록 또는 세로 길이 연장은 Enterprise 등급 업그레이드를
                통해 가능합니다.
              </UpgradePrompt>
            )}
          </>
        )}
        <p className="text-sm text-gray-500">
          여기에 상세페이지 이미지를 등록해 주세요. (권장 너비: 860px / JPG, PNG
          파일)
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          💡 자료가 없거나, 만들 시간이 부족하신가요? 걱정하지 마세요.
          플랜틀리가 직접 찾아뵙고, 우리 회사의 기술력이 돋보이도록 기획부터
          상세페이지 제작까지 완벽하게 해결해 드립니다. 문의하기 : 카카오톡
          "플랜틀리주식회사" 검색
        </p>
      </div>
    </div>
  );
});
