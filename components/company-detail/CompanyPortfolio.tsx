"use client";

import { Card } from "@/components/ui/card";
import { CompanyImageCarousel } from "./CompanyImageCarousel";
import { CompanyVideo } from "./CompanyVideo";
import type { CompanyDetail } from "@/lib/types/company-detail.types";

interface CompanyPortfolioProps {
  company: CompanyDetail;
}

export function CompanyPortfolio({ company }: CompanyPortfolioProps) {
  const images =
    company.company_images?.sort((a, b) => a.display_order - b.display_order) ||
    [];

  const hasContent = images.length > 0 || company.video_url;

  if (!hasContent) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">포트폴리오</h2>

      <div className="space-y-6">
        {images.length > 0 && <CompanyImageCarousel images={images} />}
        {company.video_url && <CompanyVideo videoUrl={company.video_url} />}
      </div>
    </Card>
  );
}


