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
    <Card className="p-6">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: brandColor }}
      >
        프로젝트 & 성과
      </h2>

      <div className="space-y-6">
        {company.project_title && (
          <div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: brandColor }}
            >
              주요 프로젝트
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {company.project_title}
            </p>
          </div>
        )}

        {company.achievements && (
          <div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: brandColor }}
            >
              주요 성과
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {company.achievements}
            </p>
          </div>
        )}

        {company.partners && (
          <div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: brandColor }}
            >
              주요 파트너
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {company.partners}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

