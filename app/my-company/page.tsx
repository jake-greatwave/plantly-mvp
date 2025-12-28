"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MyCompanyCard } from "@/components/my-company/MyCompanyCard";
import { DraftCard } from "@/components/my-company/DraftCard";

export default function MyCompanyPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [hasDraft, setHasDraft] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
    checkDraft();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await fetch("/api/companies/my");
      const result = await response.json();

      if (response.ok && result.success) {
        setCompanies(result.data);
      }
    } catch {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const checkDraft = () => {
    const draft = localStorage.getItem("company_draft");
    setHasDraft(!!draft);
  };

  const handleDeleteCompany = () => {
    loadCompanies();
  };

  const handleDeleteDraft = () => {
    setHasDraft(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">우리 기업</h1>
            <p className="text-gray-600">등록한 기업 정보를 관리하세요</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/companies/register">
              <Plus className="w-4 h-4 mr-2" />새 기업 등록
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hasDraft && <DraftCard onDelete={handleDeleteDraft} />}

            {companies.map((company) => (
              <MyCompanyCard
                key={company.id}
                id={company.id}
                name={company.company_name}
                logoUrl={company.logo_url}
                introTitle={company.intro_title}
                isVerified={company.is_verified}
                onDelete={handleDeleteCompany}
              />
            ))}

            {!hasDraft && companies.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  등록된 기업이 없습니다
                </h3>
                <p className="text-gray-600 mb-4">
                  첫 번째 기업 정보를 등록해보세요
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/companies/register">
                    <Plus className="w-4 h-4 mr-2" />
                    기업 등록하기
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}






