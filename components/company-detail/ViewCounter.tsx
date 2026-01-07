"use client";

import { useEffect } from "react";

interface ViewCounterProps {
  companyId: string;
}

export function ViewCounter({ companyId }: ViewCounterProps) {
  useEffect(() => {
    // 조회수 증가 API 호출
    const incrementViewCount = async () => {
      try {
        await fetch(`/api/companies/${companyId}/view`, {
          method: "POST",
        });
      } catch (error) {
        // 조회수 증가 실패는 사용자에게 보이지 않도록 조용히 처리
        console.error("Failed to increment view count:", error);
      }
    };

    incrementViewCount();
  }, [companyId]);

  return null; // UI 렌더링 없음
}

