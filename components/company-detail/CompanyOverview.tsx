"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Globe,
  Clock,
  Shield,
  DollarSign,
  MapPin,
  Calendar,
  User,
  Wrench,
  Package,
  Award,
  Briefcase,
} from "lucide-react";
import { formatFullAddress } from "@/lib/utils/address";
import type { CompanyDetail } from "@/lib/types/company-detail.types";

interface CompanyOverviewProps {
  company: CompanyDetail;
  brandColor: string;
}

export function CompanyOverview({ company, brandColor }: CompanyOverviewProps) {
  const industries = company.industries
    ? Array.isArray(company.industries)
      ? company.industries
      : typeof company.industries === "string"
      ? JSON.parse(company.industries)
      : Object.values(company.industries)
    : [];

  const certifications = company.certifications
    ? Array.isArray(company.certifications)
      ? company.certifications
      : typeof company.certifications === "string"
      ? JSON.parse(company.certifications)
      : Object.values(company.certifications)
    : [];

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

  const countries =
    company.company_regions
      ?.filter((cr) => cr.regions && cr.regions.region_type === "country")
      .map((cr) => cr.regions?.region_name)
      .filter(Boolean) || [];

  const pricingLabels: Record<string, string> = {
    fixed: "고정 단가제",
    consultation: "상담 후 결정",
    project_based: "프로젝트별 상이",
  };

  const trlLabels: Record<string, string> = {
    prototype: "프로토타입",
    mass_production: "양산 적용 가능",
    global_standard: "글로벌 표준",
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 pb-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              기본 정보
            </h3>
            <div className="space-y-3">
              {company.establishment_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">설립일</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(company.establishment_date)}
                    </p>
                  </div>
                </div>
              )}

              {company.ceo_name && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">대표자</p>
                    <p className="text-sm font-medium text-gray-900">
                      {company.ceo_name}
                    </p>
                  </div>
                </div>
              )}

              {company.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">주소</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatFullAddress(
                        company.address,
                        company.address_detail
                      )}
                    </p>
                  </div>
                </div>
              )}

              {industries.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">주력산업</p>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((industry: unknown, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        style={{
                          backgroundColor: `${brandColor}15`,
                          color: brandColor,
                        }}
                      >
                        {String(industry)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {certifications.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">인증/자격</p>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert: unknown, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-gray-300 text-gray-700"
                      >
                        {String(cert)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">연락처</h3>
            <div className="space-y-3">
              {company.manager_name && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">담당자</p>
                  <p className="text-sm font-medium text-gray-900">
                    {company.manager_name}
                    {company.manager_position &&
                      ` (${company.manager_position})`}
                  </p>
                </div>
              )}

              {company.manager_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                  <a
                    href={`tel:${company.manager_phone}`}
                    className="text-sm text-gray-900 hover:underline transition-colors"
                    style={{ color: brandColor }}
                  >
                    {company.manager_phone}
                  </a>
                </div>
              )}

              {company.manager_email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                  <a
                    href={`mailto:${company.manager_email}`}
                    className="text-sm hover:underline break-all transition-colors"
                    style={{ color: brandColor }}
                  >
                    {company.manager_email}
                  </a>
                </div>
              )}

              {company.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400 shrink-0" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline break-all transition-colors"
                    style={{ color: brandColor }}
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              대응 가능 국가
            </h3>
            <div className="space-y-3">
              {countries.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {countries.map((country, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 text-gray-700"
                      >
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {company.lead_time && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">납기</p>
                    <p className="text-sm font-medium text-gray-900">
                      {company.lead_time}
                    </p>
                  </div>
                </div>
              )}

              {company.pricing_type && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">가격 정책</p>
                    <p className="text-sm font-medium text-gray-900">
                      {pricingLabels[company.pricing_type] ||
                        company.pricing_type}
                    </p>
                  </div>
                </div>
              )}

              {company.as_info && (
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">A/S 정보</p>
                    <p className="text-sm font-medium text-gray-900">
                      {company.as_info}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-6 border-b border-gray-200 md:border-b-0 md:border-r border-gray-200 md:pr-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              기술 정보
            </h3>
            <div className="space-y-3">
              {company.intro_content && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1.5">
                    회사 소개
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-3">
                    {company.intro_content}
                  </p>
                </div>
              )}

              {company.trl_level && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1.5">
                    기술 성숙도
                  </h4>
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
                  <h4 className="text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                    <Wrench className="w-4 h-4" />
                    주요 장비
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {equipment
                      .slice(0, 5)
                      .map((item: unknown, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700"
                        >
                          {String(item)}
                        </Badge>
                      ))}
                    {equipment.length > 5 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700"
                      >
                        +{equipment.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {materials.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    취급 재료
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {materials
                      .slice(0, 5)
                      .map((item: unknown, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700"
                        >
                          {String(item)}
                        </Badge>
                      ))}
                    {materials.length > 5 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700"
                      >
                        +{materials.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-6 md:pl-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5" style={{ color: brandColor }} />
              프로젝트 & 성과
            </h3>
            <div className="space-y-3">
              {company.project_title && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1.5">
                    주요 프로젝트
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                    {company.project_title}
                  </p>
                </div>
              )}

              {company.achievements && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    주요 성과
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-3">
                    {company.achievements}
                  </p>
                </div>
              )}

              {company.partners && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1.5">
                    주요 파트너
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-2">
                    {company.partners}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
