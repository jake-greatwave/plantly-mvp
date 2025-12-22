"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Building2, MapPin, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CompanyPreviewDialog } from "./CompanyPreviewDialog";
import { formatAddressShort } from "@/lib/utils/address";
import { toast } from "sonner";
import type { AdminCompany } from "@/lib/types/admin-company.types";

interface CompanyCardProps {
  company: AdminCompany;
  onUpdate: (companyId: string, isVerified: boolean) => void;
  onDelete?: (companyId: string) => void;
}

export function CompanyCard({ company, onUpdate, onDelete }: CompanyCardProps) {
  const router = useRouter();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVerified, setIsVerified] = useState(company.is_verified);
  const [isToggling, setIsToggling] = useState(false);
  const [deletedCompany, setDeletedCompany] = useState<AdminCompany | null>(
    null
  );

  useEffect(() => {
    setIsVerified(company.is_verified);
  }, [company.is_verified]);

  const mainImage =
    company.company_images?.find((img) => img.image_type === "main")
      ?.image_url ||
    company.company_images?.sort((a, b) => a.display_order - b.display_order)[0]
      ?.image_url ||
    company.logo_url;

  const industries = company.industries
    ? Array.isArray(company.industries)
      ? company.industries
      : typeof company.industries === "string"
      ? JSON.parse(company.industries)
      : Object.values(company.industries)
    : [];

  const handleDelete = async () => {
    if (!confirm("정말로 이 기업 정보를 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    setDeletedCompany(company);
    if (onDelete) {
      onDelete(company.id);
    }
    try {
      const response = await fetch(`/api/admin/companies/${company.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제 실패");
      }

      toast.success("기업 정보가 삭제되었습니다.");
    } catch (error) {
      toast.error("기업 정보 삭제에 실패했습니다.");
      if (onDelete && deletedCompany) {
        onDelete(company.id);
      }
    } finally {
      setIsDeleting(false);
      setDeletedCompany(null);
    }
  };

  const handleEdit = () => {
    router.push(`/companies/edit/${company.id}`);
  };

  const handleToggleVerified = async (checked: boolean) => {
    setIsToggling(true);
    const previousValue = isVerified;
    setIsVerified(checked);
    onUpdate(company.id, checked);

    try {
      const response = await fetch(`/api/admin/companies/${company.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_verified: checked }),
      });

      if (!response.ok) {
        throw new Error("상태 변경 실패");
      }

      toast.success(
        checked
          ? "기업 정보가 승인되었습니다."
          : "기업 정보가 미승인 처리되었습니다."
      );
    } catch (error) {
      setIsVerified(previousValue);
      onUpdate(company.id, previousValue);
      toast.error("상태 변경에 실패했습니다.");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={company.company_name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {company.company_name}
              </h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isVerified ? "default" : "secondary"}
                  className={isVerified ? "bg-green-500" : "bg-yellow-500"}
                >
                  {isVerified ? "승인" : "대기"}
                </Badge>
                <Switch
                  checked={isVerified}
                  onCheckedChange={handleToggleVerified}
                  disabled={isToggling}
                />
              </div>
            </div>

            <div className="min-h-[20px] mb-2">
              {company.address && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {formatAddressShort(company.address)}
                  </span>
                </div>
              )}
            </div>

            <div className="min-h-[24px] mb-3">
              {industries.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {industries
                    .slice(0, 2)
                    .map((industry: unknown, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {String(industry)}
                      </Badge>
                    ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                미리보기
              </Button>
              <Button size="sm" variant="outline" onClick={handleEdit}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <CompanyPreviewDialog
        company={company}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onUpdate={onUpdate}
      />
    </>
  );
}
