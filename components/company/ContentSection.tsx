"use client";

import { memo } from "react";
import { Label } from "@/components/ui/label";
import { ContentEditor } from "./ContentEditor";
import type { CompanyFormData } from "@/lib/types/company-form.types";

interface ContentSectionProps {
  data: Partial<CompanyFormData>;
  onFieldChange: (field: keyof CompanyFormData, value: any) => void;
}

export const ContentSection = memo(function ContentSection({
  data,
  onFieldChange,
}: ContentSectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">8. 회사 소개글</h3>
        <p className="text-gray-600 text-sm">
          기업 소개, 제품 설명, 회사 문화 등을 자유롭게 작성해주세요
        </p>
      </div>
      <div className="space-y-2">
        <Label>게시글 내용</Label>
        <ContentEditor
          content={data.content || ""}
          onChange={(content) => onFieldChange("content", content)}
        />
      </div>
    </div>
  );
});
