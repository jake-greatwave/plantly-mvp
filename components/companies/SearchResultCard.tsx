"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, Star } from "lucide-react";
import type { Database } from "@/lib/types/database.types";

type Company = Database["public"]["Tables"]["companies"]["Row"] & {
  company_categories?: Array<{
    category_id: string;
    categories: {
      category_name: string;
      category_code: string;
    } | null;
  }>;
  company_images?: Array<{
    id: string;
    image_url: string;
    image_type: "main" | "portfolio" | "facility" | null;
    display_order: number;
  }>;
  company_tags?: Array<{
    id: string;
    tag_name: string;
  }>;
};

interface SearchResultCardProps {
  company: Company;
}

export function SearchResultCard({ company }: SearchResultCardProps) {
  const router = useRouter();

  const mainImage =
    company.company_images?.find((img) => img.image_type === "main")?.image_url ||
    company.logo_url;

  const industries = company.industries
    ? (typeof company.industries === "string"
        ? JSON.parse(company.industries)
        : company.industries)
    : null;

  const industryList = Array.isArray(industries)
    ? industries
    : typeof industries === "object" && industries !== null
    ? Object.values(industries)
    : [];

  const categories =
    company.company_categories
      ?.map((cc) => cc.categories?.category_name)
      .filter(Boolean) || [];

  const handleClick = () => {
    router.push(`/companies/${company.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="bg-white border-gray-200 overflow-hidden hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
    >
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={company.company_name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          {company.is_verified && (
            <Badge className="bg-blue-600 text-white">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              인증
            </Badge>
          )}
          {company.is_featured && (
            <Badge className="bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              추천
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-gray-900 font-semibold text-lg mb-2 line-clamp-1">
          {company.company_name}
        </h3>

        {company.intro_title && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {company.intro_title}
          </p>
        )}

        {industryList.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1.5">주력산업</p>
            <div className="flex flex-wrap gap-1.5">
              {industryList.slice(0, 3).map((industry, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 text-xs"
                >
                  {String(industry)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div className="mt-auto pt-2 border-t border-gray-100">
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 2).map((category, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs border-gray-300 text-gray-600"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

