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
    <Card className="p-6">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: brandColor }}
      >
        기술 정보
      </h2>

      <div className="space-y-6">
        {company.intro_content && (
          <div>
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: brandColor }}
            >
              회사 소개
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {company.intro_content}
            </p>
          </div>
        )}

        {company.trl_level && (
          <div>
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: brandColor }}
            >
              기술 성숙도 (TRL)
            </h3>
            <Badge
              variant="outline"
              className="text-base px-4 py-2"
              style={{ borderColor: brandColor, color: brandColor }}
            >
              {trlLabels[company.trl_level] || company.trl_level}
            </Badge>
          </div>
        )}

        {equipment.length > 0 && (
          <div>
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: brandColor }}
            >
              주요 장비
            </h3>
            <div className="flex flex-wrap gap-2">
              {equipment.map((item: unknown, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700"
                >
                  {String(item)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {materials.length > 0 && (
          <div>
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: brandColor }}
            >
              취급 재료
            </h3>
            <div className="flex flex-wrap gap-2">
              {materials.map((item: unknown, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700"
                >
                  {String(item)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

