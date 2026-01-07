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
