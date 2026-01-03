"use client";

import { Card } from "@/components/ui/card";
import type { CompanyDetail } from "@/lib/types/company-detail.types";

interface CompanyProjectsProps {
  company: CompanyDetail;
  brandColor: string;
}

export function CompanyProjects({ company, brandColor }: CompanyProjectsProps) {
  const hasContent =
    company.project_title || company.achievements || company.partners;

  if (!hasContent) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: brandColor }}
      >
        프로젝트 & 성과
      </h3>

      <div className="space-y-4">
        {company.project_title && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1.5">주요 프로젝트</h4>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
              {company.project_title}
            </p>
          </div>
        )}

        {company.achievements && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1.5">주요 성과</h4>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-3">
              {company.achievements}
            </p>
          </div>
        )}

        {company.partners && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1.5">주요 파트너</h4>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-2">
              {company.partners}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

