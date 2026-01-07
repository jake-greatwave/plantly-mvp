import { Suspense } from "react";
import { SearchResultsContent } from "@/components/companies/SearchResultsContent";
import { SearchResultsSkeleton } from "@/components/companies/SearchResultsSkeleton";

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResultsContent />
        </Suspense>
      </div>
    </div>
  );
}










