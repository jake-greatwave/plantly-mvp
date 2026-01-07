"use client";

import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadField } from "@/components/forms/FileUploadField";
import { UpgradePrompt } from "@/components/ui/upgrade-prompt";
import { getEffectiveLimits } from "@/lib/utils/grade-limits";
import type { CompanyFormData } from "@/lib/types/company-form.types";
import type { UserGrade } from "@/lib/types/auth.types";

interface ReferenceSectionProps {
  data: Partial<CompanyFormData>;
  onFieldChange: (field: keyof CompanyFormData, value: any) => void;
  userGrade?: UserGrade;
  isAdmin?: boolean;
  onUpgradeSuccess?: () => void;
}

export const ReferenceSection = memo(function ReferenceSection({
  data,
  onFieldChange,
  userGrade = "basic",
  isAdmin = false,
  onUpgradeSuccess,
}: ReferenceSectionProps) {
  const limits = getEffectiveLimits(userGrade, isAdmin);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          4. 주요 또는 최근 레퍼런스
        </h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_title">프로젝트 제목</Label>
        <Input
          id="project_title"
          value={data.project_title || ""}
          onChange={(e) => onFieldChange("project_title", e.target.value)}
          placeholder="예: OOO사 스티어링휠 EOL 성능 검사기 구축"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="achievements">주요 성과</Label>
        <Textarea
          id="achievements"
          value={data.achievements || ""}
          onChange={(e) => onFieldChange("achievements", e.target.value)}
          placeholder="예: 사이클 타임 15% 단축, 불량률 2% 개선"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="partners">파트너사 (공개용)</Label>
        <Input
          id="partners"
          value={data.partners || ""}
          onChange={(e) => onFieldChange("partners", e.target.value)}
          placeholder="예: 현대차, 삼성전자 등"
        />
      </div>
    </div>
  );
});
