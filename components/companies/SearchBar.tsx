"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "./SearchFilters";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearchQuery(search);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }

    router.push(`/companies?${params.toString()}`);
  };

  const hasActiveFilters =
    searchParams.get("parent_category_id") ||
    searchParams.get("category_id") ||
    searchParams.get("industries") ||
    searchParams.get("countries") ||
    searchParams.get("is_verified") === "true" ||
    searchParams.get("is_featured") === "true";

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <form onSubmit={handleSearch} className="flex-1">
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
        <Button
          type="submit"
          onClick={handleSearch}
          className="shrink-0 bg-blue-600 hover:bg-blue-700"
          size="default"
        >
          <Search className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={hasActiveFilters ? "default" : "outline"}
          size="default"
          onClick={() => setShowFilters(!showFilters)}
          className={`shrink-0 ${hasActiveFilters ? "bg-blue-600 hover:bg-blue-700" : ""}`}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="mt-3 border-t border-gray-200 pt-4 bg-white rounded-lg p-4">
          <SearchFilters
            onFilterChange={() => {
              const hasFilters =
                searchParams.get("parent_category_id") ||
                searchParams.get("category_id") ||
                searchParams.get("industries") ||
                searchParams.get("countries") ||
                searchParams.get("is_verified") === "true" ||
                searchParams.get("is_featured") === "true";
              if (!hasFilters) {
                setShowFilters(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

