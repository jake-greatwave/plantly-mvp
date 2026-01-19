"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

interface InquiryLink {
  id: string;
  url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function InquiryLinkManagement() {
  const [link, setLink] = useState<InquiryLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [url, setUrl] = useState("");

  const fetchLink = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/inquiry-links");
      if (!response.ok) {
        throw new Error("문의하기 링크를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      const links = data.links || [];
      // 가장 최근 링크 하나만 사용
      const latestLink = links.length > 0 ? links[0] : null;
      setLink(latestLink);
      if (latestLink) {
        setUrl(latestLink.url);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLink();
  }, []);

  const handleSave = async () => {
    if (!url.trim()) {
      toast.error("URL을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      if (link) {
        // 기존 링크 수정
        const response = await fetch(`/api/admin/inquiry-links/${link.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: url.trim() }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "문의하기 링크 수정에 실패했습니다.");
        }

        toast.success("문의하기 링크가 수정되었습니다.");
      } else {
        // 새 링크 생성
        const response = await fetch("/api/admin/inquiry-links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: url.trim() }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "문의하기 링크 생성에 실패했습니다.");
        }

        toast.success("문의하기 링크가 생성되었습니다.");
      }
      fetchLink();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "오류가 발생했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!link) return;

    try {
      const response = await fetch(`/api/admin/inquiry-links/${link.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !link.is_active }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "상태 변경에 실패했습니다.");
      }

      toast.success(
        `문의하기 링크가 ${!link.is_active ? "활성화" : "비활성화"}되었습니다.`
      );
      fetchLink();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "오류가 발생했습니다."
      );
    }
  };

  const handleDelete = async () => {
    if (!link) return;
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/inquiry-links/${link.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "삭제에 실패했습니다.");
      }

      toast.success("문의하기 링크가 삭제되었습니다.");
      setLink(null);
      setUrl("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "오류가 발생했습니다."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">문의하기 링크 관리</h2>
        <p className="text-gray-600 mt-1">
          구글폼 등 문의하기 URL을 등록하고 관리할 수 있습니다.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="inquiry-url" className="text-base font-medium mb-2 block">
              구글폼 URL
            </Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  id="inquiry-url"
                  type="url"
                  placeholder="https://docs.google.com/forms/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !saving) {
                      handleSave();
                    }
                  }}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      저장 중...
                    </>
                  ) : link ? (
                    "수정"
                  ) : (
                    "등록"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {link && (
            <>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {link.url}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {link.is_active ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        활성화됨
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-sm">
                        <XCircle className="w-4 h-4" />
                        비활성화됨
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="active-toggle" className="text-sm">
                        활성화
                      </Label>
                      <Switch
                        id="active-toggle"
                        checked={link.is_active}
                        onCheckedChange={handleToggleActive}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  생성일: {new Date(link.created_at).toLocaleString("ko-KR")}
                  {link.updated_at !== link.created_at &&
                    ` | 수정일: ${new Date(link.updated_at).toLocaleString("ko-KR")}`}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
