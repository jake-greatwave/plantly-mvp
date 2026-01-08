"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User } from "lucide-react";
import { formatFullAddress } from "@/lib/utils/address";
import type { CompanyDetail } from "@/lib/types/company-detail.types";

interface CompanyInfoProps {
  company: CompanyDetail;
  brandColor: string;
}

export function CompanyInfo({ company, brandColor }: CompanyInfoProps) {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <Card className="p-6">
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: brandColor }}
      >
        기업 정보
      </h2>

      <div className="space-y-4">
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

        {company.address && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500">주소</p>
              <p className="text-sm font-medium text-gray-900">
                {formatFullAddress(company.address, company.address_detail)}
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
    </Card>
  );
}

