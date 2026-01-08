"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface CompanyPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function CompanyPagination({
  pagination,
  onPageChange,
}: CompanyPaginationProps) {
  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={!hasPrevPage}
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getPageNumbers().map((pageNum, index) => {
        if (pageNum === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          );
        }

        return (
          <Button
            key={pageNum}
            variant={pageNum === page ? "default" : "outline"}
            onClick={() => onPageChange(pageNum as number)}
            className={cn(
              pageNum === page && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {pageNum}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={!hasNextPage}
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>
    </div>
  );
}











