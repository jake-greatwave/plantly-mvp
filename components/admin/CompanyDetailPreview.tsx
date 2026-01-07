"use client";

import { useEffect, useState } from "react";
import { CompanyHero } from "@/components/company-detail/CompanyHero";
import { CompanyOverview } from "@/components/company-detail/CompanyOverview";
import { CompanyVideo } from "@/components/company-detail/CompanyVideo";
import { CompanyContent } from "@/components/company-detail/CompanyContent";
import { CompanyImageGallery } from "@/components/company-detail/CompanyImageGallery";
import { getGradientBackground } from "@/lib/utils/color";
import type { CompanyDetail } from "@/lib/types/company-detail.types";

interface CompanyDetailPreviewProps {
  companyId: string;
}

export function CompanyDetailPreview({ companyId }: CompanyDetailPreviewProps) {
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/admin/companies/${companyId}/detail`);
        const result = await response.json();

        if (response.ok && result.success) {
          setCompany(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch company:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (!company) {
    return <div className="text-center py-8 text-gray-500">기업 정보를 불러올 수 없습니다.</div>;
  }

  const brandColor = company.brand_color || "#3B82F6";
  const gradientBackground = getGradientBackground(brandColor);

  return (
    <div className="min-h-screen" style={{ background: gradientBackground }}>
      <CompanyHero company={company} brandColor={brandColor} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <CompanyOverview company={company} brandColor={brandColor} />
          {company.video_url && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: brandColor }}
              >
                기업소개 동영상
              </h2>
              <CompanyVideo videoUrl={company.video_url} />
            </div>
          )}
          <CompanyContent company={company} />
          <CompanyImageGallery company={company} />
        </div>
      </div>
    </div>
  );
}

