"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompanyFiltersProps {
  currentFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export function CompanyFilters({
  currentFilter,
  onFilterChange,
}: CompanyFiltersProps) {
  return (
    <div className="mb-6 flex gap-2">
      <Button
        variant={currentFilter === null ? "default" : "outline"}
        onClick={() => onFilterChange(null)}
        className={cn(
          currentFilter === null && "bg-blue-600 hover:bg-blue-700"
        )}
      >
        전체
      </Button>
      <Button
        variant={currentFilter === "false" ? "default" : "outline"}
        onClick={() => onFilterChange("false")}
        className={cn(
          currentFilter === "false" && "bg-blue-600 hover:bg-blue-700"
        )}
      >
        승인 대기
      </Button>
      <Button
        variant={currentFilter === "true" ? "default" : "outline"}
        onClick={() => onFilterChange("true")}
        className={cn(
          currentFilter === "true" && "bg-blue-600 hover:bg-blue-700"
        )}
      >
        승인 완료
      </Button>
    </div>
  );
}







