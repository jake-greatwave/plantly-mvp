"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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

interface RecentCompanyCardProps {
  company: Company;
}

function RecentCompanyCard({ company }: RecentCompanyCardProps) {
  const router = useRouter();

  const mainImage =
    company.company_images?.find((img) => img.image_type === "main")?.image_url ||
    company.company_images?.sort((a, b) => a.display_order - b.display_order)[0]?.image_url ||
    company.logo_url;

  // 카테고리와 직접입력 태그를 모두 합쳐서 표시
  const categories =
    company.company_categories
      ?.map((cc) => cc.categories?.category_name)
      .filter(Boolean) || [];
  
  const tags = company.company_tags?.map((tag) => tag.tag_name) || [];
  const allTags = [...categories, ...tags];

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

  const handleClick = () => {
    router.push(`/companies/${company.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="bg-white border-gray-200 overflow-hidden hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex">
        <div className="relative w-28 h-28 flex-shrink-0 bg-white overflow-hidden p-2">
          {mainImage ? (
            <img
              src={mainImage}
              alt={company.company_name}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white rounded">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
          )}
          {company.is_featured && (
            <div className="absolute top-1 right-1">
              <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0.5">
                <Star className="w-2.5 h-2.5 mr-0.5" />
                추천
              </Badge>
            </div>
          )}
        </div>

        <div className="p-3 flex-1 flex flex-col min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
            {company.company_name}
          </h3>

          {company.intro_title && (
            <p className="text-gray-700 text-xs mb-2 line-clamp-2">
              {company.intro_title}
            </p>
          )}

          <div className="space-y-1 mb-2 flex-1">
            {company.address && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="line-clamp-1">{formatAddressShort(company.address)}</span>
              </div>
            )}
            {industryList.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {industryList.slice(0, 2).map((industry: any, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5"
                  >
                    {String(industry)}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <div className="flex flex-wrap gap-0.5">
                {allTags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-[10px] border-gray-300 text-gray-600 px-1 py-0.5"
                  >
                    #{tag}
                  </Badge>
                ))}
                {allTags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] border-gray-300 text-gray-600 px-1 py-0.5"
                  >
                    +{allTags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function RecentCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadCompanies = useCallback(async (pageNum: number, append: boolean = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/companies?page=${pageNum}&limit=12`);
      const data = await response.json();

      if (data.companies && data.companies.length > 0) {
        if (append) {
          setCompanies((prev) => [...prev, ...data.companies]);
        } else {
          setCompanies(data.companies);
        }
        setHasMore(data.pagination.hasNextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load companies:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    loadCompanies(1, false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
        hasMore &&
        !loading
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadCompanies(nextPage, true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, page, loadCompanies]);

  if (companies.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-gray-900 mb-6 text-center text-2xl font-bold">최근 등록 기업</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((company) => (
            <RecentCompanyCard key={company.id} company={company} />
          ))}
        </div>
        {loading && (
          <div className="text-center py-8 text-gray-500 text-sm">로딩 중...</div>
        )}
      </div>
    </section>
  );
}

