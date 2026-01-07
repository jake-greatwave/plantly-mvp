"use client";

import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpgradePrompt } from "@/components/ui/upgrade-prompt";
import type { CompanyFormData } from "@/lib/types/company-form.types";
import type { UserGrade } from "@/lib/types/auth.types";

interface VideoSectionProps {
  data: Partial<CompanyFormData>;
  onFieldChange: (field: keyof CompanyFormData, value: any) => void;
  userGrade?: UserGrade;
  isAdmin?: boolean;
  onUpgradeSuccess?: () => void;
}

export const VideoSection = memo(function VideoSection({
  data,
  onFieldChange,
  userGrade = "basic",
  isAdmin = false,
  onUpgradeSuccess,
}: VideoSectionProps) {
  const canUploadVideo =
    isAdmin || userGrade === "enterprise" || userGrade === "enterprise_trial";

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">7. 회사 소개 동영상</h3>
      </div>

      <div className="space-y-2">
        {canUploadVideo ? (
          <Input
            id="video_url"
            type="url"
            value={data.video_url || ""}
            onChange={(e) => onFieldChange("video_url", e.target.value)}
            placeholder="회사 소개 영상이나 주요 설비 가동 영상에 대한 유튜브 링크를 입력해 주세요"
          />
        ) : (
          <UpgradePrompt
            feature="회사 소개 동영상"
            upgradeSource="회사 소개 동영상"
            variant="overlay"
            onUpgradeSuccess={onUpgradeSuccess}
          >
            <Input
              id="video_url"
              type="url"
              value={data.video_url || ""}
              onChange={(e) => onFieldChange("video_url", e.target.value)}
              placeholder="회사 소개 영상이나 주요 설비 가동 영상에 대한 유튜브 링크를 입력해 주세요"
              disabled={true}
            />
          </UpgradePrompt>
        )}
      </div>
    </div>
  );
});

