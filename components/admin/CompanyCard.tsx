"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Building2, MapPin, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyPreviewDialog } from "./CompanyPreviewDialog";
import { formatFullAddress } from "@/lib/utils/address";
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
  const [isSpotlight, setIsSpotlight] = useState(company.is_spotlight || false);
  const [spotlightOrder, setSpotlightOrder] = useState(
    company.spotlight_order?.toString() || ""
  );
  const [isToggling, setIsToggling] = useState(false);
  const [isSpotlightToggling, setIsSpotlightToggling] = useState(false);
  const [deletedCompany, setDeletedCompany] = useState<AdminCompany | null>(
    null
  );

  useEffect(() => {
    setIsVerified(company.is_verified);
    setIsSpotlight(company.is_spotlight || false);
    setSpotlightOrder(company.spotlight_order?.toString() || "");
  }, [company.is_verified, company.is_spotlight, company.spotlight_order]);

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

  const handleToggleSpotlight = async (checked: boolean) => {
    setIsSpotlightToggling(true);
    const previousValue = isSpotlight;
    const previousOrder = spotlightOrder;
    setIsSpotlight(checked);

    if (!checked) {
      setSpotlightOrder("");
    } else if (!spotlightOrder) {
      // 활성화 시 기본 순서 설정 (현재 최대값 + 1)
      setSpotlightOrder("1");
    }

    try {
      const orderValue = checked
        ? spotlightOrder
          ? parseInt(spotlightOrder, 10)
          : 1
        : null;

      const response = await fetch(`/api/admin/companies/${company.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_spotlight: checked,
          spotlight_order: orderValue,
        }),
      });

      if (!response.ok) {
        throw new Error("눈 여겨볼 기업 설정 실패");
      }

      toast.success(
        checked
          ? "눈 여겨볼 기업으로 설정되었습니다."
          : "눈 여겨볼 기업 설정이 해제되었습니다."
      );
    } catch (error) {
      setIsSpotlight(previousValue);
      setSpotlightOrder(previousOrder);
      toast.error("설정 변경에 실패했습니다.");
    } finally {
      setIsSpotlightToggling(false);
    }
  };

  const handleOrderChange = async (value: string) => {
    setSpotlightOrder(value);
    if (!isSpotlight || !value) return;

    const orderValue = value ? parseInt(value, 10) : null;
    if (isNaN(orderValue || 0)) return;

    try {
      const response = await fetch(`/api/admin/companies/${company.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_spotlight: true,
          spotlight_order: orderValue,
        }),
      });

      if (!response.ok) {
        throw new Error("순서 변경 실패");
      }
    } catch (error) {
      toast.error("순서 변경에 실패했습니다.");
    }
  };

  return (
    <>
      <Card className="p-3 hover:shadow-lg transition-shadow">
        <div className="flex flex-col gap-3">
          {/* 이미지와 제목 */}
          <div className="flex gap-3">
            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
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
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 leading-tight mb-2 wrap-break-word">
                {company.company_name}
              </h3>

              {company.address && (
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {formatFullAddress(company.address, company.address_detail)}
                  </span>
                </div>
              )}

              {/* 조회수 표시 */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Eye className="w-3 h-3 shrink-0" />
                <span>조회수: {company.view_count || 0}</span>
              </div>
            </div>
          </div>

          {/* 승인/대기 배지와 승인 토글 - 가로 배치 */}
          <div className="flex items-center gap-2">
            <Badge
              variant={isVerified ? "default" : "secondary"}
              className={`text-xs px-1.5 py-0 ${
                isVerified ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {isVerified ? "승인" : "대기"}
            </Badge>
            <div className="flex items-center gap-1.5">
              <Label
                htmlFor={`verified-${company.id}`}
                className="text-xs text-gray-600"
              >
                승인
              </Label>
              <Switch
                id={`verified-${company.id}`}
                checked={isVerified}
                onCheckedChange={handleToggleVerified}
                disabled={isToggling}
                className="scale-75"
              />
            </div>
          </div>

          {/* 산업군 태그 */}
          {industries.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {industries
                .slice(0, 2)
                .map((industry: unknown, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs px-1.5 py-0"
                  >
                    {String(industry)}
                  </Badge>
                ))}
            </div>
          )}

          {/* 눈 여겨볼 기업 설정 */}
          <div className="p-2 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center justify-between mb-1.5">
              <Label
                htmlFor={`spotlight-${company.id}`}
                className="text-xs font-medium"
              >
                눈 여겨볼 기업
              </Label>
              <Switch
                id={`spotlight-${company.id}`}
                checked={isSpotlight}
                onCheckedChange={handleToggleSpotlight}
                disabled={isSpotlightToggling}
                className="scale-75"
              />
            </div>
            {isSpotlight && (
              <div className="flex items-center gap-1.5">
                <Label
                  htmlFor={`order-${company.id}`}
                  className="text-xs text-gray-600"
                >
                  순서:
                </Label>
                <Input
                  id={`order-${company.id}`}
                  type="number"
                  min="1"
                  value={spotlightOrder}
                  onChange={(e) => handleOrderChange(e.target.value)}
                  className="w-16 h-6 text-xs px-2"
                  placeholder="1"
                />
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="flex-1 text-xs h-7 px-2"
            >
              <Eye className="w-3 h-3 mr-1" />
              미리보기
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              className="h-7 w-7 p-0"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 h-7 w-7 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
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
