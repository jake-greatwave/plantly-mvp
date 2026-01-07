"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CompanyDetailPreview } from "./CompanyDetailPreview";
import { toast } from "sonner";
import type { AdminCompany } from "@/lib/types/admin-company.types";

interface CompanyPreviewDialogProps {
  company: AdminCompany;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (companyId: string, isVerified: boolean) => void;
}

export function CompanyPreviewDialog({
  company,
  open,
  onOpenChange,
  onUpdate,
}: CompanyPreviewDialogProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleApprove = async () => {
    setIsUpdating(true);
    onUpdate(company.id, true);
    try {
      const response = await fetch(`/api/admin/companies/${company.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_verified: true }),
      });

      if (!response.ok) {
        throw new Error("승인 실패");
      }

      toast.success("기업 정보가 승인되었습니다.");
      onOpenChange(false);
    } catch (error) {
      onUpdate(company.id, false);
      toast.error("승인 처리에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    setIsUpdating(true);
    onUpdate(company.id, false);
    try {
      const response = await fetch(`/api/admin/companies/${company.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_verified: false }),
      });

      if (!response.ok) {
        throw new Error("미승인 처리 실패");
      }

      toast.success("기업 정보가 미승인 처리되었습니다.");
      onOpenChange(false);
    } catch (error) {
      onUpdate(company.id, true);
      toast.error("미승인 처리에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    router.push(`/companies/edit/${company.id}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[95vh] overflow-y-auto p-0"
        style={{
          maxWidth: '98vw',
          width: '98vw',
        }}
      >
        <div className="sticky top-0 z-50 bg-white border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle>기업 정보 상세보기</DialogTitle>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <CompanyDetailPreview companyId={company.id} />
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleEdit}
          >
            수정
          </Button>
          {company.is_verified ? (
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={isUpdating}
              className="text-yellow-600 hover:text-yellow-700"
            >
              미승인 처리
            </Button>
          ) : (
            <Button
              onClick={handleApprove}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              승인 처리
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

