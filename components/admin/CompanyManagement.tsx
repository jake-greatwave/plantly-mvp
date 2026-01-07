"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CompanyList } from "./CompanyList";
import { CompanyFilters } from "./CompanyFilters";
import { CompanyPagination } from "./CompanyPagination";
import type { AdminCompany } from "@/lib/types/admin-company.types";

export function CompanyManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const isVerified = searchParams.get("is_verified");
  const sortBy = searchParams.get("sort_by");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      if (isVerified !== null && isVerified !== undefined) {
        params.set("is_verified", isVerified);
      }
      if (sortBy) {
        params.set("sort_by", sortBy);
      }

      const response = await fetch(`/api/admin/companies?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setCompanies(data.companies || []);
        setPagination(data.pagination || pagination);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, isVerified, sortBy]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleFilterChange = (verified: string | null) => {
    const params = new URLSearchParams();
    if (verified !== null) {
      params.set("is_verified", verified);
    }
    if (sortBy) {
      params.set("sort_by", sortBy);
    }
    params.set("page", "1");
    router.push(`/admin/companies?${params.toString()}`);
  };

  const handleSortChange = (newSortBy: string | null) => {
    const params = new URLSearchParams();
    if (isVerified !== null && isVerified !== undefined) {
      params.set("is_verified", isVerified);
    }
    if (newSortBy) {
      params.set("sort_by", newSortBy);
    }
    params.set("page", "1");
    router.push(`/admin/companies?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/admin/companies?${params.toString()}`);
  };

  const handleCompanyUpdate = (companyId: string, isVerified: boolean) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, is_verified: isVerified } : c
      )
    );
  };

  const handleCompanyDelete = (companyId: string) => {
    setCompanies((prev) => {
      const exists = prev.some((c) => c.id === companyId);
      if (exists) {
        return prev.filter((c) => c.id !== companyId);
      }
      fetchCompanies();
      return prev;
    });
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">기업 정보 관리</h1>
        <p className="text-gray-600">등록된 기업 정보를 승인하고 관리하세요</p>
      </div>

      <CompanyFilters
        currentFilter={isVerified}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <CompanyList
        companies={companies}
        loading={loading}
        onUpdate={handleCompanyUpdate}
        onDelete={handleCompanyDelete}
      />

      {pagination.totalPages > 1 && (
        <CompanyPagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

