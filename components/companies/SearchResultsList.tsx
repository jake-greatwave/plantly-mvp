"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchResultCard } from "./SearchResultCard";
import { CompanyPagination } from "./CompanyPagination";
import { SearchResultsSkeleton } from "./SearchResultsSkeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Building2 } from "lucide-react";
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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function SearchResultsList() {
  const searchParams = useSearchParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        const search = searchParams.get("search");
        const page = searchParams.get("page") || "1";
        const categoryId = searchParams.get("category_id");
        const regionId = searchParams.get("region_id");
        const isVerified = searchParams.get("is_verified");
        const isFeatured = searchParams.get("is_featured");

        if (search) params.set("search", search);
        params.set("page", page);
        if (categoryId) params.set("category_id", categoryId);
        if (regionId) params.set("region_id", regionId);
        if (isVerified) params.set("is_verified", isVerified);
        if (isFeatured) params.set("is_featured", isFeatured);

        const response = await fetch(`/api/companies?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const data = await response.json();
        setCompanies(data.companies || []);
        setPagination(data.pagination || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [searchParams]);

  if (loading) {
    return <SearchResultsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Building2 className="w-12 h-12 text-gray-400" />
          </EmptyMedia>
          <EmptyTitle>검색 결과가 없습니다</EmptyTitle>
          <EmptyDescription>
            다른 검색어로 시도해보시거나 필터를 조정해보세요.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const search = searchParams.get("search") || "";

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {search ? `"${search}" 검색 결과` : "전체 기업"}
        </h1>
        <p className="text-gray-600 mb-4">
          {search
            ? `검색어 "${search}"에 대한 결과를 표시합니다.`
            : "등록된 모든 기업을 확인하세요."}
        </p>
        {pagination && (
          <p className="text-sm text-gray-600">
            총 {pagination.total.toLocaleString()}개의 기업이 있습니다.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {companies.map((company) => (
          <SearchResultCard key={company.id} company={company} />
        ))}
      </div>

      {pagination && (
        <CompanyPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
        />
      )}
    </>
  );
}

