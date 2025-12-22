"use client";

import Image from "next/image";
import { Building2, Star, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CompanyDetail } from "@/lib/types/company-detail.types";

interface CompanyHeroProps {
  company: CompanyDetail;
  brandColor: string;
}

export function CompanyHero({ company, brandColor }: CompanyHeroProps) {
  const mainImage =
    company.company_images?.find((img) => img.image_type === "main")
      ?.image_url ||
    company.company_images?.sort((a, b) => a.display_order - b.display_order)[0]
      ?.image_url ||
    company.logo_url;

  const categories =
    company.company_categories
      ?.map((cc) => cc.categories?.category_name)
      .filter(Boolean) || [];

  return (
    <div className="relative w-full h-96 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {mainImage ? (
        <div className="absolute inset-0">
          <Image
            src={mainImage}
            alt={company.company_name}
            fill
            className="object-cover opacity-30"
            unoptimized
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Building2 className="w-32 h-32 text-white" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="relative z-10 h-full flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
          <div className="flex items-end gap-4 mb-4">
            {company.logo_url && (
              <div className="relative w-24 h-24 bg-white rounded-lg p-2 shadow-lg">
                <Image
                  src={company.logo_url}
                  alt={`${company.company_name} 로고`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1
                  className="text-4xl font-bold"
                  style={{ color: brandColor }}
                >
                  {company.company_name}
                </h1>
                {company.is_featured && (
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="w-4 h-4 mr-1" />
                    추천
                  </Badge>
                )}
              </div>
              {company.intro_title && (
                <p className="text-xl text-white/90 mb-3">
                  {company.intro_title}
                </p>
              )}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 3).map((category, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

