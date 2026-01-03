"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MyCompanyCard } from "@/components/my-company/MyCompanyCard";
import { DraftCard } from "@/components/my-company/DraftCard";

export default function MyCompanyPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [hasDraft, setHasDraft] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) {
      return companies;
    }

    const query = searchQuery.toLowerCase();
    return companies.filter((company) => {
      const nameMatch = company.company_name?.toLowerCase().includes(query);
      const introMatch = company.intro_title?.toLowerCase().includes(query);
      const ceoMatch = company.ceo_name?.toLowerCase().includes(query);
      const addressMatch = company.address?.toLowerCase().includes(query);
      
      return nameMatch || introMatch || ceoMatch || addressMatch;
    });
  }, [companies, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              우리 기업 <span className="text-gray-500 font-normal">({companies.length})</span>
            </h1>
            <p className="text-gray-600">등록한 기업 정보를 관리하세요</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/companies/register">
              <Plus className="w-4 h-4 mr-2" />새 기업 등록
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="기업명, 대표자명, 주소 등으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hasDraft && <DraftCard onDelete={handleDeleteDraft} />}

            {filteredCompanies.map((company) => (
              <MyCompanyCard
                key={company.id}
                company={company}
                onDelete={handleDeleteCompany}
              />
            ))}

            {!hasDraft && filteredCompanies.length === 0 && companies.length > 0 && (
              <div className="col-span-full text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-600">
                  다른 검색어로 시도해보세요
                </p>
              </div>
            )}

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






