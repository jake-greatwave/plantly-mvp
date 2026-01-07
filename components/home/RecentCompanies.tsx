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

  const categories =
    company.company_categories
      ?.map((cc) => cc.categories?.category_name)
      .filter(Boolean) || [];

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
        <div className="relative w-40 h-40 flex-shrink-0 bg-white overflow-hidden p-3">
          {mainImage ? (
            <img
              src={mainImage}
              alt={company.company_name}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
          )}
          {company.is_featured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-yellow-500 text-white text-sm px-2 py-1">
                <Star className="w-3 h-3 mr-1" />
                추천
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-1">
            {company.company_name}
          </h3>

          {company.intro_title && (
            <p className="text-gray-700 text-sm mb-2.5 line-clamp-2">
              {company.intro_title}
            </p>
          )}

          <div className="space-y-1.5 mb-2.5 flex-1">
            {company.address && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="line-clamp-1">{formatAddressShort(company.address)}</span>
              </div>
            )}
            {industryList.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {industryList.slice(0, 2).map((industry: any, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 text-sm px-2 py-0.5"
                  >
                    {String(industry)}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {categories.length > 0 && (
            <div className="pt-2.5 border-t border-gray-200">
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, 2).map((category, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-sm border-gray-300 text-gray-600 px-2 py-0.5"
                  >
                    {category}
                  </Badge>
                ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

