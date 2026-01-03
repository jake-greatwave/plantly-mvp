"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CompanyDetail } from "@/lib/types/company-detail.types";

interface CompanyTechnicalProps {
  company: CompanyDetail;
  brandColor: string;
}

export function CompanyTechnical({ company, brandColor }: CompanyTechnicalProps) {
  const equipment = company.equipment
    ? Array.isArray(company.equipment)
      ? company.equipment
      : typeof company.equipment === "string"
      ? JSON.parse(company.equipment)
      : Object.values(company.equipment)
    : [];

  const materials = company.materials
    ? Array.isArray(company.materials)
      ? company.materials
      : typeof company.materials === "string"
      ? JSON.parse(company.materials)
      : Object.values(company.materials)
    : [];

  const hasContent =
    equipment.length > 0 ||
    materials.length > 0 ||
    company.trl_level ||
    company.intro_content;

  if (!hasContent) {
    return null;
  }

  const trlLabels: Record<string, string> = {
    prototype: "프로토타입",
    mass_production: "양산 적용 가능",
    global_standard: "글로벌 표준",
  };

  return (
    <Card className="p-4">
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: brandColor }}
      >
        기술 정보
      </h3>

      <div className="space-y-4">
        {company.intro_content && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1.5">회사 소개</h4>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-3">
              {company.intro_content}
            </p>
          </div>
        )}

        {company.trl_level && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1.5">기술 성숙도</h4>
            <Badge
              variant="outline"
              className="text-xs px-2 py-1"
              style={{ borderColor: brandColor, color: brandColor }}
            >
              {trlLabels[company.trl_level] || company.trl_level}
            </Badge>
          </div>
        )}

        {equipment.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1.5">주요 장비</h4>
            <div className="flex flex-wrap gap-1.5">
              {equipment.slice(0, 5).map((item: unknown, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700"
                >
                  {String(item)}
                </Badge>
              ))}
              {equipment.length > 5 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  +{equipment.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {materials.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1.5">취급 재료</h4>
            <div className="flex flex-wrap gap-1.5">
              {materials.slice(0, 5).map((item: unknown, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700"
                >
                  {String(item)}
                </Badge>
              ))}
              {materials.length > 5 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  +{materials.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

