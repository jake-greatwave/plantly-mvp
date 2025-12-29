"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PricingTableDialog } from "@/components/ui/pricing-table-dialog";
import type {
  UpgradeSurveyRequest,
  SurveyQ1Needs,
  SurveyQ2Price,
  SurveyQ3WTP,
} from "@/lib/types/survey.types";
import {
  SURVEY_Q1_OPTIONS,
  SURVEY_Q2_OPTIONS,
  SURVEY_Q3_OPTIONS,
} from "@/lib/types/survey.types";

interface UpgradeSurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
  onSuccess?: () => void;
}

export function UpgradeSurveyDialog({
  open,
  onOpenChange,
  feature,
  onSuccess,
}: UpgradeSurveyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [q1Needs, setQ1Needs] = useState<SurveyQ1Needs | "">("");
  const [q2Price, setQ2Price] = useState<SurveyQ2Price | "">("");
  const [q3WTP, setQ3WTP] = useState<SurveyQ3WTP | "">("");
  const [q3Etc, setQ3Etc] = useState("");
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (!q1Needs || !q2Price || !q3WTP) {
      toast.error("모든 필수 항목을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/upgrade/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feature_used: feature,
          q1_needs: q1Needs,
          q2_price: q2Price,
          q3_wtp: q3WTP,
          q3_etc: q3Etc || undefined,
        } as UpgradeSurveyRequest),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "설문 제출에 실패했습니다.");
        return;
      }

      toast.success("Enterprise 등급이 적용되었습니다. (3개월 무료)");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Survey submission error:", error);
      toast.error("설문 제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setQ1Needs("");
        setQ2Price("");
        setQ3WTP("");
        setQ3Etc("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            유료 기능을 3개월간 무료로 써보세요!
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            플랜틀리는 현재 베타 서비스 중입니다.
            <br />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsPricingDialogOpen(true);
              }}
              className="text-blue-600 underline hover:text-blue-700"
            >
              예상 가격 정책
            </a>
            에 대한 간단한 의견(4문항)만 주시면,
            <br />
            모든 제한이 해제된 Enterprise 등급 혜택을 3개월간 무료로 드립니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Q. 방금 사용하시려던 이 기능이 귀사의 홍보에 얼마나 중요한가요?
            </Label>
            <RadioGroup
              value={q1Needs}
              onValueChange={(value) => setQ1Needs(value as SurveyQ1Needs)}
            >
              {SURVEY_Q1_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`q1-${option.value}`}
                  />
                  <Label
                    htmlFor={`q1-${option.value}`}
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Q. 이 혜택이 포함된 '가격 정책'에 대해 어떻게 생각하시나요?
            </Label>
            <RadioGroup
              value={q2Price}
              onValueChange={(value) => setQ2Price(value as SurveyQ2Price)}
            >
              {SURVEY_Q2_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`q2-${option.value}`}
                  />
                  <Label
                    htmlFor={`q2-${option.value}`}
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Q. 유료 구독 의향이 있다면, 어떤 등급을 구독하시겠습니까?
            </Label>
            <RadioGroup
              value={q3WTP}
              onValueChange={(value) => setQ3WTP(value as SurveyQ3WTP)}
            >
              {SURVEY_Q3_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`q3-${option.value}`}
                  />
                  <Label
                    htmlFor={`q3-${option.value}`}
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="q3-etc" className="text-base font-semibold">
              Q. 제조 솔루션 플랫폼 '플랜틀리'에 대해 자유로운 이야기를
              부탁드립니다.
            </Label>
            <Textarea
              id="q3-etc"
              value={q3Etc}
              onChange={(e) => setQ3Etc(e.target.value)}
              placeholder="의견을 자유롭게 입력해주세요..."
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !q1Needs || !q2Price || !q3WTP}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "처리 중..." : "의견 보내고 혜택 즉시 적용하기"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <PricingTableDialog
        open={isPricingDialogOpen}
        onOpenChange={setIsPricingDialogOpen}
      />
    </Dialog>
  );
}
