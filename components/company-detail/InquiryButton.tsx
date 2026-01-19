"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface InquiryButtonProps {
  brandColor: string;
}

export function InquiryButton({ brandColor }: InquiryButtonProps) {
  const [inquiryUrl, setInquiryUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiryLink = async () => {
      try {
        const response = await fetch("/api/inquiry-link");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.url) {
            setInquiryUrl(data.url);
          }
        }
      } catch (error) {
        console.error("Failed to fetch inquiry link:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiryLink();
  }, []);

  if (loading || !inquiryUrl) {
    return null;
  }

  return (
    <Button
      className="w-32 h-12 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:opacity-90"
      style={{
        backgroundColor: "#3764E4",
        color: "white",
      }}
      onClick={() => {
        window.open(inquiryUrl, "_blank", "noopener,noreferrer");
      }}
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      문의하기
    </Button>
  );
}
