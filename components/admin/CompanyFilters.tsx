"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CompanyFiltersProps {
  currentFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  sortBy?: string | null;
  onSortChange?: (sortBy: string | null) => void;
}

export function CompanyFilters({
  currentFilter,
  onFilterChange,
  sortBy,
  onSortChange,
}: CompanyFiltersProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex gap-2">
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

      {onSortChange && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">정렬:</label>
          <Select
            value={sortBy || "created_at_desc"}
            onValueChange={(value) => onSortChange(value === "created_at_desc" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at_desc">최신순</SelectItem>
              <SelectItem value="view_count_desc">조회수 높은순</SelectItem>
              <SelectItem value="view_count_asc">조회수 낮은순</SelectItem>
              <SelectItem value="company_name_asc">이름순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}










