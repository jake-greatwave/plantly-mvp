"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Globe,
  Clock,
  Shield,
  DollarSign,
  MapPin,
} from "lucide-react";
import { formatAddressShort } from "@/lib/utils/address";
import type { CompanyDetail } from "@/lib/types/company-detail.types";

interface CompanyContactProps {
  company: CompanyDetail;
  brandColor: string;
}

export function CompanyContact({ company, brandColor }: CompanyContactProps) {
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

  return (
    <Card className="p-6">
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: brandColor }}
      >
        연락처 & 거래 조건
      </h2>

      <div className="space-y-4">
        {company.manager_name && (
          <div>
            <p className="text-sm text-gray-500 mb-1">담당자</p>
            <p className="text-sm font-medium text-gray-900">
              {company.manager_name}
              {company.manager_position && ` (${company.manager_position})`}
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

        {company.address && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500">주소</p>
              <p className="text-sm text-gray-900">
                {company.address}
                {company.address_detail && ` ${company.address_detail}`}
              </p>
            </div>
          </div>
        )}

        {countries.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">대응 가능 국가</p>
            <div className="flex flex-wrap gap-2">
              {countries.map((country, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                >
                  {country}
                </span>
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
                {pricingLabels[company.pricing_type] || company.pricing_type}
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
    </Card>
  );
}

