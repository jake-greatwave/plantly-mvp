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

  const handleClick = () => {
    router.push(`/companies/${company.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="bg-white border-gray-200 overflow-hidden hover:border-blue-600 hover:shadow-md transition-all cursor-pointer h-full flex flex-col"
    >
      <div className="relative w-full h-20 bg-gray-100 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={company.company_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <div className="absolute top-0.5 right-0.5 flex gap-0.5">
          {company.is_featured && (
            <Badge className="bg-yellow-500 text-white text-[9px] px-0.5 py-0 h-3.5 leading-none">
              <Star className="w-1.5 h-1.5" />
            </Badge>
          )}
        </div>
      </div>

      <div className="p-2 flex-1 flex flex-col min-h-0">
        <h3 className="text-gray-900 font-semibold text-sm mb-1 line-clamp-1 leading-tight">
          {company.company_name}
        </h3>

        {company.intro_title && (
          <p className="text-gray-600 text-xs mb-1.5 line-clamp-1 leading-tight overflow-hidden text-ellipsis">
            {company.intro_title}
          </p>
        )}

        {company.address && (
          <div className="flex items-center gap-1 mb-1.5 text-[10px] text-gray-500">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{formatAddressShort(company.address)}</span>
          </div>
        )}

        {categories.length > 0 && (
          <div className="mt-auto pt-0.5">
            <Badge
              variant="outline"
              className="text-[10px] border-gray-300 text-gray-600 px-1 py-0 h-3.5 leading-none"
            >
              {categories[0]}
            </Badge>
          </div>
        )}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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

