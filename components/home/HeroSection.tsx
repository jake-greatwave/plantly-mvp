"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/companies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-3">
            제조의 모든 연결, 플랜틀리에서 시작됩니다
          </h2>
          <p className="text-lg text-gray-600">
            프로젝트를 맡길 기업과 해결할 기업이 한 곳에서 만나는 제조 플랫폼
          </p>
        </div>
        <div className="text-center max-w-2xl mx-auto">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="어떤 솔루션을 찾으시나요? (예: CNC 자동화, 사출금형)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 h-auto border-gray-300 focus-visible:ring-blue-600 focus-visible:border-blue-600 bg-white"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
