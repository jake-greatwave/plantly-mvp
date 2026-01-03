"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PricingTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRICING_DATA = [
  {
    category: "상위노출 구독제",
    plans: [
      {
        grade: "기본(무료)",
        price: "무료",
        features: "소분류 태그 2개 기본 제공",
        effect: "기본 정보 제공",
      },
      {
        grade: "Basic",
        price: "9만원/월",
        features: "상위 20% 노출, 태그 4개",
        effect: "안정적 리드 확보, 검색 유입 증가",
      },
      {
        grade: "Standard",
        price: "19만원/월",
        features: "상위 15% 노출, 태그 7개, 대표 색상 적용",
        effect: "브랜드 노출 확대",
      },
      {
        grade: "Premium",
        price: "39만원/월",
        features: "상위 10% 노출, 태그 10개, 컬러 배지",
        effect: "기업 전문성 강화",
      },
      {
        grade: "Enterprise",
        price: "79만원/월",
        features: "TOP3 보장, 태그 20개, 추천영역 노출",
        effect: "최상위 브랜딩 포지션 확보",
      },
    ],
  },
  {
    category: "상세페이지 & 레퍼런스 등록 등급제",
    plans: [
      {
        grade: "기본(무료)",
        price: "무료",
        features: "3개 등록",
        effect: "기본 정보 제공",
      },
      {
        grade: "Basic",
        price: "5만원/월",
        features: "5개 등록",
        effect: "검색 신뢰도 향상",
      },
      {
        grade: "Standard",
        price: "10만원/월",
        features: "10개 등록",
        effect: "제품·설비 상세 노출",
      },
      {
        grade: "Premium",
        price: "20만원/월",
        features: "20개 등록",
        effect: "기술·포트폴리오 강화",
      },
      {
        grade: "Enterprise",
        price: "40만원/월",
        features: "30개 + PDF",
        effect: "대규모 자료 보유 기업에 최적화",
      },
    ],
  },
  {
    category: "상세페이지 제작 서비스",
    plans: [
      {
        grade: "Basic",
        price: "90만원/건",
        features: "5장 제작",
        effect: "홈페이지 운영·자료화 부담 해소",
      },
      {
        grade: "Standard",
        price: "150만원/건",
        features: "10장 제작",
        effect: "기술·설비 설명자료 정리",
      },
      {
        grade: "Premium",
        price: "250만원/건",
        features: "20장 제작",
        effect: "전문 영업자료 확보",
      },
      {
        grade: "Enterprise",
        price: "500만원/건",
        features: "30장 + PDF 제작",
        effect: "기업 브랜딩·입찰자료 활용",
      },
    ],
  },
  {
    category: "배너 광고",
    plans: [
      {
        grade: "메인 최상단",
        price: "200~500만원/월",
        features: "플랫폼 메인 상단 고정 노출",
        effect: "강력한 도달률·인지도 확보",
      },
      {
        grade: "카테고리 상단",
        price: "100~200만원/월",
        features: "카테고리 핵심 지면 노출",
        effect: "타깃 고객 직접 접근",
      },
      {
        grade: "키워드 독점",
        price: "50~100만원/월",
        features: "특정 키워드 검색 시 독점 노출",
        effect: "고의도 고객 즉시 확보",
      },
    ],
  },
];

export function PricingTableDialog({
  open,
  onOpenChange,
}: PricingTableDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="!max-w-[50vw] max-h-[90vh] overflow-y-auto w-[50vw]"
        style={{ maxWidth: '50vw', width: '50vw' }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">플랜틀리 가격 정책</DialogTitle>
          <DialogDescription className="text-base pt-2">
            플랜틀리의 유료 서비스 가격표입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {PRICING_DATA.map((item, categoryIndex) => (
            <div key={categoryIndex} className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.category}
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">등급</TableHead>
                      <TableHead className="w-[150px]">가격(월/건)</TableHead>
                      <TableHead>제공 기능 및 특징</TableHead>
                      <TableHead>기대 효과</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.plans.map((plan, planIndex) => (
                      <TableRow key={planIndex}>
                        <TableCell className="font-medium">
                          {plan.grade}
                        </TableCell>
                        <TableCell>{plan.price}</TableCell>
                        <TableCell>{plan.features}</TableCell>
                        <TableCell>{plan.effect}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

