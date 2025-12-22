"use client";

import { useEffect, useState } from "react";
import { CompanyHero } from "@/components/company-detail/CompanyHero";
import { CompanyInfo } from "@/components/company-detail/CompanyInfo";
import { CompanyPortfolio } from "@/components/company-detail/CompanyPortfolio";
import { CompanyTechnical } from "@/components/company-detail/CompanyTechnical";
import { CompanyProjects } from "@/components/company-detail/CompanyProjects";
import { CompanyContact } from "@/components/company-detail/CompanyContact";
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

  return (
    <div className="space-y-6">
      <CompanyHero company={company} brandColor={brandColor} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CompanyPortfolio company={company} />
          <CompanyTechnical company={company} brandColor={brandColor} />
          <CompanyProjects company={company} brandColor={brandColor} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <CompanyInfo company={company} brandColor={brandColor} />
          <CompanyContact company={company} brandColor={brandColor} />
        </div>
      </div>
    </div>
  );
}

