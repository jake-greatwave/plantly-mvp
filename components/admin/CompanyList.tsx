"use client";

import { CompanyCard } from "./CompanyCard";
import type { AdminCompany } from "@/lib/types/admin-company.types";

interface CompanyListProps {
  companies: AdminCompany[];
  loading: boolean;
  onUpdate: (companyId: string, isVerified: boolean) => void;
  onDelete?: (companyId: string) => void;
}

export function CompanyList({
  companies,
  loading,
  onUpdate,
  onDelete,
}: CompanyListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-48 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        등록된 기업이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

