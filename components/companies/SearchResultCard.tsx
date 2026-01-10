"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Star, MapPin } from "lucide-react";
import { formatAddressShort } from "@/lib/utils/address";
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
    company.company_images?.sort((a, b) => a.display_order - b.display_order)[0]?.image_url ||
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

  // 카테고리와 직접입력 태그를 모두 합쳐서 표시
  const categories =
    company.company_categories
      ?.map((cc) => cc.categories?.category_name)
      .filter(Boolean) || [];
  
  const tags = company.company_tags?.map((tag) => tag.tag_name) || [];
  const allTags = [...categories, ...tags];

  const handleClick = () => {
    router.push(`/companies/${company.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="bg-white border-gray-200 overflow-hidden hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
    >
      <div className="relative w-full h-48 bg-white overflow-hidden p-3">
        {mainImage ? (
          <div className="relative w-full h-full">
            <Image
              src={mainImage}
              alt={company.company_name}
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center rounded">
            <Building2 className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
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

        {company.address && (
          <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{formatAddressShort(company.address)}</span>
          </div>
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

        {allTags.length > 0 && (
          <div className="mt-auto pt-2 border-t border-gray-100">
            <div className="flex flex-wrap gap-1.5">
              {allTags.slice(0, 2).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs border-gray-300 text-gray-600"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

